import connectMongo from "../../../utils/connectMongo";
import Warranty from "../../../models/Warranty";

export default async function handler(req, res) {
  const tokenId = req.query.tokenId;
  let curItem;

  try {
    await connectMongo();
    console.log("connected to database");
    curItem = await Warranty.find({ tokenId: tokenId });
    console.log(curItem);
    res.status(200).json({
      tokenId: curItem[0].tokenId,
      date: curItem[0].date,
      repair: curItem[0].repair,
    });
  } catch (err) {
    console.log("serial number doesn't exist");
    res.status(404).json({
      message: "failed",
    });
  }
}
