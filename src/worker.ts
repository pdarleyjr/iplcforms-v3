// Custom worker entry point that combines Astro SSR with Cloudflare Workflows
// This file will be the main entry point defined in wrangler.jsonc

// Import the Astro-generated SSR handler
import astroHandler from '../dist/_worker.js/index.js';

// Import the CustomerWorkflow class for Cloudflare Workflows binding
import { CustomerWorkflow } from './workflows/customer_workflow';

// Export the Astro SSR handler as default (required for routing)
export default astroHandler;

// Export the CustomerWorkflow class (required for workflows binding)
export { CustomerWorkflow };