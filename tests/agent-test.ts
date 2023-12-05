import { fixture, Selector } from "testcafe";

fixture("Test agent").page("http://localhost:5173/");

test("Test agent", async (t) => {
  /* Test schema adress submit */
  await t
    .typeText(
      "#schema-name-input",
      `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`
    )
    .setFilesToUpload("#input-file-upload", ["../assets/testSchema.json"]);

  /* Wait for schema submit */
  await t.expect(Selector("#file-uploaded").innerText).eql("File Uploaded");

  /* Restart agent */
  await t.click("#restart-button").wait(5000);
}).skipJsErrors();
