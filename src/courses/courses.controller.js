const moment = require('moment');
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
    const courses = await courseModel.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'courses',
          as: 'students'
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          schedule: 1,
          startDate: 1,
          endDate: 1,
          numberOfStudents: { $size: '$students' }
        }
      },
      {
        $sort: { numberOfStudents: -1 }
      }
    ]);
    res.json(courses);
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

const getCoursesWithMoreStudents = async (req, res) => {
  try {
    const now = moment().toDate();
    const sixMonthsAgo = moment()
      .subtract(6, 'months')
      .toDate();

    const courseWithMoreStudents = await courseModel.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'courses',
          as: 'students'
        }
      },
      {
        $match: {
          createdAt: {
            $gte: sixMonthsAgo,
            $lt: now
          }
        }
      },
      {
        $project: {
          name: 1,
          schedule: 1,
          _id: 0,
          'students.code': 1,
          'students.firstName': 1,
          'students.lastName': 1,
          containsStudents: { $gt: [{ $size: '$students' }, 0] },
          numberOfStudents: { $size: '$students' }
        }
      },
      {
        $match: {
          containsStudents: true
        }
      },
      {
        $sort: { numberOfStudents: -1 }
      },
      { $limit: 3 }
    ]);

    res.send(courseWithMoreStudents);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCoursesWithStudents = async (req, res) => {
  try {
    let coursesWithStudents = await courseModel.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'courses',
          as: 'students'
        }
      },
      {
        $project: {
          name: 1,
          _id: 0,
          schedule: 1,
          'students.code': 1,
          'students.firstName': 1,
          'students.lastName': 1,
          containsStudents: { $gt: [{ $size: '$students' }, 0] },
          numberOfStudents: { $size: '$students' }
        }
      },
      {
        $match: {
          containsStudents: true
        }
      }
    ]);
    res.send(coursesWithStudents);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCoursesWithoutStudents = async (req, res) => {
  try {
    const coursesWithoutStudents = await courseModel.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'courses',
          as: 'students'
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          schedule: 1,
          containsStudents: { $gt: [{ $size: '$students' }, 0] }
        }
      },
      {
        $match: {
          containsStudents: false
        }
      }
    ]);

    res.json(coursesWithoutStudents);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCoursesWithStudents,
  getCoursesWithoutStudents,
  getCoursesWithMoreStudents
};
