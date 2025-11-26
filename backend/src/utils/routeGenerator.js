const fs = require('fs');
const path = require('path');

const generateCRUDRoute = (modelName, tableName, fields, associations = []) => {
  const routeName = modelName.charAt(0).toLowerCase() + modelName.slice(1) + 's';
  
  return `const express = require('express');
const { Op } = require('sequelize');
const { ${modelName}${associations.length > 0 ? ', ' + associations.join(', ') : ''} } = require('../models');
const { authenticate, checkSchoolAccess } = require('../middleware/auth');
const { validateQuery, schemas } = require('../middleware/validation');

const router = express.Router();

// Get all ${routeName}
router.get('/', 
  authenticate,
  checkSchoolAccess,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      // Add school filter if model has schoolId
      ${fields.includes('schoolId') ? 'whereClause.schoolId = req.user.schoolId;' : ''}

      if (search) {
        whereClause[Op.or] = [
          ${fields.filter(f => f.includes('name')).map(f => `{ ${f}: { [Op.like]: \`%\${search}%\` } }`).join(',\n          ')}
        ];
      }

      const { count, rows } = await ${modelName}.findAndCountAll({
        where: whereClause,
        ${associations.length > 0 ? `include: [${associations.map(a => `{ model: ${a}, as: '${a}' }`).join(', ')}],` : ''}
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder]]
      });

      res.json({
        status: 'success',
        data: {
          ${routeName}: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get ${modelName.toLowerCase()} by ID
router.get('/:id', authenticate, checkSchoolAccess, async (req, res, next) => {
  try {
    const record = await ${modelName}.findByPk(req.params.id${associations.length > 0 ? `, {
      include: [${associations.map(a => `{ model: ${a}, as: '${a}' }`).join(', ')}]
    }` : ''});

    if (!record) {
      return res.status(404).json({
        status: 'error',
        message: '${modelName} not found'
      });
    }

    res.json({
      status: 'success',
      data: record
    });
  } catch (error) {
    next(error);
  }
});

// Create new ${modelName.toLowerCase()}
router.post('/', authenticate, checkSchoolAccess, async (req, res, next) => {
  try {
    const record = await ${modelName}.create(req.body);
    
    const newRecord = await ${modelName}.findByPk(record.id${associations.length > 0 ? `, {
      include: [${associations.map(a => `{ model: ${a}, as: '${a}' }`).join(', ')}]
    }` : ''});

    res.status(201).json({
      status: 'success',
      message: '${modelName} created successfully',
      data: newRecord
    });
  } catch (error) {
    next(error);
  }
});

// Update ${modelName.toLowerCase()}
router.put('/:id', authenticate, checkSchoolAccess, async (req, res, next) => {
  try {
    const record = await ${modelName}.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        message: '${modelName} not found'
      });
    }

    await record.update(req.body);

    const updatedRecord = await ${modelName}.findByPk(record.id${associations.length > 0 ? `, {
      include: [${associations.map(a => `{ model: ${a}, as: '${a}' }`).join(', ')}]
    }` : ''});

    res.json({
      status: 'success',
      message: '${modelName} updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    next(error);
  }
});

// Delete ${modelName.toLowerCase()}
router.delete('/:id', authenticate, checkSchoolAccess, async (req, res, next) => {
  try {
    const record = await ${modelName}.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        message: '${modelName} not found'
      });
    }

    await record.destroy();

    res.json({
      status: 'success',
      message: '${modelName} deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;`;
};

module.exports = { generateCRUDRoute };