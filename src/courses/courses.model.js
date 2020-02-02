const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const courseSchema = new Schema(
  {
    name: { type: String, trim: true, required: true, unique: true },
    schedule: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    studentsNumber: { type: Number }
  },
  { timestamps: true }
);

const courseModel = mongoose.model('courses', courseSchema);

module.exports = courseModel;
