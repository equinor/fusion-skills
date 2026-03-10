# Dependency PR Review Tracker

Use this tracker while reviewing a dependency PR so the research, lens analysis, validation, and follow-up path stay explicit.

## Quick workflow

- [ ] Capture PR context and update type
- [ ] Record the dependency package, versions, and changed files
- [ ] Gather release notes, changelog, advisories, and known-issue sources
- [ ] Summarize research findings
- [ ] Score security, code quality, and impact lenses
- [ ] Determine recommendation and confidence
- [ ] Identify required follow-up work
- [ ] Ask for explicit maintainer confirmation before any approve/merge action

## Context

| Field | Value |
|-------|-------|
| Repository | |
| Pull request # / URL | |
| Package | |
| Ecosystem | |
| Current version | |
| Target version | |
| Update type | |
| Changed files | |
| CI status | |

## Sources consulted

| Source type | Link / reference | Key finding |
|-------------|------------------|-------------|
| Release notes / changelog | | |
| Security advisories | | |
| Issue tracker / regressions | | |
| Dependency graph / diff | | |
| Additional source | | |

## Validation plan

**Repository-specific checks**
```
(paste relevant commands here)
```

**PR / package-specific checks**
```
(paste focused validation here)
```

## Lens tracking

| Lens | Assessment | Evidence | Notes |
|------|------------|----------|-------|
| Security | `clear / concern / blocking` | | |
| Code quality | `clear / concern / blocking` | | |
| Impact | `clear / concern / blocking` | | |

## Verdict

| Field | Value |
|-------|-------|
| Recommendation | `merge / merge with follow-up / hold / decline` |
| Confidence | `high / medium / low` |
| Rationale | |

## Follow-up handoff

If additional work is required, make the handoff explicit.

| Need follow-up? | Issue type | Destination skill / flow | Draft path / link |
|----------------|------------|--------------------------|-------------------|
| `yes / no` | `Task / Bug / User Story` | `fusion-issue-authoring` | |

## Final action gate

- [ ] Research summary is complete
- [ ] Lens assessments have evidence
- [ ] Recommendation and confidence are consistent with the evidence
- [ ] Follow-up work is explicit instead of implied
- [ ] Maintainer confirmation requested before any approve/merge action