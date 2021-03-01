declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      CORS_ORIGIN: string;
      PD_DATABASE_URL: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
