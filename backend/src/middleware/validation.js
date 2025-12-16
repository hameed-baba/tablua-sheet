const Validator = require("fastest-validator");

const v = new Validator();

const validate = (schema) => {
  const check = v.compile(schema);
  return (req, res, next) => {
    const result = check(req.body);
    if (result !== true) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        details: result.map((error) => `${error.field}: ${error.message}`),
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  const check = v.compile(schema);
  return (req, res, next) => {
    const result = check(req.query);
    if (result !== true) {
      return res.status(400).json({
        status: "error",
        message: "Query validation error",
        details: result.map((error) => `${error.field}: ${error.message}`),
      });
    }
    next();
  };
};

// Common validation schemas
const schemas = {
  login: {
    email: { type: "email", required: true },
    password: { type: "string", min: 6, required: true },
  },

  staffRegistration: {
    full_name: { type: "string", min: 2, max: 100, required: true },
    phone_number: {
      type: "string",
      pattern: /^[0-9+\-\s()]+$/,
      required: true,
    },
    email: { type: "email", required: true },
    address: { type: "string", max: 255, required: true },
    state: { type: "string", max: 50, required: true },
    local_gov: { type: "string", max: 50, required: true },
    date_of_employment: { type: "date", convert: true, required: true },
    role_id: { type: "number", integer: true, positive: true, required: true },
    password: { type: "string", min: 6, required: true },
    has_school_access: { type: "boolean", optional: true },
    has_system_access: { type: "boolean", optional: true },
    is_default_password: { type: "boolean", optional: true },
    section_ids: { type: "string", optional: true },
    gender: { type: "enum", values: ["male", "female"], required: true },
    date_of_birth: { type: "date", optional: true, convert: true },
    employee_id: { type: "string", optional: true },
    salary: { type: "number", positive: true, optional: true },
    employment_type: {
      type: "enum",
      values: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "substitute",
        "temporary",
      ],
      optional: true,
    },
    qualifications: {
      type: "enum",
      values: [
        "Senior Secondary Certificate (SSCE)",
        "National Diploma (ND)",
        "National Certificate in Education (NCE)",
        "Higher National Diploma (HND)",
        "Bachelor's Degree (BSc)",
        "Master's Degree (MSc)",
        "Doctorate (PhD)",
        "Certificate",
        "Other",
      ],
      optional: true,
    },
    qualification_title: { type: "string", optional: true },
    institution: { type: "string", optional: true },
    year_obtained: { type: "string", optional: true },
    emergency_contact: { type: "string", optional: true },
    emergency_contact_name: { type: "string", optional: true },
    emergency_contact_relation: { type: "string", optional: true },
    year_of_experience: { type: "string", optional: true },
    specializations: { type: "string", optional: true },
    status: { type: "boolean", optional: true },
  },
  studentRegistration: {
    full_name: { type: "string", min: 2, max: 100, required: true },
    gender: { type: "enum", values: ["male", "female"], required: true },
    dob: { type: "string", required: true },
    address: { type: "string", max: 255, required: true },
    state: { type: "string", max: 50, required: true },
    local_gov: { type: "string", max: 50, required: true },
    religion: { type: "string", max: 50, optional: true },
    blood_group: { type: "string", max: 10, optional: true },
    admission_number: { type: "string", max: 50, required: true },
    admitted_class: { type: "number", max: 50, required: true },
    admitted_session: { type: "number", max: 50, required: true },
    student_status: {
      type: "enum",
      values: ["active", "graduated", "transferred", "suspended", "withdrawn", "leave"],
      default: "active",
      optional: true,
    },
    current_class_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    current_session_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    parent_id: { type: "number", integer: true, positive: true, required: true },
  },

  // New nested structure for student registration with subjects
  studentRegistrationWithSubjects: {
    student: {
      type: "object",
      required: true,
      props: {
        full_name: { type: "string", min: 2, max: 100, required: true },
        gender: { type: "enum", values: ["male", "female"], required: true },
        dob: { type: "string", required: true },
        address: { type: "string", max: 255, required: true },
        state: { type: "string", max: 50, required: true },
        local_gov: { type: "string", max: 50, required: true },
        religion: { type: "string", max: 50, optional: true },
        blood_group: { type: "string", max: 10, optional: true },
        admission_number: { type: "string", max: 50, required: true },
        admitted_class: { type: "number", max: 50, required: true },
        admitted_session: { type: "number", max: 50, required: true },
        student_status: {
          type: "enum",
          values: ["active", "graduated", "transferred", "suspended", "withdrawn", "leave"],
          default: "active",
          optional: true,
        },
        current_class_id: {
          type: "number",
          integer: true,
          positive: true,
          required: true,
        },
        current_session_id: {
          type: "number",
          integer: true,
          positive: true,
          required: true,
        },
        parent_id: { type: "number", integer: true, positive: true, required: true },
      },
    },
    subjects: {
      type: "array",
      optional: true,
      items: {
        type: "object",
        props: {
          school_subject_id: { type: "number", integer: true, positive: true, required: true },
          current_class_id: { type: "number", integer: true, positive: true, required: true },
          current_session_id: { type: "number", integer: true, positive: true, required: true },
        },
      },
    },
  },

  parentRegistration: {
    full_name: { type: "string", min: 2, max: 100, required: true },
    religion: { type: "enum", values: ["islam", "christianity", "other"], optional: true },
    gender: { type: "enum", values: ["male", "female"], required: true },
    address: { type: "string", max: 255, required: true },
    state: { type: "string", max: 50, required: true },
    local_gov: { type: "string", max: 50, required: true },
    phone_number: {
      type: "string",
      pattern: /^([+]234|234|0){1}[7-9]{1}[0-1]{1}[0-9]{8}$/,
      required: true,
    },
  },

  roleCreation: {
    role_name: { type: "string", min: 2, max: 50, required: true },
    description: { type: "string", max: 255, optional: true },
    permissions: { type: "array", items: "number", optional: true },
  },

  permissionCreation: {
    permission_name: { type: "string", min: 2, max: 100, required: true },
  },

  rolePermissionAssignment: {
    role_id: { type: "number", integer: true, positive: true, required: true },
    permissionId: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
  },

  schoolClassCreation: {
    class_name: { type: "string", min: 1, max: 50, required: true },
    grade_list_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    school_staff_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },

    section_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
  },

  schoolSectionCreation: {
    section_name: { type: "string", min: 1, max: 50, required: true },
  },

  schoolSubjectCreation: {
    subject_name: { type: "string", min: 1, max: 100, required: true },
    section_ids: {
      type: "string",
      required: true,
    },
  },

  schoolSessionCreation: {
    session_name: { type: "string", min: 1, max: 50, required: true },
    status: {
      type: "enum",
      values: ["active", "inactive"],
      default: "inactive",
      optional: true,
    },
    schoolId: { type: "number", integer: true, positive: true, required: true },
  },

  schoolTermCreation: {
    sessionId: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    schoolId: { type: "number", integer: true, positive: true, required: true },
    term_name: { type: "string", min: 1, max: 50, required: true },
    status: {
      type: "enum",
      values: ["active", "inactive"],
      default: "inactive",
      optional: true,
    },
    payment_status: {
      type: "enum",
      values: ["pending", "paid", "overdue"],
      default: "pending",
      optional: true,
    },
    prevSessionId: {
      type: "number",
      integer: true,
      positive: true,
      optional: true,
      nullable: true,
    },
  },

  classMasterCreation: {
    schoolId: { type: "number", integer: true, positive: true, required: true },
    schoolStaffId: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    schoolSectionId: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    schoolClassId: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
  },

  classSubjectAssignCreation: {
    school_class_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    school_subject_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    school_staff_id: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
  },

  // New schema for bulk assignments
  classSubjectAssignBulkCreation: {
    assignments: {
      type: "array",
      required: true,
      min: 1,
      items: {
        type: "object",
        properties: {
          school_class_id: {
            type: "number",
            integer: true,
            positive: true,
            required: true,
          },
          school_subject_id: {
            type: "number",
            integer: true,
            positive: true,
            required: true,
          },
          school_staff_id: {
            type: "number",
            integer: true,
            positive: true,
            required: true,
          },
        },
      },
    },
    school_class_id: {
      type: "number",
      integer: true,
      positive: true,
      required: false, // Optional for bulk operations
    },
  },

  gradeListCreation: {
    grade_name: { type: "string", min: 1, max: 50, required: true },
    grade_type: { type: "string", min: 1, max: 50, required: true },
  },

  gradeSystemCreation: {
    gradeListId: {
      type: "number",
      integer: true,
      positive: true,
      required: true,
    },
    from_mark: { type: "number", min: 0, max: 100, required: true },
    to_mark: { type: "number", min: 0, max: 100, required: true },
    grade: { type: "string", min: 1, max: 10, required: true },
    remark: { type: "string", max: 100, optional: true },
  },

  changePassword: {
    currentPassword: { type: "string", min: 6, required: true },
    newPassword: { type: "string", min: 6, required: true },
  },

  pagination: {
    page: {
      type: "number",
      integer: true,
      min: 1,
      default: 1,
      optional: true,
      convert: true,
    },
    limit: {
      type: "number",
      integer: true,
      min: 1,
      max: 100,
      default: 25,
      optional: true,
      convert: true,
    },
    search: { type: "string", optional: true },
    sortBy: { type: "string", optional: true },
    sortOrder: {
      type: "enum",
      values: ["ASC", "DESC"],
      default: "DESC",
      optional: true,
    },
  },
};

module.exports = {
  validate,
  validateQuery,
  schemas,
};
