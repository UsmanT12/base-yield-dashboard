import { ethers } from "ethers";
import { SEAMLESS_ABI, ATOKEN_ABI, DEBT_TOKEN_ABI } from "./abis/seamless";
import { CURRENT_ADDRESSES, BASE_RPC_URL } from "./config";

export interface SeamlessPosition {
  asset: string;
  symbol: string;
  suppliedAmount: string;
  suppliedAmountFormatted: string;
  borrowedAmount: string;
  borrowedAmountFormatted: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  currentLiquidityRate: string;
  currentVariableBorrowRate: string;
  decimals: number;
}

export interface UserAccountData {
  totalCollateralBase: string;
  totalDebtBase: string;
  availableBorrowsBase: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
  healthFactorFormatted: string;
}

// Create provider instance
const getProvider = () => {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
};

// Get user's account data from Seamless Protocol
export async function getUserAccountData(
  userAddress: string
): Promise<UserAccountData | null> {
  try {
    const provider = getProvider();
    const seamlessContract = new ethers.Contract(
      CURRENT_ADDRESSES.SEAMLESS_POOL,
      SEAMLESS_ABI,
      provider
    );

    const accountData = await seamlessContract.getUserAccountData(userAddress);

    // accountData returns: totalCollateralBase, totalDebtBase, availableBorrowsBase,
    // currentLiquidationThreshold, ltv, healthFactor
    const [
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    ] = accountData;

    return {
      totalCollateralBase: totalCollateralBase.toString(),
      totalDebtBase: totalDebtBase.toString(),
      availableBorrowsBase: availableBorrowsBase.toString(),
      currentLiquidationThreshold: currentLiquidationThreshold.toString(),
      ltv: ltv.toString(),
      healthFactor: healthFactor.toString(),
      healthFactorFormatted: ethers.formatUnits(healthFactor, 18),
    };
  } catch (error) {
    console.error("Error fetching user account data:", error);
    return null;
  }
}

// Get reserve data for a specific asset
export async function getReserveData(assetAddress: string) {
  try {
    const provider = getProvider();
    const seamlessContract = new ethers.Contract(
      CURRENT_ADDRESSES.SEAMLESS_POOL,
      SEAMLESS_ABI,
      provider
    );

    const reserveData = await seamlessContract.getReserveData(assetAddress);

    // Returns configuration, liquidityIndex, currentLiquidityRate, etc.
    return {
      configuration: reserveData[0],
      liquidityIndex: reserveData[1],
      currentLiquidityRate: reserveData[2],
      variableBorrowIndex: reserveData[3],
      currentVariableBorrowRate: reserveData[4],
      currentStableBorrowRate: reserveData[5],
      lastUpdateTimestamp: reserveData[6],
      id: reserveData[7],
      aTokenAddress: reserveData[8],
      stableDebtTokenAddress: reserveData[9],
      variableDebtTokenAddress: reserveData[10],
      interestRateStrategyAddress: reserveData[11],
    };
  } catch (error) {
    console.error("Error fetching reserve data:", error);
    return null;
  }
}

// Get user's supplied amount for a specific asset
export async function getUserSuppliedAmount(
  userAddress: string,
  assetAddress: string,
  aTokenAddress: string,
  decimals: number = 18
): Promise<string> {
  try {
    const provider = getProvider();
    const aTokenContract = new ethers.Contract(
      aTokenAddress,
      ATOKEN_ABI,
      provider
    );

    const balance = await aTokenContract.balanceOf(userAddress);
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error fetching supplied amount:", error);
    return "0";
  }
}

// Get user's borrowed amount for a specific asset
export async function getUserBorrowedAmount(
  userAddress: string,
  assetAddress: string,
  debtTokenAddress: string,
  decimals: number = 18
): Promise<string> {
  try {
    const provider = getProvider();
    const debtTokenContract = new ethers.Contract(
      debtTokenAddress,
      DEBT_TOKEN_ABI,
      provider
    );

    const balance = await debtTokenContract.balanceOf(userAddress);
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error fetching borrowed amount:", error);
    return "0";
  }
}

// Get all user positions on Seamless Protocol
export async function getUserSeamlessPositions(
  userAddress: string
): Promise<SeamlessPosition[]> {
  try {
    const provider = getProvider();
    const seamlessContract = new ethers.Contract(
      CURRENT_ADDRESSES.SEAMLESS_POOL,
      SEAMLESS_ABI,
      provider
    );

    // Get list of all reserves
    const reservesList = await seamlessContract.getReservesList();

    const positions: SeamlessPosition[] = [];

    // Check positions for each reserve
    for (const assetAddress of reservesList) {
      const reserveData = await getReserveData(assetAddress);

      if (reserveData) {
        // Get token symbol and decimals (simplified - in production you'd cache this)
        let symbol = "UNKNOWN";
        let decimals = 18;

        // Map known tokens
        if (
          assetAddress.toLowerCase() === CURRENT_ADDRESSES.USDC.toLowerCase()
        ) {
          symbol = "USDC";
          decimals = 6;
        } else if (
          assetAddress.toLowerCase() === CURRENT_ADDRESSES.WETH.toLowerCase()
        ) {
          symbol = "WETH";
          decimals = 18;
        }

        const [suppliedAmount, borrowedAmount] = await Promise.all([
          getUserSuppliedAmount(
            userAddress,
            assetAddress,
            reserveData.aTokenAddress,
            decimals
          ),
          getUserBorrowedAmount(
            userAddress,
            assetAddress,
            reserveData.variableDebtTokenAddress,
            decimals
          ),
        ]);

        // Only include positions with non-zero amounts
        if (parseFloat(suppliedAmount) > 0 || parseFloat(borrowedAmount) > 0) {
          positions.push({
            asset: assetAddress,
            symbol,
            suppliedAmount: ethers
              .parseUnits(suppliedAmount, decimals)
              .toString(),
            suppliedAmountFormatted: parseFloat(suppliedAmount).toFixed(6),
            borrowedAmount: ethers
              .parseUnits(borrowedAmount, decimals)
              .toString(),
            borrowedAmountFormatted: parseFloat(borrowedAmount).toFixed(6),
            aTokenAddress: reserveData.aTokenAddress,
            variableDebtTokenAddress: reserveData.variableDebtTokenAddress,
            currentLiquidityRate: ethers.formatUnits(
              reserveData.currentLiquidityRate,
              27
            ), // Rate in ray units
            currentVariableBorrowRate: ethers.formatUnits(
              reserveData.currentVariableBorrowRate,
              27
            ),
            decimals,
          });
        }
      }
    }

    return positions;
  } catch (error) {
    console.error("Error fetching Seamless positions:", error);
    return [];
  }
}

// Calculate estimated APY from rate (ray units = 27 decimals)
export function calculateAPY(rate: string): number {
  try {
    const ratePerSecond = parseFloat(ethers.formatUnits(rate, 27));
    const secondsPerYear = 365 * 24 * 60 * 60;
    const apy = Math.pow(1 + ratePerSecond, secondsPerYear) - 1;
    return apy * 100; // Return as percentage
  } catch (error) {
    console.error("Error calculating APY:", error);
    return 0;
  }
}

// Format health factor for display
export function formatHealthFactor(healthFactor: string): string {
  const hf = parseFloat(healthFactor);

  // Handle edge cases
  if (hf === 0 || !isFinite(hf) || isNaN(hf)) return "∞";

  // Very large numbers (essentially infinite)
  if (hf > 1000000) return "∞";

  // Very small numbers (liquidation risk)
  if (hf < 0.001) return "0.001";

  // Normal formatting
  if (hf < 1) return hf.toFixed(3);
  if (hf < 10) return hf.toFixed(2);
  if (hf < 100) return hf.toFixed(1);

  // Large but finite numbers
  return Math.floor(hf).toString();
}

// Get health factor color based on risk level
export function getHealthFactorColor(healthFactor: string): string {
  const hf = parseFloat(healthFactor);

  // Handle edge cases - very large numbers or no debt
  if (hf === 0 || !isFinite(hf) || isNaN(hf) || hf > 1000000) {
    return "text-green-600"; // No debt or extremely safe
  }

  if (hf >= 2) return "text-green-600"; // Safe
  if (hf >= 1.5) return "text-yellow-600"; // Moderate risk
  if (hf >= 1.1) return "text-orange-600"; // High risk
  return "text-red-600"; // Liquidation risk
}
