import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";
import { useState, useEffect } from "react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="btn-primary text-lg px-8 py-3 opacity-50">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <ConnectButton />

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
