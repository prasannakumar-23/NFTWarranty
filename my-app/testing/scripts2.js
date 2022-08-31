const ethers = require("ethers");
const contractabi = require("../constants/cabi.json");
require("dotenv").config({ path: ".env" });

async function main() {
  const contractAddress = "0x1D22cb77DAAB545e2a7c652Dd85a695d38CEff52";
  console.log(
    "wss://polygon-mumbai.g.alchemy.com/v2/zurJTrfSEQoqjKepEzLZvqqDUT87wIg_"
  );
  const provider = new ethers.providers.WebSocketProvider(
    "wss://polygon-mumbai.g.alchemy.com/v2/zurJTrfSEQoqjKepEzLZvqqDUT87wIg_"
  );
  const contract = new ethers.Contract(contractAddress, contractabi, provider);
  contract.on("_aproove", (from, to, tokenId, event) => {
    let info = {
      repairer: from,
      to: to,
      tokenId: tokenId,
      msg: msg,
    };
  });
}

main();
