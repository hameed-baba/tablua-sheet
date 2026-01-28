const getBase64Image = require("./base64Image");

const footerImage = () => {
  return {
    image: getBase64Image("tabula-sheet-logo.png"),
    width: 70,
    height: 20,
    alignment: "right",
    margin: [45, 0, 0, 0],
  };
};

const footerImageSmall = () => {
  return {
    image: getBase64Image("tabula-sheet-logo.png"),
    width: 50,
    height: 15,
    alignment: "right",
    margin: [45, 10, 0, 0],
  };
};

module.exports = {
  footerImage,
  footerImageSmall,
};
