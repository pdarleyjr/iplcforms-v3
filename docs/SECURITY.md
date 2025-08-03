# Security Guidelines for IPLC Forms v3

This document outlines security best practices for managing credentials, handling sensitive data, and responding to security incidents in the IPLC Forms v3 application.

## 🚨 Immediate Action Required: Exposed API Token

Based on the security audit, a Cloudflare API token was exposed in terminal commands. **This token must be rotated immediately.**

### Steps to Rotate the Exposed Token

1. **Log into Cloudflare Dashboard**
   - Navigate to https://dash.cloudflare.com/
   - Go to "My Profile" → "API Tokens"

2. **Revoke the Exposed Token**
   - Find the token with value starting with `U6XGuhQXd5JwIrkuIprF...`
   - Click "Revoke" to immediately invalidate it

3. **Create a New API Token**
   - Click "Create Token"
   - Use the "Custom token" template
   - Required permissions:
     - Account: Cloudflare Workers Scripts:Edit
     - Account: Workers KV Storage:Edit
     - Account: D1:Edit
     - Zone: Workers Routes:Edit

4. **Update All Deployments**
   ```bash
   # Set the new token in production
   npx wrangler secret put CLOUDFLARE_API_TOKEN
   # Enter the new token when prompted
   ```

5. **Update GitHub Secrets**
   - Go to your repository settings
   - Navigate to Secrets and variables → Actions
   - Update `CLOUDFLARE_API_TOKEN` with the new value

## 🔐 Credential Management Best Practices

### 1. Environment Variables

**Development Environment**
- Copy `.env.example` to `.env` for local development
- Never commit `.env` files to version control
- Use placeholder values in `.env.example`

**Production Environment**
- Store all secrets using Wrangler secrets:
  ```bash
  npx wrangler secret put SECRET_NAME
  ```
- Never use environment files in production

### 2. Required Secrets

| Secret Name | Description | Rotation Schedule |
|------------|-------------|-------------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API access | Every 90 days |
| `ADMIN_PASSWORD` | Admin dashboard access | Every 30 days |
| `NEXTCLOUD_PASSWORD` | Nextcloud integration | Every 90 days |
| `SLACK_WEBHOOK_URL` | Slack notifications | Every 180 days |
| `API_TOKEN` | Application API access | Every 90 days |

### 3. Secret Storage Guidelines

**DO:**
- ✅ Use Cloudflare Worker Secrets for production
- ✅ Use environment variables for local development only
- ✅ Implement least-privilege access
- ✅ Use different tokens for each environment
- ✅ Enable 2FA on all service accounts

**DON'T:**
- ❌ Commit secrets to version control
- ❌ Log secrets in console output
- ❌ Share secrets via email or chat
- ❌ Use the same token across environments
- ❌ Store secrets in plain text files

## 📅 Secret Rotation Schedule

### Automated Rotation Reminders

Set up calendar reminders for the following rotation schedule:

1. **Monthly (Every 30 days)**
   - Admin passwords
   - Database access credentials

2. **Quarterly (Every 90 days)**
   - API tokens
   - Integration credentials
   - Service account passwords

3. **Semi-Annually (Every 180 days)**
   - Webhook URLs
   - OAuth client secrets

### Rotation Process

1. **Generate New Credential**
   - Create new token/password in the service dashboard
   - Follow strong password/token guidelines

2. **Update Production First**
   ```bash
   npx wrangler secret put SECRET_NAME
   ```

3. **Verify Functionality**
   - Test the application with new credentials
   - Monitor error logs for authentication failures

4. **Update Documentation**
   - Update any internal documentation
   - Notify team members of rotation

5. **Revoke Old Credential**
   - Wait 24 hours after updating
   - Revoke/delete old credential in service dashboard

## 🛡️ Security Headers

The application implements the following security headers:

```javascript
{
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.cloudflare.com",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

## 🔍 Security Monitoring

### 1. Audit Logging

Monitor the following events:
- Failed authentication attempts
- API token usage
- Database queries
- File uploads
- Admin actions

### 2. Rate Limiting

Current implementation:
- 60 requests per minute per IP
- Burst capacity of 10 requests
- Automatic cleanup after 5 minutes

### 3. Alerting

Set up alerts for:
- Multiple failed authentication attempts
- Unusual API usage patterns
- Database connection failures
- Rate limit violations

## 🚨 Incident Response

### If a Secret is Exposed

1. **Immediate Actions**
   - Revoke the exposed credential immediately
   - Generate and deploy new credential
   - Check access logs for unauthorized usage

2. **Investigation**
   - Review git history for exposure source
   - Check CI/CD logs
   - Audit recent deployments

3. **Remediation**
   - Update all systems using the credential
   - Review and update security practices
   - Document incident and lessons learned

4. **Prevention**
   - Enable secret scanning in GitHub
   - Use pre-commit hooks to detect secrets
   - Regular security training for developers

## 🔧 Security Tools

### Recommended Tools

1. **Secret Scanning**
   - GitHub secret scanning (enabled by default)
   - Gitleaks for pre-commit hooks
   - TruffleHog for deep repository scanning

2. **Dependency Scanning**
   - Dependabot for automated updates
   - npm audit for vulnerability detection
   - Snyk for continuous monitoring

3. **Code Analysis**
   - ESLint security plugin
   - TypeScript strict mode
   - SonarCloud for code quality

### Pre-commit Hooks

This project now includes automated pre-commit hooks managed by Husky:

1. **Automatic Installation**
   - Hooks are installed automatically when you run `npm install`
   - No manual configuration required

2. **Hook Checks**
   - **TypeScript Compilation**: `npm run type-check`
   - **Secret Scanning**: `npm run scan-secrets`
   - **Lint-staged**: Runs TypeScript checks on staged `.ts` and `.tsx` files

3. **Secret Scanner Features**
   - Detects common secret patterns:
     - GitHub tokens (`ghp_`, `ghs_`, `github_pat_`)
     - API keys and tokens
     - Passwords and private keys
     - AWS credentials (`AKIA...`)
     - Cloudflare tokens
   - Ignores false positives (examples, placeholders, test data)
   - Provides clear error messages with file and line numbers

4. **Bypassing Hooks**
   - Use `git commit --no-verify` only in emergencies
   - Always manually verify no secrets are exposed before bypassing

5. **Manual Secret Scanning**
   ```bash
   # Run secret scanner manually
   npm run scan-secrets
   
   # Check specific files
   git add file.ts
   npm run scan-secrets
   ```

## 📞 Security Contacts

For security concerns or to report vulnerabilities:

- **Email**: security@iplcforms.com
- **GitHub Security**: Use private vulnerability reporting
- **Emergency**: Contact project maintainers directly

## 📚 Additional Resources

- [Cloudflare Security Best Practices](https://developers.cloudflare.com/fundamentals/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

---

**Last Updated**: August 2025  
**Next Review**: November 2025