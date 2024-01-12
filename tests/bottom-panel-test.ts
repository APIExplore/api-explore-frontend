import { fixture, Selector } from "testcafe";
import axios from "axios";
import { backendDomain } from "../src/constants/apiConstants";

let schemaName;
let sequenceName;

fixture("Bottom panel test")
  .page("http://localhost:5173/")
  .afterEach(async () => {
    if (schemaName) {
      await axios.delete(
        `${backendDomain}/callsequence/delete/${sequenceName}`,
      );
      await axios.delete(`${backendDomain}/apischema/delete/${schemaName}`);
    }
  });

async function schemaUpload(t) {
  /* Start api over agent */
  await t.click("#close-introduction-page");
  await t.click("#dropdown-available-apis");
  await t.click("#schema-0").wait(9000);

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
  await t
    .click(Selector("div").withAttribute("row-index", "1"))
    .click(Selector("div").withAttribute("row-index", "3"));
  await t.click(".log-tab").wait(1000);
}).skipJsErrors();
