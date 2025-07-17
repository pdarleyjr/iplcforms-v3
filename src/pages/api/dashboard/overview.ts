import type { APIRoute, APIContext } from 'astro';
import { FormTemplateService } from '@/lib/services/form_template';
import { FormSubmissionService } from '@/lib/services/form_submission';
import { getD1Manager } from '@/lib/services/d1-connection-manager';

interface DashboardStats {
  activePatients: number;
  formsCreated: number;
  completionRate: string;
}

interface CloudflareRuntime {
  env: {
    DB: any;
    [key: string]: any;
  };
}

export const GET: APIRoute = async ({ locals }: APIContext) => {
  try {
    // Research-backed runtime access pattern
    const runtime = locals.runtime as CloudflareRuntime;
    const env = runtime?.env;
    
    if (!env?.DB) {
      return new Response(JSON.stringify({
        error: 'Database not available',
        details: 'D1 database binding not found in runtime environment'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize services with D1ConnectionManager for optimized caching
    const connectionManager = getD1Manager(env.DB);
    const templateService = new FormTemplateService(env.DB);
    const submissionService = new FormSubmissionService(env.DB);

    // Execute dashboard stats with research-backed caching
    const stats = await connectionManager.executeWithCache(
      'landing_page_dashboard_stats',
      async (): Promise<DashboardStats> => {
        // Get total active forms (representing active patients)
        const activeTemplates = await templateService.getAll({ is_active: true });
        const activePatients = activeTemplates.length;

        // Get total forms created (all templates)
        const allTemplates = await templateService.getAll({});
        const formsCreated = allTemplates.length;

        // Get submission statistics for completion rate
        const submissionStats = await submissionService.getSubmissionStats();
        const totalSubmissions = submissionStats.total || 0;
        const completedSubmissions = submissionStats.byStatus?.submitted || 0;
        const reviewedSubmissions = submissionStats.byStatus?.reviewed || 0;

        // Calculate completion rate (submitted + reviewed vs total)
        const completedCount = completedSubmissions + reviewedSubmissions;
        let completionRate = '0.0';
        
        if (totalSubmissions > 0) {
          const rate = (completedCount / totalSubmissions) * 100;
          completionRate = rate.toFixed(1);
        }

        return {
          activePatients,
          formsCreated,
          completionRate: completionRate + '%'
        };
      },
      5 * 60 * 1000 // 5 minutes cache TTL as recommended by research
    );

    // Research-backed response with proper headers
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        'X-Powered-By': 'Cloudflare D1',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Dashboard overview API error:', error);
    
    // Research-backed structured error response
    const errorResponse = {
      error: 'Internal server error',
      message: 'Failed to retrieve dashboard statistics',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : String(error)
      })
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
};