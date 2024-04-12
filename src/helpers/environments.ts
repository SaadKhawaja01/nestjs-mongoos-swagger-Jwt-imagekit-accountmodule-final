import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  MONGO_DB_URL: process.env.MONGO_DB_URL ?? '',
  APP_NAME: process.env.APP_NAME ?? '',
  APP_DESC_SWAGGER: process.env.APP_DESC_SWAGGER ?? '',
  MONGO_DB: process.env.MONGO_DB ?? '',
  APP_VERSION: process.env.APP_VERSION ?? '',
  BASE_SALT_NUMBER: process.env.BASE_SALT_NUMBER ?? '',
  JwtSecret: process.env.JwtSecret ?? '',
  JWT_EXPIRY: process.env.JWT_EXPIRY ?? '',
  IMAGE_KIT_PUB_KEY: process.env.IMAGE_KIT_PUB_KEY ?? '',
  IMAGE_KIT_PRV_KEY: process.env.IMAGE_KIT_PRV_KEY ?? '',
  IMAGE_KIT_URL_ENDPOINT: process.env.IMAGE_KIT_URL_ENDPOINT ?? '',
};

export default environments;
