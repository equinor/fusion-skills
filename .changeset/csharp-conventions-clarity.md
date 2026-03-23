---
"fusion-code-conventions": patch
---

Improve C# conventions for clarity and consistency

- Separate Controllers/ and Endpoints/ into distinct lines in the project layout to avoid ambiguity
- Clarify Startup.cs guidance to distinguish the older Startup class pattern from the .NET 6+ minimal hosting model
- Broaden error-handling guidance to cover both minimal API and MVC ProblemDetails helpers across supported target frameworks
