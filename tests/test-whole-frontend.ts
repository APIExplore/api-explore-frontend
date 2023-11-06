import { fixture, Selector } from "testcafe";

fixture("Whole frontend test").page("http://localhost:5173/");

test("Test api schema adress submit", async (t) => {
  // Test schema adress submit
  await t
    //.typeText("#schema-adress-input", "http://localhost:8080/swagger.json")
    .click("#submit-adress-button");

  // Wait for schema submit
  await t.expect(Selector("#schema-fetched").innerText).eql("Schema fetched");
  await t.click(".config-tab");
  await t.click(".api-schema-tab");
});
