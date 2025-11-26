const { Op } = require("sequelize");
const { asyncHandler } = require("../middleware/errorHandler");

class BaseController {
  constructor(model, modelName, includes = []) {
    this.model = model;
    this.modelName = modelName;
    this.includes = includes;
  }

  // getAll = asyncHandler(async (req, res) => {
  //   const {
  //     page = Math.max(parseInt(req.query.page) || 1, 1),
  //     limit = 25,
  //     search = req.query.search?.trim() || "",
  //     sortBy = "createdAt",
  //     sortOrder = req.query.sortBy || "createdAt",
  //     ...filters
  //   } = req.query;

  //   const offset = (page - 1) * limit;
  //   const whereClause = this.buildWhereClause(req, filters, search);

  //   const { count, rows } = await this.model.findAndCountAll({
  //     where: whereClause,
  //     include: this.includes,
  //     limit,
  //     offset,
  //     order: [[sortBy, sortOrder]],
  //     distinct: true,
  //   });

  //   const pluralName = this.modelName.toLowerCase() + "s";
  //   const totalPages = Math.ceil(count / limit);

  //   res.json({
  //     status: "success",
  //     data: {
  //       [pluralName]: rows,
  //       pagination: {
  //         currentPage: parseInt(page),
  //         totalPages,
  //         totalCount: count,
  //         limit: parseInt(limit),
  //         hasNextPage: page < totalPages,
  //         hasPrevPage: page > 1,
  //       },
  //     },
  //   });
  // });

  getAll = asyncHandler(async (req, res) => {
    // Parse page and limit, with defaults
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;

    // ✅ Default 25, override only if valid number > 0
    const limit =
      req.query.limit && parseInt(req.query.limit) > 0
        ? parseInt(req.query.limit)
        : 25;

    const search = req.query.search?.trim() || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = (req.query.sortOrder || "DESC").toUpperCase();

    const offset = (page - 1) * limit;

    const whereClause = this.buildWhereClause(req, req.query, search);

    const { count, rows } = await this.model.findAndCountAll({
      where: whereClause,
      include: this.includes,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    if (count === 0) {
      return res.status(404).json({
        status: "not found",
        message: `${this.modelName} not found`,
      });
    }

    const pluralName = this.modelName.toLowerCase() + "s";
    const totalPages = Math.ceil(count / limit);

    res.json({
      status: "success",
      data: {
        [pluralName]: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count, // ✅ consistent key
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  });

  getById = asyncHandler(async (req, res) => {
    const record = await this.model.findByPk(req.params.id, {
      include: this.includes,
    });

    if (!record) {
      return res.status(404).json({
        status: "error",
        message: `${this.modelName} not found`,
      });
    }

    res.json({
      status: "success",
      data: record,
    });
  });

  create = asyncHandler(async (req, res) => {
    const data = this.prepareCreateData(req);

    // Check for duplicates
    const duplicateCheck = await this.checkDuplicate(data);
    if (duplicateCheck) {
      return res.status(409).json({
        status: "error",
        message: `${this.modelName} already exists`,
        details: duplicateCheck,
      });
    }

    const record = await this.model.create(data);

    const newRecord = await this.model.findByPk(record.id, {
      include: this.includes,
    });

    res.status(201).json({
      status: "success",
      message: `${this.modelName} created successfully`,
      data: newRecord,
    });
  });

  update = asyncHandler(async (req, res) => {
    const record = await this.model.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: "error",
        message: `${this.modelName} not found`,
      });
    }

    // Check for duplicates (excluding current record)
    const duplicateCheck = await this.checkDuplicate(req.body, req.params.id);
    if (duplicateCheck) {
      return res.status(409).json({
        status: "error",
        message: `${this.modelName} already exists`,
        details: duplicateCheck,
      });
    }

    await record.update(req.body);

    const updatedRecord = await this.model.findByPk(record.id, {
      include: this.includes,
    });

    res.json({
      status: "success",
      message: `${this.modelName} updated successfully`,
      data: updatedRecord,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const record = await this.model.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: "error",
        message: `${this.modelName} not found`,
      });
    }

    await record.destroy();

    res.json({
      status: "success",
      message: `${this.modelName} deleted successfully`,
    });
  });

  // Override these methods in child classes for custom behavior
  buildWhereClause(req, filters, search) {
    const whereClause = {};

    // // Add school filter if user doesn't have system access
    // if (req.user && !req.user.hasSystemAccess && this.model.rawAttributes.schoolId) {
    //   whereClause.schoolId = req.user.schoolId;
    // }

    // Add other filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] && this.model.rawAttributes[key]) {
        whereClause[key] = filters[key];
      }
    });

    // Add search functionality
    if (search) {
      const searchableFields = this.getSearchableFields();
      if (searchableFields.length > 0) {
        whereClause[Op.or] = searchableFields.map((field) => ({
          [field]: { [Op.like]: `%${search}%` },
        }));
      }
    }

    return whereClause;
  }

  getSearchableFields() {
    // Override in child classes to define searchable fields
    const attributes = Object.keys(this.model.rawAttributes);
    return attributes.filter(
      (attr) =>
        attr.includes("name") ||
        attr.includes("title") ||
        attr.includes("email")
    );
  }

  prepareCreateData(req) {
    // Add schoolId if user doesn't have system access
    const data = { ...req.body };
    if (
      req.user &&
      !req.user.hasSystemAccess &&
      this.model.rawAttributes.schoolId
    ) {
      data.schoolId = req.user.schoolId;
    }
    return data;
  }

  getUniqueFields() {
    // Override in child classes to define unique fields for duplicate checking
    // Returns array of field names or arrays of field names for composite uniqueness
    const attributes = Object.keys(this.model.rawAttributes);
    const uniqueFields = [];

    // Check for common unique field patterns
    if (attributes.includes("section_name")) uniqueFields.push("section_name");
    if (attributes.includes("class_name")) uniqueFields.push("class_name");
    if (attributes.includes("subject_name")) uniqueFields.push("subject_name");
    if (attributes.includes("role_name")) uniqueFields.push("role_name");
    if (attributes.includes("permission_name"))
      uniqueFields.push("permission_name");
    if (attributes.includes("session_name")) uniqueFields.push("session_name");
    if (attributes.includes("term_name")) uniqueFields.push("term_name");
    if (attributes.includes("grade_name")) uniqueFields.push("grade_name");
    if (attributes.includes("email")) uniqueFields.push("email");
    if (attributes.includes("admission_number"))
      uniqueFields.push("admission_number");
    if (attributes.includes("employee_id")) uniqueFields.push("employee_id");

    return uniqueFields;
  }

  async checkDuplicate(data, excludeId = null) {
    const uniqueFields = this.getUniqueFields();

    if (uniqueFields.length === 0) return null;

    const whereConditions = [];

    for (const field of uniqueFields) {
      if (Array.isArray(field)) {
        // Composite unique constraint
        const compositeWhere = {};
        let hasAllFields = true;

        for (const subField of field) {
          if (data[subField]) compositeWhere[subField] = data[subField];
          else hasAllFields = false;
        }

        if (hasAllFields) whereConditions.push(compositeWhere);
      } else {
        // Single field unique constraint
        if (data[field]) whereConditions.push({ [field]: data[field] });
      }
    }

    if (whereConditions.length === 0) return null;

    // Build the where clause with proper exclusion
    const whereClause = {
      [Op.and]: [
        { id: { [Op.ne]: excludeId } }, // ✅ exclude current record safely
        { [Op.or]: whereConditions }, // ✅ check other records only
      ],
    };

    const existingRecord = await this.model.findOne({ where: whereClause });

    if (existingRecord) {
      const duplicateFields = [];

      for (const field of uniqueFields) {
        if (Array.isArray(field)) {
          const allMatch = field.every(
            (subField) => existingRecord[subField] === data[subField]
          );
          if (allMatch) duplicateFields.push(field.join(" + "));
        } else {
          if (existingRecord[field] === data[field]) {
            duplicateFields.push(field);
          }
        }
      }

      return `Duplicate found for: ${duplicateFields.join(", ")}`;
    }

    return null;
  }
}

module.exports = BaseController;
