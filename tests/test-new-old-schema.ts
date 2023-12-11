import { fixture, Selector } from "testcafe";

fixture("Test sequence upload").page("http://localhost:5173/");

test("Test sequence upload", async (t) => {
  await t
    .click(".existing-schema-tab")
    .click(".new-schema-tab")
    .click(".existing-schema-tab");

  const schemaDropDownExists = await Selector("#dropdown-existing-schemas")
    .exists;
  if (schemaDropDownExists) {
    await t.click("#dropdown-existing-schemas");
    await t.click("#schema-0");
    /* Wait for existing schema load */
    await t.expect(Selector("#schema-fetched").exists).ok();
  }

  await t.click("#close-landing-page");

  if (schemaDropDownExists) {
    /* See if endpoints exist */
    await t
      .click("#endpoints")
      .click("#option-0--menu--16")
      .click("#cancel-params");
  }

  /* Create new schema*/
  await t.click("#choose-schema");

  /* Test schema adress submit */
  await t
    .typeText(
      "#schema-name-input",
      `Test new schema + ${Math.random() * (999 - 1 + 1) + 1}`
    )
    .click("#submit-adress-button");

  /* Wait for schema submit */
  await t.expect(Selector("#schema-fetched").innerText).eql("Schema fetched");

  /* Check if schema endpoints are fetched */
  await t
    .click("#endpoints")
    .click("#option-0--menu--16")
    .click("#cancel-params");
}).skipJsErrors();
