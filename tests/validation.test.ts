import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";
import { artworkInputSchema, validateImageFile } from "@/lib/validation/artwork";

describe("contactSchema", () => {
  const ok = { name: "Sam", email: "sam@example.com", message: "Hello there, nice site!" };
  it("accepts a valid message", () => expect(contactSchema.safeParse(ok).success).toBe(true));
  it("rejects a bad email", () => expect(contactSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false));
  it("rejects short messages", () => expect(contactSchema.safeParse({ ...ok, message: "hi" }).success).toBe(false));
  it("rejects a filled honeypot", () => expect(contactSchema.safeParse({ ...ok, website: "spam" }).success).toBe(false));
});

describe("artwork validation", () => {
  it("requires a title and treats blank optionals as missing", () => {
    expect(artworkInputSchema.safeParse({ title: "", category: "Paintings", description: "" }).success).toBe(false);
    const r = artworkInputSchema.safeParse({ title: "Pond", category: "Paintings", medium: "", madeOn: "", description: "", note: "" });
    expect(r.success && r.data.medium).toBeFalsy();
  });
  it("rejects unknown categories", () => {
    expect(artworkInputSchema.safeParse({ title: "x", category: "Nope", description: "" }).success).toBe(false);
  });
  it("checks file type and size", () => {
    expect(validateImageFile({ name: "a.gif", type: "image/gif", size: 10 })).toMatch(/isn't/);
    expect(validateImageFile({ name: "a.png", type: "image/png", size: 30 * 1024 * 1024 })).toMatch(/larger/);
    expect(validateImageFile({ name: "a.png", type: "image/png", size: 1000 })).toBeNull();
  });
});
