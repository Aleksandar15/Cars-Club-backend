import { Pool } from "pg";
// import "dotenv/config";
// ^ this is used for console.logging it,
// as without this: it's synchronously 'undefined' per TSC compiler,
// but in setTimeout:
// it shows the correct value, also, everything works app-wise,
// & so, such an import is not necessary (disregard the .log).

// console.log("process.env.PGUSER database.ts:", process.env.PGUSER);//undefined
// setTimeout(() => {
//   console.log(".PGUSER database.ts inside setTimeout:", process.env.PGUSER);
// }, 0); // logs correct value

// UPDATES FOR Render.com deployment
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  // Connection string for deployed environment
  pool = new Pool({
    connectionString: process.env.CONNECTION_STRING_POSTGRESQL,
  });
} else {
  // Connection placeholders for local development environment
  pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPROXYPORT,
    database: process.env.PGDATABASE,
  });
}

// console.log("pool", pool);

export default pool;
