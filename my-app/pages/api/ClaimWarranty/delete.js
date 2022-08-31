import connectMongo from "../../../utils/connectMongo";
import ClaimWarranty from "../../../models/ClaimWarranty";

export default async function createProduct(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");
    console.log(req.body);
    const curDocId = req.body.docId;
    console.log(curDocId);

    const txn = await ClaimWarranty.findOneAndDelete({
      _id: curDocId,
      status: "pending",
    });
    console.log("FOUND AND DELETED DOCUMENT");
    console.log(txn);
    res.json({ txn });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
