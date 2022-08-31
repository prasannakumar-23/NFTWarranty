const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { METADATA_URL, RETAIL_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  const metadataURL = METADATA_URL;
  const retailContract = RETAIL_CONTRACT_ADDRESS;
  const warrantyContract = await ethers.getContractFactory("Warranty");

  // deploy the contract
  const deployedWarrantyContract = await warrantyContract.deploy(
    metadataURL,
    retailContract
  );

  // print the address of the deployed contract
  console.log(
    "warrantyContract Contract Address:",
    deployedWarrantyContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
