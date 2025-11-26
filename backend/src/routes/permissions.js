const express = require('express');
const { authenticate, checkSystemAccess } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { permissionController } = require('../controllers');

const router = express.Router();

router.get('/', authenticate, permissionController.getAllPermissions);

router.post('/', 
  authenticate, 
  checkSystemAccess, 
  validate(schemas.permissionCreation),
  permissionController.create
);

router.put('/:id', authenticate, checkSystemAccess, permissionController.update);

router.delete('/:id', authenticate, checkSystemAccess, permissionController.delete);

module.exports = router;