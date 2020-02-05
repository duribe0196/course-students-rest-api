const studentModel = require('./students.model');
const courseModel = require('../courses/courses.model');

const createStudent = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName)
      return res.send(
        'You need to send the first name and the last name of student to create'
      );
    const newStudent = new studentModel(req.body);
    await newStudent.save();
    res.send(`${firstName} ${lastName} have been created like student`);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getStudent = async (req, res) => {
  try {
    let students = await studentModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courses',
          foreignField: '_id',
          as: 'courses'
        }
      },
      {
        $project: {
          code: 1,
          firstName: 1,
          lastName: 1,
          'courses.name': 1,
          'courses.schedule': 1,
          _id: 0
        }
      }
    ]);

    res.json(students);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code)
      return res.send('You need to send the code of student to update them');

    const updatedResponse = await studentModel.updateMany(req.query, {
      $set: req.body
    });
    if (updatedResponse.n < 1) return res.send('Any resgister was updated');
    res.send(`Student with code ${code} have been updated`);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code)
      return res.send('You need to send the code of student to delete them');

    removedResponse = await studentModel.remove(req.query);
    if (removedResponse.n < 1) return res.send('Any resgister was removed');
    res.send(`Student with code ${code} have been delete`);
  } catch (error) {
    res.status(500).json(error);
  }
};

const assignStudentToCourse = async (req, res) => {
  try {
    const { code } = req.query;
    const { name } = req.body;

    if (!code || !name)
      return res.send(
        'You need student code and course name to assing student to a course'
      );

    const course = await courseModel.findOne(req.body);
    const studentData = await studentModel.find({
      code: code,
      courses: course._id
    });
    if (studentData.length)
      return res.send(
        `The student with code ${code} already is in ${name} course`
      );

    updatedResponse = await studentModel.findOneAndUpdate(req.query, {
      $push: { courses: course._id }
    });

    if (updatedResponse.n < 1) return res.send('Any course asigned');
    res.send(`${code} was assigned to course ${name}`);
  } catch (error) {}
};

const getStudentsByCourse = async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.send(
      'You need the course name to get the student list in this course'
    );

  let studentsByCourse = await studentModel.aggregate([
    {
      $lookup: {
        from: 'courses',
        localField: 'courses',
        foreignField: '_id',
        as: 'courses'
      }
    },
    {
      $match: { 'courses.name': name }
    },
    {
      $project: { _id: 0, code: 1, firstName: 1, lastName: 1 }
    }
  ]);
  res.send(studentsByCourse);
  try {
  } catch (error) {
    res.status(500).json(error);
  }
};

const getStudentsWithouthCourses = async (req, res) => {
  try {
    let studentsWithouthCourse = await studentModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courses',
          foreignField: '_id',
          as: 'courses'
        }
      },
      {
        $project: {
          _id: 0,
          code: 1,
          firstName: 1,
          lastName: 1,
          containsCourses: { $gt: [{ $size: '$courses' }, 0] }
        }
      },
      {
        $match: {
          containsCourses: false
        }
      }
    ]);
    res.json(studentsWithouthCourse);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getStudentsWithCourses = async (req, res) => {
  try {
    let studentsWithCourses = await studentModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courses',
          foreignField: '_id',
          as: 'courses'
        }
      },
      {
        $project: {
          code: 1,
          firstName: 1,
          lastName: 1,
          'courses.name': 1,
          'courses.schedule': 1,
          _id: 0,
          containsCourses: { $gt: [{ $size: '$courses' }, 0] }
        }
      },
      {
        $match: {
          containsCourses: true
        }
      }
    ]);
    res.json(studentsWithCourses);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentsByCourse,
  assignStudentToCourse,
  getStudentsWithCourses,
  getStudentsWithouthCourses
};
