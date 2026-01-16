module.exports = qrCode = () => {
  return {
    margin: [0, 10, 0, 0],
    stack: [
      {
        qr: 'Student Name: "John Doe"',
        fit: 70,
        foreground: "#3771c8",
        background: "#fff",
        alignment: "right",
        eccLevel: "H",
      },
    ],
  };
};
