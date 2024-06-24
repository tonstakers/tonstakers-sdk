type StorePiece = {
  ts: number;
  data: any;
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

  getData(key: string) {
    return this.store[key].data;
  }

  setData(key: string, data: any) {
    this.store[key] = {
      ts: this.time,
      data,
    };
  }
}
