# Changelog

All notable changes to this repository are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [Unreleased]

### Added
- Added `fusion-skill-authoring` as the repository skill-authoring helper.
- Added guidance for default skill naming with the `fusion-` prefix in this repository.
- Added semantic version guidance for skills using frontmatter `metadata.version`.
- Added default `license: MIT` guidance for newly scaffolded skills.
- Added repository versioning guidance for tag-based installs and upgrade safety.

### Changed
- Renamed `skill-authoring` to `fusion-skill-authoring`.
- Updated scaffolding and contribution documentation to require explicit prefix handling.
- Updated skill templates/checklists to include `metadata.version` and frontmatter validation constraints.

### Validation
- Skills validation command: `npx -y skills add . --list`.
