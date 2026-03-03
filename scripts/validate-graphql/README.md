# validate-graphql

Validates GraphQL syntax for static skill fallback files.

## Scope

- `skills/**/assets/**/*.graphql`
- `skills/**/assets/**/*.gql`

## Usage

- `bun run validate:graphql`
- `GITHUB_TOKEN=<token> bun run validate:graphql:codegen`

## Notes

- This check validates GraphQL document syntax only.
- It does not validate schema compatibility against a live GraphQL endpoint.
- The codegen check validates operations against GitHub GraphQL schema and writes generated output to `.tmp/graphql-codegen/`.
