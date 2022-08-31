export const connectWallet = async () => {
  try {
    await getProviderOrSigner();
    setWalletConnected(true);
  } catch (error) {
    console.log(error);
  }
};

export const getProviderOrSigner = async (needSigner = false) => {
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  const { chainId } = await web3Provider.getNetwork();
  if (chainId !== 4) {
    window.alert("Change the network to Rinkeby");
    throw new Error("Change network to Rinkeby");
  }

  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider;
};
export const nftContract = new Contract(
  NFT_CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
  signer
);
