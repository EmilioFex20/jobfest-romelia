import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

export async function GET() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("idToken")?.value;

  if (!idToken) {
    return NextResponse.json(
      {
        authenticated: false,
        message: "No autenticado",
      },
      { status: 401 },
    );
  }

  try {
    const payload = decodeJwtPayload(idToken);
    const groups = payload["cognito:groups"] || [];

    let role = "student";

    if (groups.includes("admin")) {
      role = "admin";
    } else if (groups.includes("company")) {
      role = "company";
    }

    return NextResponse.json({
      authenticated: true,
      email: payload.email,
      sub: payload.sub,
      groups,
      role,
    });
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        message: "Token inválido",
      },
      { status: 401 },
    );
  }
}
