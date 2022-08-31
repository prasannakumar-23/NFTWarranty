// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectMongo from "../../../utils/connectMongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const tokenId = req.query.tokenId;
  console.log(tokenId);
  let curItem;

  try {
    await connectMongo();
    console.log("connected to database");
    curItem = await Product.find({ sNums: tokenId });
    console.log(curItem);
    res.status(200).json({
      name: curItem[0].pName,
      description: curItem[0].pDesc,
      sNo: tokenId,
      productId: curItem[0].pId,
      url: curItem[0].url,
    });
  } catch (err) {
    console.log("serial number doesnt exist");
    res.status(404).json({
      message: "failed",
      error: err,
    });
  }
}
