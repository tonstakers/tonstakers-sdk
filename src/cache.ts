type DataPiece = {
  ts: number;
  data: string;
};

export class NetworkCache {
  ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  get time() {
    return Date.now();
  }

  async get<T extends any>(key: string, getNewValue: () => Promise<T>): Promise<T> {
    if (this.needsUpdate(key)) {
      return this.save<T>(key, getNewValue());
    }

    return this.retrieve<T>(key);
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
    const piece = this.getDataPiece(key);
    localStorage.removeItem(key);
    return piece ? JSON.parse(piece.data) : undefined;
  }

  get size() {
    return localStorage.length;
  }

  cleanup() {
    Object.keys(localStorage).forEach((key) => {
      const piece = this.getDataPiece(key);
      if (piece && this.needsUpdate(key)) {
        this.pop(key);
      }
    });
  }

  clear() {
    localStorage.clear();
  }

  private getDataPiece(key: string): DataPiece | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
