import { TokenBalance, formatUsdValue } from "@/utils/fetchBalances";

interface TokenCardProps {
  balances: TokenBalance[];
  isLoading?: boolean;
}

export default function TokenCard({
  balances,
  isLoading = false,
}: TokenCardProps) {
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Token Balances</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Token Balances</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <p className="text-gray-500">No tokens found</p>
          <p className="text-sm text-gray-400">
            Connect your wallet and add some tokens to get started
          </p>
        </div>
      </div>
    );
  }

  const totalValue = balances.reduce(
    (sum, balance) => sum + (balance.usdValue || 0),
    0
  );

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Token Balances</h3>
        {totalValue > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-lg font-bold text-gray-900">
              {formatUsdValue(totalValue)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {balances.map((balance, index) => (
          <div
            key={`${balance.token}-${index}`}
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {balance.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{balance.symbol}</p>
                <p className="text-sm text-gray-500">
                  {balance.symbol === "ETH" ? "Ethereum" : balance.symbol}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {balance.balanceFormatted} {balance.symbol}
              </p>
              {balance.usdValue && (
                <p className="text-sm text-gray-500">
                  {formatUsdValue(balance.usdValue)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Showing {balances.length} token{balances.length !== 1 ? "s" : ""}
          </span>
          <span>Base Network</span>
        </div>
      </div>
    </div>
  );
}
