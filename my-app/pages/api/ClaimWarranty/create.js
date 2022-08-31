import connectMongo from "../../../utils/connectMongo";
import ClaimWarranty from "../../../models/ClaimWarranty";

export default async function createProduct(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("CREATING DOCUMENT");
    let newClaim = req.body;
    console.log(newClaim);

    const txn = await ClaimWarranty.create(newClaim);
    console.log("CREATED DOCUMENT");
    console.log(txn);
    res.json({ txn });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
