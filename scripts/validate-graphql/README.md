# validate-graphql

Validates GraphQL syntax for static skill fallback files.

## Scope

- `skills/**/assets/graphql/*.graphql`

## Usage

- `bun run validate:graphql`

## Notes

- This check validates GraphQL document syntax only.
- It does not validate schema compatibility against a live GraphQL endpoint.
