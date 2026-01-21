const getSchoolName = (fontSize = 20) => ({
  text: "DAYLIGHT ACADEMY",
  bold: true,
  margin: [0, 0, 0, 0],
  fontSize: fontSize,
  alignment: "center",
  color: "#3771c8",
});

const getSchoolAddress = (fontSize = 10) => ({
  text: "TALATA MAFARA, ZAMFARA STATE",
  fontSize: fontSize,
  bold: true,
  alignment: "center",
  color: "#3771c8",
  margin: [0, 5, 0, 0],
});

const getSchoolMotto = (fontSize = 9) => ({
  text: "Education is the soul of success",
  fontSize: fontSize,
  alignment: "center",
  italics: true,
  color: "#3771c8",
  margin: [0, 5, 0, 0],
});

module.exports = {
  getSchoolName,
  getSchoolAddress,
  getSchoolMotto,
};
