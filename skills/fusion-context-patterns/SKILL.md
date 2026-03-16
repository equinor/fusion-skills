---
name: fusion-context-patterns
description: 'Helps Fusion app developers use Fusion Framework context patterns correctly for enabling context, consuming context, and handling context errors. USE FOR: enabling context in Fusion apps, context setup questions, context error troubleshooting, custom context patterns, context API usage. DO NOT USE FOR: generic React context advice, domain business rules, non-Fusion context patterns.'
license: MIT
metadata:
   version: "0.0.0"
   status: active
   owner: "@equinor/fusion-core"
   tags:
      - fusion-framework
      - context
      - patterns
      - troubleshooting
      - setup
   mcp:
      suggested:
         - mcp_fusion
---

# Fusion Framework Context Patterns

## When to use

Use this skill when developers need guidance on Fusion Framework context patterns, including:

- Setting up context in Fusion applications (`enableContext`, context configuration)
- Consuming context in React components (`useModuleCurrentContext`, `useRelatedContext`)  
- Handling context-related errors and troubleshooting missing/invalid context
- Creating custom context clients and context types
- Understanding context lifecycle events and validation
- Framework-specific context patterns and common pitfalls

Typical triggers:
- "How do I enable context in my Fusion app?"
- "I'm getting context errors, how do I fix them?"
- "How do I set up ProjectMaster context?"
- "How do I create custom context for my app?"
- "Context is not working in my component"
- "How do I handle context changes?"

## When not to use

Do not use this skill for:
- Generic React Context API questions unrelated to Fusion Framework
- Domain-specific business rules about what context should mean
- Application code outside Fusion Framework context patterns  
- General React state management not involving Fusion context

## Required inputs

Collect before providing guidance:
- What specific context-related task are they trying to accomplish?
- Are they setting up new context, consuming existing context, or troubleshooting errors?
- What Fusion Framework version and context types are they working with?
- Are they seeing specific error messages or unexpected behavior?

Optional inputs:
- Current context configuration code (if troubleshooting)
- Component code where context should be consumed
- Error messages or logs related to context issues

## Instructions

### Step 1 — Search current Fusion Framework context documentation

Always start by retrieving current context APIs and patterns from Fusion MCP:

1. Use `mcp_fusion_mcp_lo_search_framework` to get current context module APIs, setup patterns, and examples
2. Use `mcp_fusion_mcp_lo_search_docs` for broader context guidance and concepts
3. Search for terms relevant to the user's specific question (enableContext, useModuleCurrentContext, custom context, etc.)

### Step 2 — Provide framework-grounded guidance

Based on current documentation:

1. **For setup questions**: Explain `enableContext` configuration patterns, context types, and module registration
2. **For consumption questions**: Show `useModuleCurrentContext` and related React hooks with examples
3. **For error troubleshooting**: Identify likely causes using `FusionContextSearchError` patterns and validation lifecycle
4. **For custom context**: Walk through custom context client setup and path extraction patterns

### Step 3 — Include concrete examples

Always provide:
- Current API usage examples from the framework documentation
- Specific configuration code matching their use case
- Error handling patterns when relevant
- Links to official cookbooks and documentation sources

### Step 4 — Label fallback guidance clearly

When Fusion MCP is unavailable or returns incomplete results:
- Clearly state "**Fallback guidance** (MCP unavailable)"  
- Provide general context patterns but emphasize verification against current docs
- Direct to official Fusion Framework documentation sources

## Expected output

Provide:
- Framework-grounded setup or troubleshooting guidance
- Concrete code examples using current APIs
- Explanation of context patterns, lifecycle, and common pitfalls
- Links to relevant cookbooks, documentation, or examples
- Clear labeling when fallback guidance is provided

## Safety & constraints

- Never invent context types, hooks, or configuration methods not grounded in current framework sources
- Always search Fusion MCP first before providing guidance
- Clearly distinguish between current framework patterns and fallback advice
- Focus on Fusion Framework context patterns only, not generic React context
- Direct users to official sources for verification and deeper context

## References

See [references/context-patterns.md](references/context-patterns.md) for comprehensive examples of:
- Basic context setup patterns
- React hook usage examples  
- Custom context client patterns
- Error handling and troubleshooting guides
- Common pitfalls and solutions