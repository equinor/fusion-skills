import { describe, expect, it } from "bun:test";
import { sanitizeAnsi } from "../validate-skills/sanitize-ansi";

describe("sanitizeAnsi", () => {
  it("removes ANSI escape sequences and keeps plain text", () => {
    const input = "\u001b[32mOK\u001b[0m plain";
    expect(sanitizeAnsi(input)).toBe("OK plain");
  });

  it("stops gracefully on truncated escape sequence", () => {
    const input = "prefix\u001b[31";
    expect(sanitizeAnsi(input)).toBe("prefix");
  });

  it("handles long output without recursion", () => {
    const repeated = "\u001b[33mwarn\u001b[0m ".repeat(20000);
    const sanitized = sanitizeAnsi(repeated);
    expect(sanitized.startsWith("warn ")).toBe(true);
    expect(sanitized.includes("\u001b[")).toBe(false);
  });
});
