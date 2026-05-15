// Timing-related constants
export const TIMING = {
  DEFAULT_INTERVAL: 5000,
  TIMEOUT: 600000,
  CACHE_TIMEOUT: 30000,
  ESTIMATED_TIME_BW_TX_S: 3,
  ESTIMATED_TIME_AFTER_ROUND_S: 10 * 60,
};

// Blockchain-related constants
export const BLOCKCHAIN = {
  CHAIN_DEV: "-3",
  API_URL: "https://tonapi.io",
  API_URL_TESTNET: "https://testnet.tonapi.io",
};

// Contract-related constants
export const CONTRACT = {
  STAKING_CONTRACT_ADDRESS: "EQCkWxfyhAkim3g2DjKQQg8T5P4g-Q1-K_jErGcDJZ4i-vqR",
  STAKING_CONTRACT_ADDRESS_TESTNET: "kQANFsYyYn-GSZ4oajUJmboDURZU-udMHf9JxzO4vYM_hFP3",
  PARTNER_CODE: 0x000000106796caef,
  PAYLOAD_UNSTAKE: 0x595f07bc,
  PAYLOAD_STAKE: 0x47d54391,
  STAKE_FEE_RES: 1,
  UNSTAKE_FEE_RES: 1.05,
  RECOMMENDED_FEE_RESERVE: 1.1,
};

// Multisig v2 (ton-blockchain/multisig-contract-v2) constants
export const MULTISIG = {
  OP_NEW_ORDER: 0xf718510f,
  OP_EXECUTE: 0x75097f5d,
  OP_ORDER_INIT: 0x9c73fba2,
  OP_ORDER_APPROVE: 0xa762230f,
  ACTION_SEND_MESSAGE: 0xf1381e5b,
  ACTION_UPDATE_PARAMS: 0x1d0cfbd3,
  ARBITRARY_SEQNO: BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  ),
  DEFAULT_DEPLOY_VALUE: "0.5",
  DEFAULT_EXPIRATION_SECONDS: 24 * 60 * 60,
  TX_LOOKUP_DEFAULT_LIMIT: 50,
};
