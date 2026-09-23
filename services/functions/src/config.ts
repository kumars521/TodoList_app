import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  azureFunctionsEnvironment: process.env.AZURE_FUNCTIONS_ENVIRONMENT ?? 'Development',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://todonew:todonew@localhost:5432/todonew',
  storageConnectionString: process.env.STORAGE_CONNECTION_STRING ?? 'UseDevelopmentStorage=true',
};

export function isDevelopmentMode(): boolean {
  return env.azureFunctionsEnvironment === 'Development';
}
