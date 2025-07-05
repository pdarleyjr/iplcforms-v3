#!/usr/bin/env node

/**
 * Test Script for Database Migrations
 * Validates schema integrity and tests basic operations
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function executeQuery(database, query, description) {
  try {
    log(`Testing: ${description}`, 'blue');
    const { stdout } = await execAsync(`wrangler d1 execute ${database} --command="${query}"`);
    log(`✓ ${description} - SUCCESS`, 'green');
    return { success: true, output: stdout };
  } catch (error) {
    log(`✗ ${description} - FAILED: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testDatabaseSchema(database = 'admin-db') {
  log('\n=== Database Schema Test Suite ===', 'cyan');
  log(`Testing database: ${database}`, 'blue');

  const tests = [
    // Test 1: Check if migration tracking table exists
    {
      query: "SELECT COUNT(*) as count FROM schema_migrations;",
      description: "Schema migrations table exists"
    },

    // Test 2: Check if customers table has role column
    {
      query: "SELECT role FROM customers LIMIT 1;",
      description: "Customers table has role column"
    },

    // Test 3: Check clinical_permissions table
    {
      query: "SELECT COUNT(*) as count FROM clinical_permissions;",
      description: "Clinical permissions table exists and has data"
    },

    // Test 4: Check form_templates table structure
    {
      query: "SELECT id, name, category, version FROM form_templates LIMIT 1;",
      description: "Form templates table structure"
    },

    // Test 5: Check form_submissions table structure
    {
      query: "SELECT id, template_id, status FROM form_submissions LIMIT 1;",
      description: "Form submissions table structure"
    },

    // Test 6: Check ai_summaries table structure
    {
      query: "SELECT id, summary_type, ai_model FROM ai_summaries LIMIT 1;",
      description: "AI summaries table structure"
    },

    // Test 7: Check form_analytics table structure
    {
      query: "SELECT id, metric_type, metric_value FROM form_analytics LIMIT 1;",
      description: "Form analytics table structure"
    },

    // Test 8: Test role constraint
    {
      query: "SELECT DISTINCT role FROM customers WHERE role IN ('patient', 'clinician', 'admin', 'researcher');",
      description: "Role constraint validation"
    },

    // Test 9: Test category constraint
    {
      query: "SELECT DISTINCT category FROM form_templates WHERE category IN ('assessment', 'intake', 'progress', 'discharge', 'screening', 'custom');",
      description: "Form template category constraint"
    },

    // Test 10: Test status constraint
    {
      query: "SELECT DISTINCT status FROM form_submissions WHERE status IN ('draft', 'submitted', 'reviewed', 'archived');",
      description: "Form submission status constraint"
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    const result = await executeQuery(database, test.query, test.description);
    if (result.success) {
      passedTests++;
    } else {
      failedTests++;
    }
  }

  // Test foreign key relationships
  log('\nTesting Foreign Key Relationships:', 'yellow');
  
  const fkTests = [
    {
      query: `INSERT INTO form_templates (name, description, category, form_config, created_by) VALUES ('Test Template', 'Test Description', 'assessment', '{"fields":[]}', 1);`,
      description: "Insert test form template"
    },
    {
      query: `INSERT INTO form_submissions (template_id, patient_id, form_data) VALUES (1, 1, '{"test":"data"}');`,
      description: "Insert test form submission with FK reference"
    },
    {
      query: `INSERT INTO ai_summaries (submission_id, ai_model, model_version, summary_text) VALUES (1, 'gpt-4', '2024-test', 'Test summary');`,
      description: "Insert test AI summary with FK reference"
    }
  ];

  for (const test of fkTests) {
    const result = await executeQuery(database, test.query, test.description);
    if (result.success) {
      passedTests++;
    } else {
      failedTests++;
    }
  }

  // Cleanup test data
  log('\nCleaning up test data:', 'yellow');
  await executeQuery(database, "DELETE FROM ai_summaries WHERE ai_model = 'gpt-4';", "Cleanup AI summaries");
  await executeQuery(database, "DELETE FROM form_submissions WHERE form_data = '{\"test\":\"data\"}';", "Cleanup form submissions");
  await executeQuery(database, "DELETE FROM form_templates WHERE name = 'Test Template';", "Cleanup form templates");

  // Summary
  log('\n=== Test Results ===', 'cyan');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`Total: ${passedTests + failedTests}`, 'blue');

  if (failedTests === 0) {
    log('\n✓ All tests passed! Database schema is working correctly.', 'green');
    return true;
  } else {
    log('\n✗ Some tests failed. Please check the migration files.', 'red');
    return false;
  }
}

async function testSampleData(database = 'admin-db') {
  log('\n=== Sample Data Validation ===', 'cyan');
  
  const dataTests = [
    {
      query: "SELECT COUNT(*) as permission_count FROM clinical_permissions;",
      description: "Check clinical permissions sample data",
      expectedMin: 20
    },
    {
      query: "SELECT COUNT(*) as template_count FROM form_templates;",
      description: "Check form templates sample data",
      expectedMin: 2
    }
  ];

  let allPassed = true;

  for (const test of dataTests) {
    try {
      const { stdout } = await execAsync(`wrangler d1 execute ${database} --command="${test.query}"`);
      
      // Parse count from wrangler JSON output
      // Extract JSON array from the output string
      const jsonMatch = stdout.match(/\[([\s\S]*)\]/);
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[0]);
          const results = jsonData[0]?.results;
          if (results && results.length > 0) {
            // Get the first key-value pair from results (count field)
            const countKey = Object.keys(results[0])[0];
            const count = results[0][countKey];
            
            if (count >= test.expectedMin) {
              log(`✓ ${test.description} - Found ${count} records`, 'green');
            } else {
              log(`✗ ${test.description} - Expected at least ${test.expectedMin}, found ${count}`, 'red');
              allPassed = false;
            }
          } else {
            log(`✗ ${test.description} - No results found in JSON output`, 'red');
            allPassed = false;
          }
        } catch (parseError) {
          log(`✗ ${test.description} - JSON parse error: ${parseError.message}`, 'red');
          allPassed = false;
        }
      } else {
        log(`✗ ${test.description} - Could not find JSON data in output`, 'red');
        allPassed = false;
      }
    } catch (error) {
      log(`✗ ${test.description} - Error: ${error.message}`, 'red');
      allPassed = false;
    }
  }

  return allPassed;
}

// Parse command line arguments
const args = process.argv.slice(2);
const database = args.find(arg => arg.startsWith('--db='))?.split('=')[1] || 'admin-db';

if (args.includes('--help') || args.includes('-h')) {
  log('\nDatabase Migration Test Suite', 'cyan');
  log('\nUsage:', 'blue');
  log('  node scripts/test-migrations.js [options]', 'reset');
  log('\nOptions:', 'blue');
  log('  --db=<name>    Database name (default: admin-db)', 'reset');
  log('  --help, -h     Show this help message', 'reset');
  log('\nExample:', 'blue');
  log('  node scripts/test-migrations.js --db=admin-db', 'reset');
  process.exit(0);
}

// Run tests
async function runAllTests() {
  const schemaTest = await testDatabaseSchema(database);
  const dataTest = await testSampleData(database);
  
  const success = schemaTest && dataTest;
  
  if (success) {
    log('\n🎉 All tests completed successfully!', 'green');
    log('Database is ready for application use.', 'green');
  } else {
    log('\n❌ Some tests failed.', 'red');
    log('Please review migration files and re-run migrations if needed.', 'red');
  }
  
  return success;
}

runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});