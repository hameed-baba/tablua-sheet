module.exports =  function reportCardHeader() {
  return {
    margin: [20, 20, 40, 0],
    text: `Printed at ${new Date().toISOString().split("T")[0]}`,
    alignment: "right",
    bold: true,
    fontSize: 7,
    color: "#667085",
  };
}
