import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

function getSecretHash(
  username: string,
  clientId: string,
  clientSecret: string,
) {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    const clientId = process.env.COGNITO_CLIENT_ID!;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET!;

    const secretHash = getSecretHash(email, clientId, clientSecret);

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await cognito.send(command);

    const accessToken = response.AuthenticationResult?.AccessToken;
    const idToken = response.AuthenticationResult?.IdToken;
    const refreshToken = response.AuthenticationResult?.RefreshToken;
    const expiresIn = response.AuthenticationResult?.ExpiresIn ?? 3600;
    const challengeName = response.ChallengeName;

    if (challengeName) {
      return NextResponse.json({
        success: false,
        challengeName,
        session: response.Session,
        message: "Se requiere completar un challenge de Cognito",
      });
    }

    if (!accessToken || !idToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Cognito no devolvió tokens de autenticación",
        },
        { status: 401 },
      );
    }

    const payload = decodeJwtPayload(idToken);
    const groups = payload["cognito:groups"] || [];

    let redirectTo = "/student";

    if (groups.includes("admin")) {
      redirectTo = "/admin";
    } else if (groups.includes("company")) {
      redirectTo = "/company";
    }

    const res = NextResponse.json({
      success: true,
      message: "Login correcto",
      redirectTo,
    });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    res.cookies.set("idToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    if (refreshToken) {
      res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
