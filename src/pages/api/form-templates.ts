import { FormTemplateService } from "@/lib/services/form_template";
import { validateApiTokenResponse } from "@/lib/api";

export async function GET({ locals, request }: any) {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const templates = await formTemplateService.getAll();
    return Response.json({ templates });
  } catch (error) {
    return Response.json(
      { message: "Couldn't load form templates" },
      { status: 500 },
    );
  }
}

export async function POST({ locals, request }: any) {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const body = await request.json();
    const template = await formTemplateService.create(body);
    return Response.json(
      {
        message: "Form template created successfully",
        template,
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to create form template",
        success: false,
      },
      { status: 500 },
    );
  }
}