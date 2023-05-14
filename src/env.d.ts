declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    PGUSER: string;
    PGPASSWORD: string;
    PGHOST: string;
    PGPROXYPORT: number;
    PGDATABASE: string;
    NODE_ENV?: "development" | "production";
    CONNECTION_STRING_POSTGRESQL: string;
  }
}
