import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const API_BASE_URL = process.env.API_BASE_URL;

    if (!API_BASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "API_BASE_URL no está configurada.",
        },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No autenticado. No existe accessToken en cookies.",
        },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/cv/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "No se pudo descargar el CV.",
          detail: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url || data.download_url,
      file_name: data.file_name,
    });
  } catch (error) {
    console.error("Error en /api/cv/download:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno al descargar CV.",
      },
      { status: 500 },
    );
  }
}
