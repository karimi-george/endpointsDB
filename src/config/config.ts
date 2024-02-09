import mssql, { ConnectionPool, config } from "mssql";
import dotenv from "dotenv";
dotenv.config();

const NotesConfig: config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

// Uncomment the following block if you want to use ConnectionPool
// const poolPromise: Promise<ConnectionPool> = new mssql.ConnectionPool(NotesConfig)
//   .connect()
//   .then(pool => {
//     console.log('Connected to MSSQL');
//     return pool;
//   })
//   .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// Uncomment the following block if you want to use mssql.connect
// mssql.connect(NotesConfig).then((pool: ConnectionPool) => {
//   if (pool.connected) {
//     console.log("Connected to MSSQL");
//   }
// });

export {
  NotesConfig,
};
