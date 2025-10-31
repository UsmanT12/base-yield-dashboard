import { ethers } from "ethers";
import { ERC20_ABI } from "./abis/erc20";
import { CURRENT_ADDRESSES, BASE_RPC_URL } from "./config";

export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
  usdValue?: number;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

// Token information for Base network
export const BASE_TOKENS: TokenInfo[] = [
  {
    address: CURRENT_ADDRESSES.USDC,
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  {
    address: CURRENT_ADDRESSES.WETH,
    symbol: "WETH",
    decimals: 18,
    name: "Wrapped Ethereum",
  },
  {
    address: CURRENT_ADDRESSES.AERO,
    symbol: "AERO",
    decimals: 18,
    name: "Aerodrome Finance",
  },
];

// Create provider instance
const getProvider = () => {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
};

// Get ETH balance (native token)
export async function getEthBalance(address: string): Promise<TokenBalance> {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    const balanceFormatted = ethers.formatEther(balance);

    return {
      token: "ETH",
      symbol: "ETH",
      balance: balance.toString(),
      balanceFormatted: parseFloat(balanceFormatted).toFixed(6),
      decimals: 18,
    };
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    return {
      token: "ETH",
      symbol: "ETH",
      balance: "0",
      balanceFormatted: "0.000000",
      decimals: 18,
    };
  }
}

// Get ERC-20 token balance
export async function getTokenBalance(
  tokenAddress: string,
  userAddress: string,
  tokenInfo?: TokenInfo
): Promise<TokenBalance> {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Get token info if not provided
    let symbol = tokenInfo?.symbol;
    let decimals = tokenInfo?.decimals;

    if (!symbol || decimals === undefined) {
      const [fetchedSymbol, fetchedDecimals] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
      ]);
      symbol = fetchedSymbol;
      decimals = Number(fetchedDecimals);
    }

    const balance = await contract.balanceOf(userAddress);
    const balanceFormatted = ethers.formatUnits(balance, decimals);

    return {
      token: tokenAddress,
      symbol: symbol || "UNKNOWN",
      balance: balance.toString(),
      balanceFormatted: parseFloat(balanceFormatted).toFixed(6),
      decimals: decimals || 18,
    };
  } catch (error) {
    console.error(
      `Error fetching ${tokenInfo?.symbol || "token"} balance:`,
      error
    );
    return {
      token: tokenAddress,
      symbol: tokenInfo?.symbol || "UNKNOWN",
      balance: "0",
      balanceFormatted: "0.000000",
      decimals: tokenInfo?.decimals || 18,
    };
  }
}

// Get all token balances for a user
export async function getAllTokenBalances(
  userAddress: string
): Promise<TokenBalance[]> {
  try {
    const balancePromises = [
      getEthBalance(userAddress),
      ...BASE_TOKENS.map((token) =>
        getTokenBalance(token.address, userAddress, token)
      ),
    ];

    const balances = await Promise.all(balancePromises);

    // Filter out zero balances for cleaner display (optional)
    return balances.filter(
      (balance) => parseFloat(balance.balanceFormatted) > 0
    );
  } catch (error) {
    console.error("Error fetching all token balances:", error);
    return [];
  }
}

// Get specific token balances (useful for testing or specific tokens)
export async function getMultipleTokenBalances(
  tokenAddresses: string[],
  userAddress: string
): Promise<TokenBalance[]> {
  try {
    const balancePromises = tokenAddresses.map((tokenAddress) => {
      const tokenInfo = BASE_TOKENS.find(
        (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
      );
      return getTokenBalance(tokenAddress, userAddress, tokenInfo);
    });

    return await Promise.all(balancePromises);
  } catch (error) {
    console.error("Error fetching multiple token balances:", error);
    return [];
  }
}

// Utility function to format balance for display
export function formatBalance(
  balance: string,
  decimals: number,
  displayDecimals: number = 6
): string {
  const formatted = ethers.formatUnits(balance, decimals);
  return parseFloat(formatted).toFixed(displayDecimals);
}

// Utility function to format USD values (when price data is available)
export function formatUsdValue(usdValue: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue);
}
