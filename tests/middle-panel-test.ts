import { fixture, Selector } from "testcafe";

fixture("Middle panel test").page("http://localhost:5173/");

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

test("Test timeline and dependency graph visualisation", async (t) => {
  /* Test schema adress submit */
  await schemaUpload(t);

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click(".dependency-graph-tab");
  await t.click(".relationship-tab");
  await t.click("#play-button").wait(2000);
  await t.click(".dependency-graph-tab");
  await t.click(".timeline-tab");
  await t
    .click("#endpoints")
    .click("#option-2--menu--23")
    .typeText("#params-input-0", `Sequence upload`)
    .click("#submit-endpoint")
    .click("#edit-3")
    .typeText("#params-input-0", `Item number 2`, { replace: true })
    .click("#submit-endpoint")
    .click("#delete-4")
    .click("#delete-4")
    .click("#delete-4");
  await t.click("#play-button");
  await t.click(".dependency-graph-tab").wait(2000);
  await t.click(".timeline-tab");
}).skipJsErrors();
