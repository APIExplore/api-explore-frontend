import { fixture, Selector } from "testcafe";
import axios from "axios";
import { backendDomain } from "../src/constants/apiConstants";

let schemaName;
let sequenceName;
fixture("Middle panel test")
  .page("http://localhost:5173/")
  .afterEach(async () => {
    if (schemaName) {
      await axios.delete(`${backendDomain}/apischema/delete/${schemaName}`);
    }
  });

async function schemaUpload(t) {
  await t.click("#close-introduction-page");
  await t.click(".new-schema-tab");

  schemaName = `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`;
  sequenceName = `Test sequence + ${Math.random() * (999 - 1 + 1) + 1}`;

  /* Test schema adress submit */
  await t
    .typeText("#schema-name-input", schemaName)
    .setFilesToUpload("#input-file-upload", ["../assets/testSchema.json"]);

  /* Wait for schema submit */
  await t.expect(Selector("#file-uploaded").innerText).eql("File Uploaded");

  /* Create name and upload sequence */
  await t.typeText("#sequence-name-input", sequenceName);
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
    .click("#option-2--menu--27")
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
