import { Address as c, toNano as i, beginCell as l } from "@ton/core";
import { HttpClient as p, Api as E } from "tonapi-sdk-js";
const d = {
  DEFAULT_INTERVAL: 5e3,
  TIMEOUT: 6e5,
  CACHE_TIMEOUT: 3e4
}, h = {
  CHAIN_DEV: "-3",
  API_URL: "https://tonapi.io",
  API_URL_TESTNET: "https://testnet.tonapi.io"
}, a = {
  STAKING_CONTRACT_ADDRESS: "EQCkWxfyhAkim3g2DjKQQg8T5P4g-Q1-K_jErGcDJZ4i-vqR",
  STAKING_CONTRACT_ADDRESS_TESTNET: "kQANFsYyYn-GSZ4oajUJmboDURZU-udMHf9JxzO4vYM_hFP3",
  REFERRAL_CODE: 70457412335,
  PAYLOAD_UNSTAKE: 1499400124,
  PAYLOAD_STAKE: 1205158801,
  STAKE_FEE_RES: 1,
  UNSTAKE_FEE_RES: 1.05,
  RECOMMENDED_FEE_RESERVE: 1.1
};
class A {
  constructor(t) {
    this.store = {}, this.ttl = t;
  }
  get time() {
    return Date.now();
  }
  needsUpdate(t) {
    const e = this.store[t];
    return e ? this.time - e.ts >= this.ttl : !0;
  }
  async get(t) {
    return this.store[t].data;
  }
  set(t, e) {
    this.store[t] = {
      ts: this.time,
      data: e
    };
  }
}
class n extends EventTarget {
  constructor({
    connector: t,
    referralCode: e = a.REFERRAL_CODE,
    tonApiKey: o,
    cacheFor: s
  }) {
    super(), this.connector = t, this.referralCode = e, this.tonApiKey = o, this.cache = new A(
      s === void 0 ? d.CACHE_TIMEOUT : s
    ), this.setupClient(), this.initialize().catch((r) => {
      console.error("Initialization error:", r);
    });
  }
  async setupClient() {
    const t = this.tonApiKey ? {
      headers: {
        Authorization: `Bearer ${this.tonApiKey}`,
        "Content-type": "application/json"
      }
    } : {}, e = new p({
      baseUrl: h.API_URL,
      baseApiParams: t
    });
    this.client = new E(e), this.stakingContractAddress = c.parse(
      a.STAKING_CONTRACT_ADDRESS
    );
  }
  async initialize() {
    this.connector.onStatusChange(async (t) => {
      var e;
      (e = t == null ? void 0 : t.account) != null && e.address ? await this.setupWallet(t) : this.deinitialize();
    });
  }
  deinitialize() {
    console.log("Deinitializing Tonstakers..."), this.walletAddress = void 0, n.jettonWalletAddress = void 0, this.dispatchEvent(new Event("deinitialized"));
  }
  async setupWallet(t) {
    console.log("Setting up wallet for Tonstakers..."), t.account.chain, h.CHAIN_DEV, this.walletAddress = c.parse(t.account.address), n.jettonWalletAddress || (n.jettonWalletAddress = await this.getJettonWalletAddress(
      this.walletAddress
    )), this.dispatchEvent(new Event("initialized"));
  }
  async fetchStakingPoolInfo() {
    if (this.cache.needsUpdate("poolInfo")) {
      const t = async () => {
        const e = await this.client.staking.getStakingPoolInfo(
          this.stakingContractAddress.toString()
        ), o = await this.client.blockchain.execGetMethodForBlockchainAccount(
          this.stakingContractAddress.toString(),
          "get_pool_full_data"
        );
        return {
          poolInfo: e.pool,
          poolFullData: o.decoded
        };
      };
      this.cache.set("poolInfo", t());
    }
    return this.cache.get("poolInfo");
  }
  async getCurrentApy() {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      return (await this.fetchStakingPoolInfo()).poolInfo.apy;
    } catch {
      throw console.error("Failed to get current APY"), new Error("Could not retrieve current APY.");
    }
  }
  async getHistoricalApy() {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      return this.cache.needsUpdate("stakingHistory") && this.cache.set(
        "stakingHistory",
        this.client.staking.getStakingPoolHistory(
          this.stakingContractAddress.toString()
        )
      ), (await this.cache.get("stakingHistory")).apy;
    } catch {
      throw console.error("Failed to get historical APY"), new Error("Could not retrieve historical APY.");
    }
  }
  async getRoundTimestamps() {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      const e = (await this.fetchStakingPoolInfo()).poolInfo;
      return [e.cycle_start * 1e3, e.cycle_end * 1e3];
    } catch {
      throw console.error("Failed to get current APY"), new Error("Could not retrieve current APY.");
    }
  }
  async getTvl() {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      return (await this.fetchStakingPoolInfo()).poolInfo.total_amount;
    } catch {
      throw console.error("Failed to get TVL"), new Error("Could not retrieve TVL.");
    }
  }
  async getStakersCount() {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      return (await this.fetchStakingPoolInfo()).poolInfo.current_nominators;
    } catch {
      throw console.error("Failed to get stakers count"), new Error("Could not retrieve stakers count.");
    }
  }
  async getRates() {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      const t = await this.fetchStakingPoolInfo(), e = t.poolFullData.total_balance, o = t.poolFullData.supply, s = e / o, r = t.poolFullData.projected_balance, g = t.poolFullData.projected_supply, u = r / g;
      return {
        TONUSD: await this.getTonPrice(),
        tsTONTON: s,
        tsTONTONProjected: u
      };
    } catch {
      throw console.error("Failed to get rates"), new Error("Could not retrieve rates.");
    }
  }
  async getTonPrice() {
    var t, e, o;
    try {
      return this.cache.needsUpdate("tonPrice") && this.cache.set(
        "tonPrice",
        this.client.rates.getRates({
          tokens: ["ton"],
          currencies: ["usd"]
        })
      ), (o = (e = (t = (await this.cache.get("tonPrice")).rates) == null ? void 0 : t.TON) == null ? void 0 : e.prices) == null ? void 0 : o.USD;
    } catch {
      return 0;
    }
  }
  async getStakedBalance() {
    if (!n.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    const t = n.jettonWalletAddress.toString(), e = `stakedBalance-${t}`;
    try {
      this.cache.needsUpdate(e) && this.cache.set(
        e,
        this.client.blockchain.execGetMethodForBlockchainAccount(
          t,
          "get_wallet_data"
        )
      );
      const s = (await this.cache.get(e)).decoded.balance;
      return console.log(`Current tsTON balance: ${s}`), s;
    } catch {
      return 0;
    }
  }
  async getAvailableBalance() {
    if (!this.walletAddress) throw new Error("Wallet is not connected.");
    try {
      this.cache.needsUpdate("account") && this.cache.set(
        "account",
        this.client.accounts.getAccount(this.walletAddress.toString())
      );
      const t = await this.cache.get("account"), e = Number(t.balance) - Number(i(a.RECOMMENDED_FEE_RESERVE));
      return Math.max(e, 0);
    } catch {
      return 0;
    }
  }
  async stake(t) {
    if (!this.walletAddress || !n.jettonWalletAddress)
      throw new Error("Tonstakers is not fully initialized.");
    try {
      await this.validateAmount(t);
      const e = i(t + a.STAKE_FEE_RES), o = this.preparePayload("stake", t), s = await this.sendTransaction(
        this.stakingContractAddress,
        e,
        o
      );
      return console.log(`Staked ${t} TON successfully.`), s;
    } catch (e) {
      throw console.error(
        "Staking failed:",
        e instanceof Error ? e.message : e
      ), new Error("Staking operation failed.");
    }
  }
  async stakeMax() {
    try {
      const t = await this.getAvailableBalance(), e = await this.stake(t);
      return console.log(
        `Staked maximum amount of ${t} TON successfully.`
      ), e;
    } catch (t) {
      throw console.error(
        "Maximum staking failed:",
        t instanceof Error ? t.message : t
      ), new Error("Maximum staking operation failed.");
    }
  }
  async unstake(t) {
    if (!n.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(t);
      const e = this.preparePayload("unstake", t), o = await this.sendTransaction(
        n.jettonWalletAddress,
        i(a.UNSTAKE_FEE_RES),
        e
      );
      return console.log(`Initiated unstaking of ${t} tsTON.`), o;
    } catch (e) {
      throw console.error(
        "Unstaking failed:",
        e instanceof Error ? e.message : e
      ), new Error("Unstaking operation failed.");
    }
  }
  async unstakeInstant(t) {
    if (!n.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(t);
      const e = this.preparePayload("unstake", t, !1, !0), o = await this.sendTransaction(
        n.jettonWalletAddress,
        i(a.UNSTAKE_FEE_RES),
        e
      );
      return console.log(`Initiated instant unstaking of ${t} tsTON.`), o;
    } catch (e) {
      throw console.error(
        "Instant unstaking failed:",
        e instanceof Error ? e.message : e
      ), new Error("Instant unstaking operation failed.");
    }
  }
  async unstakeBestRate(t) {
    if (!n.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(t);
      const e = this.preparePayload("unstake", t, !0), o = await this.sendTransaction(
        n.jettonWalletAddress,
        i(a.UNSTAKE_FEE_RES),
        e
      );
      return console.log(`Initiated unstaking of ${t} tsTON at the best rate.`), o;
    } catch (e) {
      throw console.error(
        "Best rate unstaking failed:",
        e instanceof Error ? e.message : e
      ), new Error("Best rate unstaking operation failed.");
    }
  }
  preparePayload(t, e, o = !1, s = !1) {
    let r = l();
    switch (t) {
      case "stake":
        r.storeUint(a.PAYLOAD_STAKE, 32), r.storeUint(1, 64).storeUint(this.referralCode, 64);
        break;
      case "unstake":
        r.storeUint(a.PAYLOAD_UNSTAKE, 32), r.storeUint(0, 64).storeCoins(i(e)).storeAddress(this.walletAddress).storeMaybeRef(
          l().storeUint(Number(o), 1).storeUint(Number(s), 1).endCell()
        );
        break;
    }
    return r.endCell().toBoc().toString("base64");
  }
  async getJettonWalletAddress(t) {
    try {
      const e = await this.fetchStakingPoolInfo(), o = c.parse(
        e.poolInfo.liquid_jetton_master
      ), s = await this.client.blockchain.execGetMethodForBlockchainAccount(
        o.toString(),
        "get_wallet_address",
        { args: [t.toString()] }
      );
      return c.parse(s.decoded.jetton_wallet_address);
    } catch (e) {
      throw console.error(
        "Failed to get jetton wallet address:",
        e instanceof Error ? e.message : e
      ), new Error("Could not retrieve jetton wallet address.");
    }
  }
  async validateAmount(t) {
    if (typeof t != "number" || t <= 0)
      throw new Error("Invalid amount specified");
  }
  sendTransaction(t, e, o) {
    const r = {
      validUntil: +/* @__PURE__ */ new Date() + d.TIMEOUT,
      messages: [
        {
          address: t.toString(),
          amount: e.toString(),
          payload: o
        }
      ]
    };
    return this.connector.sendTransaction(r);
  }
}
export {
  n as Tonstakers
};
