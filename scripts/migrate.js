#!/usr/bin/env node

/**
 * Database Migration Runner for Cloudflare D1
 * Applies migrations in order and tracks migration status
 */

import { exec } from 'child_process';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '../migrations');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function getMigrationFiles() {
  try {
    const files = await readdir(MIGRATIONS_DIR);
    return files
      .filter(file => file.endsWith('.sql'))
      .sort((a, b) => {
        const numA = parseInt(a.split('_')[0]);
        const numB = parseInt(b.split('_')[0]);
        return numA - numB;
      });
  } catch (error) {
    log(`Error reading migrations directory: ${error.message}`, 'red');
    return [];
  }
}

async function getAppliedMigrations(database = 'admin-db') {
  try {
    const { stdout } = await execAsync(`wrangler d1 execute ${database} --command="SELECT migration_file FROM schema_migrations ORDER BY applied_at"`);
    
    // Parse wrangler output to extract migration names
    const lines = stdout.split('\n');
    const migrations = [];
    
    for (const line of lines) {
      if (line.includes('.sql')) {
        const match = line.match(/(\d{4}_[\w_]+\.sql)/);
        if (match) {
          migrations.push(match[1]);
        }
      }
    }
    
    return migrations;
  } catch (error) {
    // If schema_migrations table doesn't exist, return empty array
    if (error.message.includes('no such table')) {
      log('Schema migrations table not found - this appears to be a fresh database', 'yellow');
      return [];
    }
    log(`Error checking applied migrations: ${error.message}`, 'red');
    return [];
  }
}

async function createMigrationsTable(database = 'admin-db') {
  const createTableSQL = `CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, migration_file TEXT NOT NULL UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);`;
  
  try {
    await execAsync(`wrangler d1 execute ${database} --command="${createTableSQL}"`);
    log('Created schema_migrations table', 'green');
  } catch (error) {
    log(`Error creating migrations table: ${error.message}`, 'red');
    throw error;
  }
}

async function applyMigration(file, database = 'admin-db') {
  const filePath = join(MIGRATIONS_DIR, file);
  
  try {
    // Read the migration file
    const migrationSQL = await readFile(filePath, 'utf8');
    
    // Apply the migration
    log(`Applying migration: ${file}`, 'blue');
    await execAsync(`wrangler d1 execute ${database} --file="${filePath}"`);
    
    // Record the migration as applied
    const recordSQL = `INSERT INTO schema_migrations (migration_file) VALUES ('${file}')`;
    await execAsync(`wrangler d1 execute ${database} --command="${recordSQL}"`);
    
    log(`✓ Successfully applied: ${file}`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to apply ${file}: ${error.message}`, 'red');
    return false;
  }
}

async function runMigrations(database = 'admin-db', dryRun = false) {
  log('\n=== Cloudflare D1 Migration Runner ===', 'cyan');
  log(`Database: ${database}`, 'blue');
  
  if (dryRun) {
    log('DRY RUN MODE - No changes will be applied', 'yellow');
  }
  
  try {
    // Get all migration files
    const allMigrations = await getMigrationFiles();
    log(`\nFound ${allMigrations.length} migration files`, 'blue');
    
    // Ensure migrations table exists
    if (!dryRun) {
      await createMigrationsTable(database);
    }
    
    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations(database);
    log(`${appliedMigrations.length} migrations already applied`, 'blue');
    
    // Find pending migrations
    const pendingMigrations = allMigrations.filter(
      migration => !appliedMigrations.includes(migration)
    );
    
    if (pendingMigrations.length === 0) {
      log('\n✓ Database is up to date!', 'green');
      return true;
    }
    
    log(`\nPending migrations (${pendingMigrations.length}):`, 'yellow');
    pendingMigrations.forEach(migration => {
      log(`  - ${migration}`, 'yellow');
    });
    
    if (dryRun) {
      log('\nDry run complete - use --apply to run migrations', 'cyan');
      return true;
    }
    
    // Apply pending migrations
    log('\nApplying migrations...', 'blue');
    let successful = 0;
    
    for (const migration of pendingMigrations) {
      const success = await applyMigration(migration, database);
      if (success) {
        successful++;
      } else {
        log(`\nStopping migration process due to error in ${migration}`, 'red');
        break;
      }
    }
    
    log(`\n=== Migration Complete ===`, 'cyan');
    log(`Successfully applied: ${successful}/${pendingMigrations.length} migrations`, 'green');
    
    if (successful === pendingMigrations.length) {
      log('✓ All migrations applied successfully!', 'green');
      return true;
    } else {
      log('✗ Some migrations failed - check logs above', 'red');
      return false;
    }
    
  } catch (error) {
    log(`\nMigration runner error: ${error.message}`, 'red');
    return false;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const database = args.find(arg => arg.startsWith('--db='))?.split('=')[1] || 'admin-db';
const dryRun = args.includes('--dry-run');
const apply = args.includes('--apply');

if (args.includes('--help') || args.includes('-h')) {
  log('\nCloudflare D1 Migration Runner', 'cyan');
  log('\nUsage:', 'blue');
  log('  node scripts/migrate.js [options]', 'reset');
  log('\nOptions:', 'blue');
  log('  --db=<name>    Database name (default: admin-db)', 'reset');
  log('  --dry-run      Show pending migrations without applying', 'reset');
  log('  --apply        Apply pending migrations', 'reset');
  log('  --help, -h     Show this help message', 'reset');
  log('\nExamples:', 'blue');
  log('  node scripts/migrate.js --dry-run', 'reset');
  log('  node scripts/migrate.js --apply', 'reset');
  log('  node scripts/migrate.js --apply --db=test-db', 'reset');
  process.exit(0);
}

if (!dryRun && !apply) {
  log('Please specify either --dry-run or --apply', 'red');
  log('Use --help for usage information', 'yellow');
  process.exit(1);
}

// Run migrations
runMigrations(database, dryRun).then(success => {
  process.exit(success ? 0 : 1);
});