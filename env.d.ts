interface CloudflareEnv {
  DB_RECIPES: D1Database;
  WEB_SCRAPING_BLOG: R2Bucket;
}

declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  }
}
