import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Head from "next/head";
import WalletConnect from "@/components/WalletConnect";
import TokenCard from "@/components/TokenCard";
import YieldCard from "@/components/YieldCard";
import { TokenBalance, getAllTokenBalances } from "@/utils/fetchBalances";
import {
  SeamlessPosition,
  UserAccountData,
  getUserAccountData,
  getUserSeamlessPositions,
} from "@/utils/seamless";

export default function Home() {
  const { address, isConnected } = useAccount();

  // State for token balances
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(false);

  // State for Seamless positions
  const [seamlessPositions, setSeamlessPositions] = useState<
    SeamlessPosition[]
  >([]);
  const [seamlessAccountData, setSeamlessAccountData] =
    useState<UserAccountData | null>(null);
  const [seamlessLoading, setSeamlessLoading] = useState(false);

  // State for general loading
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch token balances
  const fetchTokenBalances = async (userAddress: string) => {
    setBalancesLoading(true);
    try {
      const balances = await getAllTokenBalances(userAddress);
      setTokenBalances(balances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setTokenBalances([]);
    } finally {
      setBalancesLoading(false);
    }
  };

  // Fetch Seamless data with retry logic
  const fetchSeamlessData = async (userAddress: string, retryCount = 0) => {
    setSeamlessLoading(true);
    try {
      console.log(
        `Fetching Seamless data for ${userAddress}, attempt ${retryCount + 1}`
      );

      // Add small delay between calls to avoid rate limiting
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }

      const [positions, accountData] = await Promise.all([
        getUserSeamlessPositions(userAddress),
        getUserAccountData(userAddress),
      ]);

      console.log("Seamless data fetched successfully:", {
        positions,
        accountData,
      });
      setSeamlessPositions(positions);
      setSeamlessAccountData(accountData);
    } catch (error) {
      console.error(
        `Error fetching Seamless data (attempt ${retryCount + 1}):`,
        error
      );

      // Retry up to 2 times
      if (retryCount < 2) {
        console.log(
          `Retrying Seamless data fetch in ${retryCount + 1} seconds...`
        );
        setTimeout(() => {
          fetchSeamlessData(userAddress, retryCount + 1);
        }, 1000 * (retryCount + 1));
        return; // Don't set loading to false yet
      }

      // Only clear data after all retries failed
      console.error("All Seamless data fetch attempts failed");
      setSeamlessPositions([]);
      setSeamlessAccountData(null);
    } finally {
      // Always set loading to false after the first attempt completes
      // (retry attempts will manage their own loading state)
      if (retryCount === 0) {
        setSeamlessLoading(false);
      }
    }
  };

  // Fetch all data
  const fetchAllData = async (userAddress: string) => {
    setIsRefreshing(true);
    await Promise.all([
      fetchTokenBalances(userAddress),
      fetchSeamlessData(userAddress),
    ]);
    setIsRefreshing(false);
  };

  // Effect to fetch data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchAllData(address);
    } else {
      // Clear data when disconnected
      setTokenBalances([]);
      setSeamlessPositions([]);
      setSeamlessAccountData(null);
    }
  }, [isConnected, address]);

  // Manual refresh function
  const handleRefresh = () => {
    if (address) {
      fetchAllData(address);
    }
  };

  return (
    <>
      <Head>
        <title>Base Yield Dashboard - Your DeFi Portfolio on Base</title>
        <meta
          name="description"
          content="Track your DeFi portfolio on Base network with real-time token balances and yield farming positions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Base Yield Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Your DeFi Portfolio on Base Network
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {isConnected && (
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Refresh</span>
                  </button>
                )}
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isConnected ? (
            /* Welcome Screen */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Base Yield Dashboard
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Connect your wallet to view your DeFi portfolio on Base
                  network. Track token balances, lending positions, and yield
                  opportunities all in one place.
                </p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      View token balances (ETH, USDC, AERO)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Track Seamless Protocol positions
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Monitor yield farming opportunities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard Content */
            <div className="space-y-8">
              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TokenCard
                  balances={tokenBalances}
                  isLoading={balancesLoading}
                />
                <YieldCard
                  positions={seamlessPositions}
                  accountData={seamlessAccountData}
                  isLoading={seamlessLoading}
                />
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About This Dashboard
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Token Balances
                    </h4>
                    <p>
                      Real-time ERC-20 token balances fetched directly from Base
                      network contracts.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Seamless Protocol
                    </h4>
                    <p>
                      Your lending and borrowing positions with current APY
                      rates and health factors.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Base Network
                    </h4>
                    <p>
                      Built for Base - Coinbase's L2 solution for fast, low-cost
                      DeFi interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>
                &copy; 2025 Base Yield Dashboard. Built for the Base ecosystem.
              </p>
              <p className="mt-2">
                Data sourced from Base network •
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 ml-1"
                >
                  Privacy Policy
                </a>{" "}
                •
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 ml-1"
                >
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
