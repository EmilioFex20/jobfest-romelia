import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
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

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email y contraseña son obligatorios",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@cetys.edu.mx")) {
      return NextResponse.json(
        {
          success: false,
          message: "El correo debe ser institucional (@cetys.edu.mx).",
          code: "INVALID_DOMAIN",
        },
        { status: 400 },
      );
    }

    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Configuración de Cognito incompleta",
          code: "SERVER_CONFIG_ERROR",
        },
        { status: 500 },
      );
    }

    const secretHash = getSecretHash(normalizedEmail, clientId, clientSecret);

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: normalizedEmail,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: "email",
          Value: normalizedEmail,
        },
      ],
    });

    const response = await cognito.send(command);

    return NextResponse.json({
      success: true,
      message: "Usuario registrado. Revisa tu correo para confirmar la cuenta.",
      userSub: response.UserSub,
      userConfirmed: response.UserConfirmed,
      codeDeliveryDetails: response.CodeDeliveryDetails,
    });
  } catch (error: unknown) {
    console.log("ERROR COGNITO:", error);

    const errorName = error instanceof Error ? error.name : "UnknownError";

    if (errorName === "UsernameExistsException") {
      return NextResponse.json(
        {
          success: false,
          message: "Este correo ya está registrado. Intenta iniciar sesión.",
          code: "USER_EXISTS",
        },
        { status: 409 },
      );
    }

    if (errorName === "InvalidPasswordException") {
      return NextResponse.json(
        {
          success: false,
          message: "La contraseña no cumple con los requisitos de seguridad.",
          code: "INVALID_PASSWORD",
        },
        { status: 400 },
      );
    }

    if (errorName === "InvalidParameterException") {
      return NextResponse.json(
        {
          success: false,
          message: "Los datos enviados no son válidos.",
          code: "INVALID_PARAMETER",
        },
        { status: 400 },
      );
    }

    if (errorName === "LimitExceededException") {
      return NextResponse.json(
        {
          success: false,
          message: "Se alcanzó el límite de intentos. Intenta más tarde.",
          code: "LIMIT_EXCEEDED",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo registrar la cuenta.",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}
