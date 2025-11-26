const express = require('express');
const { authenticate, checkSchoolAccess } = require('../middleware/auth');
const { validate, validateQuery, schemas } = require('../middleware/validation');
const { classSubjectAssignController } = require('../controllers');

const router = express.Router();

router.get('/', 
  authenticate, 
  checkSchoolAccess, 
  validateQuery(schemas.pagination), 
  classSubjectAssignController.getAll
);

router.get('/:id', authenticate, checkSchoolAccess, classSubjectAssignController.getById);

router.post('/', 
  authenticate, 
  checkSchoolAccess, 
  validate(schemas.classSubjectAssignCreation),
  classSubjectAssignController.create
);

router.put('/:id', authenticate, checkSchoolAccess, classSubjectAssignController.update);

router.delete('/:id', authenticate, checkSchoolAccess, classSubjectAssignController.delete);

module.exports = router;