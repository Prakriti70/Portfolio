import { describe, expect, it } from "vitest";
import { filterArtwork, moveItem, usedCategories } from "@/lib/artwork";
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
  it("ignores out-of-range moves", () => {
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 1, 2)).toEqual(["a", "b"]);
  });
});
