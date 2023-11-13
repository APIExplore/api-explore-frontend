import { fixture, Selector } from "testcafe";

fixture("Test sequence upload").page("http://localhost:5173/");

test("Test sequence upload", async (t) => {
  // Test schema adress submit
  await t
    //.typeText("#schema-adress-input", "http://localhost:8080/swagger.json")
    .click("#play-button");
}).skipJsErrors();
