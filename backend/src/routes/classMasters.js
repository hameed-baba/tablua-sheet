const express = require('express');
const { authenticate, checkSchoolAccess } = require('../middleware/auth');
const { validate, validateQuery, schemas } = require('../middleware/validation');
const { classMasterController } = require('../controllers');

const router = express.Router();

router.get('/', 
  authenticate,
  checkSchoolAccess,
  validateQuery(schemas.pagination),
  classMasterController.getAll
);

router.get('/:id', authenticate, checkSchoolAccess, classMasterController.getById);

router.post('/', 
  authenticate, 
  checkSchoolAccess, 
  validate(schemas.classMasterCreation),
  classMasterController.create
);

router.put('/:id', authenticate, checkSchoolAccess, classMasterController.update);

router.delete('/:id', authenticate, checkSchoolAccess, classMasterController.delete);

module.exports = router;