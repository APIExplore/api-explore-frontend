import { fixture, Selector } from "testcafe";
import axios from "axios";
import { backendDomain } from "../src/constants/apiConstants";

let schemaName;
let sequenceName;
fixture("Left panel test")
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
    Selector("button").withAttribute("title", "Toggle Row Expanded").nth(0),
  );
  await t.click(
    Selector("button").withAttribute("title", "Toggle Row Expanded").nth(1),
  );

  await t.click(".metrics-tab");
  if (!(await Selector("#metrics").exists)) {
    throw Error("Metrics tab is missing values");
  }

  await t.click(".details-tab");
}).skipJsErrors();
