import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Set up fonts
if (pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  pdfMake.vfs = pdfFonts;
}

/**
 * Generate a professional staff profile PDF
 * @param {Object} staffData - The staff data object
 */
export const generateStaffProfilePDF = (staffData) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sections = staffData.sections
    ? staffData.sections.map((s) => s.section_name).join(", ")
    : "N/A";

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    
    header: (currentPage, pageCount) => {
      return {
        columns: [
          {
            text: "Staff Profile Report",
            style: "headerText",
            margin: [40, 20, 0, 0],
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            style: "headerText",
            margin: [0, 20, 40, 0],
          },
        ],
      };
    },

    footer: (currentPage, pageCount) => {
      return {
        columns: [
          {
            text: `Generated on ${formatDate(new Date())}`,
            alignment: "left",
            style: "footerText",
            margin: [40, 0, 0, 0],
          },
          {
            text: "Confidential Document",
            alignment: "right",
            style: "footerText",
            margin: [0, 0, 40, 0],
          },
        ],
      };
    },

    content: [
      // Title Section
      {
        text: "STAFF PROFILE",
        style: "title",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },

      // Profile Header with Avatar
      {
        columns: [
          {
            width: 80,
            stack: [
              {
                canvas: [
                  {
                    type: "ellipse",
                    x: 40,
                    y: 40,
                    r1: 40,
                    r2: 40,
                    color: "#667eea",
                  },
                ],
              },
              {
                text: getInitials(staffData.full_name),
                style: "avatarText",
                absolutePosition: { x: 40, y: 100 },
                alignment: "center",
                width: 80,
              },
            ],
          },
          {
            width: "*",
            stack: [
              {
                text: staffData.full_name || "N/A",
                style: "staffName",
              },
              {
                text: staffData.Role?.role_name || "N/A",
                style: "staffRole",
                margin: [0, 5, 0, 5],
              },
              {
                text: `Employee ID: ${staffData.employee_id || "N/A"}`,
                style: "employeeId",
              },
              {
                text: staffData.has_school_access ? "● Active" : "● Inactive",
                style: staffData.has_school_access
                  ? "statusActive"
                  : "statusInactive",
                margin: [0, 5, 0, 0],
              },
            ],
            margin: [20, 10, 0, 0],
          },
        ],
        margin: [0, 0, 0, 30],
      },

      // Divider
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 2,
            lineColor: "#667eea",
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Personal Information Section
      {
        text: "PERSONAL INFORMATION",
        style: "sectionHeader",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            [
              { text: "Full Name", style: "tableLabel" },
              { text: staffData.full_name || "N/A", style: "tableValue" },
            ],
            [
              { text: "Email", style: "tableLabel" },
              { text: staffData.email || "N/A", style: "tableValue" },
            ],
            [
              { text: "Phone Number", style: "tableLabel" },
              { text: staffData.phone_number || "N/A", style: "tableValue" },
            ],
            [
              { text: "Gender", style: "tableLabel" },
              {
                text:
                  staffData.gender?.charAt(0).toUpperCase() +
                    staffData.gender?.slice(1) || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Date of Birth", style: "tableLabel" },
              {
                text: formatDate(staffData.date_of_birth),
                style: "tableValue",
              },
            ],
            [
              { text: "Address", style: "tableLabel" },
              { text: staffData.address || "N/A", style: "tableValue" },
            ],
            [
              { text: "Local Government", style: "tableLabel" },
              { text: staffData.local_gov || "N/A", style: "tableValue" },
            ],
            [
              { text: "State", style: "tableLabel" },
              { text: staffData.state || "N/A", style: "tableValue" },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9fafb" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
        },
        margin: [0, 0, 0, 20],
      },

      // Professional Information Section
      {
        text: "PROFESSIONAL INFORMATION",
        style: "sectionHeader",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            [
              { text: "Employee ID", style: "tableLabel" },
              { text: staffData.employee_id || "N/A", style: "tableValue" },
            ],
            [
              { text: "Role", style: "tableLabel" },
              {
                text: staffData.Role?.role_name || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Date of Employment", style: "tableLabel" },
              {
                text: formatDate(staffData.date_of_employment),
                style: "tableValue",
              },
            ],
            [
              { text: "Employment Type", style: "tableLabel" },
              {
                text:
                  staffData.employment_type?.charAt(0).toUpperCase() +
                    staffData.employment_type?.slice(1) || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Salary", style: "tableLabel" },
              { text: formatCurrency(staffData.salary), style: "tableValue" },
            ],
            [
              { text: "Sections", style: "tableLabel" },
              { text: sections, style: "tableValue" },
            ],
            [
              { text: "Years of Experience", style: "tableLabel" },
              {
                text: staffData.year_of_experience
                  ? `${staffData.year_of_experience} years`
                  : "N/A",
                style: "tableValue",
              },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9fafb" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
        },
        margin: [0, 0, 0, 20],
      },

      // Qualifications Section
      {
        text: "EDUCATION & QUALIFICATIONS",
        style: "sectionHeader",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            [
              { text: "Highest Qualification", style: "tableLabel" },
              {
                text: staffData.qualifications || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Qualification Title", style: "tableLabel" },
              {
                text: staffData.qualification_title || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Institution", style: "tableLabel" },
              { text: staffData.institution || "N/A", style: "tableValue" },
            ],
            [
              { text: "Year Obtained", style: "tableLabel" },
              { text: staffData.year_obtained || "N/A", style: "tableValue" },
            ],
            [
              { text: "Specializations", style: "tableLabel" },
              {
                text: staffData.specializations || "N/A",
                style: "tableValue",
              },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9fafb" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
        },
        margin: [0, 0, 0, 20],
      },

      // Emergency Contact Section
      {
        text: "EMERGENCY CONTACT",
        style: "sectionHeader",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            [
              { text: "Contact Name", style: "tableLabel" },
              {
                text: staffData.emergency_contact_name || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Contact Number", style: "tableLabel" },
              {
                text: staffData.emergency_contact || "N/A",
                style: "tableValue",
              },
            ],
            [
              { text: "Relationship", style: "tableLabel" },
              {
                text: staffData.emergency_contact_relation || "N/A",
                style: "tableValue",
              },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9fafb" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
        },
        margin: [0, 0, 0, 20],
      },
    ],

    styles: {
      title: {
        fontSize: 24,
        bold: true,
        color: "#667eea",
      },
      headerText: {
        fontSize: 9,
        color: "#6b7280",
      },
      footerText: {
        fontSize: 8,
        color: "#9ca3af",
        italics: true,
      },
      staffName: {
        fontSize: 20,
        bold: true,
        color: "#111827",
      },
      staffRole: {
        fontSize: 14,
        color: "#667eea",
        bold: true,
      },
      employeeId: {
        fontSize: 11,
        color: "#6b7280",
      },
      statusActive: {
        fontSize: 11,
        color: "#10b981",
        bold: true,
      },
      statusInactive: {
        fontSize: 11,
        color: "#ef4444",
        bold: true,
      },
      avatarText: {
        fontSize: 28,
        bold: true,
        color: "#ffffff",
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: "#111827",
        background: "#f3f4f6",
        margin: [0, 10, 0, 10],
      },
      tableLabel: {
        fontSize: 10,
        bold: true,
        color: "#374151",
        margin: [5, 5, 5, 5],
      },
      tableValue: {
        fontSize: 10,
        color: "#111827",
        margin: [5, 5, 5, 5],
      },
    },

    defaultStyle: {
      font: "Roboto",
    },
  };

  // Generate and download the PDF
  const fileName = `${staffData.full_name?.replace(/\s+/g, "_") || "Staff"}_Profile_${new Date().getTime()}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
};
