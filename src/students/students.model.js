const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const studentSchema = new Schema(
  {
    code: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    age: { type: String, trim: true },
    email: { type: String, trim: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'courses' }]
  },
  { timestamps: true }
);

const studentModel = mongoose.model('students', studentSchema);

module.exports = studentModel;
