import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import {
  ACTIVE_CHAIN,
  AUTHORIZED_WALLETS,
  NFT_COLLECTION_ADDRESS,
  NFT_PRICE,
} from "../../const/yourDetails";
import { getUser } from "./auth/[...thirdweb]";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

const pkeyWallet = new PrivateKeyWallet(process.env.PRIVATE_KEY);

export default async function handler(req, res) {
  try {
    // Check user authentication
    const user = await getUser(req);

    // If user is not authenticated, return 401
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (AUTHORIZED_WALLETS.includes(user.address)) {
      // Initialize SDK and contract
      const sdk = await ThirdwebSDK.fromWallet(pkeyWallet, ACTIVE_CHAIN);
      const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
      // Authorized to mint, generate signature
      const signature = await contract.erc721.signature.generate({
        to: user.address,
        // Ideally metadata would also be dynamic
        metadata: {
          name: "Dynamically minted NFT",
          image:
            "ipfs://QmbRiEac37z5KX9MTsmm5E46ggs8i9smPfJzmNtGq4jYbH/thirdweb-logo-png.jpeg",
        },
        price: NFT_PRICE,
      });

      // Send signature back to client side
      return res.json({ signature });
    }

    // Not authorized to mint
    return res.status(403).json({ error: "Not authorized to mint" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong, check server logs for more info" });
  }
}
