declare namespace NodeJS {
  interface ProcessEnv {
    jwtSecret: string;
    jwtRefreshSecret: string;
    PGUSER: string;
    PGPASSWORD: string;
    PGHOST: string;
    PGPROXYPORT: number;
    PGDATABASE: string;
    NODE_ENV?: "development" | "production";
  }
}
