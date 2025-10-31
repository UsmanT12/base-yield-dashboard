import { base, baseSepolia } from "wagmi/chains";

export const NETWORKS = {
  base: base,
  baseSepolia: baseSepolia,
} as const;

export const BASE_RPC_URL =
  process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Contract Addresses on Base Mainnet
export const CONTRACT_ADDRESSES = {
  // ERC-20 Tokens
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  WETH: "0x4200000000000000000000000000000000000006",
  AERO: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",

  // Seamless Protocol (example addresses - verify these)
  SEAMLESS_POOL: "0x8F44Fd754285aa6A2b8B9B97739B79746e0475a7", // Main pool contract
  SEAMLESS_DATA_PROVIDER: "0x2A0979257105834789bC6b9E1B00446DFbA8dFBa", // Data provider

  // Aerodrome Finance
  AERODROME_ROUTER: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
  AERODROME_FACTORY: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
} as const;

// Base Sepolia Testnet addresses (for testing)
export const TESTNET_ADDRESSES = {
  USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  WETH: "0x4200000000000000000000000000000000000006",
  AERO: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", // Using mainnet address for testing

  // Seamless Protocol (testnet addresses - these may need to be updated)
  SEAMLESS_POOL: "0x8F44Fd754285aa6A2b8B9B97739B79746e0475a7",
  SEAMLESS_DATA_PROVIDER: "0x2A0979257105834789bC6b9E1B00446DFbA8dFBa",

  // Aerodrome Finance (testnet)
  AERODROME_ROUTER: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
  AERODROME_FACTORY: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
} as const;

export const CURRENT_NETWORK =
  process.env.NODE_ENV === "production" ? "base" : "baseSepolia";
export const CURRENT_ADDRESSES =
  CURRENT_NETWORK === "base" ? CONTRACT_ADDRESSES : TESTNET_ADDRESSES;

// API endpoints
export const SUBGRAPH_URLS = {
  AERODROME:
    "https://api.thegraph.com/subgraphs/name/aerodrome-finance/aerodrome",
  UNISWAP_V3: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-base",
} as const;
