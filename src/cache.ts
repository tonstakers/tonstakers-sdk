type StorePiece = {
  ts: number;
  data: Promise<any>;
};

export class NetworkCache {
  private store: Record<string, StorePiece>;
  ttl: number;

  constructor(ttl: number) {
    this.store = {};
    this.ttl = ttl;
  }

  get time() {
    return Date.now();
  }

  needsUpdate(key: string): boolean {
    const piece = this.store[key];

    if (!piece) {
      return true;
    }

    return this.time - piece.ts >= this.ttl;
  }

  async get(key: string) {
    return this.store[key].data;
  }

  set(key: string, data: Promise<any>) {
    this.store[key] = {
      ts: this.time,
      data,
    };
  }
}
