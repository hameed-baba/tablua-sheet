const getSchoolName = () => ({
  text: "DAYLIGHT ACADEMY",
  bold: true,
  margin: [0, 0, 0, 0],
  fontSize: 20,
  alignment: "center",
  color: "#3771c8",
});

const getSchoolAddress = () => ({
  text: "TALATA MAFARA, ZAMFARA STATE",
  fontSize: 10,
  bold: true,
  alignment: "center",
  color: "#3771c8",
  margin: [0, 5, 0, 0],
});

const getSchoolMotto = () => ({
  text: "Education is the soul of success",
  fontSize: 9,
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
