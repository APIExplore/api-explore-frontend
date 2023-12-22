import { fixture, Selector } from "testcafe";

fixture("Bottom panel test").page("http://localhost:5173/");

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

test("Test bottom panel", async (t) => {
  /* Test schema adress submit */
  await schemaUpload(t);

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click(".log-tab");
  await t.click("#play-button");
  await t.click(".event-tab");
  await t
    .click("#endpoints")
    .click("#option-2--menu--19")
    .typeText("#params-input-0", `Sequence upload`)
    .click("#submit-endpoint")
    .click("#edit-3")
    .typeText("#params-input-0", `Item number 2`, { replace: true })
    .click("#submit-endpoint")
    .click("#delete-4")
    .click("#delete-4")
    .click("#delete-4");
  await t.click("#play-button");
  await t
    .click(Selector("div").withAttribute("row-index", "1"))
    .click(Selector("div").withAttribute("row-index", "3"));
  await t.click(".log-tab").wait(1000);
}).skipJsErrors();
