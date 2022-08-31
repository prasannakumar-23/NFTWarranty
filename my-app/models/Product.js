const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pName: { type: String, required: true },
  pId: { type: String, required: true },
  pDesc: { type: String, required: true },
  pAttr: { type: String, required: true },
  url: { type: String },
  warrantyTime: { type: String },
  sNums: [String],
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
