import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
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
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Email y código son obligatorios",
        },
        { status: 400 },
      );
    }

    const clientId = process.env.COGNITO_CLIENT_ID!;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET!;

    const secretHash = getSecretHash(email, clientId, clientSecret);

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: secretHash,
    });

    await cognito.send(command);

    return NextResponse.json({
      success: true,
      message: "Cuenta confirmada correctamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "No se pudo confirmar la cuenta",
      },
      { status: 400 },
    );
  }
}
