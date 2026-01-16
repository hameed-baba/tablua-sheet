const fs = require("fs");
const path = require("path");

module.exports = function getBase64Image(imageName) {
  try {
    const fullPath = path.join(__dirname, "..", "img", imageName);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const imageBuffer = fs.readFileSync(fullPath);
    const base64 = imageBuffer.toString("base64");
    const mimeType = imageName.endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

