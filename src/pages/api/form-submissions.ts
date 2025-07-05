import { FormSubmissionService } from "@/lib/services/form_submission";
import { validateApiTokenResponse } from "@/lib/api";

export async function GET({ locals, request }: any) {
  const { API_TOKEN, DB } = locals.runtime.env;
  
  // Validate API token
  const invalidTokenResponse = await validateApiTokenResponse(request, API_TOKEN);
  if (invalidTokenResponse) return invalidTokenResponse;

  const formSubmissionService = new FormSubmissionService(DB);
  
  try {
    // Parse URL query parameters for filtering
    const url = new URL(request.url);
    const filters: any = {};
    
    if (url.searchParams.get('template_id')) {
      filters.template_id = parseInt(url.searchParams.get('template_id')!, 10);
    }
    if (url.searchParams.get('patient_id')) {
      filters.patient_id = parseInt(url.searchParams.get('patient_id')!, 10);
    }
    if (url.searchParams.get('status')) {
      filters.status = url.searchParams.get('status');
    }
    if (url.searchParams.get('date_from')) {
      filters.date_from = url.searchParams.get('date_from');
    }
    if (url.searchParams.get('date_to')) {
      filters.date_to = url.searchParams.get('date_to');
    }
    if (url.searchParams.get('page')) {
      filters.page = parseInt(url.searchParams.get('page')!, 10);
    }
    if (url.searchParams.get('per_page')) {
      filters.per_page = parseInt(url.searchParams.get('per_page')!, 10);
    }

    const submissions = await formSubmissionService.getAll(filters);
    return Response.json({ submissions });
  } catch (error) {
    console.error('Error loading form submissions:', error);
    return Response.json(
      { message: "Couldn't load form submissions" }, 
      { status: 500 }
    );
  }
}

export async function POST({ locals, request }: any) {
  const { API_TOKEN, DB } = locals.runtime.env;
  
  // Validate API token
  const invalidTokenResponse = await validateApiTokenResponse(request, API_TOKEN);
  if (invalidTokenResponse) return invalidTokenResponse;

  const formSubmissionService = new FormSubmissionService(DB);
  
  try {
    const submissionData = await request.json();
    
    // Validate required fields
    if (!submissionData.template_id || !submissionData.responses) {
      return Response.json(
        { message: "Missing required fields: template_id and responses are required" },
        { status: 400 }
      );
    }

    const result = await formSubmissionService.create(submissionData);
    
    if (result.success) {
      return Response.json({
        message: "Form submission created successfully",
        submission_id: result.submissionId,
        calculated_score: result.calculated_score
      }, { status: 201 });
    } else {
      return Response.json(
        { message: "Failed to create form submission" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating form submission:', error);
    return Response.json(
      { message: "Couldn't create form submission" },
      { status: 500 }
    );
  }
}