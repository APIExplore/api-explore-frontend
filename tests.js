import createTestCafe from "testcafe";

const testcafe = await createTestCafe();

try {
  const runner = testcafe.createRunner();

  const failed = await runner
    .src(["./tests/test-all.ts"])
    .browsers(["chrome --start-fullscreen"])
    .useProxy("localhost:5173")
    .run({ speed: 0.7 });

  console.log("Tests failed: " + failed);
} finally {
  await testcafe.close();
}
