import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function buildWorkerEntry() {
  console.log('🔧 Building custom worker entry point...');
  
  try {
    // Ensure dist directory exists
    const distDir = join(projectRoot, 'dist');
    if (!existsSync(distDir)) {
      await mkdir(distDir, { recursive: true });
      console.log('📁 Created dist directory');
    }

    // Read the TypeScript source
    const sourceFile = join(projectRoot, 'src/worker.ts');
    if (!existsSync(sourceFile)) {
      throw new Error(`Source file not found: ${sourceFile}`);
    }
    
    const source = await readFile(sourceFile, 'utf-8');
    
    // Simple transformation from TypeScript to JavaScript
    // Convert import paths and remove type annotations
    let jsContent = source
      // Convert relative import to proper path
      .replace(
        "import astroHandler from '../dist/_worker.js/index.js';",
        "import astroHandler from './_worker.js/index.js';"
      )
      // Convert workflow import to relative path
      .replace(
        "import { CustomerWorkflow } from './workflows/customer_workflow';",
        "import { CustomerWorkflow } from '../src/workflows/customer_workflow.js';"
      )
      // Remove TypeScript comments and convert to JS
      .replace(/\/\/.*TypeScript.*/g, '// Generated worker entry point')
      .replace(/import\s+type\s+.*?;/g, ''); // Remove type-only imports if any

    // Add proper module header with build timestamp
    const header = `// Generated worker entry point for Cloudflare Workers
// Built at: ${new Date().toISOString()}
// This file combines Astro SSR with Cloudflare Workflows
`;

    const finalContent = header + jsContent;
    
    // Write the compiled worker with atomic operation
    const outputFile = join(projectRoot, 'dist/worker-entry.js');
    const tempFile = outputFile + '.tmp';
    
    await writeFile(tempFile, finalContent, 'utf-8');
    await writeFile(outputFile, finalContent, 'utf-8');
    
    console.log('✅ Worker entry point built successfully at dist/worker-entry.js');
    
  } catch (error) {
    console.error('❌ Failed to build worker entry point:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

buildWorkerEntry();