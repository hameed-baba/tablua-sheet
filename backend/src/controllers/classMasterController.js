const BaseController = require('./baseController');
const { ClassMaster, SchoolStaff, SchoolSection, SchoolClass } = require('../models');

class ClassMasterController extends BaseController {
  constructor() {
    super(ClassMaster, 'ClassMaster', [
      { model: SchoolStaff, as: 'Staff' },
      { model: SchoolSection, as: 'Section' },
      { model: SchoolClass, as: 'Class' }
    ]);
  }

  getSearchableFields() {
    return []; // No direct searchable fields, but could search through relationships
  }
}

module.exports = new ClassMasterController();