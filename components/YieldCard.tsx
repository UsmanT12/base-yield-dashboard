import {
  SeamlessPosition,
  UserAccountData,
  calculateAPY,
  formatHealthFactor,
  getHealthFactorColor,
} from "@/utils/seamless";

interface YieldCardProps {
  positions: SeamlessPosition[];
  accountData: UserAccountData | null;
  isLoading?: boolean;
}

export default function YieldCard({
  positions,
  accountData,
  isLoading = false,
}: YieldCardProps) {
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Lending & Borrowing
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasPositions = positions.length > 0;
  const totalSupplied = positions.reduce(
    (sum, pos) => sum + parseFloat(pos.suppliedAmountFormatted),
    0
  );
  const totalBorrowed = positions.reduce(
    (sum, pos) => sum + parseFloat(pos.borrowedAmountFormatted),
    0
  );

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-gray-900">
        Lending & Borrowing
      </h3>

      {/* Account Summary */}
      {accountData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Total Supplied</p>
            <p className="text-xl font-bold text-green-900">
              ${totalSupplied.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Total Borrowed</p>
            <p className="text-xl font-bold text-red-900">
              ${totalBorrowed.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">Health Factor</p>
            <p
              className={`text-xl font-bold ${getHealthFactorColor(
                accountData.healthFactorFormatted
              )}`}
            >
              {formatHealthFactor(accountData.healthFactorFormatted)}
            </p>
          </div>
        </div>
      )}

      {!hasPositions ? (
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-gray-500">No lending positions found</p>
          <p className="text-sm text-gray-400">
            Start supplying or borrowing on Seamless Protocol to see your
            positions here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div
              key={`${position.asset}-${index}`}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">
                      {position.symbol.charAt(0)}
                    </span>
                  </div>
                  {position.symbol}
                </h4>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Net Position</p>
                  <p
                    className={`font-semibold ${
                      parseFloat(position.suppliedAmountFormatted) >
                      parseFloat(position.borrowedAmountFormatted)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {(
                      parseFloat(position.suppliedAmountFormatted) -
                      parseFloat(position.borrowedAmountFormatted)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Supplied */}
                {parseFloat(position.suppliedAmountFormatted) > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-green-700">
                        Supplied
                      </span>
                      <span className="text-sm text-green-600">
                        {calculateAPY(position.currentLiquidityRate).toFixed(2)}
                        % APY
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-900">
                      {position.suppliedAmountFormatted} {position.symbol}
                    </p>
                  </div>
                )}

                {/* Borrowed */}
                {parseFloat(position.borrowedAmountFormatted) > 0 && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-red-700">
                        Borrowed
                      </span>
                      <span className="text-sm text-red-600">
                        {calculateAPY(
                          position.currentVariableBorrowRate
                        ).toFixed(2)}
                        % APY
                      </span>
                    </div>
                    <p className="text-lg font-bold text-red-900">
                      {position.borrowedAmountFormatted} {position.symbol}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasPositions && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Seamless Protocol</span>
            <span>
              {positions.length} position{positions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
