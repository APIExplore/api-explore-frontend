import { fixture, Selector } from "testcafe";
import axios from "axios";
import { backendDomain } from "../src/constants/apiConstants";

let schemaName;
let sequenceName;
let seqName2;
let seqName3;
fixture("Right panel test")
  .page("http://localhost:5173/")
  .afterEach(async () => {
    if (schemaName) {
      await axios.delete(`${backendDomain}/apischema/delete/${schemaName}`);
    }
  });

async function schemaUpload(t) {
  await t.click(".new-schema-tab");

  const sequenceName = String(Math.random() * (999 - 1 + 1) + 1);
  schemaName = `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`;

  /* Test schema adress submit */
  await t
    .typeText("#schema-name-input", schemaName)
    .setFilesToUpload("#input-file-upload", ["../assets/testSchema.json"]);

  /* Wait for schema submit */
  await t.expect(Selector("#file-uploaded").innerText).eql("File Uploaded");

  /* Create name and upload sequence */
  await t.typeText("#sequence-name-input", `1 Test sequence + ${sequenceName}`);

  return [`1 Test sequence + ${sequenceName}`, schemaName];
}

test("Test Sequences tab", async (t) => {
  /* Test schema adress submit */
  const response = await schemaUpload(t);
  sequenceName = response[0];

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click("#play-button");

  seqName2 = `Test sequence + ${Math.random() * (999 - 1 + 1) + 1}`;
  seqName3 = `Test sequence + ${Math.random() * (999 - 1 + 1) + 1}`;

  /* Create name and upload sequence */
  await t.typeText("#sequence-name-input", seqName2, { replace: true });

  await t.click("#play-button");

  /* Create name and upload second sequence */
  await t.typeText("#sequence-name-input", seqName3, { replace: true });

  await t.click("#play-button");

  await t.click(".sequences-tab");

  /* Sequences sorting test */
  await t.click("#desc");
  await t.click("#asc");

  /* Put first sequence as favourite */
  await t.click(".favourite-button");
  await t.click(".toggle-favorite").click(".toggle-favorite");

  /* Expand first sequence */
  await t.click("#expand-sequence");

  /* Edit schema*/
  await t.click("#edit-sequence");

  if ((await Selector("#sequence-name-input").value) !== response[0]) {
    throw Error("editing wrong sequence");
  }

  await t.click("#delete-3");
  await t.click("#play-button").wait(2000);

  await t.click(".sequences-tab");

  const numOfElements = await Selector("dl > div").count;

  if (numOfElements !== 8) {
    throw Error("Sequence editing gone wrong");
  }

  /* See sequence details */
  await t.click("#view-details").wait(1000).click("#close-details-modal");

  await t.click("#export-to-json");

  await t.click("#delete-sequence");

  await t
    .expect(Selector(".sequence-removed").innerText)
    .eql(`You have removed the sequence ${response[0]}`);
}).skipJsErrors();

test("Test Configuration call by call", async (t) => {
  /* Test schema adress submit */
  const response = await schemaUpload(t);
  sequenceName = response[0];

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
  await t.click("#delete-5");

  const table = await Selector("table").withAttribute("role", "table");
  const rows = table.find("tbody > tr");
  const count = await rows.count;
  const callByCallNumber = await Selector("#play-button").find("div").innerText;

  if (count !== 8 || callByCallNumber !== "5/8") {
    throw Error(`failed to remove call while in call by call`);
  }
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
  await t.click("#play-button");
}).skipJsErrors();

test("Test Configuration tab endpoints and selection", async (t) => {
  const response = await schemaUpload(t);
  sequenceName = response[0];

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
    .click("#option-2--menu--27")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    /* Select endpoint under index 1 and write under its params something (POST) */
    .click("#option-1--menu--27")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    /* Select endpoint under index 0 and write under its params something (GET) */
    .click("#option-0--menu--27")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    /* Select random endpoint and show how to delete it */
    .click("#option-3--menu--27")
    .click("#submit-endpoint")
    .click("#delete-3")
    /* Select random endpoint and show how to edit it if you forget to add params */
    .click("#endpoints")
    .click("#option-1--menu--27")
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
  const response = await schemaUpload(t);
  sequenceName = response[0];

  /* Import sequence */
  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  await t.click("#play-button").click("#delete-1");
  await t
    .click("#endpoints")
    .click("#option-2--menu--27")
    .typeText("#params-input-0", `Sequence upload`)
    .click("#submit-endpoint")
    .click("#edit-3")
    .typeText("#params-input-0", `Item number 2`, { replace: true })
    .click("#submit-endpoint");
  await t.click("#play-button").wait(2000);
}).skipJsErrors();
