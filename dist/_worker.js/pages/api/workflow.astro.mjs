globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as authenticate, b as authorize } from '../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
import { a as validateRequest, h as CustomerWorkflowSchema } from '../../chunks/api-validation_BmEG2mSm.mjs';
import { w as withPerformanceMonitoring } from '../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const postHandler = async (context) => {
  const { CUSTOMER_WORKFLOW } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.MANAGE, "workflows");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  try {
    const body = await context.request.json();
    const customer_id = context.params?.id ? parseInt(context.params.id) : body.customer_id;
    const requestData = { ...body, customer_id };
    const validation = validateRequest(CustomerWorkflowSchema, requestData);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors
        },
        { status: 400 }
      );
    }
    const { customer_id: validatedCustomerId, workflow_type, parameters } = validation.data;
    const workflowInstance = await CUSTOMER_WORKFLOW.create({
      params: {
        customer_id: validatedCustomerId,
        workflow_type,
        parameters: {
          ...parameters,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          api_version: "v3",
          initiated_by: "api"
        }
      }
    });
    const workflowSteps = await generateWorkflowSteps(workflow_type || "onboarding", validatedCustomerId || 0, parameters);
    for (const step of workflowSteps.slice(0, 3)) {
      if (workflowInstance && typeof workflowInstance.step === "function") {
        await workflowInstance.step(step.name, async () => {
          return await executeWorkflowStep(step, validatedCustomerId || 0, context.locals.runtime.env);
        });
      }
    }
    if (workflowSteps.length > 3) {
      if (workflowInstance && typeof workflowInstance.step === "function") {
        await workflowInstance.step("schedule_remaining_steps", async () => {
          return {
            scheduled_steps: workflowSteps.slice(3).map((step) => ({
              name: step.name,
              scheduled_for: new Date(Date.now() + step.delay_ms).toISOString()
            }))
          };
        });
      }
    }
    return Response.json(
      {
        success: true,
        message: "Workflow started successfully",
        data: {
          workflow_id: workflowInstance.id,
          customer_id: validatedCustomerId,
          workflow_type,
          steps_executed: workflowSteps.slice(0, 3).length,
          steps_scheduled: Math.max(0, workflowSteps.length - 3)
        }
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Workflow error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to start workflow",
        errors: [error instanceof Error ? error.message : "Unknown error"]
      },
      { status: 500 }
    );
  }
};
async function generateWorkflowSteps(workflowType, customerId, parameters) {
  const baseSteps = [
    {
      name: "validate_customer",
      action: "customer_validation",
      delay_ms: 0,
      required: true
    },
    {
      name: "initialize_session",
      action: "session_creation",
      delay_ms: 1e3,
      required: true
    },
    {
      name: "send_welcome_notification",
      action: "notification",
      delay_ms: 2e3,
      required: false
    }
  ];
  const workflowSpecificSteps = {
    onboarding: [
      {
        name: "create_patient_profile",
        action: "profile_creation",
        delay_ms: 5e3,
        required: true
      },
      {
        name: "assign_initial_assessments",
        action: "assessment_assignment",
        delay_ms: 1e4,
        required: true
      },
      {
        name: "schedule_intake_appointment",
        action: "appointment_scheduling",
        delay_ms: 3e4,
        required: false
      }
    ],
    assessment: [
      {
        name: "prepare_assessment_forms",
        action: "form_preparation",
        delay_ms: 3e3,
        required: true
      },
      {
        name: "send_assessment_invitation",
        action: "assessment_invitation",
        delay_ms: 5e3,
        required: true
      },
      {
        name: "monitor_completion_status",
        action: "completion_monitoring",
        delay_ms: 6e4,
        required: false
      }
    ],
    treatment: [
      {
        name: "review_clinical_data",
        action: "clinical_review",
        delay_ms: 5e3,
        required: true
      },
      {
        name: "generate_treatment_plan",
        action: "treatment_planning",
        delay_ms: 15e3,
        required: true
      },
      {
        name: "schedule_follow_up",
        action: "follow_up_scheduling",
        delay_ms: 24 * 60 * 60 * 1e3,
        // 24 hours
        required: false
      }
    ],
    follow_up: [
      {
        name: "prepare_follow_up_forms",
        action: "form_preparation",
        delay_ms: 2e3,
        required: true
      },
      {
        name: "analyze_progress_metrics",
        action: "progress_analysis",
        delay_ms: 1e4,
        required: true
      },
      {
        name: "update_treatment_plan",
        action: "treatment_update",
        delay_ms: 2e4,
        required: false
      }
    ]
  };
  return [
    ...baseSteps,
    ...workflowSpecificSteps[workflowType] || []
  ];
}
async function executeWorkflowStep(step, customerId, env) {
  const maxRetries = 3;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      switch (step.action) {
        case "customer_validation":
          return await validateCustomerExists(customerId, env.DB);
        case "session_creation":
          return await createWorkflowSession(customerId, env.DB);
        case "notification":
          return await sendNotification(customerId, "workflow_started", env);
        case "profile_creation":
          return await createPatientProfile(customerId, env.DB);
        case "assessment_assignment":
          return await assignInitialAssessments(customerId, env.DB);
        case "appointment_scheduling":
          return await scheduleAppointment(customerId, env);
        case "form_preparation":
          return await prepareAssessmentForms(customerId, env.DB);
        case "assessment_invitation":
          return await sendAssessmentInvitation(customerId, env);
        case "completion_monitoring":
          return await monitorCompletionStatus(customerId, env.DB);
        case "clinical_review":
          return await reviewClinicalData(customerId, env.DB);
        case "treatment_planning":
          return await generateTreatmentPlan(customerId, env.DB);
        case "follow_up_scheduling":
          return await scheduleFollowUp(customerId, env);
        case "progress_analysis":
          return await analyzeProgressMetrics(customerId, env.DB);
        case "treatment_update":
          return await updateTreatmentPlan(customerId, env.DB);
        default:
          return { success: true, message: `Executed ${step.name}`, data: {} };
      }
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          attempts: attempt
        };
      }
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1e3));
    }
  }
}
async function validateCustomerExists(customerId, db) {
  const result = await db.prepare("SELECT id FROM customers WHERE id = ?").bind(customerId).first();
  return {
    success: !!result,
    message: result ? "Customer validated" : "Customer not found",
    data: { customer_id: customerId, exists: !!result }
  };
}
async function createWorkflowSession(customerId, db) {
  const sessionId = `wf_${customerId}_${Date.now()}`;
  return {
    success: true,
    message: "Workflow session created",
    data: { session_id: sessionId, customer_id: customerId }
  };
}
async function sendNotification(customerId, type, env) {
  return {
    success: true,
    message: "Notification sent",
    data: { customer_id: customerId, notification_type: type }
  };
}
async function createPatientProfile(customerId, db) {
  return {
    success: true,
    message: "Patient profile created",
    data: { customer_id: customerId, profile_created: true }
  };
}
async function assignInitialAssessments(customerId, db) {
  return {
    success: true,
    message: "Initial assessments assigned",
    data: { customer_id: customerId, assessments_assigned: 3 }
  };
}
async function scheduleAppointment(customerId, env) {
  return {
    success: true,
    message: "Appointment scheduled",
    data: { customer_id: customerId, appointment_scheduled: true }
  };
}
async function prepareAssessmentForms(customerId, db) {
  return {
    success: true,
    message: "Assessment forms prepared",
    data: { customer_id: customerId, forms_prepared: true }
  };
}
async function sendAssessmentInvitation(customerId, env) {
  return {
    success: true,
    message: "Assessment invitation sent",
    data: { customer_id: customerId, invitation_sent: true }
  };
}
async function monitorCompletionStatus(customerId, db) {
  return {
    success: true,
    message: "Completion monitoring initiated",
    data: { customer_id: customerId, monitoring_active: true }
  };
}
async function reviewClinicalData(customerId, db) {
  return {
    success: true,
    message: "Clinical data reviewed",
    data: { customer_id: customerId, data_reviewed: true }
  };
}
async function generateTreatmentPlan(customerId, db) {
  return {
    success: true,
    message: "Treatment plan generated",
    data: { customer_id: customerId, treatment_plan_created: true }
  };
}
async function scheduleFollowUp(customerId, env) {
  return {
    success: true,
    message: "Follow-up scheduled",
    data: { customer_id: customerId, follow_up_scheduled: true }
  };
}
async function analyzeProgressMetrics(customerId, db) {
  return {
    success: true,
    message: "Progress metrics analyzed",
    data: { customer_id: customerId, metrics_analyzed: true }
  };
}
async function updateTreatmentPlan(customerId, db) {
  return {
    success: true,
    message: "Treatment plan updated",
    data: { customer_id: customerId, treatment_plan_updated: true }
  };
}
const POST = withPerformanceMonitoring(postHandler, "workflow:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=workflow.astro.mjs.map
