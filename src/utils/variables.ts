const { env } = process;

// List all the environment variables you want to export
const ENV_KEYS = [
  "MONGO_URI",
  "PORT",
  "MAILTRAP_USER",
  "MAILTRAP_PASSWORD",
  "SERVER_AUTH_EMAIL",
  "PASSWORD_RESET_LINK",
  "SIGN_IN_URL",
] as const;

type EnvRecord = Record<(typeof ENV_KEYS)[number], string>;

// Dynamically construct an object from the environment variables
export const config: EnvRecord = Object.fromEntries(
  ENV_KEYS.map((key) => [key, env[key]])
) as EnvRecord;
