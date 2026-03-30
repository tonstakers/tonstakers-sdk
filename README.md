
# Tonstakers SDK

The Tonstakers SDK offers an advanced set of tools for developers aiming to incorporate staking functionalities into their applications on the TON blockchain. It provides staking operations, balance inquiries, withdrawal tracking, and rate information for the tsTON liquid staking protocol.

## Features

- Staking and unstaking operations: standard, instant, and best-rate modes.
- Retrieval of staked balance, available balance, TVL (Total Value Locked), and stakers count.
- Current and historical APY (Annual Percentage Yield) for staked assets.
- Active withdrawal NFT tracking with estimated payout times.
- Instant liquidity and exchange rate queries.
- Optional API key configuration for higher tonapi rate limits.
- Event-driven architecture for initialization and deinitialization notifications.

## Installation

Tonstakers SDK can be easily installed using npm or yarn, or integrated directly into your HTML pages.

### Using npm or yarn

```bash
npm install tonstakers-sdk
# or
yarn add tonstakers-sdk
```

### Using a `<script>` tag

For direct HTML integration:

```html
<script src="path/to/tonstakers-sdk.min.js"></script>
```

Replace `"path/to/tonstakers-sdk.min.js"` with the actual SDK path.

## Usage

### In a Module Environment

Initialize the SDK with your wallet connector (usually a TonConnect instance) and optional parameters:

```typescript
import { Tonstakers, IWalletConnector } from "tonstakers-sdk";
import { TonConnectUI } from "@tonconnect/ui";

const tonConnectUI = new TonConnectUI({
  manifestUrl: MANIFEST_URL,
});

const tonstakers = new Tonstakers({
  connector: tonConnectUI,   // Required: TonConnect-compatible wallet connector
  partnerCode: 123456,       // Optional: your referral/partner code for attribution
  tonApiKey: "YOUR_API_KEY", // Optional: tonapi.io API key for higher rate limits
});
```

### In a Browser Environment

```html
<script src="path/to/tonstakers-sdk.min.js"></script>
<script>
  const { Tonstakers } = TonstakersSDK;

  const tonstakers = new Tonstakers({
    connector: yourWalletConnector,
    partnerCode: 123456,
    tonApiKey: "YOUR_API_KEY",
  });
</script>
```

The SDK exports `IWalletConnector` — the minimal interface a connector must satisfy. `TonConnectUI` from `@tonconnect/ui` and `TonConnect` from `@tonconnect/sdk` both satisfy it out of the box. You can also use it to type your own connector:

```typescript
import { IWalletConnector } from "tonstakers-sdk";

class MyConnector implements IWalletConnector {
  sendTransaction(tx) { ... }
  onStatusChange(callback) { ... }
}
```

### Constructor Options

| Option | Type | Required | Description |
|---|---|---|---|
| `connector` | `IWalletConnector` | Yes | TonConnect-compatible wallet connector |
| `partnerCode` | `number` | No | Partner/referral code embedded in stake transactions |
| `tonApiKey` | `string` | No | API key for [tonapi.io](https://tonapi.io) to increase rate limits |

### Public Properties

```typescript
tonstakers.ready      // boolean — true after the "initialized" event fires
tonstakers.isTestnet  // boolean — auto-detected from the connected wallet's chain
```

### Event Listeners

Wait for the SDK to be ready before calling any methods:

```javascript
tonstakers.addEventListener("initialized", () => {
  console.log("Tonstakers SDK initialized, ready:", tonstakers.ready);
  console.log("Testnet mode:", tonstakers.isTestnet);
});

tonstakers.addEventListener("deinitialized", () => {
  console.log("Wallet disconnected, SDK deinitialized.");
});
```

### Staking Operations

```javascript
import { toNano } from "@ton/core";

// Stake 1 TON — the SDK automatically adds a 1 TON fee reserve on top
await tonstakers.stake(toNano(1));

// Stake the maximum available balance (reserves 1.1 TON for fees automatically)
await tonstakers.stakeMax();
```

### Unstaking Operations

Three unstake modes are available depending on your needs:

```javascript
// Standard unstake — waits for the current staking round to end before payout
await tonstakers.unstake(toNano(1));

// Instant unstake — uses the pool's instant liquidity; fails if liquidity is insufficient
await tonstakers.unstakeInstant(toNano(1));

// Best-rate unstake — waits until round end to maximize the TON/tsTON exchange rate
await tonstakers.unstakeBestRate(toNano(1));
```

> All unstake methods send **1.05 TON** as gas on top of the tsTON amount. The input amount is in tsTON (use `toNano` for nanoton units).

| Method | Speed | Rate | Use when |
|---|---|---|---|
| `unstake()` | Next round | Standard | Default choice |
| `unstakeInstant()` | Immediate | Market rate | Need funds now, pool has liquidity |
| `unstakeBestRate()` | End of round | Optimal | Maximizing return is priority |

### Reading Balances and Rates

All balance methods return values in **nanoton** (1 TON = 1,000,000,000 nanoton). Use `fromNano()` from `@ton/core` to convert for display.

```javascript
import { fromNano } from "@ton/core";

// tsTON balance (in nanoton)
const stakedBalance = await tonstakers.getStakedBalance(); // number
console.log(`Staked: ${fromNano(stakedBalance)} tsTON`);

// Raw TON balance of the connected wallet (in nanoton)
const tonBalance = await tonstakers.getBalance(); // number
console.log(`TON balance: ${fromNano(tonBalance)} TON`);

// TON balance minus the 1.1 TON fee reserve — use this for stake UI (in nanoton)
const availableBalance = await tonstakers.getAvailableBalance(); // number
console.log(`Available for staking: ${fromNano(availableBalance)} TON`);

// Current APY as a percentage
const currentApy = await tonstakers.getCurrentApy(); // number
console.log(`Current APY: ${currentApy}%`);

// Historical APY data points
const historicalApy = await tonstakers.getHistoricalApy(); // ApyHistory[]
console.log(`Historical APY:`, historicalApy);

// Total Value Locked in the staking pool (in nanoton)
const tvl = await tonstakers.getTvl(); // number
console.log(`TVL: ${fromNano(tvl)} TON`);

// Number of active stakers
const stakersCount = await tonstakers.getStakersCount(); // number
console.log(`Stakers: ${stakersCount}`);

// Exchange rates
const rates = await tonstakers.getRates();
// rates: { TONUSD: number, tsTONTON: number, tsTONTONProjected: number }
console.log(`1 TON = ${rates.TONUSD} USD`);
console.log(`1 tsTON = ${rates.tsTONTON} TON`);
console.log(`Projected 1 tsTON = ${rates.tsTONTONProjected} TON`);

// Available instant liquidity in the staking contract (in nanoton)
const instantLiquidity = await tonstakers.getInstantLiquidity(); // number
console.log(`Instant liquidity: ${fromNano(instantLiquidity)} TON`);
```

### Active Withdrawal NFTs

When a user unstakes, they receive a withdrawal NFT representing their pending payout. Use `getActiveWithdrawalNFTs()` to track these:

```javascript
const activeWithdrawals = await tonstakers.getActiveWithdrawalNFTs();
// Returns NftItemWithEstimates[] — standard NftItem fields plus:
// - estimatedPayoutDateTime: number  — estimated Unix timestamp (seconds) of payout
// - roundEndTime: number             — Unix timestamp when the staking round ends
// - tsTONAmount: number              — tsTON amount being withdrawn

for (const nft of activeWithdrawals) {
  const payoutDate = new Date(nft.estimatedPayoutDateTime * 1000);
  console.log(`Withdrawal of ${nft.tsTONAmount} tsTON, estimated payout: ${payoutDate}`);
}
```

### Fee Summary

| Operation | Extra cost |
|---|---|
| `stake(amount)` | +1 TON added automatically |
| `unstake*(amount)` | +1.05 TON gas required |
| `getAvailableBalance()` | Returns balance minus 1.1 TON reserve |

## Testnet

Testnet is detected automatically from the connected wallet's chain ID. When `tonstakers.isTestnet === true`, the SDK switches to `testnet.tonapi.io` and the testnet staking contract. No additional configuration is needed.

## Demo

A demo HTML page is included with the SDK to demonstrate integration into web applications, showcasing wallet connection, staking/unstaking operations, and balance updates.
