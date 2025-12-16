const BaseController = require("./baseController");
const { CaConfig } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

class CaConfigController extends BaseController {
  constructor() {
    super(CaConfig, "CaConfig", []);
  }

  // Override or add specific methods if needed
  // For now, standard CRUD from BaseController is sufficient
  // But we might want a specific method to get the *current* config if we treat it as a singleton
  // However, getAll with limit 1 is also fine for now.
  
  // Example: Get the single active config (assuming there's only one or we want the latest)
  getLatestConfig = asyncHandler(async (req, res) => {
    const config = await CaConfig.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!config) {
        return res.status(404).json({
            status: "error",
            message: "Configuration not found"
        });
    }

    res.json({
        status: "success",
        data: config
    });
  });
}

module.exports = new CaConfigController();
