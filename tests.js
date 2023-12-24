import createTestCafe from "testcafe";

const testcafe = await createTestCafe();

try {
  const runner = testcafe.createRunner();

  const failed = await runner
    .src([
      "./tests/bottom-panel-test.ts",
      "./tests/left-panel-test.ts",
      "./tests/middle-panel-test.ts",
      "./tests/right-panel-test.ts",
      "./tests/test-new-old-schema.ts",
      "./tests/agent-test.ts",
      "./tests/test-all.ts",
    ])
    .browsers(["chrome --start-fullscreen"])
    .useProxy("localhost:5173")
    .run({ speed: 1 });

  console.log("Tests failed: " + failed);
} finally {
  await testcafe.close();
}
