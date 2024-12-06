import { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const Wallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      const providerOptions = {}; // Add any provider options if needed
      const web3Modal = new Web3Modal({ cacheProvider: true, providerOptions });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();

      const address = await signer.getAddress();
      setWalletAddress(address);
      alert("Wallet connected: " + address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {walletAddress && <p>Connected: {walletAddress}</p>}
    </div>
  );
};

export default Wallet;
