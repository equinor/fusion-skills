---
"fusion-skills": patch
---

Fix Windows compatibility in validation scripts

- Fix extractFrontmatter regex to handle \r\n line endings
- Fix parseFrontmatter split to normalize \r\n line endings
- Fix discoverLocalSkills regex to strip both / and \ path separators
