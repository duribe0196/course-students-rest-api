require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const morgan = require('morgan');
const { port } = process.env;

app.use(morgan('dev'));
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

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
