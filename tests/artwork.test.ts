import { describe, expect, it } from "vitest";
import { filterArtwork, moveItem, splitDescriptionIntoParagraphs, usedCategories } from "@/lib/artwork";
import { sampleArtwork } from "@/data/sampleArtwork";

describe("filterArtwork", () => {
  it("returns everything for All", () => {
    expect(filterArtwork(sampleArtwork, "All")).toHaveLength(sampleArtwork.length);
  });
  it("filters by category and can be empty", () => {
    expect(filterArtwork(sampleArtwork, "Writing").every((a) => a.category === "Writing")).toBe(true);
    expect(filterArtwork([], "Paintings")).toEqual([]);
  });
  it("lists only used categories", () => {
    expect(usedCategories(sampleArtwork)).toContain("Writing");
  });
});

describe("moveItem", () => {
  it("moves without mutating", () => {
    const list = ["a", "b", "c"];
    expect(moveItem(list, 0, 1)).toEqual(["b", "a", "c"]);
    expect(list).toEqual(["a", "b", "c"]);
  });

  describe("splitDescriptionIntoParagraphs", () => {
    it("preserves line breaks within paragraphs and separates blank-line paragraphs", () => {
      expect(splitDescriptionIntoParagraphs("\n  First line\n  Second line\n\n  Final paragraph.  ")).toEqual([
        "First line\n  Second line",
        "Final paragraph.",
      ]);
    });
    it("returns no paragraphs for an empty description", () => {
      expect(splitDescriptionIntoParagraphs("  \n  ")).toEqual([]);
    });
  });
  it("ignores out-of-range moves", () => {
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 1, 2)).toEqual(["a", "b"]);
  });
});
