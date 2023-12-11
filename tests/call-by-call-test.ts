import { fixture, Selector } from "testcafe";

fixture("Test call by call").page("http://localhost:5173/");

test("Test call by call", async (t) => {
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

  await t.setFilesToUpload("#input-choose-seq", [
    "../assets/testSequence.json",
  ]);

  /* Activate call by call */
  await t.click(Selector("span").withAttribute("tabindex", "0"));

  /* Run call by call few times */
  await t.click("#play-button").wait(1000);
  await t.click("#play-button").wait(1000);
  await t.click("#play-button").wait(1000);
}).skipJsErrors();
