const ethers = require("ethers");
const contractabi = require("/constants/cabi.json");
require("dotenv").config({ path: ".env" });

async function main() {
  const contractAddress = "0x1D22cb77DAAB545e2a7c652Dd85a695d38CEff52";
  console.log(process.env.ALCHEMY_WEBSOCKET);
  const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_WEBSOCKET
  );
  const contract = new ethers.Contract(contractAddress, contractabi, provider);
  contract.on("_req", (from, to, msg, event) => {
    let info = {
      from: from,
      to: to,
      msg: msg,
      data: event,
    };
    console.log(JSON.stringify(info, null, 4));
  });
}

main();
