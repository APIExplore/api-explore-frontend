import { fixture, Selector } from "testcafe";

fixture("Left panel test").page("http://localhost:5173/");

async function schemaUpload(t) {
  /* Test schema adress submit */
  await t
    .typeText(
      "#schema-name-input",
      `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`
    )
    .setFilesToUpload("#input-file-upload", ["../assets/testSchema.json"]);

  /* Wait for schema submit */
  await t.expect(Selector("#file-uploaded").innerText).eql("File Uploaded");

  /* Create name and upload sequence */
  await t.typeText(
    "#sequence-name-input",
    `Test sequence + ${Math.random() * (999 - 1 + 1) + 1}`
  );
}

test("Test details", async (t) => {
  /* Test schema adress submit */
  await schemaUpload(t);

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click("#play-button");

  await t
    .click(Selector("div").withAttribute("row-index", "1"))
    .click(Selector("div").withAttribute("row-index", "3"));

  /* Show those details for both endpoints */
  await t.click(
    Selector("button").withAttribute("title", "Toggle Row Expanded").nth(0)
  );
  await t.click(
    Selector("button").withAttribute("title", "Toggle Row Expanded").nth(1)
  );

  await t.click(".metrics-tab");
  await t.click(".details-tab");
}).skipJsErrors();
