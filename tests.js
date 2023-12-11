import createTestCafe from "testcafe";

const testcafe = await createTestCafe();

try {
  const runner = testcafe.createRunner();

  const failed = await runner
    .src([
      "./tests/test-new-old-schema.ts",
      "./tests/call-by-call-test.ts",
      "./tests/test-all.ts",
      "./tests/agent-test.ts",
    ])
    .browsers(["chrome --start-fullscreen"])
    .useProxy("localhost:5173")
    .run({ speed: 0.9 });

  console.log("Tests failed: " + failed);
} finally {
  await testcafe.close();
}
