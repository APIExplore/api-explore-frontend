import { fixture, Selector } from "testcafe";
import axios from "axios";
import { backendDomain } from "../src/constants/apiConstants";

let schemaName;

fixture("Test sequence upload")
  .page("http://localhost:5173/")
  .afterEach(async () => {
    if (schemaName) {
      await axios.delete(`${backendDomain}/apischema/delete/${schemaName}`);
    }
  });

test("Test sequence upload", async (t) => {
  await t.click(".new-schema-tab");

  await t
    .click(".existing-schema-tab")
    .click(".new-schema-tab")
    .click(".existing-schema-tab");

  let schemaDropdownElementExists;
  const schemaDropDownExists = await Selector("#dropdown-existing-schemas")
    .exists;

  if (schemaDropDownExists) {
    await t.click("#dropdown-existing-schemas");
    schemaDropdownElementExists = await Selector("#schema-1").exists;

    const secondSchemaExists = await Selector("#schema-2").exists;
    if (secondSchemaExists) {
      const schemaName = await Selector("#schema-2").innerText;

      await t.click("#remove-schema-2");

      await t
        .expect(Selector(".schema-removed").innerText)
        .eql(`You have removed the schema ${schemaName}`);
    }

    // find-schema
    // await t.typeText("#find-schema", `dise`);
    if (schemaDropdownElementExists) {
      await t.click("#schema-1");
      /* Wait for existing schema load */
      await t.expect(Selector("#schema-fetched").exists).ok();
      await t.click("#close-landing-page");
    }
  }

  if (schemaDropdownElementExists) {
    /* See if endpoints exist */
    await t
      .click("#endpoints")
      .click("#option-0--menu--27")
      .click("#cancel-params");
    /* Create new schema*/
    await t.click("#choose-schema");
  } else {
    await t.click(".new-schema-tab");
  }

  schemaName = `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`;

  /* Test schema adress submit */
  await t
    .typeText("#schema-name-input", schemaName)
    .click("#submit-adress-button");

  /* Wait for schema submit */
  await t.expect(Selector("#schema-fetched").innerText).eql("Schema fetched");

  /* Check if schema endpoints are fetched */
  await t
    .click("#endpoints")
    .click("#option-0--menu--27")
    .click("#cancel-params");
}).skipJsErrors();
