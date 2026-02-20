const generateGatewayRef = () => {
  return "OFF-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
};

module.exports = { generateGatewayRef };
