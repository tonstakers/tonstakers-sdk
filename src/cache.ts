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

  isFresh(key: string): boolean {
    const piece = this.store[key];

    if (!piece) {
      return false;
    }

    return this.time - piece.ts < this.ttl;
  }

  async getData(key: string) {
    return this.store[key].data;
  }

  setData(key: string, data: Promise<any>) {
    this.store[key] = {
      ts: this.time,
      data,
    };
  }
}
