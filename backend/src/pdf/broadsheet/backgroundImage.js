const getBase64Image = require("../base64Image");

module.exports =  function backgroundImage() {
  return {
    image:  getBase64Image('school-logo.png'),
    opacity: 0.1,
    alignment: "center",
    absolutePosition: { x: 0, y: 200 }, //250
    width: 850, // A4 width in pt
    height: 600, // A4 height in pt
  };
};
