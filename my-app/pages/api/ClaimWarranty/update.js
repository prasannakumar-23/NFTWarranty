import connectMongo from "../../../utils/connectMongo";
import ClaimWarranty from "../../../models/ClaimWarranty";

export default async function updateProduct(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");
    const cur_id = req.body._id;

    console.log("Finding DOCUMENT");
    let products = await ClaimWarranty.find({ _id: cur_id, status: "pending" });
    let product = products[0];
    console.log("Found Document");

    product.status = "approved";

    await product.save();

    res.json({ product });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
