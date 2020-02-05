const { Router } = require('express');
const routes = new Router(Router);

const controller = require('./courses.controller');

routes.post('/createCourse', controller.createCourse);
routes.get('/getCourse', controller.getCourse);
routes.get(
  '/getCoursesWithMoreStudents',
  controller.getCoursesWithMoreStudents
);
routes.get('/getCoursesWithStudents', controller.getCoursesWithStudents);
routes.get('/getCoursesWithoutStudents', controller.getCoursesWithoutStudents);
routes.put('/updateCourse', controller.updateCourse);
routes.delete('/deleteCourse', controller.deleteCourse);

module.exports = app => {
  return app.use('/courses', routes);
};
