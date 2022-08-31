const mongoose = require("mongoose");

const claimwarrantySchema = new mongoose.Schema({
  repairId: { type: String, required: true },

  tokenId: { type: String, required: true },
  msg: { type: String },
  from: { type: String },
  status: { type: String, default: "pending" },
});

const ClaimWarranty =
  mongoose.models.ClaimWarranty ||
  mongoose.model("ClaimWarranty", claimwarrantySchema);

export default ClaimWarranty;
