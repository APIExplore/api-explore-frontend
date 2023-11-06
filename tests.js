import createTestCafe from "testcafe";
const testcafe = await createTestCafe();

try {
  const runner = testcafe.createRunner();

  const failed = await runner
    .src(["./tests/test-whole-frontend.ts"])
    .browsers(["chrome"])
    .useProxy("localhost:5173")
    .run({ speed: 0.1 });

  console.log("Tests failed: " + failed);
} finally {
  await testcafe.close();
}
