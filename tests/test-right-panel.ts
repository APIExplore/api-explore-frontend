import { fixture, Selector } from "testcafe";

fixture("Test schema fetch and endpoint selection").page(
  "http://localhost:5173/"
);

test("Test api schema adress submit", async (t) => {
  // Test schema adress submit
  await t
    //.typeText("#schema-adress-input", "http://localhost:8080/swagger.json")
    .click("#submit-adress-button");

  // Wait for schema submit
  await t.expect(Selector("#schema-fetched").innerText).eql("Schema fetched");
  await t
    .click(".config-tab")
    .click("#downshift-2-input")
    .click("#methods-get")
    .click("#downshift-2-input")
    .click("#methods-get")
    .click("#methods-put")
    .click("#downshift-2-input")
    .click("#methods-put")
    .click("#downshift-2-input")
    .click("#downshift-3-item-0")
    .click("#downshift-3-item-1")
    .click("#downshift-3-item-6")
    .click("#downshift-3-item-1");
}).skipJsErrors();
