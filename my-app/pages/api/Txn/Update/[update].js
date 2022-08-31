import connectMongo from "../../../../utils/connectMongo";
import TxnHistory from "../../../../models/TxnHistory";

export default async function updateProduct(req, res) {
  const tokenId = req.query.update;
  try {
    console.log(tokenId);
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("Finding DOCUMENT");
    let txns = await TxnHistory.find({ tokenId: tokenId });
    let txn = txns[0];
    console.log("Found Document");

    const newTxnHash = req.body.txnHash;
    const newTxnFrom = req.body.from;
    const newTxnTo = req.body.to;

    txn.transactionHashes = [...txn.transactionHashes, newTxnHash];
    txn.from = [...txn.from, newTxnFrom];
    txn.to = [...txn.to, newTxnTo];

    await txn.save();

    res.json({ txn });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
}
