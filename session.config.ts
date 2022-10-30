import * as expressMySqlSession from 'express-mysql-session';

const mySqlSessionConfig = {
  host: process.env.DB_HOST,
  post: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: false,
  schema: {
    tableName: 'guestsession',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data',
    },
  },
};

const sessionStore = expressMySqlSession(mySqlSessionConfig);

const HOUR_IN_MILISECONDS = 1000 * 60 * 60;
export const guestSessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: HOUR_IN_MILISECONDS,
  },
  store: sessionStore,
};
