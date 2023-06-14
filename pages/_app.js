import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ACTIVE_CHAIN } from "../const/yourDetails";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={ACTIVE_CHAIN}
      authConfig={{ domain: "thirdweb-example.com", authUrl: "/api/auth" }}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
