import connectMongo from "../../../utils/connectMongo";
import TxnHistory from "../../../models/TxnHistory";

export default async function createProduct(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("CREATING DOCUMENT");
    let newTxn = req.body;
    console.log(newTxn);

    const txn = await TxnHistory.create(newTxn);
    console.log("CREATED DOCUMENT");
    console.log(txn);
    res.json({ txn });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
