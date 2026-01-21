const getBase64Image = require("./base64Image");
module.exports = function schoolLogo(width = 230, height = 150) {
  return {
    image: getBase64Image("school-logo.png"),
    width: width,
    height: height,
    alignment: "center",
    margin: [0, 0, 0, 0],
  };
};
