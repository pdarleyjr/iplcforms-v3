# IPLC Forms v3

A modern, AI-enhanced form-building platform built on Cloudflare's full-stack infrastructure. This application combines advanced form creation capabilities with intelligent chat assistance, offering a seamless experience for creating, managing, and analyzing forms.

## 🚀 Features

### 1. **NotebookLM-style Chat Interface**
- **Citation Surfaces**: References appear as `^[n]` with hover tooltips
- **Context Window Management**: 128KB limit with smart truncation
- **Document Upload**: Support for PDF and DOCX files with OCR extraction
- **Shareable Snippets**: UUID-based snippet sharing with direct links
- **Export Options**: Export conversations as Markdown or JSON

### 2. **Advanced Form Builder**
- **Conditional Logic Engine**: Dynamic field visibility based on user responses
- **Multi-Page Forms**: Wizard-style forms with progress tracking
- **Field Types**: Text, email, phone, date, select, radio, checkbox, file upload, AI summary
- **Real-time Preview**: See form changes instantly as you build
- **Form Templates**: Save and reuse form structures

### 3. **Third-Party Integrations**
- **Nextcloud Export**: WebDAV integration for automatic form backup
- **Slack Notifications**: Real-time alerts for form submissions
- **Email Notifications**: Automated emails via MailChannels
- **Webhook Support**: Custom integrations with external services

### 4. **Performance & Security**
- **Rate Limiting**: Token bucket algorithm (60 req/min with burst of 10)
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **SSE Optimization**: 16KB buffering with keep-alive pings
- **Caching**: Vectorize results (1hr) and conversation history (30min)
- **Performance Monitoring**: Real-time SSE metrics and analytics

### 5. **UX Polish**
- **Metallic Theme**: Gradient-metallic-primary color palette
- **Noise Texture Background**: Subtle visual depth
- **Responsive Design**: Mobile-first with collapsible sidebar
- **Smooth Animations**: Tailwind transitions throughout

## 🛠️ Technology Stack

- **Frontend**: Astro 5, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Cloudflare Workers, D1 Database, Vectorize, Workers AI
- **Storage**: Workers KV, Durable Objects
- **Deployment**: GitHub Actions with automatic Cloudflare deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Cloudflare account with Workers subscription
- Wrangler CLI installed (`npm install -g wrangler`)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pdarleyjr/iplcforms-v3.git
   cd iplcforms-v3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Cloudflare resources**
   
   Create the required resources:
   ```bash
   # D1 Database
   wrangler d1 create iplc-forms-db
   
   # KV Namespaces
   wrangler kv:namespace create "RATE_LIMITER"
   wrangler kv:namespace create "CONVERSATION_CACHE"
   wrangler kv:namespace create "SNIPPET_STORE"
   wrangler kv:namespace create "SSE_METRICS"
   
   # Vectorize Index
   wrangler vectorize create iplc-forms-vectors --preset @cf/baai/bge-base-en-v1.5
   ```

4. **Update wrangler.jsonc**
   
   Replace the IDs in `wrangler.jsonc` with your created resource IDs:
   ```jsonc
   {
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
         "id": "YOUR_RATE_LIMITER_KV_ID"
       },
       // ... other KV namespaces
     ],
     "vectorize": [
       {
         "binding": "VECTORIZE_INDEX",
         "index_name": "iplc-forms-vectors"
       }
     ]
   }
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate:local
   ```

## 🚀 Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Local: http://localhost:4321
   - Form Builder: http://localhost:4321/forms/new
   - Admin Dashboard: http://localhost:4321/admin

## 📦 Deployment

### Automatic Deployment

The project is configured for automatic deployment via GitHub Actions:

1. Push to the `main` branch
2. GitHub Actions will automatically deploy to Cloudflare Workers

### Manual Deployment

```bash
npm run deploy
```

## 🔐 Environment Variables

Create a `.env` file for local development:

```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# API Keys (optional)
NEXTCLOUD_URL=https://your-nextcloud-instance.com
NEXTCLOUD_USERNAME=your-username
NEXTCLOUD_PASSWORD=your-app-password
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Workers AI Model
AI_MODEL=@cf/qwen/qwen1.5-14b-chat-awq
```

## 📊 Admin Features

### SSE Performance Metrics

Access performance metrics at `/api/admin/sse-metrics`:

```bash
curl -u admin:password https://your-domain.workers.dev/api/admin/sse-metrics
```

### Rate Limiting

- 60 requests per minute per IP
- Burst capacity of 10 requests
- Automatic cleanup after 5 minutes

### Security Headers

- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

## 🧪 Testing

### Run tests
```bash
npm test
```

### Run linting
```bash
npm run lint
```

### Type checking
```bash
npm run typecheck
```

## 📚 API Documentation

### Chat API

**POST** `/api/chat/query`
```json
{
  "query": "Your question here",
  "documentIds": ["doc-uuid-1", "doc-uuid-2"],
  "conversationId": "optional-conversation-id"
}
```

Response: Server-Sent Events stream

### Form Submission

**POST** `/api/forms/submit`
```json
{
  "formId": "form-uuid",
  "responses": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### Snippet Sharing

**GET** `/api/chat/snippet/{snippetId}`

Returns the shared conversation snippet

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build/)
- Powered by [Cloudflare Workers](https://workers.cloudflare.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI capabilities via [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)

## 📞 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/pdarleyjr/iplcforms-v3/issues) page.

---

**Live Demo**: https://iplcforms-v3.pdarleyjr.workers.dev