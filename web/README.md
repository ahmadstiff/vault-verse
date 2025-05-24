# VaultVerse

A programmable vault for your Sui assets. Create, customize, and share your vaults with friends.

![VaultVerse](public/logo.png)

## Features

- **Vault Creation and Customization**: Create personalized vaults for your digital assets and customize them to your preferences.
- **Asset Management**: Securely store and manage your Sui blockchain assets in one place.
- **NFT Features**: Special support for NFT storage, display, and management.
- **Multi-wallet Support**: Connect and manage assets from multiple wallet providers.
- **Transaction Handling**: Streamlined transaction experience for deposits, withdrawals, and transfers.
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices.

## Tech Stack

VaultVerse is built with modern web technologies:

- **Frontend**:
  - React 18.3.1
  - TypeScript 5.6.3
  - Vite 5.2.0
  - Tailwind CSS 3.4.16
  - HeroUI component library

- **Blockchain Integration**:
  - Sui Blockchain
  - @mysten/dapp-kit
  - @mysten/sui
  - TanStack React Query for data fetching
  - Viem for Ethereum provider interfaces

- **Styling and Animation**:
  - Framer Motion
  - Tailwind Variants
  - clsx and tailwind-merge for class composition

## Installation

### Prerequisites

- Node.js (v16 or later)
- pnpm 10.11.0 or later

### Setup

1. Clone the repository:

```bash
git clone https://github.com/koalaterbang/hackathon/sui/magic.git
cd sui/magic/web
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with your configuration (see `.env.example` for reference)

## Development

VaultVerse provides several commands for development and building:

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## Project Structure

```
web/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── vault/     # Vault-specific components
│   │   ├── wallet/    # Wallet connection components
│   │   └── modals/    # Modal components
│   ├── config/        # Application configuration
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Page layouts
│   ├── lib/           # Utility functions and constants
│   ├── pages/         # Application pages
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   └── provider.tsx   # Global providers
├── .env               # Environment variables
├── index.html         # HTML entry point
├── package.json       # Project dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [GitHub](https://github.com/koalaterbang/hackathon/sui/degen)
- [Twitter](https://twitter.com/degen_meme_finance)
- [Discord](https://discord.gg/degenmemefinance)

