# IPLC Forms v3 - Deployment Guide

This guide provides detailed instructions for deploying IPLC Forms v3 to Cloudflare Workers.

## 🚀 Quick Start

### Prerequisites

1. **Cloudflare Account**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Enable Workers subscription (Free tier available)

2. **Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Node.js 18+**
   - Download from [nodejs.org](https://nodejs.org)

## 📋 Step-by-Step Deployment

### 1. Create Cloudflare Resources

#### D1 Database
```bash
wrangler d1 create iplc-forms-db
```

Save the database ID from the output:
```
✅ Successfully created DB 'iplc-forms-db' in region ENAM
Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB"
database_name = "iplc-forms-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Save this ID
```

#### KV Namespaces
```bash
# Rate Limiter KV
wrangler kv:namespace create "RATE_LIMITER"

# Conversation Cache KV
wrangler kv:namespace create "CONVERSATION_CACHE"

# Snippet Store KV
wrangler kv:namespace create "SNIPPET_STORE"

# SSE Metrics KV
wrangler kv:namespace create "SSE_METRICS"

# Form Sessions KV
wrangler kv:namespace create "FORM_SESSIONS"
```

Save each namespace ID from the outputs.

#### Vectorize Index
```bash
wrangler vectorize create iplc-forms-vectors --preset @cf/baai/bge-base-en-v1.5
```

### 2. Update Configuration

Edit `wrangler.jsonc` with your resource IDs:

```jsonc
{
  "name": "iplcforms-v3",
  "compatibility_date": "2024-10-28",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist",
  "dev": {
    "port": 8787
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "iplc-forms-db",
      "database_id": "YOUR_D1_DATABASE_ID"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "RATE_LIMITER",
      "id": "YOUR_RATE_LIMITER_ID"
    },
    {
      "binding": "CONVERSATION_CACHE",
      "id": "YOUR_CONVERSATION_CACHE_ID"
    },
    {
      "binding": "SNIPPET_STORE",
      "id": "YOUR_SNIPPET_STORE_ID"
    },
    {
      "binding": "SSE_METRICS",
      "id": "YOUR_SSE_METRICS_ID"
    },
    {
      "binding": "FORM_SESSIONS",
      "id": "YOUR_FORM_SESSIONS_ID"
    }
  ],
  "vectorize": [
    {
      "binding": "VECTORIZE_INDEX",
      "index_name": "iplc-forms-vectors"
    }
  ],
  "ai": {
    "binding": "AI"
  }
}
```

### 3. Set Environment Variables

#### Via Wrangler CLI
```bash
# Admin credentials (REQUIRED)
wrangler secret put ADMIN_USERNAME
# Enter: admin

wrangler secret put ADMIN_PASSWORD
# Enter: your-secure-password

# Optional integrations
wrangler secret put NEXTCLOUD_URL
wrangler secret put NEXTCLOUD_USERNAME
wrangler secret put NEXTCLOUD_PASSWORD
wrangler secret put SLACK_WEBHOOK_URL
```

#### Via Cloudflare Dashboard
1. Go to Workers & Pages > Your Worker > Settings > Variables
2. Add each secret variable

### 4. Run Database Migrations

```bash
# For local development
npm run db:migrate:local

# For production
npm run db:migrate:remote
```

Migration files are located in `/migrations/` and will be applied in order.

### 5. Deploy to Production

#### Manual Deployment
```bash
npm run build
npm run deploy
```

#### Automatic Deployment (Recommended)
1. Fork/Clone the repository to your GitHub account
2. Go to Cloudflare Dashboard > Workers & Pages
3. Click "Create application" > "Pages" > "Connect to Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Add environment variables in the Pages settings

### 6. Verify Deployment

1. **Check the deployment URL**
   ```
   https://iplcforms-v3.YOUR-SUBDOMAIN.workers.dev
   ```

2. **Test the admin panel**
   ```
   https://iplcforms-v3.YOUR-SUBDOMAIN.workers.dev/admin
   ```

3. **Verify API endpoints**
   ```bash
   # Test rate limiting
   curl -X GET https://iplcforms-v3.YOUR-SUBDOMAIN.workers.dev/api/health
   
   # Test admin auth
   curl -u admin:password https://iplcforms-v3.YOUR-SUBDOMAIN.workers.dev/api/admin/sse-metrics
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. D1 Database Errors
```
Error: D1_ERROR: no such table: forms
```
**Solution**: Run migrations
```bash
npm run db:migrate:remote
```

#### 2. KV Namespace Errors
```
Error: Cannot read properties of undefined (reading 'get')
```
**Solution**: Verify KV namespace IDs in `wrangler.jsonc`

#### 3. Vectorize Index Errors
```
Error: Vectorize index not found
```
**Solution**: Ensure the index name matches exactly
```bash
wrangler vectorize list
```

#### 4. Build Failures
```
Error: Cannot find module '@astrojs/cloudflare'
```
**Solution**: Clean install dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

1. **Enable Cloudflare Caching**
   - Set appropriate cache headers for static assets
   - Use Cloudflare Page Rules for aggressive caching

2. **Monitor Usage**
   - Check Workers Analytics for request patterns
   - Monitor D1 query performance
   - Review Vectorize usage metrics

3. **Scale Limits**
   - Workers: 100,000 requests/day (free tier)
   - D1: 5GB storage, 5M rows read/day (free tier)
   - KV: 100,000 reads/day (free tier)
   - Vectorize: 30M queried dimensions/month (free tier)

## 📊 Monitoring

### Cloudflare Dashboard
1. Workers & Pages > Your Worker > Analytics
2. Monitor:
   - Request count
   - Error rate
   - Response times
   - CPU time

### Custom Metrics
Access SSE performance metrics:
```bash
curl -u admin:password https://your-domain.workers.dev/api/admin/sse-metrics
```

### Logs
```bash
# Tail production logs
wrangler tail
```

## 🔐 Security Best Practices

1. **Strong Admin Password**
   - Use a password manager
   - Minimum 16 characters
   - Include numbers and special characters

2. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

3. **Access Control**
   - Limit admin access
   - Use Cloudflare Access for additional protection
   - Monitor login attempts

4. **Data Protection**
   - Enable D1 backups
   - Export critical data regularly
   - Test restore procedures

## 🚨 Rollback Procedure

If deployment issues occur:

1. **Via GitHub (Recommended)**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   ```

2. **Via Cloudflare Dashboard**
   - Go to Workers & Pages > Your Worker > Deployments
   - Click "Rollback" on a previous deployment

3. **Manual Rollback**
   ```bash
   # Deploy specific version
   git checkout <previous-commit-hash>
   npm run build
   npm run deploy
   ```

## 📞 Support

- **GitHub Issues**: [github.com/pdarleyjr/iplcforms-v3/issues](https://github.com/pdarleyjr/iplcforms-v3/issues)
- **Cloudflare Community**: [community.cloudflare.com](https://community.cloudflare.com)
- **Discord**: [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)

---

Last updated: January 2025