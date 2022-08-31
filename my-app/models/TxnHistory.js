const mongoose = require("mongoose");

const txnHistorySchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  transactionHashes: [String],
  from: [String],
  to: [String],
});

const TxnHistory =
  mongoose.models.TxnHistory || mongoose.model("TxnHistory", txnHistorySchema);

export default TxnHistory;
