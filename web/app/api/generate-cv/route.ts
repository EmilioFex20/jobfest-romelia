import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const AWS_API_BASE_URL = process.env.AWS_API_BASE_URL;

  if (!AWS_API_BASE_URL) {
    console.error("AWS_API_BASE_URL no configurada");

    return NextResponse.json(
      {
        success: false,
        message: "URL base de AWS no configurada.",
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();

    const rawRequest = {
      q3_fullName: {
        first: body.firstName,
        last: body.lastName,
      },
      q6_address: {
        addr_line1: body.address,
        city: body.city,
        state: body.state,
        postal: body.postalCode,
        country: body.country,
      },
      q4_contactNumber: {
        full: body.phone,
      },
      q5_emailAddress: body.email,
      q46_bachelorsDegree: body.major,
      q54_semester: body.semester,
      q57_writeYour: body.professionalProfile,
      q15_gpagrade: body.gpa,
      q10_relevantCoursework: body.relevantCoursework,

      q43_relevantExperience: JSON.stringify(
        body.experience?.map((exp: any) => ({
          Place: exp.place,
          "Start Date": exp.start,
          "End Date or Ongoing": exp.end,
          "Brief Description": exp.desc,
        })) || [],
      ),

      q44_projects: JSON.stringify(
        body.projects?.map((project: any) => ({
          "Project Title": project.title,

          "Brief Description": project.desc,
        })) || [],
      ),

      q60_typeA: JSON.stringify(
        body.technicalSkills?.map((skill: string) => ({
          "Technical Skills": skill,
        })) || [],
      ),

      q49_softSkills: JSON.stringify(
        body.softSkills?.map((skill: string) => ({
          "Soft Skill": skill,
        })) || [],
      ),

      q55_languages: JSON.stringify(
        body.languages?.map((language: string) => ({
          Language: language,
        })) || [],
      ),
    };

    const formData = new FormData();
    formData.append("rawRequest", JSON.stringify(rawRequest));

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No autenticado.",
        },
        { status: 401 },
      );
    }

    const response = await fetch(`${AWS_API_BASE_URL}/cv/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      console.error("AWS API error:", data);

      return NextResponse.json(
        {
          success: false,
          message: "No se pudo generar el CV.",
          detail: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "CV generado correctamente.",
      data,
      url: typeof data === "object" && data !== null ? data.url : undefined,
    });
  } catch (error) {
    console.error("Error en /api/cv/generate:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno al generar el CV.",
      },
      { status: 500 },
    );
  }
}
