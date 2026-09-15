const test = require("node:test");
const assert = require("node:assert/strict");

require("./script.js");

const { getActiveSectionId, isHeaderScrolled, shouldShowScrollTop } =
  globalThis.PortfolioUI;

test("header shadow starts only after the header threshold", () => {
  assert.equal(isHeaderScrolled(24), false);
  assert.equal(isHeaderScrolled(25), true);
});

test("scroll-to-top control is hidden at its threshold", () => {
  assert.equal(shouldShowScrollTop(480), false);
  assert.equal(shouldShowScrollTop(481), true);
});

test("active navigation follows the last section above the header offset", () => {
  const sections = [
    { id: "home", offsetTop: 0 },
    { id: "about", offsetTop: 700 },
    { id: "projects", offsetTop: 1400 },
    { id: "contact", offsetTop: 2100 },
  ];

  assert.equal(
    getActiveSectionId({
      scrollY: 1361,
      viewportHeight: 800,
      documentHeight: 3200,
      headerHeight: 60,
      sections,
    }),
    "projects"
  );
});

test("contact navigation is active near the document bottom", () => {
  assert.equal(
    getActiveSectionId({
      scrollY: 2360,
      viewportHeight: 800,
      documentHeight: 3200,
      sections: [],
    }),
    "contact"
  );
});
