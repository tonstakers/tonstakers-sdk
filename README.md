# Tonstakers SDK

The Tonstakers SDK is a comprehensive tool designed for developers who wish to integrate staking functionalities within their applications on the TON blockchain. It simplifies the process of staking and unstaking operations, making it more accessible for developers to connect with the TON ecosystem.

## Features

- Staking and unstaking operations
- Balance retrieval for staked assets

## Installation

You can install the Tonstakers SDK either by using a package manager like npm or yarn, or directly in your HTML file via a `<script>` tag.

### Using npm or yarn

```bash
npm install tonstakers-sdk
# or
yarn add tonstakers-sdk
```

### Using a `<script>` tag

Alternatively, you can include the Tonstakers SDK directly in your HTML file:

```html
<script src="path/to/tonstakers-sdk.min.js"></script>
```

Ensure to replace `"path/to/tonstakers-sdk.min.js"` with the actual path to the SDK.

## Usage

### In a Module Environment

First, initialize the SDK with your connector and optional referral code:

```javascript
import { Tonstakers } from "tonstakers-sdk";

const tonstakers = new Tonstakers({
  connector: yourWalletConnector, // Your wallet connector instance
  referralCode: 123456, // Optional referral code
});
```

### In a Browser Environment

Include the SDK and initialize it directly in your HTML file:

```html
<script src="path/to/tonstakers-sdk.min.js"></script>
<script>
  const tonstakers = new TonstakersSDK.Tonstakers({
    connector: yourWalletConnector,
    referralCode: 123456,
  });
</script>
```

Listen for the SDK to initialize:

```javascript
tonstakers.addEventListener("initialized", () => {
  console.log("Tonstakers SDK initialized successfully.");
});
```

Perform staking and unstaking operations:

```javascript
await tonstakers.stake(1); // Stake 1 TON
await tonstakers.unstake(1); // Unstake 1 TON
```

Retrieve the balance of staked assets:

```javascript
const balance = await tonstakers.getBalance();
console.log(`Current staked balance: ${balance}`);
```

## Demo

A demo HTML page is provided to showcase how the SDK can be integrated into a web application. It demonstrates connecting a wallet, staking, unstaking, and refreshing balances.
