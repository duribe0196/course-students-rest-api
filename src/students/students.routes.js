const { Router } = require('express');
const routes = new Router(Router);

const controller = require('./students.controller');

routes.post('/createStudent', controller.createStudent);
routes.get('/getStudent', controller.getStudent);
routes.get('/getStudentsByCourse', controller.getStudentsByCourse);
routes.get(
  '/getStudentsWithouthCourses',
  controller.getStudentsWithouthCourses
);
routes.get('/getStudentsWithCourses', controller.getStudentsWithCourses);
routes.put('/updateStudent', controller.updateStudent);
routes.put('/assignStudentToCourse', controller.assignStudentToCourse);
routes.delete('/deleteStudent', controller.deleteStudent);

module.exports = app => {
  return app.use('/students', routes);
};
