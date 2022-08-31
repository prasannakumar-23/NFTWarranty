const mongoose = require("mongoose");

const warrantySchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  date: [String],
  repair: [String],
});

const Warranty =
  mongoose.models.Warranty || mongoose.model("Warranty", warrantySchema);

export default Warranty;
