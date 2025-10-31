import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Create a client-side only version of ConnectButton to avoid hydration issues
const DynamicConnectButton = dynamic(
  () => Promise.resolve(() => <ConnectButton />),
  {
    ssr: false,
    loading: () => (
      <button
        className="btn-primary text-lg px-8 py-3 opacity-50"
        disabled
        type="button"
      >
        Loading...
      </button>
    ),
  }
);

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <DynamicConnectButton />

      {isConnected && mounted && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Connected to:{" "}
            <span className="font-medium">{chain?.name || "Unknown"}</span>
          </p>
          <p className="text-xs text-gray-500 font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
