import connectMongo from "../../../utils/connectMongo";
import Product from "../../../models/Product";

export default async function updateProduct(req, res) {
  const productId = req.query.update;
  try {
    console.log(productId);
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("Finding DOCUMENT");
    let products = await Product.find({ pId: productId });
    let product = products[0];
    console.log("Found Document");

    let parsedsNums = req.body.sNums.split(",");

    product.sNums = [...product.sNums, ...parsedsNums];

    await product.save();

    res.json({ product });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
