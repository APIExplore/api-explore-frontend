import { fixture, Selector } from "testcafe";

fixture("Test schema fetch and endpoint selection").page(
  "http://localhost:5173/"
);

test("Test api schema adress submit and endpoints", async (t) => {
  /* Test schema adress submit */
  await t
    .typeText(
      "#schema-name-input",
      `Test schema + ${Math.random() * (999 - 1 + 1) + 1}`
    )
    .setFilesToUpload("#input-file-upload", ["../assets/testSchema.json"]);

  /* Wait for schema submit */
  await t.expect(Selector("#file-uploaded").innerText).eql("File Uploaded");

  /* Test endpoitns and their selection */
  await t
    // Show endpoints filtering
    .click("#endpoints")
    .click("#methods-get")
    .click("#endpoints")
    .click("#methods-get")
    .click("#methods-put")
    .click("#endpoints")
    .click("#methods-put")
    // Open endpoints and select some
    .click("#endpoints")
    // Select endpoint under index 1 and write under its params something (POST)
    .click("#option-1--menu--9")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    // Select endpoint under index 0 and write under its params something (GET)
    .click("#option-0--menu--9")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    // Select endpoint under index 2 and write under its params something (DELETE)
    .click("#option-2--menu--9")
    .typeText("#params-input-0", `Item`)
    .click("#submit-endpoint")
    .click("#endpoints")
    // Select random endpoint and show how to delete it
    .click("#option-3--menu--9")
    .click("#submit-endpoint")
    .click("#delete-3")
    // Select random endpoint and show how to edit it if you forget to add params
    .click("#endpoints")
    .click("#option-1--menu--9")
    .click("#submit-endpoint")
    .click("#edit-3")
    .typeText("#params-input-0", `Item number 2`)
    .click("#submit-endpoint");

  await t.click("#play-button");
}).skipJsErrors();
