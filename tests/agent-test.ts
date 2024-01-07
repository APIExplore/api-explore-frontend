import { fixture, Selector } from "testcafe";
import axios from "axios";
import { backendDomain } from "../src/constants/apiConstants";

let schemaName;
fixture("Test agent")
  .page("http://localhost:5173/")
  .afterEach(async () => {
    if (schemaName) {
      await axios.delete(`${backendDomain}/apischema/delete/${schemaName}`);
    }
  });
// C:/Program Files/Java/jre-1.8/bin/java.exe
test("Test agent", async (t) => {
  await t.click(".new-schema-tab");

  schemaName = `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`;

  /* Test schema adress submit */
  await t
    .typeText("#schema-name-input", schemaName)
    .setFilesToUpload("#input-file-upload", ["../assets/testSchema.json"]);

  /* Wait for schema submit */
  await t.expect(Selector("#file-uploaded").innerText).eql("File Uploaded");

  /* Restart agent */
  await t.click("#restart-button").wait(5000);

  /* Stop agent */
  await t.click("#agent-stop-button").wait(5000);
}).skipJsErrors();
