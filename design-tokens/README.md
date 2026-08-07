# Tinyrack design tokens

Tinyrack authors tokens as DTCG 2025.10 files. `tinyrack.resolver.json` combines
the common set with one platform (`web` or `flutter`) and both theme contexts.
The generated TypeScript, CSS, Tailwind bridge, documentation catalog, and Dart
files must be updated with `pnpm tokens:generate`.

Use only DTCG types supported by the pinned schemas in `schema/`. References
must stay inside this directory and must not be circular. Values needed by one
platform belong under `platform/`; values shared by both belong in
`common.tokens.json`.

Run `pnpm tokens:check` to validate the schemas and generated outputs, and run
`pnpm tokens:audit` to reject Web runtime tokens without a product-code
consumer.
