# iplcforms-v3 API Documentation
**Complete REST API Reference for Clinical Form Platform**

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Core Entities](#core-entities)
4. [Customer Management](#customer-management)
5. [Subscription Management](#subscription-management)
6. [Form Templates](#form-templates)
7. [Form Submissions](#form-submissions)
8. [Clinical Permissions](#clinical-permissions)
9. [Analytics](#analytics)
10. [Error Handling](#error-handling)
11. [Rate Limiting](#rate-limiting)
12. [API Testing](#api-testing)

## API Overview

### Base URLs
- **Production**: `https://iplcforms-v3.pdarleyjr.workers.dev`
- **Development**: `http://localhost:4321`

### API Version
- **Current Version**: v1
- **Content Type**: `application/json`
- **Response Format**: JSON

### HTTP Methods
- `GET` - Retrieve resources
- `POST` - Create new resources
- `PUT` - Update existing resources
- `DELETE` - Remove resources
- `PATCH` - Partial resource updates

## Authentication

### API Key Authentication
```http
Authorization: Bearer YOUR_API_KEY
```

### JWT Token Authentication
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
X-API-Version: v1
```

## Core Entities

### Customer
```typescript
interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscription_status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}
```

### Subscription
```typescript
interface Subscription {
  id: number;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  max_forms?: number;
  max_submissions?: number;
  created_at: string;
  updated_at: string;
}
```

### Form Template
```typescript
interface FormTemplate {
  id: number;
  name: string;
  description?: string;
  schema: FormSchema;
  version: number;
  customer_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Form Submission
```typescript
interface FormSubmission {
  id: number;
  form_template_id: number;
  patient_data: Record<string, any>;
  submitted_by: string;
  submitted_at: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'completed';
  clinical_notes?: string;
}
```

## Customer Management

### List Customers
```http
GET /api/customers
```

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 20 |
| `status` | string | Filter by subscription status | all |
| `search` | string | Search by name or email | - |

#### Response
```json
{
  "customers": [
    {
      "id": 1,
      "name": "Medical Practice ABC",
      "email": "admin@medicalpractice.com",
      "phone": "+1-555-0123",
      "subscription_status": "active",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-05T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### Get Customer
```http
GET /api/customers/{id}
```

#### Response
```json
{
  "customer": {
    "id": 1,
    "name": "Medical Practice ABC",
    "email": "admin@medicalpractice.com",
    "phone": "+1-555-0123",
    "address": "123 Medical Dr, Healthcare City, HC 12345",
    "subscription_status": "active",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-05T12:00:00Z"
  }
}
```

### Create Customer
```http
POST /api/customers
```

#### Request Body
```json
{
  "name": "New Medical Practice",
  "email": "contact@newpractice.com",
  "phone": "+1-555-0456",
  "address": "456 Health Ave, Medical Town, MT 67890"
}
```

#### Response
```json
{
  "customer": {
    "id": 2,
    "name": "New Medical Practice",
    "email": "contact@newpractice.com",
    "phone": "+1-555-0456",
    "address": "456 Health Ave, Medical Town, MT 67890",
    "subscription_status": "inactive",
    "created_at": "2025-01-05T18:30:00Z",
    "updated_at": "2025-01-05T18:30:00Z"
  }
}
```

### Update Customer
```http
PUT /api/customers/{id}
```

#### Request Body
```json
{
  "name": "Updated Practice Name",
  "phone": "+1-555-0789"
}
```

### Delete Customer
```http
DELETE /api/customers/{id}
```

#### Response
```json
{
  "message": "Customer deleted successfully",
  "deleted_id": 2
}
```

## Subscription Management

### List Subscriptions
```http
GET /api/subscriptions
```

#### Response
```json
{
  "subscriptions": [
    {
      "id": 1,
      "name": "Basic Plan",
      "description": "Essential clinical forms package",
      "price": 29.99,
      "billing_cycle": "monthly",
      "features": ["5 form templates", "100 submissions/month", "Basic analytics"],
      "max_forms": 5,
      "max_submissions": 100,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Create Subscription
```http
POST /api/subscriptions
```

#### Request Body
```json
{
  "name": "Professional Plan",
  "description": "Advanced clinical forms with analytics",
  "price": 99.99,
  "billing_cycle": "monthly",
  "features": ["Unlimited form templates", "1000 submissions/month", "Advanced analytics", "API access"],
  "max_forms": null,
  "max_submissions": 1000
}
```

## Form Templates

### List Form Templates
```http
GET /api/form-templates
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `customer_id` | number | Filter by customer |
| `active_only` | boolean | Show only active templates |

#### Response
```json
{
  "form_templates": [
    {
      "id": 1,
      "name": "Patient Intake Form",
      "description": "Standard patient information collection",
      "version": 1,
      "customer_id": 1,
      "is_active": true,
      "schema": {
        "fields": [
          {
            "id": "patient_name",
            "type": "text",
            "label": "Patient Name",
            "required": true
          },
          {
            "id": "date_of_birth",
            "type": "date",
            "label": "Date of Birth",
            "required": true
          }
        ]
      },
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Form Template
```http
GET /api/form-templates/{id}
```

### Create Form Template
```http
POST /api/form-templates
```

#### Request Body
```json
{
  "name": "Medical History Form",
  "description": "Comprehensive medical history collection",
  "customer_id": 1,
  "schema": {
    "fields": [
      {
        "id": "current_medications",
        "type": "textarea",
        "label": "Current Medications",
        "required": false
      },
      {
        "id": "allergies",
        "type": "checkbox_group",
        "label": "Known Allergies",
        "options": ["Penicillin", "Latex", "Shellfish", "Other"],
        "required": false
      }
    ]
  }
}
```

### Update Form Template
```http
PUT /api/form-templates/{id}
```

### Form Template Versions
```http
GET /api/form-templates/{id}/versions
```

#### Response
```json
{
  "versions": [
    {
      "version": 1,
      "created_at": "2025-01-01T00:00:00Z",
      "changes": "Initial version"
    },
    {
      "version": 2,
      "created_at": "2025-01-02T10:00:00Z",
      "changes": "Added allergies field"
    }
  ]
}
```

## Form Submissions

### List Form Submissions
```http
GET /api/form-submissions
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `form_template_id` | number | Filter by form template |
| `status` | string | Filter by submission status |
| `date_from` | string | Start date (ISO 8601) |
| `date_to` | string | End date (ISO 8601) |

#### Response
```json
{
  "form_submissions": [
    {
      "id": 1,
      "form_template_id": 1,
      "patient_data": {
        "patient_name": "John Doe",
        "date_of_birth": "1980-01-15",
        "phone": "+1-555-0123"
      },
      "submitted_by": "nurse@medicalpractice.com",
      "submitted_at": "2025-01-05T14:30:00Z",
      "status": "submitted",
      "clinical_notes": null
    }
  ]
}
```

### Get Form Submission
```http
GET /api/form-submissions/{id}
```

### Create Form Submission
```http
POST /api/form-submissions
```

#### Request Body
```json
{
  "form_template_id": 1,
  "patient_data": {
    "patient_name": "Jane Smith",
    "date_of_birth": "1990-05-20",
    "current_medications": "None",
    "allergies": ["Latex"]
  },
  "submitted_by": "doctor@medicalpractice.com"
}
```

### Update Submission Status
```http
PATCH /api/form-submissions/{id}
```

#### Request Body
```json
{
  "status": "reviewed",
  "clinical_notes": "Patient information verified and reviewed."
}
```

## Clinical Permissions

### Check User Permissions
```http
GET /api/clinical-permissions/check
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string | User identifier |
| `action` | string | Action to check |
| `resource` | string | Resource type |

#### Response
```json
{
  "has_permission": true,
  "role": "doctor",
  "allowed_actions": ["read", "write", "review"]
}
```

### List User Roles
```http
GET /api/clinical-permissions/roles
```

#### Response
```json
{
  "roles": [
    {
      "role": "doctor",
      "permissions": ["read_all", "write_all", "review", "approve"]
    },
    {
      "role": "nurse",
      "permissions": ["read_assigned", "write_assigned", "submit"]
    },
    {
      "role": "admin",
      "permissions": ["manage_users", "system_config", "audit_logs"]
    }
  ]
}
```

## Analytics

### Form Template Analytics
```http
GET /api/analytics/form-templates/{id}
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `date_from` | string | Start date |
| `date_to` | string | End date |
| `granularity` | string | daily, weekly, monthly |

#### Response
```json
{
  "form_template_id": 1,
  "period": {
    "from": "2025-01-01",
    "to": "2025-01-05"
  },
  "metrics": {
    "total_submissions": 25,
    "completed_submissions": 23,
    "draft_submissions": 2,
    "average_completion_time": 180,
    "completion_rate": 0.92
  },
  "daily_breakdown": [
    {
      "date": "2025-01-01",
      "submissions": 5,
      "completed": 5
    },
    {
      "date": "2025-01-02",
      "submissions": 8,
      "completed": 7
    }
  ]
}
```

### Customer Analytics
```http
GET /api/analytics/customers/{id}
```

#### Response
```json
{
  "customer_id": 1,
  "metrics": {
    "total_form_templates": 3,
    "active_form_templates": 2,
    "total_submissions": 150,
    "monthly_submissions": 45,
    "storage_used": "2.5 MB",
    "last_activity": "2025-01-05T16:20:00Z"
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2025-01-05T18:30:00Z",
    "request_id": "req_12345"
  }
}
```

### HTTP Status Codes
| Status | Code | Description |
|--------|------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - Missing or invalid authentication
- `PERMISSION_DENIED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `DATABASE_ERROR` - Database operation failed
- `EXTERNAL_SERVICE_ERROR` - Third-party service unavailable

## Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641024000
```

### Default Limits
| Endpoint Category | Requests per Hour |
|------------------|-------------------|
| Authentication | 100 |
| Read Operations | 1000 |
| Write Operations | 200 |
| Analytics | 500 |

### Rate Limit Exceeded Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 3600
  }
}
```

## API Testing

### cURL Examples

#### Create Customer
```bash
curl -X POST https://iplcforms-v3.pdarleyjr.workers.dev/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "name": "Test Medical Practice",
    "email": "test@practice.com",
    "phone": "+1-555-0123"
  }'
```

#### List Form Templates
```bash
curl -X GET "https://iplcforms-v3.pdarleyjr.workers.dev/api/form-templates?customer_id=1" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Submit Form Data
```bash
curl -X POST https://iplcforms-v3.pdarleyjr.workers.dev/api/form-submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "form_template_id": 1,
    "patient_data": {
      "patient_name": "John Doe",
      "date_of_birth": "1980-01-15"
    },
    "submitted_by": "nurse@practice.com"
  }'
```

### Postman Collection
A comprehensive Postman collection is available for testing all API endpoints:
- Import URL: `https://iplcforms-v3.pdarleyjr.workers.dev/api/postman-collection.json`
- Includes pre-configured authentication and sample requests

### API Testing Tools
- **Postman**: Full-featured API testing
- **Insomnia**: Alternative REST client
- **HTTPie**: Command-line HTTP client
- **curl**: Universal command-line tool

---

## API Support
For API questions or issues:
1. Check this documentation for endpoint details
2. Review error responses for troubleshooting hints
3. Test with provided cURL examples
4. Contact support with specific error codes and request IDs

**API Version**: v1
**Last Updated**: January 5, 2025
**Documentation Version**: 1.0.0