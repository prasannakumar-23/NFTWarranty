import connectMongo from "../../../utils/connectMongo";
import Product from "../../../models/Product";

export default async function createProduct(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("CREATING DOCUMENT");
    let newproduct = req.body;
    console.log(newproduct);
    let parsedsNums = req.body.sNums.split(",");

    newproduct.sNums = [...parsedsNums];

    const product = await Product.create(newproduct);
    console.log("CREATED DOCUMENT");

    res.json({ product });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
