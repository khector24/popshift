import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/tests/setup.js"],
    env: {
      DATABASE_URL: "postgresql://regionlore_user@localhost/regionlore_test",
    },
  },
});
