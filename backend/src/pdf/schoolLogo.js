const getBase64Image = require("./base64Image");
module.exports = function schoolLogo() {
  return {
    image: getBase64Image("school-logo.png"),
    width: 230,
    height: 150,
    alignment: "center",
    margin: [0, 0, 0, 0],
  };
};
