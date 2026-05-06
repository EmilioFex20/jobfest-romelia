import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const API_BASE_URL = process.env.API_BASE_URL;

    if (!API_BASE_URL) {
      return NextResponse.json(
        { success: false, message: "API_BASE_URL no configurada" },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "No se pudo crear el admin",
          detail: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en /api/admin/users:", error);

    return NextResponse.json(
      { success: false, message: "Error interno" },
      { status: 500 },
    );
  }
}
