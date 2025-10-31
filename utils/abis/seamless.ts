// Seamless Protocol ABI - Main functions for getting user account data
export const SEAMLESS_ABI = [
  "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  "function getUserConfiguration(address user) view returns (uint256 data)",
  "function getReservesList() view returns (address[] memory)",
  "function getReserveData(address asset) view returns (uint256 configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, uint16 id, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint128 accruedToTreasury, uint128 unbacked, uint128 isolationModeTotalDebt)",
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
  "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) returns (uint256)",
  "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
] as const;

// aToken ABI for getting user balances in lending pools
export const ATOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function scaledBalanceOf(address user) view returns (uint256)",
  "function getScaledUserBalanceAndSupply(address user) view returns (uint256, uint256)",
] as const;

// Debt token ABI for getting user borrow amounts
export const DEBT_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function scaledBalanceOf(address user) view returns (uint256)",
] as const;
