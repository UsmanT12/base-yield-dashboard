# Base Yield Dashboard

A comprehensive DeFi portfolio dashboard for the Base network that allows users to track their token balances, lending positions, and yield farming opportunities in one place.

## 🚀 Features

- **Wallet Connection**: Connect via MetaMask, Coinbase Wallet, and other popular wallets
- **Token Balances**: Real-time ERC-20 token balances (ETH, USDC, AERO, etc.)
- **Seamless Protocol Integration**: View lending and borrowing positions with APY rates
- **Health Factor Monitoring**: Track your position health and liquidation risk
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Base Network Optimized**: Built specifically for Base L2 for fast, low-cost transactions

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Blockchain**: wagmi, ethers.js, RainbowKit
- **Network**: Base (Mainnet & Sepolia Testnet)
- **Data**: Direct on-chain contract calls

## 📁 Project Structure

```
base-yield-dashboard/
├── pages/
│   ├── index.tsx          # Main dashboard page
│   └── _app.tsx           # App configuration with providers
├── components/
│   ├── WalletConnect.tsx  # Wallet connection component
│   ├── TokenCard.tsx      # Token balances display
│   └── YieldCard.tsx      # Lending positions display
├── utils/
│   ├── config.ts          # Network and contract configuration
│   ├── fetchBalances.ts   # Token balance utilities
│   ├── seamless.ts        # Seamless Protocol integration
│   └── abis/
│       ├── erc20.ts       # ERC-20 token ABI
│       └── seamless.ts    # Seamless Protocol ABIs
├── styles/
│   └── globals.css        # Global styles with TailwindCSS
└── package.json
```

## 🔧 Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd base-yield-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Environment Variables

| Variable                                | Description                              | Required |
| --------------------------------------- | ---------------------------------------- | -------- |
| `NEXT_PUBLIC_BASE_RPC_URL`              | Base network RPC endpoint                | ✅       |
| `NEXT_PUBLIC_ALCHEMY_API_KEY`           | Alchemy API key for enhanced performance | ❌       |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID                 | ✅       |

### Getting API Keys

1. **Alchemy API Key**: Sign up at [alchemy.com](https://alchemy.com) and create a Base app
2. **WalletConnect Project ID**: Create a project at [cloud.walletconnect.com](https://cloud.walletconnect.com)

## 📊 Supported Protocols

- **Token Balances**: ETH, USDC, WETH, AERO
- **Seamless Protocol**: Lending and borrowing positions
- **Base Network**: Optimized for Base L2

## 🔐 Security Features

- **Read-only Operations**: Dashboard only reads blockchain data, never requests signatures for transactions
- **No Private Key Storage**: Uses standard wallet connection without storing sensitive information
- **Direct Contract Calls**: Fetches data directly from verified smart contracts

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues & Limitations

- **Price Data**: USD values not yet implemented (requires price API integration)
- **LP Positions**: Aerodrome/Uniswap LP tracking planned for future releases
- **Transaction History**: Not included in current MVP

## 🔮 Roadmap

- [ ] Add token price integration (CoinGecko API)
- [ ] Implement Aerodrome LP position tracking
- [ ] Add Uniswap V3 position monitoring
- [ ] Include transaction history
- [ ] Add portfolio performance analytics
- [ ] Support for additional Base protocols

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the Base ecosystem**
