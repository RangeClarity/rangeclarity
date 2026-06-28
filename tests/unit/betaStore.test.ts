import { describe, it, expect } from "vitest";
import { normalizeEmail, normalizeTvUsername } from "../../lib/betaStore";

describe("normalizeEmail (pure)", () => {
  it("trims + lowercases valid emails", () => {
    expect(normalizeEmail("  Founder@RangeClarity.com ")).toBe("founder@rangeclarity.com");
  });
  it("rejects non-strings and malformed input", () => {
    expect(normalizeEmail(123 as unknown)).toBeNull();
    expect(normalizeEmail("not-an-email")).toBeNull();
    expect(normalizeEmail("")).toBeNull();
  });
});

describe("normalizeTvUsername (pure)", () => {
  it("trims + strips a leading @", () => {
    expect(normalizeTvUsername("  @range_reader ")).toBe("range_reader");
  });
  it("rejects too-short / non-string usernames", () => {
    expect(normalizeTvUsername("a")).toBeNull();
    expect(normalizeTvUsername(null as unknown)).toBeNull();
  });
});
