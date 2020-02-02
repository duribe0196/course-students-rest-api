require('dotenv').config();
const mongoose = require('mongoose');
const { mongodbstring } = process.env;

(async () => {
  try {
    await mongoose.connect(mongodbstring, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log('Connected to DB');
  } catch (error) {
    console.log('Error connecting to DB', error);
  }
})();