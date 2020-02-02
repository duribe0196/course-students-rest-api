const path = require('path');
const fs = require('fs');
const courseModel = require('./courses.model');

const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.send('You need to send the name of course to create');
    const newCourse = new courseModel(req.body);

    await newCourse.save();
    res.send(`${name} have been created`);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCourse = async (req, res) => {
  try {
    const coursesFinded = await courseModel.find(req.query);
    res.json(coursesFinded);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.send('You need to send the name of course to update');

    const updatedResponse = await courseModel.updateMany(req.query, {
      $set: req.body
    });
    if (updatedResponse.n < 1) return res.send('Any resgister was updated');
    res.send(`${name} have been updated`);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.send('You need to send the name of course to delete');

    removedResponse = await courseModel.remove(req.query);
    if (removedResponse.n < 1) return res.send('Any resgister was removed');
    res.send(`${name} have been delete`);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
};
