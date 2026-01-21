module.exports = dashSeparator = (x2 = 515) => {
  return {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: x2, // page width minus margins 515 or 768
        y2: 0,
        lineWidth: 0.5,
        lineColor: "#3771c8",
        dash: { length: 5, space: 3 },
      },
    ],
    margin: [0, 5, 0, 0],
  };
};
