# Taostats SDK

Taostats SDK for Bittensor.

## Requirements

- **Node.js**: v22.3.0 or higher (required for WebSocket functionality)
  - If using nvm: `nvm use` (uses the version specified in `.nvmrc`)
  - If using Node.js v22.1.0, you may encounter WebSocket connection issues

## Installation

```bash
npm install @taostats/sdk
# or
yarn add @taostats/sdk
# or
pnpm add @taostats/sdk
```

## Usage

### Full API Access (requires API key)
[Get your Taostats API key here](https://docs.taostats.io/docs/the-taostats-api)

```typescript
import { TaoStatsClient } from '@taostats/sdk';

// Initialize the client with API key for full access
const client = new TaoStatsClient({
  apiKey: 'your_taostats-api_key'
});

// Core API methods
const health = await client.getHealth();

// Modular API access
const taoPrice = await client.taoPrices.getTaoPrice();
const tradingData = await client.tradingView.getTradingViewHistory({...});
const slippage = await client.delegations.getSlippage({...});
const account = await client.accounts.getAccount('address');

// Blockchain operations also work
const transferResult = await client.transfer.tao({
  to: 'recipient_address',
  amount: '1.0'
});
```

### Blockchain-Only Usage (with custom RPC)

```typescript
import { TaoStatsClient } from '@taostats/sdk';

// Initialize client for blockchain operations with custom RPC
const client = new TaoStatsClient({
  rpcUrl: 'your custom RPC URL' // Custom RPC URL
  // No apiKey needed when using custom RPC for blockchain operations
});

// Use multiple wallets by initializing multiple clients with different TAO_ACCOUNT_SEED or TAO_ACCOUNT_PRIVATE_KEY
const client_1 = new TaoStatsClient({
  seed:process.env.TAO_ACCOUNT_SEED_1  //(or)
  privateKey:process.env.TAO_ACCOUNT_PRIVATE_KEY_1 
});
const client_2 = new TaoStatsClient({
  seed:process.env.TAO_ACCOUNT_SEED_2  //(or)
  privateKey:process.env.TAO_ACCOUNT_PRIVATE_KEY_2 
});

// If seed or privateKey is not provided at the initialization the fallback is to have TAO_ACCOUNT_SEED or TAO_ACCOUNT_PRIVATE_KEY in .env file for blockchain operations

// Transfer operations work with custom RPC
const fee = await client.utils.estimateTransferFee('destination_address', '1.0');
const isValid = client.utils.validateAddress('address');
const transferResult = await client.transfer.tao({
  to: 'recipient_address',
  amount: '1.0'
});

// TaoStats API calls will fail with helpful error message
// await client.taoPrices.getTaoPrice(); // ❌ Requires API key
```

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm test

# Run linting
pnpm run lint
```

## Running Examples

There are several ways to run the provided examples:

### Method 1: Using ts-node (Recommended)

```bash
# Install dependencies first
pnpm install

# Run the basic usage example directly
pnpm run example

# Run the modular structure example
pnpm run example:modular

# Or run ts-node directly
pnpm dlx ts-node examples/basic-usage.ts
pnpm dlx ts-node examples/modular-usage.ts
```

### Method 2: Compile and Run

```bash
# Install dependencies
pnpm install

# Build the project and run compiled example
pnpm run example:compiled

# Or manually:
pnpm run build
node dist/examples/basic-usage.js
```

### Method 3: Set up environment variables

You can create a `.env` file in the project root to store your API key:

```bash
# Copy the example file and edit it
cp .env.example .env

# Edit the .env file to add your actual API key
TAOSTATS_API_KEY=your-actual-api-key-here

```

```typescript
import { TaoStatsClient } from '@taostats/sdk';

// Initialize the client with API key for full access
const client = new TaoStatsClient({
  apiKey: process.env.TAOSTATS_API_KEY
});

```

**Note:** The `.env` file is already included in `.gitignore` so your API key won't be committed to version control.

### Creating Custom Examples

You can create your own example files in the `examples/` directory and run them with:

```bash
pnpm dlx ts-node examples/your-example.ts
```

## API Documentation

This SDK provides a TypeScript/JavaScript interface for Bittensor.

## Architecture

The SDK is organized into modules for better code organization and maintainability:

### API Modules (require API key)
- **`client.accounts`** - Account information, balances, and transactions
- **`client.chain`** - Blockchain data including blocks, extrinsics, events, and network statistics
- **`client.delegations`** - Delegation/staking data, slippage calculations, and stake balances
- **`client.live`** - Real-time blockchain data and live network information
- **`client.metagraph`** - Metagraph data including miner incentive distributions
- **`client.subnets`** - Subnet data, registration, pricing, and comprehensive analytics
- **`client.taoPrices`** - TAO price and market data endpoints
- **`client.tradingView`** - TradingView UDF history data for subnets
- **`client.validators`** - Validator data, Parent/Child Hotkey data, performance, weights, alpha shares and yield

### Blockchain Modules (require API key by default, or custom RPC URL)
- **`client.move`** - Move staked tokens between hotkeys and subnets
- **`client.stake`** - Staking operations to validators and subnets
- **`client.transfer`** - TAO and Alpha token transfers via blockchain
- **`client.unstake`** - Unstaking operations from validators and subnets

Each module contains:
- **Typed interfaces** for all request/response data
- **Comprehensive methods** for the respective API endpoints
- **Full TypeScript support** with intellisense and type checking

## Awesome Taostats

Want to see what people are building with Taostats? Want to share your product? [Awesome Taostats](https://github.com/taostat/awesome-taostats) is a listing of products built with our API.
