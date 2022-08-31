import connectMongo from "../../../../utils/connectMongo";
import Warranty from "../../../../models/Warranty";

export default async function updateProduct(req, res) {
  const tokenId = req.query.tokenId;
  try {
    console.log(tokenId);
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("Finding DOCUMENT");
    let products = await Warranty.find({ tokenId: tokenId });
    let product = products[0];
    console.log("Found Document");

    let parseddate = req.body.date;
    let parsedrepair = req.body.repair;

    product.date = [...product.date, parseddate];
    product.repair = [...product.repair, parsedrepair];
    await product.save();

    res.json({ product });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
24;
my - app / pages / api / TokenIds / [tokenId].js;
