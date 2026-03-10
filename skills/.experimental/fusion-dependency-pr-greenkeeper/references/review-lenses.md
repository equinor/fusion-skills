# Review lenses reference

Detailed guidance for each review lens used in dependency PR analysis.

## Security lens

Evaluate the dependency update for security implications.

**Check for:**

1. **CVE resolution**: Does the update fix known vulnerabilities? Cross-reference with GitHub Security Advisories, the package ecosystem advisory database (for example npm audit, pip-audit), and the upstream changelog.
2. **New dependencies**: Does the update introduce new transitive dependencies? Each new dependency is additional attack surface.
3. **Advisories against target version**: Are there active advisories for the version being upgraded to? Check the ecosystem advisory database and the upstream issue tracker.
4. **Supply chain signals**: Has the package changed ownership recently? Are there anomalous publish patterns?

**Assessment scale:**

- `clear`: No security concerns identified. The update resolves existing issues or is neutral.
- `concern`: Minor security considerations exist but are manageable (for example new transitive dependency from a trusted publisher).
- `blocking`: Active CVE in the target version, untrusted/new publisher, or the update removes a security-relevant feature without replacement.

## Code quality lens

Evaluate the upstream quality and stability of the update.

**Check for:**

1. **Upstream CI**: Does the target version pass its own CI? Look for green badges, release notes mentioning test results, or CI status on the release tag.
2. **API changes**: Are there new/changed/removed APIs that the consuming codebase uses? Check the changelog for `BREAKING`, `DEPRECATED`, or `REMOVED` markers.
3. **Stability signals**: Is this a maintenance release (bug fixes, small refactors) or a large rewrite? Maintenance releases are lower risk.
4. **Community feedback**: Are there open issues flagging regressions in the target version? Check the first few days/weeks of issue reports after the release.

**Assessment scale:**

- `clear`: Well-tested release, no API changes affecting this codebase, stable maintenance character.
- `concern`: API changes exist but are manageable, or the release is very recent with limited community feedback.
- `blocking`: Known regressions reported, failing upstream CI, or large API surface changes requiring significant adaptation.

## Impact lens

Evaluate the practical impact of merging the update into this repository.

**Check for:**

1. **Blast radius**: Does the PR change only lockfiles, or does it require code changes? Lockfile-only updates are lower risk.
2. **CI status**: Does the CI pipeline pass with the update applied? A red CI is a strong hold signal.
3. **Downstream consumers**: Are there other packages or deployments that depend on this repository and would be affected by the version change?
4. **Follow-up work**: Does the update require post-merge actions? (configuration changes, migration scripts, documentation updates, monitoring adjustments)

**Assessment scale:**

- `clear`: Lockfile-only change, CI passes, no downstream impact, no follow-up needed.
- `concern`: Minor code changes needed, or follow-up work identified but manageable.
- `blocking`: CI fails, significant code adaptation required, or downstream breaking impact without a mitigation plan.

## Combining lens assessments

The final verdict considers all three lenses together:

| Scenario | Typical verdict |
| --- | --- |
| All lenses `clear` | `merge` with high confidence |
| One or more `concern`, no `blocking` | `merge with follow-up` or `merge` depending on concern severity |
| Any lens `blocking` | `hold` or `decline` until blocker is resolved |
| Mixed signals with low research confidence | `hold` with specific follow-up questions |
