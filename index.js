require('dotenv').config();

const requiredEnv = ['port', 'mongodbstring'];

for (let envVar of requiredEnv)
  if (!process.env[envVar])
    throw new Error(`${envVar} env varible must be declared in .env file`);

require('./utils/db');
require('./server');