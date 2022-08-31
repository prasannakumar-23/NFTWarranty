const ethers = require("ethers");
const contractabi = require("../constants/cabi.json");
require("dotenv").config({ path: ".env" });
const axios = require("axios");

async function main() {
  const contractAddress = "0x242Bfe278bdE88881d5A8feaB20Ea62F31b535c4";
  console.log(
    "wss://polygon-mumbai.g.alchemy.com/v2/zurJTrfSEQoqjKepEzLZvqqDUT87wIg_"
  );
  const provider = new ethers.providers.WebSocketProvider(
    "wss://polygon-mumbai.g.alchemy.com/v2/zurJTrfSEQoqjKepEzLZvqqDUT87wIg_"
  );
  const contract = new ethers.Contract(contractAddress, contractabi, provider);
  contract.on("_req", async (from, to, tokenId, event) => {
    let info = {
      from: from,
      repairId: to,
      tokenId: ethers.BigNumber.from(tokenId).toString(),
      msg: event,
    };
    console.log(JSON.stringify(info, null, 4));
    await axios.post(`http://localhost:3000/api/ClaimWarranty/create`, info);
    console.log("added to DB");
  });
  console.log("hello");
}

main();
