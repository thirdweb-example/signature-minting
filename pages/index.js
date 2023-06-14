import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NFT_COLLECTION_ADDRESS } from "../const/yourDetails";
import { useState } from "react";

export default function Home() {
  const address = useAddress();
  const { contract, isLoading } = useContract(NFT_COLLECTION_ADDRESS);
  const [loading, setLoading] = useState(false);

  const validateAndMint = async () => {
    try {
      if (!address || isLoading) return;
      setLoading(true);
      // Contact API to check eligibility and get signature
      const response = await fetch("/api/requestMint", {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        return alert("You are unable to mint at this time.");
      }
      // Mint NFT
      await contract.erc721.signature.mint(data.signature);
      setLoading(false);
      alert("NFT minted!");
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert(
        "Something went wrong. Please check the console for more information."
      );
    }
  };

  return (
    <div className="container">
      <ConnectWallet />
      {address && (
        <button disabled={loading} className="button" onClick={validateAndMint}>
          {loading ? "Loading..." : "Validate and mint!"}
        </button>
      )}
    </div>
  );
}
