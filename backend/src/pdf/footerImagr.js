const getBase64Image = require("./base64Image");


module.exports = footerImage = () => {
  return {
    image: getBase64Image('tabula-sheet-logo.png'),
    width: 70,
    height: 20,
    alignment: "right",
    margin: [45, 0, 0, 0],
  };
};


