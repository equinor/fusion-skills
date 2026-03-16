---
name: fusion-http-service-discovery
description: 'Helps Fusion app developers use HTTP clients and service discovery patterns in Fusion Framework for calling backend services, configuring service discovery, and troubleshooting service resolution. USE FOR: calling backend services, configuring service discovery, HTTP client setup, troubleshooting service endpoints, service resolution issues. DO NOT USE FOR: generic REST advice, backend API design, non-Fusion HTTP patterns.'
license: MIT
metadata:
  version: "0.0.0"
  status: active
  owner: "@equinor/fusion-core"
  tags:
    - fusion-framework
    - http
    - service-discovery
    - backend-services
    - troubleshooting
    - configuration
  mcp:
    suggested:
      - mcp_fusion
---

# Fusion Framework HTTP and Service Discovery

## When to use

Use this skill when developers need guidance on HTTP and service discovery patterns in Fusion Framework, including:

- Calling backend services from Fusion applications (`configureHttpClient`, `createClient`, `json()`)
- Setting up service discovery for dynamic service resolution (`enableServiceDiscovery`)
- Troubleshooting service endpoint resolution and HTTP client errors
- Configuring authentication scopes and headers for backend services  
- Understanding the relationship between HTTP clients and service discovery
- Creating HTTP clients for discovered services

Typical triggers:
- "How do I call a backend service from my Fusion app?"
- "How do I set up service discovery?"
- "I'm getting wrong service URLs or discovery failures"
- "How do I configure HTTP clients with authentication?"
- "Service discovery is not working"
- "How do I troubleshoot HTTP client errors?"
- "How do I use discovered services?"

## When not to use

Do not use this skill for:
- Generic REST client advice not specific to Fusion Framework
- Backend API design or contract definition
- Non-Fusion HTTP patterns or vanilla fetch usage
- Authentication implementation details (use auth-specific skills)

## Required inputs

Collect before providing guidance:
- What specific HTTP or service discovery task are they trying to accomplish?
- Are they setting up new HTTP clients, configuring service discovery, or troubleshooting existing issues?
- Are they seeing specific error messages or unexpected service URLs?
- What services are they trying to call?

Optional inputs:
- Current HTTP client or service discovery configuration code
- Error messages or logs related to HTTP or service discovery
- Service names or endpoints they're working with

## Instructions

### Step 1 — Search current Fusion Framework HTTP and service discovery documentation

Always start by retrieving current HTTP and service discovery APIs from Fusion MCP:

1. Use `mcp_fusion_mcp_lo_search_framework` to get current HTTP module and service discovery patterns
2. Use `mcp_fusion_mcp_lo_search_docs` for broader HTTP and service discovery guidance  
3. Search for terms relevant to the user's specific question (configureHttpClient, enableServiceDiscovery, createClient, resolveService, etc.)

### Step 2 — Provide framework-grounded guidance

Based on current documentation:

1. **For HTTP client setup**: Explain `configureHttpClient` patterns, named clients, and `createClient` usage
2. **For service discovery setup**: Show `enableServiceDiscovery` configuration and service resolution patterns
3. **For calling services**: Demonstrate `json()`, `fetch()`, and observable patterns with discovered services
4. **For troubleshooting**: Identify likely causes using HTTP client errors and service discovery failures

### Step 3 — Explain how HTTP and service discovery fit together

Always clarify the relationship:
- Service discovery resolves service names to URLs and scopes
- HTTP clients use these discovered services for actual API calls
- How to create HTTP clients for discovered services (`modules.serviceDiscovery.createClient()`)
- When to use direct HTTP clients vs service discovery patterns

### Step 4 — Include concrete examples

Always provide:
- Current API usage examples from the framework documentation
- Configuration code matching their use case
- Service discovery setup with HTTP client integration
- Error handling and troubleshooting patterns
- Links to official framework sources

### Step 5 — Label fallback guidance clearly  

When Fusion MCP is unavailable or returns incomplete results:
- Clearly state "**Fallback guidance** (MCP unavailable)"
- Provide general HTTP and service discovery patterns but emphasize verification against current docs
- Direct to official Fusion Framework documentation sources

## Expected output

Provide:
- Framework-grounded HTTP client and service discovery guidance
- Concrete code examples using current APIs (`configureHttpClient`, `enableServiceDiscovery`, `createClient`)
- Explanation of how HTTP clients and service discovery work together
- Step-by-step setup patterns for common scenarios
- Troubleshooting guidance for service resolution and HTTP errors
- Links to relevant cookbooks, documentation, or examples
- Clear labeling when fallback guidance is provided

## Safety & constraints

- Never invent service names, HTTP client configurations, or discovery rules not grounded in current framework sources
- Always search Fusion MCP first before providing guidance
- Clearly distinguish between current framework patterns and fallback advice
- Focus on Fusion Framework HTTP and service discovery patterns only
- Direct users to official sources for verification and deeper context
- Avoid recommending vanilla fetch or generic HTTP libraries when Fusion Framework patterns exist

## References

See [references/http-service-discovery.md](references/http-service-discovery.md) for comprehensive examples of:
- HTTP client configuration patterns
- Service discovery setup and usage
- Integration patterns between HTTP and service discovery
- Common troubleshooting scenarios and solutions
- Authentication and scoping patterns