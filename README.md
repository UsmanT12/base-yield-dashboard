# Base Yield Dashboard

A minimal DeFi portfolio dashboard for the Base network (MVP). It reads on-chain data directly and displays token balances, Seamless lending/borrowing positions, and LP/DEX-related info where available.

This repository contains the working MVP and developer tooling. The app is built with Next.js + TypeScript and uses wagmi, RainbowKit and ethers for wallet/connect and on-chain reads.

---

## What I implemented (status)

- Wallet connection via RainbowKit (MetaMask, Coinbase Wallet, WalletConnect). The wallet button is dynamically imported client-side to avoid hydration issues.
- ERC-20 balance fetching for ETH (native), USDC, WETH and AERO using ethers.js.
- Seamless Protocol integration: fetches user account snapshot and reserve positions (supply / borrow) on-chain.
- Provider singleton and retry/timeouts: uses a single provider instance and simple retry/backoff logic to reduce RPC rate-limit issues.
- Health Factor formatting: large/infinite values are shown as `∞`, small values are clamped, and color-coded risk indicator is provided.
- TailwindCSS for styling and basic component cards (TokenCard, YieldCard).
- Basic logging and debugging helpers in the data fetch utilities to help diagnose RPC issues.

Status: functional MVP — wallet connect, token balances and Seamless positions fetch correctly in most cases. Some features (price USD conversion, Uniswap/Aerodrome LP parsing) are TODO.

---

## Quick Start (local development)

Prerequisites:

- Node.js >= 18
- npm (or yarn)

1. Clone and install

```bash
git clone https://github.com/usmant12/base-yield-dashboard.git
cd base-yield-dashboard
npm install
```

2. Add environment variables

```bash
cp .env.example .env.local
# edit .env.local and add your keys
```

Important: `.env.local` is listed in `.gitignore` so your keys won't be committed.

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment variables

Set these in `.env.local` for local development and in your hosting provider (Vercel) for production:

- `NEXT_PUBLIC_BASE_RPC_URL` — Base RPC endpoint (public or Alchemy)
- `NEXT_PUBLIC_ALCHEMY_API_KEY` — optional, improves reliability/performance
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` — WalletConnect project id

Note: Keep private keys and server-side secrets out of `NEXT_PUBLIC_` variables; those are visible to the client.

---

## Deployment (Vercel recommended)

1. Push repo to GitHub (if not already)
2. Create a new Vercel project → Import from GitHub
3. During import, set the **Project Name** (this is just Vercel's project name and can differ from the GitHub repo name). Make sure you select the correct repository to deploy from (do **not** create a new GitHub repo from Vercel unless you want one).
4. Add environment variables in Vercel (same keys as `.env.local`)
5. Deploy; every push to the connected branch (usually `main`) will trigger a new build and deployment.

---

## Security & best practices

- `.env.local` is ignored by git; do not commit secrets.
- Use Vercel/Netlify environment variables for production secrets.
- Run `npm audit` regularly and keep dependencies updated.
- This app performs only read-only on-chain calls; there is no private key or server-side signing.

Suggested local security commands:

```bash
npm run security:check
npm audit
```

---

## Troubleshooting

- Hydration errors ("Expected server HTML to contain a matching <button>") — solved by dynamically importing RainbowKit's `ConnectButton` on the client (`ssr: false`) and rendering a matching placeholder during SSR.
- WalletConnect QR appears instead of browser wallet — choose the injected/wallet-specific option (MetaMask/Coinbase) if you have an extension installed. WalletConnect is intended for mobile wallets or external apps.
- "No lending positions found" after refresh — this can happen due to RPC timeouts or rate limits. The app now uses a provider singleton + retry/backoff logic and logs fetch attempts. Check the browser console for messages like `Fetching Seamless data for ... attempt X`.

If you see repeated failures, consider:

1. Using an Alchemy (or other) API key for a more reliable RPC endpoint
2. Checking network selection in your wallet (Base network required)

---

## Developer notes / implemented details

- `pages/_app.tsx` — wagmi + RainbowKit setup, Alchemy + public provider configuration and React Query provider.
- `components/WalletConnect.tsx` — client-only dynamic import of `ConnectButton` to avoid SSR hydration mismatch and display of the connected address.
- `utils/fetchBalances.ts` — ethers-based token balance utilities (native ETH and ERC-20 tokens). Includes safe fallbacks for symbol/decimals.
- `utils/seamless.ts` — Seamless integration: `getUserAccountData`, `getReserveData`, `getUserSeamlessPositions`. Uses a provider singleton, timeouts, retries, and improved logging. Also formatted health factor handling.
- `components/YieldCard.tsx` & `components/TokenCard.tsx` — UI cards for Lending and Token balances with loading placeholders.

---

## Next Steps (suggested)

- Add price data (CoinGecko) to show USD values and portfolio totals
- Implement Aerodrome / Uniswap LP position fetching and presentation
- Add more robust caching (server-side or edge caching) if RPC limits persist
- Add end-to-end tests and unit tests for data parsing utilities

---

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production server
npm run lint     # lint project
npm run security:check  # run npm audit + lint
```

---

If you want, I can also:

- Prepare a small PR that adds CoinGecko price integration (fetch and cache prices)
- Add simple unit tests around the health factor formatting and APY calculations

If anything is missing or you'd like the README to emphasize other details (custom domain instructions, Sentry integration, or CI), tell me which sections to expand.

---

**Built with ❤️ for the Base ecosystem**
