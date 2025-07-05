# iplcforms-v3 Deployment Setup Guide
**Complete Setup, Secrets Management, Migrations, and Clean Deploy Documentation**

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Secrets Management](#secrets-management)
3. [Database Migrations](#database-migrations)
4. [Clean Deploy Process](#clean-deploy-process)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ or **yarn**: v1.22+
- **Wrangler CLI**: v4.22.0+
- **Git**: Latest version

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd iplcforms-v3
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Install Wrangler CLI Globally
```bash
npm install -g wrangler@latest
```

#### 4. Authenticate with Cloudflare
```bash
wrangler auth login
```

#### 5. Create Local Environment File
```bash
cp .dev.vars.example .dev.vars
```

#### 6. Configure Local Environment
Edit `.dev.vars` with your local development values:
```env
# Database Configuration
DB_NAME=admin-db-dev
DB_TOKEN=your-local-db-token

# Workflow Configuration  
CUSTOMER_WORKFLOW=CustomerWorkflow-dev

# API Configuration
API_BASE_URL=http://localhost:4321
ENVIRONMENT=development

# Authentication (if applicable)
AUTH_SECRET=your-local-auth-secret
JWT_SECRET=your-local-jwt-secret
```

#### 7. Setup Local Database
```bash
# Create local D1 database
wrangler d1 create admin-db-dev

# Update wrangler.jsonc with local database ID
# Copy the database_id from the output to wrangler.jsonc
```

#### 8. Run Database Migrations
```bash
npm run migrate:local
```

#### 9. Start Development Server
```bash
npm run dev
```

#### 10. Verify Setup
Navigate to `http://localhost:4321/admin` to verify the admin interface loads correctly.

## Secrets Management

### Environment Separation
The project uses three environment levels:
- **Local Development**: `.dev.vars` (not committed)
- **Production**: Cloudflare Workers secrets
- **CI/CD**: GitHub Actions secrets (if applicable)

### Local Secrets (`.dev.vars`)
```env
# This file is excluded from git via .gitignore
# Copy from .dev.vars.example and customize

# Database
DB_NAME=admin-db-dev
DB_TOKEN=dev-token-here

# Authentication
AUTH_SECRET=your-development-auth-secret
JWT_SECRET=your-development-jwt-secret

# Workflows
CUSTOMER_WORKFLOW=CustomerWorkflow-dev

# External APIs (if applicable)
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
```

### Production Secrets Management

#### Setting Production Secrets
```bash
# Database secrets (if custom tokens needed)
wrangler secret put DB_TOKEN --name iplcforms-v3

# Authentication secrets
wrangler secret put AUTH_SECRET --name iplcforms-v3
wrangler secret put JWT_SECRET --name iplcforms-v3

# External API keys
wrangler secret put STRIPE_SECRET_KEY --name iplcforms-v3
wrangler secret put SENDGRID_API_KEY --name iplcforms-v3
```

#### Listing Production Secrets
```bash
wrangler secret list --name iplcforms-v3
```

#### Updating Production Secrets
```bash
wrangler secret put SECRET_NAME --name iplcforms-v3
```

#### Deleting Production Secrets
```bash
wrangler secret delete SECRET_NAME --name iplcforms-v3
```

### Security Best Practices

#### ✅ DO
- Use different secrets for different environments
- Rotate secrets regularly
- Use strong, randomly generated secrets
- Store secrets in proper secret management systems
- Use environment-specific database names

#### ❌ DON'T
- Commit secrets to git
- Use production secrets in development
- Share secrets via insecure channels
- Use weak or predictable secrets
- Hard-code secrets in source code

## Database Migrations

### Migration File Structure
```
migrations/
├── 0001_create_customers.sql
├── 0002_create_subscriptions.sql
├── 0003_create_customer_subscriptions.sql
└── 0004_clinical_roles_permissions.sql
```

### Migration Scripts

#### Local Development Migrations
```bash
# Run all pending migrations locally
npm run migrate:local

# Run specific migration locally
wrangler d1 execute admin-db-dev --local --file=migrations/0001_create_customers.sql
```

#### Production Migrations
```bash
# Run all pending migrations in production
npm run migrate:prod

# Run specific migration in production
wrangler d1 execute admin-db --file=migrations/0001_create_customers.sql
```

#### Migration Testing
```bash
# Test migrations with sample data
npm run test:migrations

# Verify migration rollback (if supported)
npm run test:rollback
```

### Creating New Migrations

#### 1. Create Migration File
```bash
# Create new migration file with timestamp
touch migrations/$(date +%Y%m%d%H%M%S)_your_migration_name.sql
```

#### 2. Write Migration SQL
```sql
-- migrations/0005_add_form_templates.sql
CREATE TABLE IF NOT EXISTS form_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    schema JSON NOT NULL,
    version INTEGER DEFAULT 1,
    customer_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX idx_form_templates_customer_id ON form_templates(customer_id);
CREATE INDEX idx_form_templates_name ON form_templates(name);
```

#### 3. Test Migration Locally
```bash
wrangler d1 execute admin-db-dev --local --file=migrations/0005_add_form_templates.sql
```

#### 4. Update Migration Scripts
Add new migration to `scripts/migrate.js` if using automated migration runner.

### Migration Best Practices

#### ✅ DO
- Use descriptive migration names with timestamps
- Test migrations thoroughly in development
- Create indexes for foreign keys and frequently queried columns
- Use `IF NOT EXISTS` for table creation
- Include rollback instructions in comments

#### ❌ DON'T
- Modify existing migration files
- Run production migrations without testing
- Create migrations that can't be easily rolled back
- Use DROP statements without careful consideration
- Skip migration version tracking

## Clean Deploy Process

### Pre-Deploy Checklist
```bash
# 1. Verify local build works
npm run build

# 2. Run tests (if available)
npm run test

# 3. Check for uncommitted changes
git status

# 4. Verify environment configuration
cat wrangler.jsonc

# 5. Test migration scripts
npm run migrate:local
```

### Clean Deploy Steps

#### 1. Prepare Clean Environment
```bash
# Clean previous build artifacts
rm -rf dist/
rm -rf .astro/

# Reinstall dependencies (optional but recommended)
rm -rf node_modules/
npm install
```

#### 2. Build Application
```bash
# Build for production
npm run build

# Verify build output
ls -la dist/
```

#### 3. Prepare Deployment Files
```bash
# Copy required files to dist/
npm run wrangler:wrapper

# Verify wrapper files exist
ls -la dist/wrapper.js
```

#### 4. Run Pre-Deploy Validations
```bash
# Validate wrangler configuration
wrangler deploy --dry-run

# Check for any configuration issues
wrangler dev --local false --dry-run
```

#### 5. Deploy to Production
```bash
# Deploy using npm script (recommended)
npm run deploy

# Or deploy directly with wrangler
wrangler deploy
```

#### 6. Post-Deploy Verification
```bash
# Verify deployment succeeded
curl -s https://iplcforms-v3.pdarleyjr.workers.dev/admin

# Check deployment logs
wrangler tail

# Verify database connectivity
# (Use browser to test admin interface)
```

### Rollback Procedure

#### Quick Rollback
```bash
# Rollback to previous deployment
wrangler deployments list
wrangler rollback [deployment-id]
```

#### Manual Rollback
```bash
# Checkout previous working commit
git log --oneline -10
git checkout [previous-commit-hash]

# Redeploy previous version
npm run deploy

# Return to latest commit after verification
git checkout main
```

## Production Deployment

### Production Environment Setup

#### 1. Cloudflare Resources
```bash
# Create production D1 database
wrangler d1 create admin-db

# Create production workflow
wrangler workflows create CustomerWorkflow
```

#### 2. Update Production Configuration
Update `wrangler.jsonc` with production resource IDs:
```json
{
  "name": "iplcforms-v3",
  "compatibility_date": "2024-12-19",
  "main": "./dist/wrapper.js",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "admin-db",
      "database_id": "your-production-database-id"
    }
  ],
  "workflows": [
    {
      "binding": "CUSTOMER_WORKFLOW",
      "name": "CustomerWorkflow",
      "class_name": "CustomerWorkflow"
    }
  ]
}
```

#### 3. Set Production Secrets
```bash
# Set all required production secrets
wrangler secret put AUTH_SECRET
wrangler secret put JWT_SECRET
wrangler secret put STRIPE_SECRET_KEY
# ... other secrets as needed
```

#### 4. Run Production Migrations
```bash
npm run migrate:prod
```

#### 5. Deploy to Production
```bash
npm run deploy
```

### Production Monitoring

#### Health Checks
```bash
# Monitor deployment logs
wrangler tail

# Check deployment status
wrangler deployments list

# Monitor performance
curl -w "@curl-format.txt" -s https://iplcforms-v3.pdarleyjr.workers.dev/admin
```

#### Database Monitoring
```bash
# Check database status
wrangler d1 info admin-db

# Monitor database queries (if logging enabled)
wrangler tail --format=json | grep -i "database"
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Entry-point file not found"
```bash
# Solution: Ensure wrapper files are copied
npm run wrangler:wrapper
ls -la dist/wrapper.js

# If missing, check copyfiles installation
npm install copyfiles --save-dev
```

#### Issue: Database connection failures
```bash
# Check database binding in wrangler.jsonc
cat wrangler.jsonc | grep -A 5 "d1_databases"

# Verify database exists
wrangler d1 list

# Test database locally
wrangler d1 execute admin-db-dev --local --command="SELECT 1"
```

#### Issue: Build failures
```bash
# Clear cache and rebuild
rm -rf .astro/ dist/ node_modules/
npm install
npm run build
```

#### Issue: Secret access failures
```bash
# Verify secrets are set
wrangler secret list

# Test secret access locally
wrangler dev --local false
```

### Debug Mode Setup
```bash
# Enable detailed logging
export WRANGLER_LOG=debug

# Run with verbose output
wrangler deploy --verbose

# Monitor real-time logs
wrangler tail --format=pretty
```

### Performance Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Check worker memory usage
wrangler tail --format=json | grep -i "memory"

# Optimize build
npm run build:optimize
```

---

## Contact and Support
For deployment issues or questions:
1. Check the [DEPLOYMENT_AUDIT_REPORT.md](./DEPLOYMENT_AUDIT_REPORT.md)
2. Review Cloudflare Workers documentation
3. Check Astro deployment guides
4. Review this guide's troubleshooting section

**Last Updated**: January 5, 2025
**Tested Environment**: Node.js v18+, Wrangler CLI v4.22.0+, Astro v5.10.1