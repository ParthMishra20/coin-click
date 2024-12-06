import { ethers } from "ethers";

const DailyCheckIn = ({ walletAddress }) => {
  const claimReward = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.MANTLE_RPC_URL);
      const signer = provider.getSigner();

      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const contractABI = []; // Replace with your contract's ABI

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.claimReward();
      await tx.wait();

      alert("Reward claimed successfully!");
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Transaction failed.");
    }
  };

  return (
    <div>
      <h3>Daily Check-In</h3>
      <button onClick={claimReward}>Get Reward</button>
    </div>
  );
};

export default DailyCheckIn;
