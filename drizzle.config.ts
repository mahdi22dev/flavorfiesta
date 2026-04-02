import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/recipes_shema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  driver: "d1-http",
});
