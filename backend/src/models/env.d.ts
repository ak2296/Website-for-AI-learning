declare namespace NodeJS {
  interface ProcessEnv {
    DB_PORT: string;
    PORT: string;
    DATABASE_PATH: string;
    CONTACT_EMAIL: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    UPLOADS_DIR: string;
    REACT_APP_API_URL: string;
    MAX_FILE_SIZE: string;
    JWT_SECRET: string;
  }
}