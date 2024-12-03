type DataPiece = {
  ts: number;
  data: string;
};

export class NetworkCache {
  ttl: number;
  prefix: string;

  constructor(ttl: number, prefix: string = 'network-cache-') {
    this.ttl = ttl;
    this.prefix = prefix;
  }

  get time() {
    return Date.now();
  }

  async get<T extends any>(key: string, getNewValue: () => Promise<T>): Promise<T> {
    const fullKey = this.getFullKey(key);
    if (this.needsUpdate(fullKey)) {
      return this.save<T>(fullKey, getNewValue());
    }

    return this.retrieve<T>(fullKey);
  }

  needsUpdate(key: string, force?: boolean): boolean {
    if (force) {
      return force;
    }

    const piece = this.getDataPiece(key);

    if (!piece) {
      return true;
    }

    return this.time - piece.ts >= this.ttl;
  }

  async retrieve<T extends any>(key: string): Promise<T> {
    const piece = this.getDataPiece(key);
    if (!piece) {
      throw new Error('Data not found');
    }
    return JSON.parse(piece.data);
  }

  async save<T extends any>(key: string, data: Promise<T>): Promise<T> {
    try {
      const resolvedData = await data;
      const serializedData = JSON.stringify(resolvedData);
      const dataPiece: DataPiece = {
        ts: this.time,
        data: serializedData,
      };
      localStorage.setItem(key, JSON.stringify(dataPiece));
      return resolvedData;
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }

  pop<T extends any>(key: string): T | undefined {
    const fullKey = this.getFullKey(key);
    const piece = this.getDataPiece(fullKey);
    localStorage.removeItem(fullKey);
    return piece ? JSON.parse(piece.data) : undefined;
  }

  get size() {
    return Object.keys(localStorage).filter((key) => key.startsWith(this.prefix)).length;
  }

  cleanup() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const piece = this.getDataPiece(key);
        if (piece && this.needsUpdate(key)) {
          this.pop(key);
        }
      }
    });
  }

  clear() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private getDataPiece(key: string): DataPiece | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
