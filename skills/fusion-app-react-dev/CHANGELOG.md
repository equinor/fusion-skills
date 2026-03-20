# Changelog

## 0.1.1 - 2026-03-20

### patch

- [#101](https://github.com/equinor/fusion-skills/pull/101) [`2bc25ee`](https://github.com/equinor/fusion-skills/commit/2bc25eee94cd7bb80a8a9a0d1c844071fac0296f) - Expand `fusion-app-react-dev` with focused framework guidance for app settings, bookmarks, runtime config and assets, and analytics.


  - add dedicated references for the current settings, bookmark, runtime-config, and analytics surfaces
  - improve module guidance and review checklists for these workflows
  - broaden activation cues so the skill is easier to discover for common Fusion app tasks

  resolves equinor/fusion-core-tasks#746
  resolves equinor/fusion-core-tasks#747
  resolves equinor/fusion-core-tasks#751
  resolves equinor/fusion-core-tasks#754

- [#103](https://github.com/equinor/fusion-skills/pull/103) [`06b664d`](https://github.com/equinor/fusion-skills/commit/06b664d177a01a760738ae3d43f1670e665f81fe) - Teach `fusion-app-react-dev` to use the `fusion-research-framework` companion skill when implementation work depends on uncertain Fusion Framework APIs or examples.


  - add companion-skill metadata for `fusion-research-framework`
  - delegate framework API and package research before choosing app implementation patterns
  - align the framework helper agent with the shared source-backed research workflow

## 0.1.0 - 2026-03-18

### minor

- [#97](https://github.com/equinor/fusion-skills/pull/97) [`da1c011`](https://github.com/equinor/fusion-skills/commit/da1c011b803f79ba159313d54b531ab9dbcc6708) - Add fusion-app-react-dev skill to the catalog


  Guides feature development in Fusion Framework React apps — scaffolding
  components, hooks, services, and types that follow EDS conventions and
  Fusion Framework patterns. Includes helper agents for framework review,
  styling review, and code-quality review, plus reference docs and asset
  checklists.

  resolves equinor/fusion-core-tasks#799
