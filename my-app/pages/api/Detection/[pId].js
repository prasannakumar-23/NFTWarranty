import connectMongo from "../../../utils/connectMongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  console.log(req);
  const pId = req.query.pId;
  let curItem;

  try {
    await connectMongo();
    console.log("connected to database");
    console.log(pId);
    curItem = await Product.find({ pId: pId });
    console.log(curItem);
    res.status(200).json({
      name: curItem[0].pName,
      description: curItem[0].pDesc,
      productId: pId,
      url: curItem[0].url,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "failed",
    });
  }
}
