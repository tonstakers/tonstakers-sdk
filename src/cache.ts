type DataPiece = {
  ts: number;
  data: Promise<any>;
};

export class NetworkCache {
  private data: Record<string, DataPiece>;
  ttl: number;

  constructor(ttl: number) {
    this.data = {};
    this.ttl = ttl;
  }

  get time() {
    return Date.now();
  }

  get<T extends any>(key: string, getNewValue: () => Promise<T>): Promise<T> {
    if (this.needsUpdate(key)) {
      this.save<T>(key, getNewValue());
    }

    return this.retrieve<T>(key);
  }

  needsUpdate(key: string, force?: boolean): boolean {
    if (force) {
      return force;
    }

    const piece = this.data[key];

    if (!piece) {
      return true;
    }

    return this.time - piece.ts >= this.ttl;
  }

  async retrieve<T extends any>(key: string): Promise<T> {
    return this.data[key].data;
  }

  save<T extends any>(key: string, data: Promise<T>) {
    this.data[key] = {
      ts: this.time,
      data,
    };
  }

  pop<T extends any>(key: string): Promise<T> | undefined {
    const data = this.data[key];
    delete this.data[key];
    return data.data;
  }

  get size() {
    return Object.keys(this.data).length;
  }

  cleanup() {
    Object.keys(this.data).forEach((key) => {
      if (this.needsUpdate(key)) {
        this.pop(key);
      }
    });
  }

  clear() {
    this.data = {};
  }
}
