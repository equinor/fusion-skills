---
"fusion-code-conventions": patch
---

C# API response models: replace the advice to suppress null properties with `JsonIgnore`/`NullValueHandling.Ignore` with guidance to always serialize every declared property, since optional-by-omission fields make API contracts harder for clients to consume.
