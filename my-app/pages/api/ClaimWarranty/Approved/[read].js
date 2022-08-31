import connectMongo from "../../../../utils/connectMongo";
import ClaimWarranty from "../../../../models/ClaimWarranty";

export default async function createProduct(req, res) {
  const curTokenId = req.query.read;
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const txn = await ClaimWarranty.find({
      tokenId: curTokenId,
      status: "approved",
    });
    console.log("FOUND DOCUMENT");
    console.log(txn);
    res.json({ txn });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
