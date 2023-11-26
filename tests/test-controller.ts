import { fixture, Selector } from "testcafe";

fixture("Test sequence upload").page("http://localhost:5173/");

test("Test sequence upload", async (t) => {
  // Test schema adress submit
  await t.click("#play-button");
}).skipJsErrors();
