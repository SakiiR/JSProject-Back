const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const config = {
  API_PORT: process.env.API_PORT || 1337,
  WS_PORT: process.env.WS_PORT || 4242,
  MONGO_URL: `mongodb://${MONGO_HOST}:${MONGO_PORT}/livechat`,
  secret: "SuP3rS3cR3T!!@@"
};

export default config;
