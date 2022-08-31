import connectMongo from "../../../utils/connectMongo";
import TxnHistory from "../../../models/TxnHistory";

export default async function handler(req, res) {
  console.log(req);
  const tokenId = req.query.tokenId;
  let curItem;

  try {
    await connectMongo();
    console.log("connected to database");
    curItem = await TxnHistory.find({ tokenId: tokenId });
    console.log(curItem);

    res.status(200).json({
      tokenId: curItem[0].tokenId,
      transactionHashes: curItem[0].transactionHashes,
      from: curItem[0].from,
      to: curItem[0].to,
    });
  } catch (err) {
    console.log("tokenId doesnt exist");
    res.status(404).json({
      message: "failed",
    });
  }
}
