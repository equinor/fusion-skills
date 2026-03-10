type ConfigValue = boolean | string;

const promptEnv = process.env.PROMPT;
const modelEnv = process.env.MODEL?.trim();
const allowMcpEnv = process.env.ALLOW_MCP_SERVER?.trim() || undefined;
const autopilotEnv = process.env.AUTOPILOT?.trim() || undefined;
const yoloEnv = process.env.YOLO?.trim() || undefined;

if (!promptEnv) {
  console.error("Error: Environment variable PROMPT is not set.");
  process.exit(1);
}

const model = modelEnv || "claude-haiku-4.5";
console.log(`Using model: ${model}`);
console.log("Parsing PROMPT environment variable...");

function parseBoolean(raw: string | undefined): boolean | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }

  const normalized = raw.trim().toLowerCase();
  if (["true", "yes", "on", "1"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "off", "0", ""].includes(normalized)) {
    return false;
  }

  return undefined;
}

function coerceConfigValue(raw: string): ConfigValue {
  const unquoted = raw.trim().replace(/^(["'])(.*)\1$/, "$2");
  const parsedBoolean = parseBoolean(unquoted);
  return parsedBoolean ?? unquoted;
}

function splitFrontMatter(markdown: string): { frontMatter: string; body: string } {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)([\s\S]*)$/);
  if (!match) {
    return { frontMatter: "", body: markdown.trim() };
  }

  return {
    frontMatter: match[1].trim(),
    body: match[2].trim(),
  };
}

function parseConfig(frontMatter: string): Record<string, ConfigValue> {
  return frontMatter
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim().toLowerCase().replace(/_/g, "-");
      const value = line.slice(separatorIndex + 1).trim();

      if (!key) {
        return acc;
      }

      return Object.assign(acc, {
        [key]: value ? coerceConfigValue(value) : true,
      });
    }, {} as Record<string, ConfigValue>);
}

function parseSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const headingRegex = /^##\s+(.+?)\s*$/gm;
  let currentHeading: string | undefined;
  let sectionStart = 0;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    if (currentHeading) {
      sections.set(currentHeading, markdown.slice(sectionStart, match.index).trim());
    }

    currentHeading = match[1].trim().toLowerCase();
    sectionStart = headingRegex.lastIndex;
  }

  if (currentHeading) {
    sections.set(currentHeading, markdown.slice(sectionStart).trim());
  }

  return sections;
}

function resolveBoolean(
  envValue: string | undefined,
  configValue: ConfigValue | undefined,
  fallback: boolean,
): boolean {
  const envBoolean = parseBoolean(envValue);
  if (envBoolean !== undefined) {
    return envBoolean;
  }

  if (typeof configValue === "boolean") {
    return configValue;
  }

  if (typeof configValue === "string") {
    const configBoolean = parseBoolean(configValue);
    if (configBoolean !== undefined) {
      return configBoolean;
    }
  }

  return fallback;
}

function parseYamlArray(frontMatter: string, key: string): string[] {
  const lines = frontMatter.split(/\r?\n/);
  const results: string[] = [];
  let inArray = false;

  for (const line of lines) {
    if (line.match(new RegExp(`^${key}\\s*:`))) {
      inArray = true;
      continue;
    }

    if (inArray) {
      const match = line.match(/^\s*-\s+(.+)$/);
      if (match) {
        results.push(match[1].trim());
      } else if (line.trim() && !line.startsWith(" ")) {
        // End of array (non-indented line)
        break;
      }
    }
  }

  return results;
}

const { frontMatter, body } = splitFrontMatter(promptEnv);
const config = parseConfig(frontMatter);
const sections = parseSections(body);

const mainPrompt = sections.get("user") ?? sections.get("prompt");
if (!mainPrompt) {
  console.error("Error: Could not find a ## User or ## Prompt section in PROMPT.");
  console.error("Sections found:", Array.from(sections.keys()).join(", ") || "none");
  process.exit(1);
}

const evalContent = sections.get("eval");
if (!evalContent) {
  console.error("Error: Could not find a ## Eval section in PROMPT.");
  console.error("Sections found:", Array.from(sections.keys()).join(", ") || "none");
  process.exit(1);
}

const allowMcp = resolveBoolean(allowMcpEnv, config["allow-mcp"], true);
const autopilot = resolveBoolean(autopilotEnv, config.autopilot, true);
const yolo = resolveBoolean(yoloEnv, config.yolo, true);

const executionFlags = [
  `--model ${model}`,
  ...(allowMcp ? ["--additional-mcp-config", "@mcp-config.json"] : []),
  ...(autopilot ? ["--autopilot"] : []),
  ...(yolo ? ["--yolo"] : []),
];

console.log("Resolved execution flags:", executionFlags.join(" "));

const skillsList = parseYamlArray(frontMatter, "skills");
if (skillsList.length > 0) {
  console.log(`Found ${skillsList.length} skill(s) to install:`, skillsList.join(", "));
}

(async () => {
  await Bun.write("copilot-prompt.md", `${mainPrompt.trim()}\n`);
  await Bun.write("eval-prompt.md", `${evalContent.trim()}\n`);
  await Bun.write("execution-flags.txt", `${executionFlags.join("\n")}\n`);

  // Install required skills directly
  for (const skill of skillsList) {
    console.log(`Installing skill: ${skill}`);
    const proc = Bun.spawn(["skills", "add", "./skills", "-y", "--skill", skill, "--agent", "github-copilot"], {
      stdio: ["ignore", "inherit", "inherit"],
    });
    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      console.error(`Failed to install skill ${skill}`);
      process.exit(1);
    }
  }
})();
