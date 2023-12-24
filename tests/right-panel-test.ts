import { fixture, Selector } from "testcafe";

fixture("Right panel test").page("http://localhost:5173/");

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

test("Test Configuration tab endpoints and selection", async (t) => {
  await schemaUpload(t);

  /* Test endpoints and their selection */
  await t
    /* Show endpoints filtering */
    .click("#endpoints")
    .click("#methods-get")
    .click("#endpoints")
    .click("#methods-get")
    .click("#methods-put")
    .click("#endpoints")
    .click("#methods-put")
    /* Open endpoints and select some */
    .click("#endpoints")
    /* Select endpoint under index 2 and write under its params something (DELETE) */
    .click("#option-2--menu--23")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    /* Select endpoint under index 1 and write under its params something (POST) */
    .click("#option-1--menu--23")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    /* Select endpoint under index 0 and write under its params something (GET) */
    .click("#option-0--menu--23")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    /* Select random endpoint and show how to delete it */
    .click("#option-3--menu--23")
    .click("#submit-endpoint")
    .click("#delete-3")
    /* Select random endpoint and show how to edit it if you forget to add params */
    .click("#endpoints")
    .click("#option-1--menu--23")
    .click("#submit-endpoint")
    .click("#edit-3")
    .typeText("#params-input-0", `Item number 2`)
    .click("#submit-endpoint");

  /* Submit sequence */
  await t.click("#play-button");

  /* Reorder and submit again also show terminal */
  await t.click("#move-up-1").wait(1000).click("#move-up-2");
  await t.click(".log-tab");
  await t.click("#play-button");
}).skipJsErrors();

test("Test Configuration tab sequence upload", async (t) => {
  /* Test schema adress submit */
  await schemaUpload(t);

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click("#play-button").click("#delete-1");
  await t
    .click("#endpoints")
    .click("#option-2--menu--23")
    .typeText("#params-input-0", `Sequence upload`)
    .click("#submit-endpoint")
    .click("#edit-3")
    .typeText("#params-input-0", `Item number 2`, { replace: true })
    .click("#submit-endpoint");
  await t.click("#play-button").wait(2000);
}).skipJsErrors();

test("Test Configuration call by call", async (t) => {
  /* Test schema adress submit */
  await schemaUpload(t);

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  /* Activate call by call */
  await t.click(Selector("span").withAttribute("tabindex", "0"));

  /* Run call by call few times */
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#delete-0");

  const table = await Selector("table").withAttribute("role", "table");
  const rows = table.find("tbody > tr");
  const count = await rows.count;
  if (count < 9) {
    throw Error(
      `failed rows lower then expected amount which is 9 and current is ${count}`
    );
  }
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
}).skipJsErrors();

test("Test Sequences tab", async (t) => {
  /* Test schema adress submit */
  await schemaUpload(t);

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click("#play-button");

  /* Create name and upload sequence */
  await t.typeText(
    "#sequence-name-input",
    `Test sequence + ${Math.random() * (999 - 1 + 1) + 1}`,
    { replace: true }
  );

  await t.click("#play-button");

  await t.click(".sequences-tab");
  /* Put first sequence as favourite */
  await t.click(".favourite-button");
  await t
    .click(".toggle-favorite")
    .click(".toggle-favorite")
    /* Expand first sequence */
    .click("#expand-sequence");

  /* See sequence details */
  await t.click("#view-details").wait(1000).click("#close-details-modal");

  await t.click("#export-to-json");
}).skipJsErrors();
