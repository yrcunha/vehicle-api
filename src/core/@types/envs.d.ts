namespace NodeJS {
  interface ProcessEnv {
    TZ: "UTC";
    PORT: string;
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
  }
}
