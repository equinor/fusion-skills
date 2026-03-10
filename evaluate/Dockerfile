# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS install

# Build-arg overrides used by the `docker buildx build` workflow (see README).
# The `docker run` workflow (eval-skill.sh) passes these as runtime env instead.
ARG PROMPT
ARG ALLOW_MCP_SERVER
ARG AUTOPILOT
ARG YOLO
ARG MODEL

ENV PROMPT=${PROMPT:-}
ENV ALLOW_MCP_SERVER=${ALLOW_MCP_SERVER:-}
ENV AUTOPILOT=${AUTOPILOT:-}
ENV YOLO=${YOLO:-}
ENV MODEL=${MODEL:-}
WORKDIR /workspace

# Install only the tools the Copilot CLI needs for repository inspection and
# non-interactive prompt execution during sanity checks.
RUN apt-get update \
    && apt-get install -y --no-install-recommends bash ca-certificates curl git ripgrep \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g bun @github/copilot skills

COPY evaluate/ .

RUN chmod +x entrypoint.sh

# Entrypoint runs the evaluation script with the prompt passed as an argument.
FROM install AS execute

ENTRYPOINT ["/workspace/entrypoint.sh"]

FROM execute AS export-files

# Generate export artifact names inside the container. Use --no-cache-filter
# export-files when you want a fresh nonce without invalidating earlier stages.
RUN nonce="$(date +%s)" \
    && mkdir -p /out \
    && cp /logs/result.log "/out/${nonce}.log" \
    && cp /logs/evaluate.log "/out/${nonce}.evaluate.log"

FROM scratch AS export

COPY --from=export-files /out/ /
