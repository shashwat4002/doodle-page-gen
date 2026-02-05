const getEnv = (key, fallback) => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    return fallback;
  }
  return value;
};

export const env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number.parseInt(getEnv("API_PORT", "4000"), 10),
  JWT_SECRET: getEnv(
    "JWT_SECRET",
    // NOTE: for local development only – override in production
    "sochx-dev-insecure-secret-change-me",
  ),
  CORS_ORIGIN: getEnv("CORS_ORIGIN", "http://localhost:5173"),
  DATABASE_URL: getEnv("DATABASE_URL", ""),
  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:5173"),
  SMTP_HOST: getEnv("SMTP_HOST", ""),
  SMTP_PORT: Number.parseInt(getEnv("SMTP_PORT", "587"), 10),
  SMTP_USER: getEnv("SMTP_USER", ""),
  SMTP_PASS: getEnv("SMTP_PASS", ""),
  EMAIL_FROM: getEnv("EMAIL_FROM", "no-reply@sochx.local"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
};

