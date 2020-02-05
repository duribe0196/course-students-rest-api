require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { PORT, NODE_ENV } = process.env;

if (NODE_ENV === 'dev') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use(express.json());

const src = './src';
let modules = fs.readdirSync(src);
try {
  for (const module of modules) {
    let fileModulePath = path.resolve(src, module, `${module}.routes.js`);
    require(fileModulePath)(app);
    console.log(`Enabled module ${module}`);
  }
} catch (error) {
  console.log('Error loading the modules', error);
}

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
