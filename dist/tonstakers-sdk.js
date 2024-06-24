var jo = Object.defineProperty;
var Io = (t, e, r) => e in t ? jo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var Le = (t, e, r) => Io(t, typeof e != "symbol" ? e + "" : e, r);
var Ke = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ro(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var r = function i() {
      return this instanceof i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(i) {
    var u = Object.getOwnPropertyDescriptor(t, i);
    Object.defineProperty(r, i, u.get ? u : {
      enumerable: !0,
      get: function() {
        return t[i];
      }
    });
  }), r;
}
var pt = {}, yt = {};
const Oo = Symbol.for("nodejs.util.inspect.custom");
var Dr = Oo, $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.crc16 = void 0;
function zo(t) {
  let r = 0;
  const i = Buffer.alloc(t.length + 2);
  i.set(t);
  for (let u of i) {
    let f = 128;
    for (; f > 0; )
      r <<= 1, u & f && (r += 1), f >>= 1, r > 65535 && (r &= 65535, r ^= 4129);
  }
  return Buffer.from([Math.floor(r / 256), r % 256]);
}
$r.crc16 = zo;
var No = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, fi;
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.address = yt.Address = void 0;
const qo = No(Dr), hi = $r, oa = 17, gi = 81, sa = 128;
function Ta(t) {
  if (typeof t == "string" && !wt.isFriendly(t))
    throw new Error("Unknown address type");
  const e = Buffer.isBuffer(t) ? t : Buffer.from(t, "base64");
  if (e.length !== 36)
    throw new Error("Unknown address type: byte length is not equal to 36");
  const r = e.subarray(0, 34), i = e.subarray(34, 36), u = (0, hi.crc16)(r);
  if (!(u[0] === i[0] && u[1] === i[1]))
    throw new Error("Invalid checksum: " + t);
  let f = r[0], o = !1, h = !1;
  if (f & sa && (o = !0, f = f ^ sa), f !== oa && f !== gi)
    throw "Unknown address tag";
  h = f === oa;
  let m = null;
  r[1] === 255 ? m = -1 : m = r[1];
  const k = r.subarray(2, 34);
  return { isTestOnly: o, isBounceable: h, workchain: m, hashPart: k };
}
class wt {
  static isAddress(e) {
    return e instanceof wt;
  }
  static isFriendly(e) {
    return !(e.length !== 48 || !/[A-Za-z0-9+/_-]+/.test(e));
  }
  static isRaw(e) {
    if (e.indexOf(":") === -1)
      return !1;
    let [r, i] = e.split(":");
    return !(!Number.isInteger(parseFloat(r)) || !/[a-f0-9]+/.test(i.toLowerCase()) || i.length !== 64);
  }
  static normalize(e) {
    return typeof e == "string" ? wt.parse(e).toString() : e.toString();
  }
  static parse(e) {
    if (wt.isFriendly(e))
      return this.parseFriendly(e).address;
    if (wt.isRaw(e))
      return this.parseRaw(e);
    throw new Error("Unknown address type: " + e);
  }
  static parseRaw(e) {
    let r = parseInt(e.split(":")[0]), i = Buffer.from(e.split(":")[1], "hex");
    return new wt(r, i);
  }
  static parseFriendly(e) {
    if (Buffer.isBuffer(e)) {
      let r = Ta(e);
      return {
        isBounceable: r.isBounceable,
        isTestOnly: r.isTestOnly,
        address: new wt(r.workchain, r.hashPart)
      };
    } else {
      let r = e.replace(/\-/g, "+").replace(/_/g, "/"), i = Ta(r);
      return {
        isBounceable: i.isBounceable,
        isTestOnly: i.isTestOnly,
        address: new wt(i.workchain, i.hashPart)
      };
    }
  }
  constructor(e, r) {
    if (this.toRawString = () => this.workChain + ":" + this.hash.toString("hex"), this.toRaw = () => {
      const i = Buffer.alloc(36);
      return i.set(this.hash), i.set([this.workChain, this.workChain, this.workChain, this.workChain], 32), i;
    }, this.toStringBuffer = (i) => {
      let u = i && i.testOnly !== void 0 ? i.testOnly : !1, o = (i && i.bounceable !== void 0 ? i.bounceable : !0) ? oa : gi;
      u && (o |= sa);
      const h = Buffer.alloc(34);
      h[0] = o, h[1] = this.workChain, h.set(this.hash, 2);
      const m = Buffer.alloc(36);
      return m.set(h), m.set((0, hi.crc16)(h), 34), m;
    }, this.toString = (i) => {
      let u = i && i.urlSafe !== void 0 ? i.urlSafe : !0, f = this.toStringBuffer(i);
      return u ? f.toString("base64").replace(/\+/g, "-").replace(/\//g, "_") : f.toString("base64");
    }, this[fi] = () => this.toString(), r.length !== 32)
      throw new Error("Invalid address hash length: " + r.length);
    this.workChain = e, this.hash = r, Object.freeze(this);
  }
  equals(e) {
    return e.workChain !== this.workChain ? !1 : e.hash.equals(this.hash);
  }
}
yt.Address = wt;
fi = qo.default;
function Do(t) {
  return wt.parse(t);
}
yt.address = Do;
var Lr = {}, $o = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, pi;
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.ExternalAddress = void 0;
const Lo = $o(Dr);
class ma {
  static isAddress(e) {
    return e instanceof ma;
  }
  constructor(e, r) {
    this[pi] = () => this.toString(), this.value = e, this.bits = r;
  }
  toString() {
    return `External<${this.bits}:${this.value}>`;
  }
}
Lr.ExternalAddress = ma;
pi = Lo.default;
var An = {}, ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.base32Decode = ar.base32Encode = void 0;
const la = "abcdefghijklmnopqrstuvwxyz234567";
function Fo(t) {
  const e = t.byteLength;
  let r = 0, i = 0, u = "";
  for (let f = 0; f < e; f++)
    for (i = i << 8 | t[f], r += 8; r >= 5; )
      u += la[i >>> r - 5 & 31], r -= 5;
  return r > 0 && (u += la[i << 5 - r & 31]), u;
}
ar.base32Encode = Fo;
function Ko(t, e) {
  const r = t.indexOf(e);
  if (r === -1)
    throw new Error("Invalid character found: " + e);
  return r;
}
function Ho(t) {
  let e;
  e = t.toLowerCase();
  const { length: r } = e;
  let i = 0, u = 0, f = 0;
  const o = Buffer.alloc(r * 5 / 8 | 0);
  for (let h = 0; h < r; h++)
    u = u << 5 | Ko(la, e[h]), i += 5, i >= 8 && (o[f++] = u >>> i - 8 & 255, i -= 8);
  return o;
}
ar.base32Decode = Ho;
var Vo = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, mi;
Object.defineProperty(An, "__esModule", { value: !0 });
An.ADNLAddress = void 0;
const Go = Vo(Dr), Ma = ar, ja = $r;
class kn {
  static parseFriendly(e) {
    if (e.length !== 55)
      throw Error("Invalid address");
    e = "f" + e;
    let r = (0, Ma.base32Decode)(e);
    if (r[0] !== 45)
      throw Error("Invalid address");
    let i = r.slice(33);
    if (!(0, ja.crc16)(r.slice(0, 33)).equals(i))
      throw Error("Invalid address");
    return new kn(r.slice(1, 33));
  }
  static parseRaw(e) {
    const r = Buffer.from(e, "base64");
    return new kn(r);
  }
  constructor(e) {
    if (this.toRaw = () => this.address.toString("hex").toUpperCase(), this.toString = () => {
      let r = Buffer.concat([Buffer.from([45]), this.address]), i = (0, ja.crc16)(r);
      return r = Buffer.concat([r, i]), (0, Ma.base32Encode)(r).slice(1);
    }, this[mi] = () => this.toString(), e.length !== 32)
      throw Error("Invalid address");
    this.address = e;
  }
  equals(e) {
    return this.address.equals(e.address);
  }
}
An.ADNLAddress = kn;
mi = Go.default;
var Cn = {}, er = {}, Zr = {}, Qr = {}, tr = {}, Ia;
function En() {
  if (Ia) return tr;
  Ia = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.paddedBufferToBits = tr.bitsToPaddedBuffer = void 0;
  const t = Un(), e = Jt();
  function r(u) {
    let f = new t.BitBuilder(Math.ceil(u.length / 8) * 8);
    f.writeBits(u);
    let o = Math.ceil(u.length / 8) * 8 - u.length;
    for (let h = 0; h < o; h++)
      h === 0 ? f.writeBit(1) : f.writeBit(0);
    return f.buffer();
  }
  tr.bitsToPaddedBuffer = r;
  function i(u) {
    let f = 0;
    for (let o = u.length - 1; o >= 0; o--)
      if (u[o] !== 0) {
        const h = u[o];
        let m = h & -h;
        m & 1 || (m = Math.log2(m) + 1), o > 0 && (f = o << 3), f += 8 - m;
        break;
      }
    return new e.BitString(u, 0, f);
  }
  return tr.paddedBufferToBits = i, tr;
}
var Ra;
function Jt() {
  if (Ra) return Qr;
  Ra = 1;
  var t = Ke && Ke.__importDefault || function(f) {
    return f && f.__esModule ? f : { default: f };
  }, e;
  Object.defineProperty(Qr, "__esModule", { value: !0 }), Qr.BitString = void 0;
  const r = En(), i = t(Dr);
  let u = class _n {
    /**
     * Checks if supplied object is BitString
     * @param src is unknow object
     * @returns true if object is BitString and false otherwise
     **/
    static isBitString(o) {
      return o instanceof _n;
    }
    /**
     * Constructing BitString from a buffer
     * @param data data that contains the bitstring data. NOTE: We are expecting this buffer to be NOT modified
     * @param offset offset in bits from the start of the buffer
     * @param length length of the bitstring in bits
     */
    constructor(o, h, m) {
      if (this[e] = () => this.toString(), m < 0)
        throw new Error(`Length ${m} is out of bounds`);
      this._length = m, this._data = o, this._offset = h;
    }
    /**
     * Returns the length of the bitstring
     */
    get length() {
      return this._length;
    }
    /**
     * Returns the bit at the specified index
     * @param index index of the bit
     * @throws Error if index is out of bounds
     * @returns true if the bit is set, false otherwise
     */
    at(o) {
      if (o >= this._length)
        throw new Error(`Index ${o} > ${this._length} is out of bounds`);
      if (o < 0)
        throw new Error(`Index ${o} < 0 is out of bounds`);
      let h = this._offset + o >> 3, m = 7 - (this._offset + o) % 8;
      return (this._data[h] & 1 << m) !== 0;
    }
    /**
     * Get a subscring of the bitstring
     * @param offset
     * @param length
     * @returns
     */
    substring(o, h) {
      if (o > this._length)
        throw new Error(`Offset(${o}) > ${this._length} is out of bounds`);
      if (o < 0)
        throw new Error(`Offset(${o}) < 0 is out of bounds`);
      if (h === 0)
        return _n.EMPTY;
      if (o + h > this._length)
        throw new Error(`Offset ${o} + Length ${h} > ${this._length} is out of bounds`);
      return new _n(this._data, this._offset + o, h);
    }
    /**
     * Try to get a buffer from the bitstring without allocations
     * @param offset offset in bits
     * @param length length in bits
     * @returns buffer if the bitstring is aligned to bytes, null otherwise
     */
    subbuffer(o, h) {
      if (o > this._length)
        throw new Error(`Offset ${o} is out of bounds`);
      if (o < 0)
        throw new Error(`Offset ${o} is out of bounds`);
      if (o + h > this._length)
        throw new Error(`Offset + Lenght = ${o + h} is out of bounds`);
      if (h % 8 !== 0 || (this._offset + o) % 8 !== 0)
        return null;
      let m = this._offset + o >> 3, k = m + (h >> 3);
      return this._data.subarray(m, k);
    }
    /**
     * Checks for equality
     * @param b other bitstring
     * @returns true if the bitstrings are equal, false otherwise
     */
    equals(o) {
      if (this._length !== o._length)
        return !1;
      for (let h = 0; h < this._length; h++)
        if (this.at(h) !== o.at(h))
          return !1;
      return !0;
    }
    /**
     * Format to canonical string
     * @returns formatted bits as a string
     */
    toString() {
      const o = (0, r.bitsToPaddedBuffer)(this);
      if (this._length % 4 === 0) {
        const h = o.subarray(0, Math.ceil(this._length / 8)).toString("hex").toUpperCase();
        return this._length % 8 === 0 ? h : h.substring(0, h.length - 1);
      } else {
        const h = o.toString("hex").toUpperCase();
        return this._length % 8 <= 4 ? h.substring(0, h.length - 1) + "_" : h + "_";
      }
    }
  };
  return Qr.BitString = u, e = i.default, u.EMPTY = new u(Buffer.alloc(0), 0, 0), Qr;
}
var Oa;
function Un() {
  if (Oa) return Zr;
  Oa = 1, Object.defineProperty(Zr, "__esModule", { value: !0 }), Zr.BitBuilder = void 0;
  const t = yt, e = Lr, r = Jt();
  let i = class {
    constructor(f = 1023) {
      this._buffer = Buffer.alloc(Math.ceil(f / 8)), this._length = 0;
    }
    /**
     * Current number of bits written
     */
    get length() {
      return this._length;
    }
    /**
     * Write a single bit
     * @param value bit to write, true or positive number for 1, false or zero or negative for 0
     */
    writeBit(f) {
      let o = this._length;
      if (o > this._buffer.length * 8)
        throw new Error("BitBuilder overflow");
      (f === !0 || f > 0) && (this._buffer[o / 8 | 0] |= 1 << 7 - o % 8), this._length++;
    }
    /**
     * Copy bits from BitString
     * @param src source bits
     */
    writeBits(f) {
      for (let o = 0; o < f.length; o++)
        this.writeBit(f.at(o));
    }
    /**
     * Write bits from buffer
     * @param src source buffer
     */
    writeBuffer(f) {
      if (this._length % 8 === 0) {
        if (this._length + f.length * 8 > this._buffer.length * 8)
          throw new Error("BitBuilder overflow");
        f.copy(this._buffer, this._length / 8), this._length += f.length * 8;
      } else
        for (let o = 0; o < f.length; o++)
          this.writeUint(f[o], 8);
    }
    /**
     * Write uint value
     * @param value value as bigint or number
     * @param bits number of bits to write
     */
    writeUint(f, o) {
      if (o < 0 || !Number.isSafeInteger(o))
        throw Error(`invalid bit length. Got ${o}`);
      const h = BigInt(f);
      if (o === 0) {
        if (h !== 0n)
          throw Error(`value is not zero for ${o} bits. Got ${f}`);
        return;
      }
      const m = 1n << BigInt(o);
      if (h < 0 || h >= m)
        throw Error(`bitLength is too small for a value ${f}. Got ${o}`);
      if (this._length + o > this._buffer.length * 8)
        throw new Error("BitBuilder overflow");
      const k = 8 - this._length % 8;
      if (k > 0) {
        const P = Math.floor(this._length / 8);
        if (o < k) {
          const E = Number(h);
          this._buffer[P] |= E << k - o, this._length += o;
        } else {
          const E = Number(h >> BigInt(o - k));
          this._buffer[P] |= E, this._length += k;
        }
      }
      for (o -= k; o > 0; )
        o >= 8 ? (this._buffer[this._length / 8] = Number(h >> BigInt(o - 8) & 0xffn), this._length += 8, o -= 8) : (this._buffer[this._length / 8] = Number(h << BigInt(8 - o) & 0xffn), this._length += o, o = 0);
    }
    /**
     * Write int value
     * @param value value as bigint or number
     * @param bits number of bits to write
     */
    writeInt(f, o) {
      let h = BigInt(f);
      if (o < 0 || !Number.isSafeInteger(o))
        throw Error(`invalid bit length. Got ${o}`);
      if (o === 0) {
        if (f !== 0n)
          throw Error(`value is not zero for ${o} bits. Got ${f}`);
        return;
      }
      if (o === 1) {
        if (f !== -1n && f !== 0n)
          throw Error(`value is not zero or -1 for ${o} bits. Got ${f}`);
        this.writeBit(f === -1n);
        return;
      }
      let m = 1n << BigInt(o) - 1n;
      if (h < -m || h >= m)
        throw Error(`value is out of range for ${o} bits. Got ${f}`);
      h < 0 ? (this.writeBit(!0), h = m + h) : this.writeBit(!1), this.writeUint(h, o - 1);
    }
    /**
     * Wrtie var uint value, used for serializing coins
     * @param value value to write as bigint or number
     * @param bits header bits to write size
     */
    writeVarUint(f, o) {
      let h = BigInt(f);
      if (o < 0 || !Number.isSafeInteger(o))
        throw Error(`invalid bit length. Got ${o}`);
      if (h < 0)
        throw Error(`value is negative. Got ${f}`);
      if (h === 0n) {
        this.writeUint(0, o);
        return;
      }
      const m = Math.ceil(h.toString(2).length / 8), k = m * 8;
      this.writeUint(m, o), this.writeUint(h, k);
    }
    /**
     * Wrtie var int value, used for serializing coins
     * @param value value to write as bigint or number
     * @param bits header bits to write size
     */
    writeVarInt(f, o) {
      let h = BigInt(f);
      if (o < 0 || !Number.isSafeInteger(o))
        throw Error(`invalid bit length. Got ${o}`);
      if (h === 0n) {
        this.writeUint(0, o);
        return;
      }
      let m = h > 0 ? h : -h;
      const k = 1 + Math.ceil(m.toString(2).length / 8), P = k * 8;
      this.writeUint(k, o), this.writeInt(h, P);
    }
    /**
     * Write coins in var uint format
     * @param amount amount to write
     */
    writeCoins(f) {
      this.writeVarUint(f, 4);
    }
    /**
     * Write address
     * @param address write address or address external
     */
    writeAddress(f) {
      if (f == null) {
        this.writeUint(0, 2);
        return;
      }
      if (t.Address.isAddress(f)) {
        this.writeUint(2, 2), this.writeUint(0, 1), this.writeInt(f.workChain, 8), this.writeBuffer(f.hash);
        return;
      }
      if (e.ExternalAddress.isAddress(f)) {
        this.writeUint(1, 2), this.writeUint(f.bits, 9), this.writeUint(f.value, f.bits);
        return;
      }
      throw Error(`Invalid address. Got ${f}`);
    }
    /**
     * Build BitString
     * @returns result bit string
     */
    build() {
      return new r.BitString(this._buffer, 0, this._length);
    }
    /**
     * Build into Buffer
     * @returns result buffer
     */
    buffer() {
      if (this._length % 8 !== 0)
        throw new Error("BitBuilder buffer is not byte aligned");
      return this._buffer.subarray(0, this._length / 8);
    }
  };
  return Zr.BitBuilder = i, Zr;
}
var en = {}, Fr = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CellType = void 0, function(e) {
    e[e.Ordinary = -1] = "Ordinary", e[e.PrunedBranch = 1] = "PrunedBranch", e[e.Library = 2] = "Library", e[e.MerkleProof = 3] = "MerkleProof", e[e.MerkleUpdate = 4] = "MerkleUpdate";
  }(t.CellType || (t.CellType = {}));
})(Fr);
var tn = {}, rn = {}, nn = {}, Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.readUnaryLength = void 0;
function Yo(t) {
  let e = 0;
  for (; t.loadBit(); )
    e++;
  return e;
}
Tn.readUnaryLength = Yo;
var za;
function ya() {
  if (za) return nn;
  za = 1, Object.defineProperty(nn, "__esModule", { value: !0 }), nn.generateMerkleProof = void 0;
  const t = it(), e = Tn;
  function r(o) {
    return (0, t.beginCell)().storeUint(1, 8).storeUint(1, 8).storeBuffer(o.hash(0)).storeUint(o.depth(0), 16).endCell({ exotic: !0 });
  }
  function i(o) {
    return (0, t.beginCell)().storeUint(3, 8).storeBuffer(o.hash(0)).storeUint(o.depth(0), 16).storeRef(o).endCell({ exotic: !0 });
  }
  function u(o, h, m, k) {
    const P = h.asCell();
    let E = h.loadBit() ? 1 : 0, $ = 0, L = o;
    if (E === 0) {
      $ = (0, e.readUnaryLength)(h);
      for (let ee = 0; ee < $; ee++)
        L += h.loadBit() ? "1" : "0";
    } else if ((h.loadBit() ? 1 : 0) === 0) {
      $ = h.loadUint(Math.ceil(Math.log2(m + 1)));
      for (let ae = 0; ae < $; ae++)
        L += h.loadBit() ? "1" : "0";
    } else {
      let ae = h.loadBit() ? "1" : "0";
      $ = h.loadUint(Math.ceil(Math.log2(m + 1)));
      for (let fe = 0; fe < $; fe++)
        L += ae;
    }
    if (m - $ === 0)
      return P;
    {
      let ee = P.beginParse(), ae = ee.loadRef(), fe = ee.loadRef();
      return ae.isExotic || (L + "0" === k.slice(0, L.length + 1) ? ae = u(L + "0", ae.beginParse(), m - $ - 1, k) : ae = r(ae)), fe.isExotic || (L + "1" === k.slice(0, L.length + 1) ? fe = u(L + "1", fe.beginParse(), m - $ - 1, k) : fe = r(fe)), (0, t.beginCell)().storeSlice(ee).storeRef(ae).storeRef(fe).endCell();
    }
  }
  function f(o, h, m) {
    const k = (0, t.beginCell)().storeDictDirect(o).endCell().beginParse();
    return i(u("", k, m.bits, m.serialize(h).toString(2).padStart(m.bits, "0")));
  }
  return nn.generateMerkleProof = f, nn;
}
var an = {}, Na;
function yi() {
  if (Na) return an;
  Na = 1, Object.defineProperty(an, "__esModule", { value: !0 }), an.generateMerkleUpdate = void 0;
  const t = it(), e = ya();
  function r(u, f) {
    return (0, t.beginCell)().storeUint(4, 8).storeBuffer(u.hash(0)).storeBuffer(f.hash(0)).storeUint(u.depth(0), 16).storeUint(f.depth(0), 16).storeRef(u).storeRef(f).endCell({ exotic: !0 });
  }
  function i(u, f, o, h) {
    const m = (0, e.generateMerkleProof)(u, f, o).refs[0];
    u.set(f, h);
    const k = (0, e.generateMerkleProof)(u, f, o).refs[0];
    return r(m, k);
  }
  return an.generateMerkleUpdate = i, an;
}
var Mn = {};
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.parseDict = void 0;
function Wo(t) {
  let e = 0;
  for (; t.loadBit(); )
    e++;
  return e;
}
function ua(t, e, r, i, u) {
  let f = e.loadBit() ? 1 : 0, o = 0, h = t;
  if (f === 0) {
    o = Wo(e);
    for (let m = 0; m < o; m++)
      h += e.loadBit() ? "1" : "0";
  } else if ((e.loadBit() ? 1 : 0) === 0) {
    o = e.loadUint(Math.ceil(Math.log2(r + 1)));
    for (let k = 0; k < o; k++)
      h += e.loadBit() ? "1" : "0";
  } else {
    let k = e.loadBit() ? "1" : "0";
    o = e.loadUint(Math.ceil(Math.log2(r + 1)));
    for (let P = 0; P < o; P++)
      h += k;
  }
  if (r - o === 0)
    i.set(BigInt("0b" + h), u(e));
  else {
    let m = e.loadRef(), k = e.loadRef();
    m.isExotic || ua(h + "0", m.beginParse(), r - o - 1, i, u), k.isExotic || ua(h + "1", k.beginParse(), r - o - 1, i, u);
  }
}
function Xo(t, e, r) {
  let i = /* @__PURE__ */ new Map();
  return t && ua("", t, e, i, r), i;
}
Mn.parseDict = Xo;
var dt = {}, jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.findCommonPrefix = void 0;
function Jo(t, e = 0) {
  if (t.length === 0)
    return "";
  let r = t[0].slice(e);
  for (let i = 1; i < t.length; i++) {
    const u = t[i];
    for (; u.indexOf(r, e) !== e; )
      if (r = r.substring(0, r.length - 1), r === "")
        return r;
  }
  return r;
}
jn.findCommonPrefix = Jo;
var qa;
function Zo() {
  if (qa) return dt;
  qa = 1, Object.defineProperty(dt, "__esModule", { value: !0 }), dt.serializeDict = dt.detectLabelType = dt.writeLabelSame = dt.writeLabelLong = dt.writeLabelShort = dt.buildTree = void 0;
  const t = it(), e = jn;
  function r(O, T) {
    for (; O.length < T; )
      O = "0" + O;
    return O;
  }
  function i(O, T) {
    if (O.size === 0)
      throw Error("Internal inconsistency");
    let W = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
    for (let [ie, Me] of O.entries())
      ie[T] === "0" ? W.set(ie, Me) : H.set(ie, Me);
    if (W.size === 0)
      throw Error("Internal inconsistency. Left emtpy.");
    if (H.size === 0)
      throw Error("Internal inconsistency. Right emtpy.");
    return { left: W, right: H };
  }
  function u(O, T) {
    if (O.size === 0)
      throw Error("Internal inconsistency");
    if (O.size === 1)
      return { type: "leaf", value: Array.from(O.values())[0] };
    let { left: W, right: H } = i(O, T);
    return {
      type: "fork",
      left: f(W, T + 1),
      right: f(H, T + 1)
    };
  }
  function f(O, T = 0) {
    if (O.size === 0)
      throw Error("Internal inconsistency");
    const W = (0, e.findCommonPrefix)(Array.from(O.keys()), T);
    return { label: W, node: u(O, W.length + T) };
  }
  function o(O, T) {
    let W = /* @__PURE__ */ new Map();
    for (let H of Array.from(O.keys())) {
      const ie = r(H.toString(2), T);
      W.set(ie, O.get(H));
    }
    return f(W);
  }
  dt.buildTree = o;
  function h(O, T) {
    T.storeBit(0);
    for (let W = 0; W < O.length; W++)
      T.storeBit(1);
    return T.storeBit(0), O.length > 0 && T.storeUint(BigInt("0b" + O), O.length), T;
  }
  dt.writeLabelShort = h;
  function m(O) {
    return 1 + O.length + 1 + O.length;
  }
  function k(O, T, W) {
    W.storeBit(1), W.storeBit(0);
    let H = Math.ceil(Math.log2(T + 1));
    return W.storeUint(O.length, H), O.length > 0 && W.storeUint(BigInt("0b" + O), O.length), W;
  }
  dt.writeLabelLong = k;
  function P(O, T) {
    return 2 + Math.ceil(Math.log2(T + 1)) + O.length;
  }
  function E(O, T, W, H) {
    H.storeBit(1), H.storeBit(1), H.storeBit(O);
    let ie = Math.ceil(Math.log2(W + 1));
    H.storeUint(T, ie);
  }
  dt.writeLabelSame = E;
  function $(O) {
    return 3 + Math.ceil(Math.log2(O + 1));
  }
  function L(O) {
    if (O.length === 0 || O.length === 1)
      return !0;
    for (let T = 1; T < O.length; T++)
      if (O[T] !== O[0])
        return !1;
    return !0;
  }
  function ee(O, T) {
    let W = "short", H = m(O), ie = P(O, T);
    if (ie < H && (H = ie, W = "long"), L(O)) {
      let Me = $(T);
      Me < H && (H = Me, W = "same");
    }
    return W;
  }
  dt.detectLabelType = ee;
  function ae(O, T, W) {
    let H = ee(O, T);
    H === "short" ? h(O, W) : H === "long" ? k(O, T, W) : H === "same" && E(O[0] === "1", O.length, T, W);
  }
  function fe(O, T, W, H) {
    if (O.type === "leaf" && W(O.value, H), O.type === "fork") {
      const ie = (0, t.beginCell)(), Me = (0, t.beginCell)();
      X(O.left, T - 1, W, ie), X(O.right, T - 1, W, Me), H.storeRef(ie), H.storeRef(Me);
    }
  }
  function X(O, T, W, H) {
    ae(O.label, T, H), fe(O.node, T - O.label.length, W, H);
  }
  function Y(O, T, W, H) {
    const ie = o(O, T);
    X(ie, T, W, H);
  }
  return dt.serializeDict = Y, dt;
}
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.deserializeInternalKey = Or.serializeInternalKey = void 0;
const bi = yt, ca = Jt(), Qo = En();
function es(t) {
  if (typeof t == "number") {
    if (!Number.isSafeInteger(t))
      throw Error("Invalid key type: not a safe integer: " + t);
    return "n:" + t.toString(10);
  } else {
    if (typeof t == "bigint")
      return "b:" + t.toString(10);
    if (bi.Address.isAddress(t))
      return "a:" + t.toString();
    if (Buffer.isBuffer(t))
      return "f:" + t.toString("hex");
    if (ca.BitString.isBitString(t))
      return "B:" + t.toString();
    throw Error("Invalid key type");
  }
}
Or.serializeInternalKey = es;
function ts(t) {
  let e = t.slice(0, 2), r = t.slice(2);
  if (e === "n:")
    return parseInt(r, 10);
  if (e === "b:")
    return BigInt(r);
  if (e === "a:")
    return bi.Address.parse(r);
  if (e === "f:")
    return Buffer.from(r, "hex");
  if (e === "B:") {
    const i = r.slice(-1) == "_";
    if (i || r.length % 2 != 0) {
      let f = i ? r.length - 1 : r.length;
      const o = r.substr(0, f) + "0";
      return !i && f & 1 ? new ca.BitString(Buffer.from(o, "hex"), 0, f << 2) : (0, Qo.paddedBufferToBits)(Buffer.from(o, "hex"));
    } else
      return new ca.BitString(Buffer.from(r, "hex"), 0, r.length << 2);
  }
  throw Error("Invalid key type: " + e);
}
Or.deserializeInternalKey = ts;
var Da;
function Ar() {
  if (Da) return rn;
  Da = 1, Object.defineProperty(rn, "__esModule", { value: !0 }), rn.Dictionary = void 0;
  const t = yt, e = it(), r = Cr(), i = Jt(), u = ya(), f = yi(), o = Mn, h = Zo(), m = Or;
  let k = class Dt {
    /**
     * Create an empty map
     * @param key key type
     * @param value value type
     * @returns Dictionary<K, V>
     */
    static empty(S, Z) {
      return S && Z ? new Dt(/* @__PURE__ */ new Map(), S, Z) : new Dt(/* @__PURE__ */ new Map(), null, null);
    }
    /**
     * Load dictionary from slice
     * @param key key description
     * @param value value description
     * @param src slice
     * @returns Dictionary<K, V>
     */
    static load(S, Z, le) {
      let Ae;
      if (le instanceof r.Cell) {
        if (le.isExotic)
          return Dt.empty(S, Z);
        Ae = le.beginParse();
      } else
        Ae = le;
      let Oe = Ae.loadMaybeRef();
      return Oe && !Oe.isExotic ? Dt.loadDirect(S, Z, Oe.beginParse()) : Dt.empty(S, Z);
    }
    /**
     * Low level method for rare dictionaries from system contracts.
     * Loads dictionary from slice directly without going to the ref.
     *
     * @param key key description
     * @param value value description
     * @param sc slice
     * @returns Dictionary<K, V>
     */
    static loadDirect(S, Z, le) {
      if (!le)
        return Dt.empty(S, Z);
      let Ae;
      le instanceof r.Cell ? Ae = le.beginParse() : Ae = le;
      let Oe = (0, o.parseDict)(Ae, S.bits, Z.parse), x = /* @__PURE__ */ new Map();
      for (let [vt, rt] of Oe)
        x.set((0, m.serializeInternalKey)(S.parse(vt)), rt);
      return new Dt(x, S, Z);
    }
    constructor(S, Z, le) {
      this._key = Z, this._value = le, this._map = S;
    }
    get size() {
      return this._map.size;
    }
    get(S) {
      return this._map.get((0, m.serializeInternalKey)(S));
    }
    has(S) {
      return this._map.has((0, m.serializeInternalKey)(S));
    }
    set(S, Z) {
      return this._map.set((0, m.serializeInternalKey)(S), Z), this;
    }
    delete(S) {
      const Z = (0, m.serializeInternalKey)(S);
      return this._map.delete(Z);
    }
    clear() {
      this._map.clear();
    }
    *[Symbol.iterator]() {
      for (const [S, Z] of this._map)
        yield [(0, m.deserializeInternalKey)(S), Z];
    }
    keys() {
      return Array.from(this._map.keys()).map((S) => (0, m.deserializeInternalKey)(S));
    }
    values() {
      return Array.from(this._map.values());
    }
    store(S, Z, le) {
      if (this._map.size === 0)
        S.storeBit(0);
      else {
        let Ae = this._key;
        Z != null && (Ae = Z);
        let Oe = this._value;
        if (le != null && (Oe = le), !Ae)
          throw Error("Key serializer is not defined");
        if (!Oe)
          throw Error("Value serializer is not defined");
        let x = /* @__PURE__ */ new Map();
        for (const [rt, Ot] of this._map)
          x.set(Ae.serialize((0, m.deserializeInternalKey)(rt)), Ot);
        S.storeBit(1);
        let vt = (0, e.beginCell)();
        (0, h.serializeDict)(x, Ae.bits, Oe.serialize, vt), S.storeRef(vt.endCell());
      }
    }
    storeDirect(S, Z, le) {
      if (this._map.size === 0)
        throw Error("Cannot store empty dictionary directly");
      let Ae = this._key;
      Z != null && (Ae = Z);
      let Oe = this._value;
      if (le != null && (Oe = le), !Ae)
        throw Error("Key serializer is not defined");
      if (!Oe)
        throw Error("Value serializer is not defined");
      let x = /* @__PURE__ */ new Map();
      for (const [vt, rt] of this._map)
        x.set(Ae.serialize((0, m.deserializeInternalKey)(vt)), rt);
      (0, h.serializeDict)(x, Ae.bits, Oe.serialize, S);
    }
    generateMerkleProof(S) {
      return (0, u.generateMerkleProof)(this, S, this._key);
    }
    generateMerkleUpdate(S, Z) {
      return (0, f.generateMerkleUpdate)(this, S, this._key, Z);
    }
  };
  rn.Dictionary = k, k.Keys = {
    /**
     * Standard address key
     * @returns DictionaryKey<Address>
     */
    Address: () => P(),
    /**
     * Create standard big integer key
     * @param bits number of bits
     * @returns DictionaryKey<bigint>
     */
    BigInt: (U) => E(U),
    /**
     * Create integer key
     * @param bits bits of integer
     * @returns DictionaryKey<number>
     */
    Int: (U) => $(U),
    /**
     * Create standard unsigned big integer key
     * @param bits number of bits
     * @returns DictionaryKey<bigint>
     */
    BigUint: (U) => L(U),
    /**
     * Create standard unsigned integer key
     * @param bits number of bits
     * @returns DictionaryKey<number>
     */
    Uint: (U) => ee(U),
    /**
     * Create standard buffer key
     * @param bytes number of bytes of a buffer
     * @returns DictionaryKey<Buffer>
     */
    Buffer: (U) => ae(U),
    /**
     * Create BitString key
     * @param bits key length
     * @returns DictionaryKey<BitString>
     * Point is that Buffer has to be 8 bit aligned,
     * while key is TVM dictionary doesn't have to be
     * aligned at all.
     */
    BitString: (U) => fe(U)
  }, k.Values = {
    /**
     * Create standard integer value
     * @returns DictionaryValue<bigint>
     */
    BigInt: (U) => Y(U),
    /**
     * Create standard integer value
     * @returns DictionaryValue<number>
     */
    Int: (U) => X(U),
    /**
     * Create big var int
     * @param bits nubmer of header bits
     * @returns DictionaryValue<bigint>
     */
    BigVarInt: (U) => O(U),
    /**
     * Create standard unsigned integer value
     * @param bits number of bits
     * @returns DictionaryValue<bigint>
     */
    BigUint: (U) => H(U),
    /**
     * Create standard unsigned integer value
     * @param bits number of bits
     * @returns DictionaryValue<bigint>
     */
    Uint: (U) => W(U),
    /**
     * Create big var int
     * @param bits nubmer of header bits
     * @returns DictionaryValue<bigint>
     */
    BigVarUint: (U) => T(U),
    /**
     * Create standard boolean value
     * @returns DictionaryValue<boolean>
     */
    Bool: () => ie(),
    /**
     * Create standard address value
     * @returns DictionaryValue<Address>
     */
    Address: () => Me(),
    /**
     * Create standard cell value
     * @returns DictionaryValue<Cell>
     */
    Cell: () => Pe(),
    /**
     * Create Builder value
     * @param bytes number of bytes of a buffer
     * @returns DictionaryValue<Builder>
     */
    Buffer: (U) => Ye(U),
    /**
     * Create BitString value
     * @param requested bit length
     * @returns DictionaryValue<BitString>
     * Point is that Buffer is not applicable
     * when length is not 8 bit alligned.
     */
    BitString: (U) => He(U),
    /**
     * Create dictionary value
     * @param key
     * @param value
     */
    Dictionary: (U, S) => Fe(U, S)
  };
  function P() {
    return {
      bits: 267,
      serialize: (U) => {
        if (!t.Address.isAddress(U))
          throw Error("Key is not an address");
        return (0, e.beginCell)().storeAddress(U).endCell().beginParse().preloadUintBig(267);
      },
      parse: (U) => (0, e.beginCell)().storeUint(U, 267).endCell().beginParse().loadAddress()
    };
  }
  function E(U) {
    return {
      bits: U,
      serialize: (S) => {
        if (typeof S != "bigint")
          throw Error("Key is not a bigint");
        return (0, e.beginCell)().storeInt(S, U).endCell().beginParse().loadUintBig(U);
      },
      parse: (S) => (0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadIntBig(U)
    };
  }
  function $(U) {
    return {
      bits: U,
      serialize: (S) => {
        if (typeof S != "number")
          throw Error("Key is not a number");
        if (!Number.isSafeInteger(S))
          throw Error("Key is not a safe integer: " + S);
        return (0, e.beginCell)().storeInt(S, U).endCell().beginParse().loadUintBig(U);
      },
      parse: (S) => (0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadInt(U)
    };
  }
  function L(U) {
    return {
      bits: U,
      serialize: (S) => {
        if (typeof S != "bigint")
          throw Error("Key is not a bigint");
        if (S < 0)
          throw Error("Key is negative: " + S);
        return (0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadUintBig(U);
      },
      parse: (S) => (0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadUintBig(U)
    };
  }
  function ee(U) {
    return {
      bits: U,
      serialize: (S) => {
        if (typeof S != "number")
          throw Error("Key is not a number");
        if (!Number.isSafeInteger(S))
          throw Error("Key is not a safe integer: " + S);
        if (S < 0)
          throw Error("Key is negative: " + S);
        return (0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadUintBig(U);
      },
      parse: (S) => Number((0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadUint(U))
    };
  }
  function ae(U) {
    return {
      bits: U * 8,
      serialize: (S) => {
        if (!Buffer.isBuffer(S))
          throw Error("Key is not a buffer");
        return (0, e.beginCell)().storeBuffer(S).endCell().beginParse().loadUintBig(U * 8);
      },
      parse: (S) => (0, e.beginCell)().storeUint(S, U * 8).endCell().beginParse().loadBuffer(U)
    };
  }
  function fe(U) {
    return {
      bits: U,
      serialize: (S) => {
        if (!i.BitString.isBitString(S))
          throw Error("Key is not a BitString");
        return (0, e.beginCell)().storeBits(S).endCell().beginParse().loadUintBig(U);
      },
      parse: (S) => (0, e.beginCell)().storeUint(S, U).endCell().beginParse().loadBits(U)
    };
  }
  function X(U) {
    return {
      serialize: (S, Z) => {
        Z.storeInt(S, U);
      },
      parse: (S) => S.loadInt(U)
    };
  }
  function Y(U) {
    return {
      serialize: (S, Z) => {
        Z.storeInt(S, U);
      },
      parse: (S) => S.loadIntBig(U)
    };
  }
  function O(U) {
    return {
      serialize: (S, Z) => {
        Z.storeVarInt(S, U);
      },
      parse: (S) => S.loadVarIntBig(U)
    };
  }
  function T(U) {
    return {
      serialize: (S, Z) => {
        Z.storeVarUint(S, U);
      },
      parse: (S) => S.loadVarUintBig(U)
    };
  }
  function W(U) {
    return {
      serialize: (S, Z) => {
        Z.storeUint(S, U);
      },
      parse: (S) => S.loadUint(U)
    };
  }
  function H(U) {
    return {
      serialize: (S, Z) => {
        Z.storeUint(S, U);
      },
      parse: (S) => S.loadUintBig(U)
    };
  }
  function ie() {
    return {
      serialize: (U, S) => {
        S.storeBit(U);
      },
      parse: (U) => U.loadBit()
    };
  }
  function Me() {
    return {
      serialize: (U, S) => {
        S.storeAddress(U);
      },
      parse: (U) => U.loadAddress()
    };
  }
  function Pe() {
    return {
      serialize: (U, S) => {
        S.storeRef(U);
      },
      parse: (U) => U.loadRef()
    };
  }
  function Fe(U, S) {
    return {
      serialize: (Z, le) => {
        Z.store(le);
      },
      parse: (Z) => k.load(U, S, Z)
    };
  }
  function Ye(U) {
    return {
      serialize: (S, Z) => {
        if (S.length !== U)
          throw Error("Invalid buffer size");
        Z.storeBuffer(S);
      },
      parse: (S) => S.loadBuffer(U)
    };
  }
  function He(U) {
    return {
      serialize: (S, Z) => {
        if (S.length !== U)
          throw Error("Invalid BitString size");
        Z.storeBits(S);
      },
      parse: (S) => S.loadBits(U)
    };
  }
  return rn;
}
var Ut = {}, $a;
function vi() {
  if ($a) return Ut;
  $a = 1, Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.writeString = Ut.stringToCell = Ut.readString = void 0;
  const t = it();
  function e(o) {
    if (o.remainingBits % 8 !== 0)
      throw new Error(`Invalid string length: ${o.remainingBits}`);
    if (o.remainingRefs !== 0 && o.remainingRefs !== 1)
      throw new Error(`invalid number of refs: ${o.remainingRefs}`);
    let h;
    return o.remainingBits === 0 ? h = Buffer.alloc(0) : h = o.loadBuffer(o.remainingBits / 8), o.remainingRefs === 1 && (h = Buffer.concat([h, e(o.loadRef().beginParse())])), h;
  }
  function r(o) {
    return e(o).toString();
  }
  Ut.readString = r;
  function i(o, h) {
    if (o.length > 0) {
      let m = Math.floor(h.availableBits / 8);
      if (o.length > m) {
        let k = o.subarray(0, m), P = o.subarray(m);
        h = h.storeBuffer(k);
        let E = (0, t.beginCell)();
        i(P, E), h = h.storeRef(E.endCell());
      } else
        h = h.storeBuffer(o);
    }
  }
  function u(o) {
    let h = (0, t.beginCell)();
    return i(Buffer.from(o), h), h.endCell();
  }
  Ut.stringToCell = u;
  function f(o, h) {
    i(Buffer.from(o), h);
  }
  return Ut.writeString = f, Ut;
}
var La;
function ba() {
  if (La) return tn;
  La = 1;
  var t = Ke && Ke.__importDefault || function(h) {
    return h && h.__esModule ? h : { default: h };
  }, e;
  Object.defineProperty(tn, "__esModule", { value: !0 }), tn.Slice = void 0;
  const r = t(Dr), i = Ar(), u = it(), f = vi();
  let o = class da {
    constructor(m, k) {
      this[e] = () => this.toString(), this._reader = m.clone(), this._refs = [...k], this._refsOffset = 0;
    }
    /**
     * Get remaining bits
     */
    get remainingBits() {
      return this._reader.remaining;
    }
    /**
     * Get offset bits
     */
    get offsetBits() {
      return this._reader.offset;
    }
    /**
     * Get remaining refs
     */
    get remainingRefs() {
      return this._refs.length - this._refsOffset;
    }
    /**
     * Get offset refs
     */
    get offsetRefs() {
      return this._refsOffset;
    }
    /**
     * Skip bits
     * @param bits
     */
    skip(m) {
      return this._reader.skip(m), this;
    }
    /**
     * Load a single bit
     * @returns true or false depending on the bit value
     */
    loadBit() {
      return this._reader.loadBit();
    }
    /**
     * Preload a signle bit
     * @returns true or false depending on the bit value
     */
    preloadBit() {
      return this._reader.preloadBit();
    }
    /**
     * Load a boolean
     * @returns true or false depending on the bit value
     */
    loadBoolean() {
      return this.loadBit();
    }
    /**
     * Load maybe boolean
     * @returns true or false depending on the bit value or null
     */
    loadMaybeBoolean() {
      return this.loadBit() ? this.loadBoolean() : null;
    }
    /**
     * Load bits as a new BitString
     * @param bits number of bits to read
     * @returns new BitString
     */
    loadBits(m) {
      return this._reader.loadBits(m);
    }
    /**
     * Preload bits as a new BitString
     * @param bits number of bits to read
     * @returns new BitString
     */
    preloadBits(m) {
      return this._reader.preloadBits(m);
    }
    /**
     * Load uint
     * @param bits number of bits to read
     * @returns uint value
     */
    loadUint(m) {
      return this._reader.loadUint(m);
    }
    /**
     * Load uint
     * @param bits number of bits to read
     * @returns uint value
     */
    loadUintBig(m) {
      return this._reader.loadUintBig(m);
    }
    /**
     * Preload uint
     * @param bits number of bits to read
     * @returns uint value
     */
    preloadUint(m) {
      return this._reader.preloadUint(m);
    }
    /**
     * Preload uint
     * @param bits number of bits to read
     * @returns uint value
     */
    preloadUintBig(m) {
      return this._reader.preloadUintBig(m);
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeUint(m) {
      return this.loadBit() ? this.loadUint(m) : null;
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeUintBig(m) {
      return this.loadBit() ? this.loadUintBig(m) : null;
    }
    /**
     * Load int
     * @param bits number of bits to read
     * @returns int value
     */
    loadInt(m) {
      return this._reader.loadInt(m);
    }
    /**
     * Load int
     * @param bits number of bits to read
     * @returns int value
     */
    loadIntBig(m) {
      return this._reader.loadIntBig(m);
    }
    /**
     * Preload int
     * @param bits number of bits to read
     * @returns int value
     */
    preloadInt(m) {
      return this._reader.preloadInt(m);
    }
    /**
     * Preload int
     * @param bits number of bits to read
     * @returns int value
     */
    preloadIntBig(m) {
      return this._reader.preloadIntBig(m);
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeInt(m) {
      return this.loadBit() ? this.loadInt(m) : null;
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeIntBig(m) {
      return this.loadBit() ? this.loadIntBig(m) : null;
    }
    /**
     * Load varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    loadVarUint(m) {
      return this._reader.loadVarUint(m);
    }
    /**
     * Load varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    loadVarUintBig(m) {
      return this._reader.loadVarUintBig(m);
    }
    /**
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUint(m) {
      return this._reader.preloadVarUint(m);
    }
    /**
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUintBig(m) {
      return this._reader.preloadVarUintBig(m);
    }
    /**
     * Load varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    loadVarInt(m) {
      return this._reader.loadVarInt(m);
    }
    /**
     * Load varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    loadVarIntBig(m) {
      return this._reader.loadVarIntBig(m);
    }
    /**
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarInt(m) {
      return this._reader.preloadVarInt(m);
    }
    /**
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarIntBig(m) {
      return this._reader.preloadVarIntBig(m);
    }
    /**
     * Load coins
     * @returns coins value
     */
    loadCoins() {
      return this._reader.loadCoins();
    }
    /**
     * Preload coins
     * @returns coins value
     */
    preloadCoins() {
      return this._reader.preloadCoins();
    }
    /**
     * Load maybe coins
     * @returns coins value or null
     */
    loadMaybeCoins() {
      return this._reader.loadBit() ? this._reader.loadCoins() : null;
    }
    /**
     * Load internal Address
     * @returns Address
     */
    loadAddress() {
      return this._reader.loadAddress();
    }
    /**
     * Load optional internal Address
     * @returns Address or null
     */
    loadMaybeAddress() {
      return this._reader.loadMaybeAddress();
    }
    /**
     * Load external address
     * @returns ExternalAddress
     */
    loadExternalAddress() {
      return this._reader.loadExternalAddress();
    }
    /**
     * Load optional external address
     * @returns ExternalAddress or null
     */
    loadMaybeExternalAddress() {
      return this._reader.loadMaybeExternalAddress();
    }
    /**
     * Load address
     * @returns Address, ExternalAddress or null
     */
    loadAddressAny() {
      return this._reader.loadAddressAny();
    }
    /**
     * Load reference
     * @returns Cell
     */
    loadRef() {
      if (this._refsOffset >= this._refs.length)
        throw new Error("No more references");
      return this._refs[this._refsOffset++];
    }
    /**
     * Preload reference
     * @returns Cell
     */
    preloadRef() {
      if (this._refsOffset >= this._refs.length)
        throw new Error("No more references");
      return this._refs[this._refsOffset];
    }
    /**
     * Load optional reference
     * @returns Cell or null
     */
    loadMaybeRef() {
      return this.loadBit() ? this.loadRef() : null;
    }
    /**
     * Preload optional reference
     * @returns Cell or null
     */
    preloadMaybeRef() {
      return this.preloadBit() ? this.preloadRef() : null;
    }
    /**
     * Load byte buffer
     * @param bytes number of bytes to load
     * @returns Buffer
     */
    loadBuffer(m) {
      return this._reader.loadBuffer(m);
    }
    /**
     * Load byte buffer
     * @param bytes number of bytes to load
     * @returns Buffer
     */
    preloadBuffer(m) {
      return this._reader.preloadBuffer(m);
    }
    /**
     * Load string tail
     */
    loadStringTail() {
      return (0, f.readString)(this);
    }
    /**
     * Load maybe string tail
     * @returns string or null
     */
    loadMaybeStringTail() {
      return this.loadBit() ? (0, f.readString)(this) : null;
    }
    /**
     * Load string tail from ref
     * @returns string
     */
    loadStringRefTail() {
      return (0, f.readString)(this.loadRef().beginParse());
    }
    /**
     * Load maybe string tail from ref
     * @returns string or null
     */
    loadMaybeStringRefTail() {
      const m = this.loadMaybeRef();
      return m ? (0, f.readString)(m.beginParse()) : null;
    }
    /**
     * Loads dictionary
     * @param key key description
     * @param value value description
     * @returns Dictionary<K, V>
     */
    loadDict(m, k) {
      return i.Dictionary.load(m, k, this);
    }
    /**
     * Loads dictionary directly from current slice
     * @param key key description
     * @param value value description
     * @returns Dictionary<K, V>
     */
    loadDictDirect(m, k) {
      return i.Dictionary.loadDirect(m, k, this);
    }
    /**
     * Checks if slice is empty
     */
    endParse() {
      if (this.remainingBits > 0 || this.remainingRefs > 0)
        throw new Error("Slice is not empty");
    }
    /**
     * Convert slice to cell
     */
    asCell() {
      return (0, u.beginCell)().storeSlice(this).endCell();
    }
    /**
     *
     * @returns
     */
    asBuilder() {
      return (0, u.beginCell)().storeSlice(this);
    }
    /**
     * Clone slice
     * @returns cloned slice
     */
    clone(m = !1) {
      if (m) {
        let k = this._reader.clone();
        return k.reset(), new da(k, this._refs);
      } else {
        let k = new da(this._reader, this._refs);
        return k._refsOffset = this._refsOffset, k;
      }
    }
    /**
     * Print slice as string by converting it to cell
     * @returns string
     */
    toString() {
      return this.asCell().toString();
    }
  };
  return tn.Slice = o, e = r.default, tn;
}
var In = {}, xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.BitReader = void 0;
const rs = yt, ns = Lr;
class va {
  constructor(e, r = 0) {
    this._checkpoints = [], this._bits = e, this._offset = r;
  }
  /**
   * Offset in source bit string
   */
  get offset() {
    return this._offset;
  }
  /**
   * Number of bits remaining
   */
  get remaining() {
    return this._bits.length - this._offset;
  }
  /**
   * Skip bits
   * @param bits number of bits to skip
   */
  skip(e) {
    if (e < 0 || this._offset + e > this._bits.length)
      throw new Error(`Index ${this._offset + e} is out of bounds`);
    this._offset += e;
  }
  /**
   * Reset to the beginning or latest checkpoint
   */
  reset() {
    this._checkpoints.length > 0 ? this._offset = this._checkpoints.pop() : this._offset = 0;
  }
  /**
   * Save checkpoint
   */
  save() {
    this._checkpoints.push(this._offset);
  }
  /**
   * Load a single bit
   * @returns true if the bit is set, false otherwise
   */
  loadBit() {
    let e = this._bits.at(this._offset);
    return this._offset++, e;
  }
  /**
   * Preload bit
   * @returns true if the bit is set, false otherwise
   */
  preloadBit() {
    return this._bits.at(this._offset);
  }
  /**
   * Load bit string
   * @param bits number of bits to read
   * @returns new bitstring
   */
  loadBits(e) {
    let r = this._bits.substring(this._offset, e);
    return this._offset += e, r;
  }
  /**
   * Preload bit string
   * @param bits number of bits to read
   * @returns new bitstring
   */
  preloadBits(e) {
    return this._bits.substring(this._offset, e);
  }
  /**
   * Load buffer
   * @param bytes number of bytes
   * @returns new buffer
   */
  loadBuffer(e) {
    let r = this._preloadBuffer(e, this._offset);
    return this._offset += e * 8, r;
  }
  /**
   * Preload buffer
   * @param bytes number of bytes
   * @returns new buffer
   */
  preloadBuffer(e) {
    return this._preloadBuffer(e, this._offset);
  }
  /**
   * Load uint value
   * @param bits uint bits
   * @returns read value as number
   */
  loadUint(e) {
    return Number(this.loadUintBig(e));
  }
  /**
   * Load uint value as bigint
   * @param bits uint bits
   * @returns read value as bigint
   */
  loadUintBig(e) {
    let r = this.preloadUintBig(e);
    return this._offset += e, r;
  }
  /**
   * Preload uint value
   * @param bits uint bits
   * @returns read value as number
   */
  preloadUint(e) {
    return Number(this._preloadUint(e, this._offset));
  }
  /**
   * Preload uint value as bigint
   * @param bits uint bits
   * @returns read value as bigint
   */
  preloadUintBig(e) {
    return this._preloadUint(e, this._offset);
  }
  /**
   * Load int value
   * @param bits int bits
   * @returns read value as bigint
   */
  loadInt(e) {
    let r = this._preloadInt(e, this._offset);
    return this._offset += e, Number(r);
  }
  /**
   * Load int value as bigint
   * @param bits int bits
   * @returns read value as bigint
   */
  loadIntBig(e) {
    let r = this._preloadInt(e, this._offset);
    return this._offset += e, r;
  }
  /**
   * Preload int value
   * @param bits int bits
   * @returns read value as bigint
   */
  preloadInt(e) {
    return Number(this._preloadInt(e, this._offset));
  }
  /**
   * Preload int value
   * @param bits int bits
   * @returns read value as bigint
   */
  preloadIntBig(e) {
    return this._preloadInt(e, this._offset);
  }
  /**
   * Load varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarUint(e) {
    let r = Number(this.loadUint(e));
    return Number(this.loadUintBig(r * 8));
  }
  /**
   * Load varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarUintBig(e) {
    let r = Number(this.loadUint(e));
    return this.loadUintBig(r * 8);
  }
  /**
   * Preload varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarUint(e) {
    let r = Number(this._preloadUint(e, this._offset));
    return Number(this._preloadUint(r * 8, this._offset + e));
  }
  /**
   * Preload varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarUintBig(e) {
    let r = Number(this._preloadUint(e, this._offset));
    return this._preloadUint(r * 8, this._offset + e);
  }
  /**
   * Load varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarInt(e) {
    let r = Number(this.loadUint(e));
    return Number(this.loadIntBig(r * 8));
  }
  /**
   * Load varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarIntBig(e) {
    let r = Number(this.loadUint(e));
    return this.loadIntBig(r * 8);
  }
  /**
   * Preload varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarInt(e) {
    let r = Number(this._preloadUint(e, this._offset));
    return Number(this._preloadInt(r * 8, this._offset + e));
  }
  /**
   * Preload varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarIntBig(e) {
    let r = Number(this._preloadUint(e, this._offset));
    return this._preloadInt(r * 8, this._offset + e);
  }
  /**
   * Load coins value
   * @returns read value as bigint
   */
  loadCoins() {
    return this.loadVarUintBig(4);
  }
  /**
   * Preload coins value
   * @returns read value as bigint
   */
  preloadCoins() {
    return this.preloadVarUintBig(4);
  }
  /**
   * Load Address
   * @returns Address
   */
  loadAddress() {
    let e = Number(this._preloadUint(2, this._offset));
    if (e === 2)
      return this._loadInternalAddress();
    throw new Error("Invalid address: " + e);
  }
  /**
   * Load internal address
   * @returns Address or null
   */
  loadMaybeAddress() {
    let e = Number(this._preloadUint(2, this._offset));
    if (e === 0)
      return this._offset += 2, null;
    if (e === 2)
      return this._loadInternalAddress();
    throw new Error("Invalid address");
  }
  /**
   * Load external address
   * @returns ExternalAddress
   */
  loadExternalAddress() {
    if (Number(this._preloadUint(2, this._offset)) === 1)
      return this._loadExternalAddress();
    throw new Error("Invalid address");
  }
  /**
   * Load external address
   * @returns ExternalAddress or null
   */
  loadMaybeExternalAddress() {
    let e = Number(this._preloadUint(2, this._offset));
    if (e === 0)
      return this._offset += 2, null;
    if (e === 1)
      return this._loadExternalAddress();
    throw new Error("Invalid address");
  }
  /**
   * Read address of any type
   * @returns Address or ExternalAddress or null
   */
  loadAddressAny() {
    let e = Number(this._preloadUint(2, this._offset));
    if (e === 0)
      return this._offset += 2, null;
    if (e === 2)
      return this._loadInternalAddress();
    if (e === 1)
      return this._loadExternalAddress();
    throw Error(e === 3 ? "Unsupported" : "Unreachable");
  }
  /**
   * Load bit string that was padded to make it byte alligned. Used in BOC serialization
   * @param bytes number of bytes to read
   */
  loadPaddedBits(e) {
    if (e % 8 !== 0)
      throw new Error("Invalid number of bits");
    let r = e;
    for (; ; )
      if (this._bits.at(this._offset + r - 1)) {
        r--;
        break;
      } else
        r--;
    let i = this._bits.substring(this._offset, r);
    return this._offset += e, i;
  }
  /**
   * Clone BitReader
   */
  clone() {
    return new va(this._bits, this._offset);
  }
  /**
   * Preload int from specific offset
   * @param bits bits to preload
   * @param offset offset to start from
   * @returns read value as bigint
   */
  _preloadInt(e, r) {
    if (e == 0)
      return 0n;
    let i = this._bits.at(r), u = 0n;
    for (let f = 0; f < e - 1; f++)
      this._bits.at(r + 1 + f) && (u += 1n << BigInt(e - f - 1 - 1));
    return i && (u = u - (1n << BigInt(e - 1))), u;
  }
  /**
   * Preload uint from specific offset
   * @param bits bits to preload
   * @param offset offset to start from
   * @returns read value as bigint
   */
  _preloadUint(e, r) {
    if (e == 0)
      return 0n;
    let i = 0n;
    for (let u = 0; u < e; u++)
      this._bits.at(r + u) && (i += 1n << BigInt(e - u - 1));
    return i;
  }
  _preloadBuffer(e, r) {
    let i = this._bits.subbuffer(r, e * 8);
    if (i)
      return i;
    let u = Buffer.alloc(e);
    for (let f = 0; f < e; f++)
      u[f] = Number(this._preloadUint(8, r + f * 8));
    return u;
  }
  _loadInternalAddress() {
    if (Number(this._preloadUint(2, this._offset)) !== 2 || this._preloadUint(1, this._offset + 2) !== 0n)
      throw Error("Invalid address");
    let r = Number(this._preloadInt(8, this._offset + 3)), i = this._preloadBuffer(32, this._offset + 11);
    return this._offset += 267, new rs.Address(r, i);
  }
  _loadExternalAddress() {
    if (Number(this._preloadUint(2, this._offset)) !== 1)
      throw Error("Invalid address");
    let r = Number(this._preloadUint(9, this._offset + 2)), i = this._preloadUint(r, this._offset + 11);
    return this._offset += 11 + r, new ns.ExternalAddress(i, r);
  }
}
xt.BitReader = va;
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.exoticLibrary = void 0;
const as = xt;
function is(t, e) {
  const r = new as.BitReader(t);
  if (t.length !== 264)
    throw new Error(`Library cell must have exactly (8 + 256) bits, got "${t.length}"`);
  let u = r.loadUint(8);
  if (u !== 2)
    throw new Error(`Library cell must have type 2, got "${u}"`);
  return {};
}
dn.exoticLibrary = is;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.exoticMerkleProof = void 0;
const os = xt;
function ss(t, e) {
  const r = new os.BitReader(t);
  if (t.length !== 280)
    throw new Error(`Merkle Proof cell must have exactly (8 + 256 + 16) bits, got "${t.length}"`);
  if (e.length !== 1)
    throw new Error(`Merkle Proof cell must have exactly 1 ref, got "${e.length}"`);
  let u = r.loadUint(8);
  if (u !== 3)
    throw new Error(`Merkle Proof cell must have type 3, got "${u}"`);
  const f = r.loadBuffer(32), o = r.loadUint(16), h = e[0].hash(0), m = e[0].depth(0);
  if (o !== m)
    throw new Error(`Merkle Proof cell ref depth must be exactly "${o}", got "${m}"`);
  if (!f.equals(h))
    throw new Error(`Merkle Proof cell ref hash must be exactly "${f.toString("hex")}", got "${h.toString("hex")}"`);
  return {
    proofDepth: o,
    proofHash: f
  };
}
Kr.exoticMerkleProof = ss;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.exoticMerkleUpdate = void 0;
const ls = xt;
function us(t, e) {
  const r = new ls.BitReader(t), i = 8 + 2 * 272;
  if (t.length !== i)
    throw new Error(`Merkle Update cell must have exactly (8 + (2 * (256 + 16))) bits, got "${t.length}"`);
  if (e.length !== 2)
    throw new Error(`Merkle Update cell must have exactly 2 refs, got "${e.length}"`);
  let u = r.loadUint(8);
  if (u !== 4)
    throw new Error(`Merkle Update cell type must be exactly 4, got "${u}"`);
  const f = r.loadBuffer(32), o = r.loadBuffer(32), h = r.loadUint(16), m = r.loadUint(16);
  if (h !== e[0].depth(0))
    throw new Error(`Merkle Update cell ref depth must be exactly "${h}", got "${e[0].depth(0)}"`);
  if (!f.equals(e[0].hash(0)))
    throw new Error(`Merkle Update cell ref hash must be exactly "${f.toString("hex")}", got "${e[0].hash(0).toString("hex")}"`);
  if (m !== e[1].depth(0))
    throw new Error(`Merkle Update cell ref depth must be exactly "${m}", got "${e[1].depth(0)}"`);
  if (!o.equals(e[1].hash(0)))
    throw new Error(`Merkle Update cell ref hash must be exactly "${o.toString("hex")}", got "${e[1].hash(0).toString("hex")}"`);
  return {
    proofDepth1: h,
    proofDepth2: m,
    proofHash1: f,
    proofHash2: o
  };
}
Hr.exoticMerkleUpdate = us;
var Vr = {}, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.LevelMask = void 0;
class wa {
  constructor(e = 0) {
    this._mask = 0, this._mask = e, this._hashIndex = cs(this._mask), this._hashCount = this._hashIndex + 1;
  }
  get value() {
    return this._mask;
  }
  get level() {
    return 32 - Math.clz32(this._mask);
  }
  get hashIndex() {
    return this._hashIndex;
  }
  get hashCount() {
    return this._hashCount;
  }
  apply(e) {
    return new wa(this._mask & (1 << e) - 1);
  }
  isSignificant(e) {
    return e === 0 || (this._mask >> e - 1) % 2 !== 0;
  }
}
Gr.LevelMask = wa;
function cs(t) {
  return t = t - (t >> 1 & 1431655765), t = (t & 858993459) + (t >> 2 & 858993459), (t + (t >> 4) & 252645135) * 16843009 >> 24;
}
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.exoticPruned = void 0;
const ds = xt, Fa = Gr;
function fs(t, e) {
  let r = new ds.BitReader(t), i = r.loadUint(8);
  if (i !== 1)
    throw new Error(`Pruned branch cell must have type 1, got "${i}"`);
  if (e.length !== 0)
    throw new Error(`Pruned Branch cell can't has refs, got "${e.length}"`);
  let u;
  if (t.length === 280)
    u = new Fa.LevelMask(1);
  else {
    if (u = new Fa.LevelMask(r.loadUint(8)), u.level < 1 || u.level > 3)
      throw new Error(`Pruned Branch cell level must be >= 1 and <= 3, got "${u.level}/${u.value}"`);
    const m = 16 + u.apply(u.level - 1).hashCount * 272;
    if (t.length !== m)
      throw new Error(`Pruned branch cell must have exactly ${m} bits, got "${t.length}"`);
  }
  let f = [], o = [], h = [];
  for (let m = 0; m < u.level; m++)
    o.push(r.loadBuffer(32));
  for (let m = 0; m < u.level; m++)
    h.push(r.loadUint(16));
  for (let m = 0; m < u.level; m++)
    f.push({
      depth: h[m],
      hash: o[m]
    });
  return {
    mask: u.value,
    pruned: f
  };
}
Vr.exoticPruned = fs;
Object.defineProperty(In, "__esModule", { value: !0 });
In.resolveExotic = void 0;
const hs = xt, Rn = Fr, gs = dn, ps = Kr, ms = Hr, ys = Vr, On = Gr;
function bs(t, e) {
  let r = (0, ys.exoticPruned)(t, e), i = [], u = [], f = new On.LevelMask(r.mask);
  for (let o = 0; o < r.pruned.length; o++)
    i.push(r.pruned[o].depth), u.push(r.pruned[o].hash);
  return {
    type: Rn.CellType.PrunedBranch,
    depths: i,
    hashes: u,
    mask: f
  };
}
function vs(t, e) {
  (0, gs.exoticLibrary)(t, e);
  let r = [], i = [], u = new On.LevelMask();
  return {
    type: Rn.CellType.Library,
    depths: r,
    hashes: i,
    mask: u
  };
}
function ws(t, e) {
  (0, ps.exoticMerkleProof)(t, e);
  let r = [], i = [], u = new On.LevelMask(e[0].level() >> 1);
  return {
    type: Rn.CellType.MerkleProof,
    depths: r,
    hashes: i,
    mask: u
  };
}
function xs(t, e) {
  (0, ms.exoticMerkleUpdate)(t, e);
  let r = [], i = [], u = new On.LevelMask((e[0].level() | e[1].level()) >> 1);
  return {
    type: Rn.CellType.MerkleUpdate,
    depths: r,
    hashes: i,
    mask: u
  };
}
function _s(t, e) {
  let i = new hs.BitReader(t).preloadUint(8);
  if (i === 1)
    return bs(t, e);
  if (i === 2)
    return vs(t, e);
  if (i === 3)
    return ws(t, e);
  if (i === 4)
    return xs(t, e);
  throw Error("Invalid exotic cell type: " + i);
}
In.resolveExotic = _s;
var zn = {}, jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.getRepr = jt.getBitsDescriptor = jt.getRefsDescriptor = void 0;
const ln = Fr, ks = En();
function wi(t, e, r) {
  return t.length + (r !== ln.CellType.Ordinary ? 1 : 0) * 8 + e * 32;
}
jt.getRefsDescriptor = wi;
function xi(t) {
  let e = t.length;
  return Math.ceil(e / 8) + Math.floor(e / 8);
}
jt.getBitsDescriptor = xi;
function Bs(t, e, r, i, u) {
  const f = Math.ceil(e.length / 8), o = Buffer.alloc(2 + f + 34 * r.length);
  let h = 0;
  o[h++] = wi(r, i, u), o[h++] = xi(t), (0, ks.bitsToPaddedBuffer)(e).copy(o, h), h += f;
  for (const m of r) {
    let k;
    u == ln.CellType.MerkleProof || u == ln.CellType.MerkleUpdate ? k = m.depth(i + 1) : k = m.depth(i), o[h++] = Math.floor(k / 256), o[h++] = k % 256;
  }
  for (const m of r) {
    let k;
    u == ln.CellType.MerkleProof || u == ln.CellType.MerkleUpdate ? k = m.hash(i + 1) : k = m.hash(i), k.copy(o, h), h += 32;
  }
  return o;
}
jt.getRepr = Bs;
var ta = {}, Lt = {}, _i = { exports: {} };
(function(t, e) {
  (function(r, i) {
    t.exports = i();
  })(Ke, function() {
    var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function i(v, d, y, b) {
      var _, g, M, z = d || [0], q = (y = y || 0) >>> 3, G = b === -1 ? 3 : 0;
      for (_ = 0; _ < v.length; _ += 1) g = (M = _ + q) >>> 2, z.length <= g && z.push(0), z[g] |= v[_] << 8 * (G + b * (M % 4));
      return { value: z, binLen: 8 * v.length + y };
    }
    function u(v, d, y) {
      switch (d) {
        case "UTF8":
        case "UTF16BE":
        case "UTF16LE":
          break;
        default:
          throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
      }
      switch (v) {
        case "HEX":
          return function(b, _, g) {
            return function(M, z, q, G) {
              var ue, V, J, me;
              if (M.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
              var F = z || [0], je = (q = q || 0) >>> 3, Te = G === -1 ? 3 : 0;
              for (ue = 0; ue < M.length; ue += 2) {
                if (V = parseInt(M.substr(ue, 2), 16), isNaN(V)) throw new Error("String of HEX type contains invalid characters");
                for (J = (me = (ue >>> 1) + je) >>> 2; F.length <= J; ) F.push(0);
                F[J] |= V << 8 * (Te + G * (me % 4));
              }
              return { value: F, binLen: 4 * M.length + q };
            }(b, _, g, y);
          };
        case "TEXT":
          return function(b, _, g) {
            return function(M, z, q, G, ue) {
              var V, J, me, F, je, Te, De, Ve, nt = 0, Qe = q || [0], ot = (G = G || 0) >>> 3;
              if (z === "UTF8") for (De = ue === -1 ? 3 : 0, me = 0; me < M.length; me += 1) for (J = [], 128 > (V = M.charCodeAt(me)) ? J.push(V) : 2048 > V ? (J.push(192 | V >>> 6), J.push(128 | 63 & V)) : 55296 > V || 57344 <= V ? J.push(224 | V >>> 12, 128 | V >>> 6 & 63, 128 | 63 & V) : (me += 1, V = 65536 + ((1023 & V) << 10 | 1023 & M.charCodeAt(me)), J.push(240 | V >>> 18, 128 | V >>> 12 & 63, 128 | V >>> 6 & 63, 128 | 63 & V)), F = 0; F < J.length; F += 1) {
                for (je = (Te = nt + ot) >>> 2; Qe.length <= je; ) Qe.push(0);
                Qe[je] |= J[F] << 8 * (De + ue * (Te % 4)), nt += 1;
              }
              else for (De = ue === -1 ? 2 : 0, Ve = z === "UTF16LE" && ue !== 1 || z !== "UTF16LE" && ue === 1, me = 0; me < M.length; me += 1) {
                for (V = M.charCodeAt(me), Ve === !0 && (V = (F = 255 & V) << 8 | V >>> 8), je = (Te = nt + ot) >>> 2; Qe.length <= je; ) Qe.push(0);
                Qe[je] |= V << 8 * (De + ue * (Te % 4)), nt += 2;
              }
              return { value: Qe, binLen: 8 * nt + G };
            }(b, d, _, g, y);
          };
        case "B64":
          return function(b, _, g) {
            return function(M, z, q, G) {
              var ue, V, J, me, F, je, Te = 0, De = z || [0], Ve = (q = q || 0) >>> 3, nt = G === -1 ? 3 : 0, Qe = M.indexOf("=");
              if (M.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
              if (M = M.replace(/=/g, ""), Qe !== -1 && Qe < M.length) throw new Error("Invalid '=' found in base-64 string");
              for (ue = 0; ue < M.length; ue += 4) {
                for (me = M.substr(ue, 4), J = 0, V = 0; V < me.length; V += 1) J |= r.indexOf(me.charAt(V)) << 18 - 6 * V;
                for (V = 0; V < me.length - 1; V += 1) {
                  for (F = (je = Te + Ve) >>> 2; De.length <= F; ) De.push(0);
                  De[F] |= (J >>> 16 - 8 * V & 255) << 8 * (nt + G * (je % 4)), Te += 1;
                }
              }
              return { value: De, binLen: 8 * Te + q };
            }(b, _, g, y);
          };
        case "BYTES":
          return function(b, _, g) {
            return function(M, z, q, G) {
              var ue, V, J, me, F = z || [0], je = (q = q || 0) >>> 3, Te = G === -1 ? 3 : 0;
              for (V = 0; V < M.length; V += 1) ue = M.charCodeAt(V), J = (me = V + je) >>> 2, F.length <= J && F.push(0), F[J] |= ue << 8 * (Te + G * (me % 4));
              return { value: F, binLen: 8 * M.length + q };
            }(b, _, g, y);
          };
        case "ARRAYBUFFER":
          try {
            new ArrayBuffer(0);
          } catch {
            throw new Error("ARRAYBUFFER not supported by this environment");
          }
          return function(b, _, g) {
            return function(M, z, q, G) {
              return i(new Uint8Array(M), z, q, G);
            }(b, _, g, y);
          };
        case "UINT8ARRAY":
          try {
            new Uint8Array(0);
          } catch {
            throw new Error("UINT8ARRAY not supported by this environment");
          }
          return function(b, _, g) {
            return i(b, _, g, y);
          };
        default:
          throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
      }
    }
    function f(v, d, y, b) {
      switch (v) {
        case "HEX":
          return function(_) {
            return function(g, M, z, q) {
              var G, ue, V = "", J = M / 8, me = z === -1 ? 3 : 0;
              for (G = 0; G < J; G += 1) ue = g[G >>> 2] >>> 8 * (me + z * (G % 4)), V += "0123456789abcdef".charAt(ue >>> 4 & 15) + "0123456789abcdef".charAt(15 & ue);
              return q.outputUpper ? V.toUpperCase() : V;
            }(_, d, y, b);
          };
        case "B64":
          return function(_) {
            return function(g, M, z, q) {
              var G, ue, V, J, me, F = "", je = M / 8, Te = z === -1 ? 3 : 0;
              for (G = 0; G < je; G += 3) for (J = G + 1 < je ? g[G + 1 >>> 2] : 0, me = G + 2 < je ? g[G + 2 >>> 2] : 0, V = (g[G >>> 2] >>> 8 * (Te + z * (G % 4)) & 255) << 16 | (J >>> 8 * (Te + z * ((G + 1) % 4)) & 255) << 8 | me >>> 8 * (Te + z * ((G + 2) % 4)) & 255, ue = 0; ue < 4; ue += 1) F += 8 * G + 6 * ue <= M ? r.charAt(V >>> 6 * (3 - ue) & 63) : q.b64Pad;
              return F;
            }(_, d, y, b);
          };
        case "BYTES":
          return function(_) {
            return function(g, M, z) {
              var q, G, ue = "", V = M / 8, J = z === -1 ? 3 : 0;
              for (q = 0; q < V; q += 1) G = g[q >>> 2] >>> 8 * (J + z * (q % 4)) & 255, ue += String.fromCharCode(G);
              return ue;
            }(_, d, y);
          };
        case "ARRAYBUFFER":
          try {
            new ArrayBuffer(0);
          } catch {
            throw new Error("ARRAYBUFFER not supported by this environment");
          }
          return function(_) {
            return function(g, M, z) {
              var q, G = M / 8, ue = new ArrayBuffer(G), V = new Uint8Array(ue), J = z === -1 ? 3 : 0;
              for (q = 0; q < G; q += 1) V[q] = g[q >>> 2] >>> 8 * (J + z * (q % 4)) & 255;
              return ue;
            }(_, d, y);
          };
        case "UINT8ARRAY":
          try {
            new Uint8Array(0);
          } catch {
            throw new Error("UINT8ARRAY not supported by this environment");
          }
          return function(_) {
            return function(g, M, z) {
              var q, G = M / 8, ue = z === -1 ? 3 : 0, V = new Uint8Array(G);
              for (q = 0; q < G; q += 1) V[q] = g[q >>> 2] >>> 8 * (ue + z * (q % 4)) & 255;
              return V;
            }(_, d, y);
          };
        default:
          throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
      }
    }
    var o = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], m = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], k = "Chosen SHA variant is not supported";
    function P(v, d) {
      var y, b, _ = v.binLen >>> 3, g = d.binLen >>> 3, M = _ << 3, z = 4 - _ << 3;
      if (_ % 4 != 0) {
        for (y = 0; y < g; y += 4) b = _ + y >>> 2, v.value[b] |= d.value[y >>> 2] << M, v.value.push(0), v.value[b + 1] |= d.value[y >>> 2] >>> z;
        return (v.value.length << 2) - 4 >= g + _ && v.value.pop(), { value: v.value, binLen: v.binLen + d.binLen };
      }
      return { value: v.value.concat(d.value), binLen: v.binLen + d.binLen };
    }
    function E(v) {
      var d = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, y = v || {}, b = "Output length must be a multiple of 8";
      if (d.outputUpper = y.outputUpper || !1, y.b64Pad && (d.b64Pad = y.b64Pad), y.outputLen) {
        if (y.outputLen % 8 != 0) throw new Error(b);
        d.outputLen = y.outputLen;
      } else if (y.shakeLen) {
        if (y.shakeLen % 8 != 0) throw new Error(b);
        d.outputLen = y.shakeLen;
      }
      if (typeof d.outputUpper != "boolean") throw new Error("Invalid outputUpper formatting option");
      if (typeof d.b64Pad != "string") throw new Error("Invalid b64Pad formatting option");
      return d;
    }
    function $(v, d, y, b) {
      var _ = v + " must include a value and format";
      if (!d) {
        if (!b) throw new Error(_);
        return b;
      }
      if (d.value === void 0 || !d.format) throw new Error(_);
      return u(d.format, d.encoding || "UTF8", y)(d.value);
    }
    var L = function() {
      function v(d, y, b) {
        var _ = b || {};
        if (this.t = y, this.i = _.encoding || "UTF8", this.numRounds = _.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
        this.o = d, this.u = [], this.s = 0, this.h = !1, this.v = 0, this.A = !1, this.l = [], this.H = [];
      }
      return v.prototype.update = function(d) {
        var y, b = 0, _ = this.S >>> 5, g = this.p(d, this.u, this.s), M = g.binLen, z = g.value, q = M >>> 5;
        for (y = 0; y < q; y += _) b + this.S <= M && (this.m = this.R(z.slice(y, y + _), this.m), b += this.S);
        this.v += b, this.u = z.slice(b >>> 5), this.s = M % this.S, this.h = !0;
      }, v.prototype.getHash = function(d, y) {
        var b, _, g = this.U, M = E(y);
        if (this.T) {
          if (M.outputLen === -1) throw new Error("Output length must be specified in options");
          g = M.outputLen;
        }
        var z = f(d, g, this.C, M);
        if (this.A && this.F) return z(this.F(M));
        for (_ = this.K(this.u.slice(), this.s, this.v, this.B(this.m), g), b = 1; b < this.numRounds; b += 1) this.T && g % 32 != 0 && (_[_.length - 1] &= 16777215 >>> 24 - g % 32), _ = this.K(_, g, 0, this.L(this.o), g);
        return z(_);
      }, v.prototype.setHMACKey = function(d, y, b) {
        if (!this.g) throw new Error("Variant does not support HMAC");
        if (this.h) throw new Error("Cannot set MAC key after calling update");
        var _ = u(y, (b || {}).encoding || "UTF8", this.C);
        this.k(_(d));
      }, v.prototype.k = function(d) {
        var y, b = this.S >>> 3, _ = b / 4 - 1;
        if (this.numRounds !== 1) throw new Error("Cannot set numRounds with MAC");
        if (this.A) throw new Error("MAC key already set");
        for (b < d.binLen / 8 && (d.value = this.K(d.value, d.binLen, 0, this.L(this.o), this.U)); d.value.length <= _; ) d.value.push(0);
        for (y = 0; y <= _; y += 1) this.l[y] = 909522486 ^ d.value[y], this.H[y] = 1549556828 ^ d.value[y];
        this.m = this.R(this.l, this.m), this.v = this.S, this.A = !0;
      }, v.prototype.getHMAC = function(d, y) {
        var b = E(y);
        return f(d, this.U, this.C, b)(this.Y());
      }, v.prototype.Y = function() {
        var d;
        if (!this.A) throw new Error("Cannot call getHMAC without first setting MAC key");
        var y = this.K(this.u.slice(), this.s, this.v, this.B(this.m), this.U);
        return d = this.R(this.H, this.L(this.o)), d = this.K(y, this.U, this.S, d, this.U);
      }, v;
    }(), ee = function(v, d) {
      return (ee = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(y, b) {
        y.__proto__ = b;
      } || function(y, b) {
        for (var _ in b) Object.prototype.hasOwnProperty.call(b, _) && (y[_] = b[_]);
      })(v, d);
    };
    function ae(v, d) {
      function y() {
        this.constructor = v;
      }
      ee(v, d), v.prototype = d === null ? Object.create(d) : (y.prototype = d.prototype, new y());
    }
    function fe(v, d) {
      return v << d | v >>> 32 - d;
    }
    function X(v, d) {
      return v >>> d | v << 32 - d;
    }
    function Y(v, d) {
      return v >>> d;
    }
    function O(v, d, y) {
      return v ^ d ^ y;
    }
    function T(v, d, y) {
      return v & d ^ ~v & y;
    }
    function W(v, d, y) {
      return v & d ^ v & y ^ d & y;
    }
    function H(v) {
      return X(v, 2) ^ X(v, 13) ^ X(v, 22);
    }
    function ie(v, d) {
      var y = (65535 & v) + (65535 & d);
      return (65535 & (v >>> 16) + (d >>> 16) + (y >>> 16)) << 16 | 65535 & y;
    }
    function Me(v, d, y, b) {
      var _ = (65535 & v) + (65535 & d) + (65535 & y) + (65535 & b);
      return (65535 & (v >>> 16) + (d >>> 16) + (y >>> 16) + (b >>> 16) + (_ >>> 16)) << 16 | 65535 & _;
    }
    function Pe(v, d, y, b, _) {
      var g = (65535 & v) + (65535 & d) + (65535 & y) + (65535 & b) + (65535 & _);
      return (65535 & (v >>> 16) + (d >>> 16) + (y >>> 16) + (b >>> 16) + (_ >>> 16) + (g >>> 16)) << 16 | 65535 & g;
    }
    function Fe(v) {
      return X(v, 7) ^ X(v, 18) ^ Y(v, 3);
    }
    function Ye(v) {
      return X(v, 6) ^ X(v, 11) ^ X(v, 25);
    }
    function He(v) {
      return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    }
    function U(v, d) {
      var y, b, _, g, M, z, q, G = [];
      for (y = d[0], b = d[1], _ = d[2], g = d[3], M = d[4], q = 0; q < 80; q += 1) G[q] = q < 16 ? v[q] : fe(G[q - 3] ^ G[q - 8] ^ G[q - 14] ^ G[q - 16], 1), z = q < 20 ? Pe(fe(y, 5), T(b, _, g), M, 1518500249, G[q]) : q < 40 ? Pe(fe(y, 5), O(b, _, g), M, 1859775393, G[q]) : q < 60 ? Pe(fe(y, 5), W(b, _, g), M, 2400959708, G[q]) : Pe(fe(y, 5), O(b, _, g), M, 3395469782, G[q]), M = g, g = _, _ = fe(b, 30), b = y, y = z;
      return d[0] = ie(y, d[0]), d[1] = ie(b, d[1]), d[2] = ie(_, d[2]), d[3] = ie(g, d[3]), d[4] = ie(M, d[4]), d;
    }
    function S(v, d, y, b) {
      for (var _, g = 15 + (d + 65 >>> 9 << 4), M = d + y; v.length <= g; ) v.push(0);
      for (v[d >>> 5] |= 128 << 24 - d % 32, v[g] = 4294967295 & M, v[g - 1] = M / 4294967296 | 0, _ = 0; _ < v.length; _ += 16) b = U(v.slice(_, _ + 16), b);
      return b;
    }
    var Z = function(v) {
      function d(y, b, _) {
        var g = this;
        if (y !== "SHA-1") throw new Error(k);
        var M = _ || {};
        return (g = v.call(this, y, b, _) || this).g = !0, g.F = g.Y, g.C = -1, g.p = u(g.t, g.i, g.C), g.R = U, g.B = function(z) {
          return z.slice();
        }, g.L = He, g.K = S, g.m = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], g.S = 512, g.U = 160, g.T = !1, M.hmacKey && g.k($("hmacKey", M.hmacKey, g.C)), g;
      }
      return ae(d, v), d;
    }(L);
    function le(v) {
      return v == "SHA-224" ? h.slice() : m.slice();
    }
    function Ae(v, d) {
      var y, b, _, g, M, z, q, G, ue, V, J, me, F = [];
      for (y = d[0], b = d[1], _ = d[2], g = d[3], M = d[4], z = d[5], q = d[6], G = d[7], J = 0; J < 64; J += 1) F[J] = J < 16 ? v[J] : Me(X(me = F[J - 2], 17) ^ X(me, 19) ^ Y(me, 10), F[J - 7], Fe(F[J - 15]), F[J - 16]), ue = Pe(G, Ye(M), T(M, z, q), o[J], F[J]), V = ie(H(y), W(y, b, _)), G = q, q = z, z = M, M = ie(g, ue), g = _, _ = b, b = y, y = ie(ue, V);
      return d[0] = ie(y, d[0]), d[1] = ie(b, d[1]), d[2] = ie(_, d[2]), d[3] = ie(g, d[3]), d[4] = ie(M, d[4]), d[5] = ie(z, d[5]), d[6] = ie(q, d[6]), d[7] = ie(G, d[7]), d;
    }
    var Oe = function(v) {
      function d(y, b, _) {
        var g = this;
        if (y !== "SHA-224" && y !== "SHA-256") throw new Error(k);
        var M = _ || {};
        return (g = v.call(this, y, b, _) || this).F = g.Y, g.g = !0, g.C = -1, g.p = u(g.t, g.i, g.C), g.R = Ae, g.B = function(z) {
          return z.slice();
        }, g.L = le, g.K = function(z, q, G, ue) {
          return function(V, J, me, F, je) {
            for (var Te, De = 15 + (J + 65 >>> 9 << 4), Ve = J + me; V.length <= De; ) V.push(0);
            for (V[J >>> 5] |= 128 << 24 - J % 32, V[De] = 4294967295 & Ve, V[De - 1] = Ve / 4294967296 | 0, Te = 0; Te < V.length; Te += 16) F = Ae(V.slice(Te, Te + 16), F);
            return je === "SHA-224" ? [F[0], F[1], F[2], F[3], F[4], F[5], F[6]] : F;
          }(z, q, G, ue, y);
        }, g.m = le(y), g.S = 512, g.U = y === "SHA-224" ? 224 : 256, g.T = !1, M.hmacKey && g.k($("hmacKey", M.hmacKey, g.C)), g;
      }
      return ae(d, v), d;
    }(L), x = function(v, d) {
      this.N = v, this.I = d;
    };
    function vt(v, d) {
      var y;
      return d > 32 ? (y = 64 - d, new x(v.I << d | v.N >>> y, v.N << d | v.I >>> y)) : d !== 0 ? (y = 32 - d, new x(v.N << d | v.I >>> y, v.I << d | v.N >>> y)) : v;
    }
    function rt(v, d) {
      var y;
      return d < 32 ? (y = 32 - d, new x(v.N >>> d | v.I << y, v.I >>> d | v.N << y)) : (y = 64 - d, new x(v.I >>> d | v.N << y, v.N >>> d | v.I << y));
    }
    function Ot(v, d) {
      return new x(v.N >>> d, v.I >>> d | v.N << 32 - d);
    }
    function ht(v, d, y) {
      return new x(v.N & d.N ^ ~v.N & y.N, v.I & d.I ^ ~v.I & y.I);
    }
    function gt(v, d, y) {
      return new x(v.N & d.N ^ v.N & y.N ^ d.N & y.N, v.I & d.I ^ v.I & y.I ^ d.I & y.I);
    }
    function Ue(v) {
      var d = rt(v, 28), y = rt(v, 34), b = rt(v, 39);
      return new x(d.N ^ y.N ^ b.N, d.I ^ y.I ^ b.I);
    }
    function We(v, d) {
      var y, b;
      y = (65535 & v.I) + (65535 & d.I);
      var _ = (65535 & (b = (v.I >>> 16) + (d.I >>> 16) + (y >>> 16))) << 16 | 65535 & y;
      return y = (65535 & v.N) + (65535 & d.N) + (b >>> 16), b = (v.N >>> 16) + (d.N >>> 16) + (y >>> 16), new x((65535 & b) << 16 | 65535 & y, _);
    }
    function yn(v, d, y, b) {
      var _, g;
      _ = (65535 & v.I) + (65535 & d.I) + (65535 & y.I) + (65535 & b.I);
      var M = (65535 & (g = (v.I >>> 16) + (d.I >>> 16) + (y.I >>> 16) + (b.I >>> 16) + (_ >>> 16))) << 16 | 65535 & _;
      return _ = (65535 & v.N) + (65535 & d.N) + (65535 & y.N) + (65535 & b.N) + (g >>> 16), g = (v.N >>> 16) + (d.N >>> 16) + (y.N >>> 16) + (b.N >>> 16) + (_ >>> 16), new x((65535 & g) << 16 | 65535 & _, M);
    }
    function bn(v, d, y, b, _) {
      var g, M;
      g = (65535 & v.I) + (65535 & d.I) + (65535 & y.I) + (65535 & b.I) + (65535 & _.I);
      var z = (65535 & (M = (v.I >>> 16) + (d.I >>> 16) + (y.I >>> 16) + (b.I >>> 16) + (_.I >>> 16) + (g >>> 16))) << 16 | 65535 & g;
      return g = (65535 & v.N) + (65535 & d.N) + (65535 & y.N) + (65535 & b.N) + (65535 & _.N) + (M >>> 16), M = (v.N >>> 16) + (d.N >>> 16) + (y.N >>> 16) + (b.N >>> 16) + (_.N >>> 16) + (g >>> 16), new x((65535 & M) << 16 | 65535 & g, z);
    }
    function _t(v, d) {
      return new x(v.N ^ d.N, v.I ^ d.I);
    }
    function Er(v) {
      var d = rt(v, 1), y = rt(v, 8), b = Ot(v, 7);
      return new x(d.N ^ y.N ^ b.N, d.I ^ y.I ^ b.I);
    }
    function vn(v) {
      var d = rt(v, 14), y = rt(v, 18), b = rt(v, 41);
      return new x(d.N ^ y.N ^ b.N, d.I ^ y.I ^ b.I);
    }
    var Ur = [new x(o[0], 3609767458), new x(o[1], 602891725), new x(o[2], 3964484399), new x(o[3], 2173295548), new x(o[4], 4081628472), new x(o[5], 3053834265), new x(o[6], 2937671579), new x(o[7], 3664609560), new x(o[8], 2734883394), new x(o[9], 1164996542), new x(o[10], 1323610764), new x(o[11], 3590304994), new x(o[12], 4068182383), new x(o[13], 991336113), new x(o[14], 633803317), new x(o[15], 3479774868), new x(o[16], 2666613458), new x(o[17], 944711139), new x(o[18], 2341262773), new x(o[19], 2007800933), new x(o[20], 1495990901), new x(o[21], 1856431235), new x(o[22], 3175218132), new x(o[23], 2198950837), new x(o[24], 3999719339), new x(o[25], 766784016), new x(o[26], 2566594879), new x(o[27], 3203337956), new x(o[28], 1034457026), new x(o[29], 2466948901), new x(o[30], 3758326383), new x(o[31], 168717936), new x(o[32], 1188179964), new x(o[33], 1546045734), new x(o[34], 1522805485), new x(o[35], 2643833823), new x(o[36], 2343527390), new x(o[37], 1014477480), new x(o[38], 1206759142), new x(o[39], 344077627), new x(o[40], 1290863460), new x(o[41], 3158454273), new x(o[42], 3505952657), new x(o[43], 106217008), new x(o[44], 3606008344), new x(o[45], 1432725776), new x(o[46], 1467031594), new x(o[47], 851169720), new x(o[48], 3100823752), new x(o[49], 1363258195), new x(o[50], 3750685593), new x(o[51], 3785050280), new x(o[52], 3318307427), new x(o[53], 3812723403), new x(o[54], 2003034995), new x(o[55], 3602036899), new x(o[56], 1575990012), new x(o[57], 1125592928), new x(o[58], 2716904306), new x(o[59], 442776044), new x(o[60], 593698344), new x(o[61], 3733110249), new x(o[62], 2999351573), new x(o[63], 3815920427), new x(3391569614, 3928383900), new x(3515267271, 566280711), new x(3940187606, 3454069534), new x(4118630271, 4000239992), new x(116418474, 1914138554), new x(174292421, 2731055270), new x(289380356, 3203993006), new x(460393269, 320620315), new x(685471733, 587496836), new x(852142971, 1086792851), new x(1017036298, 365543100), new x(1126000580, 2618297676), new x(1288033470, 3409855158), new x(1501505948, 4234509866), new x(1607167915, 987167468), new x(1816402316, 1246189591)];
    function Xr(v) {
      return v === "SHA-384" ? [new x(3418070365, h[0]), new x(1654270250, h[1]), new x(2438529370, h[2]), new x(355462360, h[3]), new x(1731405415, h[4]), new x(41048885895, h[5]), new x(3675008525, h[6]), new x(1203062813, h[7])] : [new x(m[0], 4089235720), new x(m[1], 2227873595), new x(m[2], 4271175723), new x(m[3], 1595750129), new x(m[4], 2917565137), new x(m[5], 725511199), new x(m[6], 4215389547), new x(m[7], 327033209)];
    }
    function wn(v, d) {
      var y, b, _, g, M, z, q, G, ue, V, J, me, F, je, Te, De, Ve = [];
      for (y = d[0], b = d[1], _ = d[2], g = d[3], M = d[4], z = d[5], q = d[6], G = d[7], J = 0; J < 80; J += 1) J < 16 ? (me = 2 * J, Ve[J] = new x(v[me], v[me + 1])) : Ve[J] = yn((F = Ve[J - 2], je = void 0, Te = void 0, De = void 0, je = rt(F, 19), Te = rt(F, 61), De = Ot(F, 6), new x(je.N ^ Te.N ^ De.N, je.I ^ Te.I ^ De.I)), Ve[J - 7], Er(Ve[J - 15]), Ve[J - 16]), ue = bn(G, vn(M), ht(M, z, q), Ur[J], Ve[J]), V = We(Ue(y), gt(y, b, _)), G = q, q = z, z = M, M = We(g, ue), g = _, _ = b, b = y, y = We(ue, V);
      return d[0] = We(y, d[0]), d[1] = We(b, d[1]), d[2] = We(_, d[2]), d[3] = We(g, d[3]), d[4] = We(M, d[4]), d[5] = We(z, d[5]), d[6] = We(q, d[6]), d[7] = We(G, d[7]), d;
    }
    var Qn = function(v) {
      function d(y, b, _) {
        var g = this;
        if (y !== "SHA-384" && y !== "SHA-512") throw new Error(k);
        var M = _ || {};
        return (g = v.call(this, y, b, _) || this).F = g.Y, g.g = !0, g.C = -1, g.p = u(g.t, g.i, g.C), g.R = wn, g.B = function(z) {
          return z.slice();
        }, g.L = Xr, g.K = function(z, q, G, ue) {
          return function(V, J, me, F, je) {
            for (var Te, De = 31 + (J + 129 >>> 10 << 5), Ve = J + me; V.length <= De; ) V.push(0);
            for (V[J >>> 5] |= 128 << 24 - J % 32, V[De] = 4294967295 & Ve, V[De - 1] = Ve / 4294967296 | 0, Te = 0; Te < V.length; Te += 32) F = wn(V.slice(Te, Te + 32), F);
            return je === "SHA-384" ? [(F = F)[0].N, F[0].I, F[1].N, F[1].I, F[2].N, F[2].I, F[3].N, F[3].I, F[4].N, F[4].I, F[5].N, F[5].I] : [F[0].N, F[0].I, F[1].N, F[1].I, F[2].N, F[2].I, F[3].N, F[3].I, F[4].N, F[4].I, F[5].N, F[5].I, F[6].N, F[6].I, F[7].N, F[7].I];
          }(z, q, G, ue, y);
        }, g.m = Xr(y), g.S = 1024, g.U = y === "SHA-384" ? 384 : 512, g.T = !1, M.hmacKey && g.k($("hmacKey", M.hmacKey, g.C)), g;
      }
      return ae(d, v), d;
    }(L), ea = [new x(0, 1), new x(0, 32898), new x(2147483648, 32906), new x(2147483648, 2147516416), new x(0, 32907), new x(0, 2147483649), new x(2147483648, 2147516545), new x(2147483648, 32777), new x(0, 138), new x(0, 136), new x(0, 2147516425), new x(0, 2147483658), new x(0, 2147516555), new x(2147483648, 139), new x(2147483648, 32905), new x(2147483648, 32771), new x(2147483648, 32770), new x(2147483648, 128), new x(0, 32778), new x(2147483648, 2147483658), new x(2147483648, 2147516545), new x(2147483648, 32896), new x(0, 2147483649), new x(2147483648, 2147516424)], xn = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
    function Tr(v) {
      var d, y = [];
      for (d = 0; d < 5; d += 1) y[d] = [new x(0, 0), new x(0, 0), new x(0, 0), new x(0, 0), new x(0, 0)];
      return y;
    }
    function Ct(v) {
      var d, y = [];
      for (d = 0; d < 5; d += 1) y[d] = v[d].slice();
      return y;
    }
    function Et(v, d) {
      var y, b, _, g, M, z, q, G, ue, V = [], J = [];
      if (v !== null) for (b = 0; b < v.length; b += 2) d[(b >>> 1) % 5][(b >>> 1) / 5 | 0] = _t(d[(b >>> 1) % 5][(b >>> 1) / 5 | 0], new x(v[b + 1], v[b]));
      for (y = 0; y < 24; y += 1) {
        for (g = Tr(), b = 0; b < 5; b += 1) V[b] = (M = d[b][0], z = d[b][1], q = d[b][2], G = d[b][3], ue = d[b][4], new x(M.N ^ z.N ^ q.N ^ G.N ^ ue.N, M.I ^ z.I ^ q.I ^ G.I ^ ue.I));
        for (b = 0; b < 5; b += 1) J[b] = _t(V[(b + 4) % 5], vt(V[(b + 1) % 5], 1));
        for (b = 0; b < 5; b += 1) for (_ = 0; _ < 5; _ += 1) d[b][_] = _t(d[b][_], J[b]);
        for (b = 0; b < 5; b += 1) for (_ = 0; _ < 5; _ += 1) g[_][(2 * b + 3 * _) % 5] = vt(d[b][_], xn[b][_]);
        for (b = 0; b < 5; b += 1) for (_ = 0; _ < 5; _ += 1) d[b][_] = _t(g[b][_], new x(~g[(b + 1) % 5][_].N & g[(b + 2) % 5][_].N, ~g[(b + 1) % 5][_].I & g[(b + 2) % 5][_].I));
        d[0][0] = _t(d[0][0], ea[y]);
      }
      return d;
    }
    function Jr(v) {
      var d, y, b = 0, _ = [0, 0], g = [4294967295 & v, v / 4294967296 & 2097151];
      for (d = 6; d >= 0; d--) (y = g[d >> 2] >>> 8 * d & 255) === 0 && b === 0 || (_[b + 1 >> 2] |= y << 8 * (b + 1), b += 1);
      return b = b !== 0 ? b : 1, _[0] |= b, { value: b + 1 > 4 ? _ : [_[0]], binLen: 8 + 8 * b };
    }
    function Zt(v) {
      return P(Jr(v.binLen), v);
    }
    function Mr(v, d) {
      var y, b = Jr(d), _ = d >>> 2, g = (_ - (b = P(b, v)).value.length % _) % _;
      for (y = 0; y < g; y++) b.value.push(0);
      return b.value;
    }
    var jr = function(v) {
      function d(y, b, _) {
        var g = this, M = 6, z = 0, q = _ || {};
        if ((g = v.call(this, y, b, _) || this).numRounds !== 1) {
          if (q.kmacKey || q.hmacKey) throw new Error("Cannot set numRounds with MAC");
          if (g.o === "CSHAKE128" || g.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
        }
        switch (g.C = 1, g.p = u(g.t, g.i, g.C), g.R = Et, g.B = Ct, g.L = Tr, g.m = Tr(), g.T = !1, y) {
          case "SHA3-224":
            g.S = z = 1152, g.U = 224, g.g = !0, g.F = g.Y;
            break;
          case "SHA3-256":
            g.S = z = 1088, g.U = 256, g.g = !0, g.F = g.Y;
            break;
          case "SHA3-384":
            g.S = z = 832, g.U = 384, g.g = !0, g.F = g.Y;
            break;
          case "SHA3-512":
            g.S = z = 576, g.U = 512, g.g = !0, g.F = g.Y;
            break;
          case "SHAKE128":
            M = 31, g.S = z = 1344, g.U = -1, g.T = !0, g.g = !1, g.F = null;
            break;
          case "SHAKE256":
            M = 31, g.S = z = 1088, g.U = -1, g.T = !0, g.g = !1, g.F = null;
            break;
          case "KMAC128":
            M = 4, g.S = z = 1344, g.M(_), g.U = -1, g.T = !0, g.g = !1, g.F = g.X;
            break;
          case "KMAC256":
            M = 4, g.S = z = 1088, g.M(_), g.U = -1, g.T = !0, g.g = !1, g.F = g.X;
            break;
          case "CSHAKE128":
            g.S = z = 1344, M = g.O(_), g.U = -1, g.T = !0, g.g = !1, g.F = null;
            break;
          case "CSHAKE256":
            g.S = z = 1088, M = g.O(_), g.U = -1, g.T = !0, g.g = !1, g.F = null;
            break;
          default:
            throw new Error(k);
        }
        return g.K = function(G, ue, V, J, me) {
          return function(F, je, Te, De, Ve, nt, Qe) {
            var ot, Qt, zt = 0, Nt = [], Ir = Ve >>> 5, ct = je >>> 5;
            for (ot = 0; ot < ct && je >= Ve; ot += Ir) De = Et(F.slice(ot, ot + Ir), De), je -= Ve;
            for (F = F.slice(ot), je %= Ve; F.length < Ir; ) F.push(0);
            for (F[(ot = je >>> 3) >> 2] ^= nt << ot % 4 * 8, F[Ir - 1] ^= 2147483648, De = Et(F, De); 32 * Nt.length < Qe && (Qt = De[zt % 5][zt / 5 | 0], Nt.push(Qt.I), !(32 * Nt.length >= Qe)); ) Nt.push(Qt.N), 64 * (zt += 1) % Ve == 0 && (Et(null, De), zt = 0);
            return Nt;
          }(G, ue, 0, J, z, M, me);
        }, q.hmacKey && g.k($("hmacKey", q.hmacKey, g.C)), g;
      }
      return ae(d, v), d.prototype.O = function(y, b) {
        var _ = function(q) {
          var G = q || {};
          return { funcName: $("funcName", G.funcName, 1, { value: [], binLen: 0 }), customization: $("Customization", G.customization, 1, { value: [], binLen: 0 }) };
        }(y || {});
        b && (_.funcName = b);
        var g = P(Zt(_.funcName), Zt(_.customization));
        if (_.customization.binLen !== 0 || _.funcName.binLen !== 0) {
          for (var M = Mr(g, this.S >>> 3), z = 0; z < M.length; z += this.S >>> 5) this.m = this.R(M.slice(z, z + (this.S >>> 5)), this.m), this.v += this.S;
          return 4;
        }
        return 31;
      }, d.prototype.M = function(y) {
        var b = function(M) {
          var z = M || {};
          return { kmacKey: $("kmacKey", z.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: $("Customization", z.customization, 1, { value: [], binLen: 0 }) };
        }(y || {});
        this.O(y, b.funcName);
        for (var _ = Mr(Zt(b.kmacKey), this.S >>> 3), g = 0; g < _.length; g += this.S >>> 5) this.m = this.R(_.slice(g, g + (this.S >>> 5)), this.m), this.v += this.S;
        this.A = !0;
      }, d.prototype.X = function(y) {
        var b = P({ value: this.u.slice(), binLen: this.s }, function(_) {
          var g, M, z = 0, q = [0, 0], G = [4294967295 & _, _ / 4294967296 & 2097151];
          for (g = 6; g >= 0; g--) (M = G[g >> 2] >>> 8 * g & 255) == 0 && z === 0 || (q[z >> 2] |= M << 8 * z, z += 1);
          return q[(z = z !== 0 ? z : 1) >> 2] |= z << 8 * z, { value: z + 1 > 4 ? q : [q[0]], binLen: 8 + 8 * z };
        }(y.outputLen));
        return this.K(b.value, b.binLen, this.v, this.B(this.m), y.outputLen);
      }, d;
    }(L);
    return function() {
      function v(d, y, b) {
        if (d == "SHA-1") this.j = new Z(d, y, b);
        else if (d == "SHA-224" || d == "SHA-256") this.j = new Oe(d, y, b);
        else if (d == "SHA-384" || d == "SHA-512") this.j = new Qn(d, y, b);
        else {
          if (d != "SHA3-224" && d != "SHA3-256" && d != "SHA3-384" && d != "SHA3-512" && d != "SHAKE128" && d != "SHAKE256" && d != "CSHAKE128" && d != "CSHAKE256" && d != "KMAC128" && d != "KMAC256") throw new Error(k);
          this.j = new jr(d, y, b);
        }
      }
      return v.prototype.update = function(d) {
        this.j.update(d);
      }, v.prototype.getHash = function(d, y) {
        return this.j.getHash(d, y);
      }, v.prototype.setHMACKey = function(d, y, b) {
        this.j.setHMACKey(d, y, b);
      }, v.prototype.getHMAC = function(d, y) {
        return this.j.getHMAC(d, y);
      }, v;
    }();
  });
})(_i);
var xa = _i.exports, Yr = {}, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.getSecureRandomWords = zr.getSecureRandomBytes = void 0;
function Ss(t) {
  return Buffer.from(window.crypto.getRandomValues(new Uint8Array(t)));
}
zr.getSecureRandomBytes = Ss;
function Ps(t) {
  return window.crypto.getRandomValues(new Uint16Array(t));
}
zr.getSecureRandomWords = Ps;
var Nn = {};
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.hmac_sha512 = void 0;
async function As(t, e) {
  let r = typeof t == "string" ? Buffer.from(t, "utf-8") : t, i = typeof e == "string" ? Buffer.from(e, "utf-8") : e;
  const u = { name: "HMAC", hash: "SHA-512" }, f = await window.crypto.subtle.importKey("raw", r, u, !1, ["sign"]);
  return Buffer.from(await crypto.subtle.sign(u, f, i));
}
Nn.hmac_sha512 = As;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.pbkdf2_sha512 = void 0;
async function Cs(t, e, r, i) {
  const u = typeof t == "string" ? Buffer.from(t, "utf-8") : t, f = typeof e == "string" ? Buffer.from(e, "utf-8") : e, o = await window.crypto.subtle.importKey("raw", u, { name: "PBKDF2" }, !1, ["deriveBits"]), h = await window.crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-512", salt: f, iterations: r }, o, i * 8);
  return Buffer.from(h);
}
qn.pbkdf2_sha512 = Cs;
var Dn = {};
Object.defineProperty(Dn, "__esModule", { value: !0 });
Dn.sha256 = void 0;
async function Es(t) {
  return typeof t == "string" ? Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(t, "utf-8"))) : Buffer.from(await crypto.subtle.digest("SHA-256", t));
}
Dn.sha256 = Es;
var $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
$n.sha512 = void 0;
async function Us(t) {
  return typeof t == "string" ? Buffer.from(await crypto.subtle.digest("SHA-512", Buffer.from(t, "utf-8"))) : Buffer.from(await crypto.subtle.digest("SHA-512", t));
}
$n.sha512 = Us;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.sha512 = t.sha256 = t.pbkdf2_sha512 = t.hmac_sha512 = t.getSecureRandomWords = t.getSecureRandomBytes = void 0;
  var e = zr;
  Object.defineProperty(t, "getSecureRandomBytes", { enumerable: !0, get: function() {
    return e.getSecureRandomBytes;
  } }), Object.defineProperty(t, "getSecureRandomWords", { enumerable: !0, get: function() {
    return e.getSecureRandomWords;
  } });
  var r = Nn;
  Object.defineProperty(t, "hmac_sha512", { enumerable: !0, get: function() {
    return r.hmac_sha512;
  } });
  var i = qn;
  Object.defineProperty(t, "pbkdf2_sha512", { enumerable: !0, get: function() {
    return i.pbkdf2_sha512;
  } });
  var u = Dn;
  Object.defineProperty(t, "sha256", { enumerable: !0, get: function() {
    return u.sha256;
  } });
  var f = $n;
  Object.defineProperty(t, "sha512", { enumerable: !0, get: function() {
    return f.sha512;
  } });
})(Yr);
var Ts = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(Lt, "__esModule", { value: !0 });
Lt.sha256 = Lt.sha256_fallback = Lt.sha256_sync = void 0;
const Ms = Ts(xa), js = Yr;
function ki(t) {
  let e;
  typeof t == "string" ? e = Buffer.from(t, "utf-8").toString("hex") : e = t.toString("hex");
  let r = new Ms.default("SHA-256", "HEX");
  r.update(e);
  let i = r.getHash("HEX");
  return Buffer.from(i, "hex");
}
Lt.sha256_sync = ki;
async function Is(t) {
  return ki(t);
}
Lt.sha256_fallback = Is;
function Rs(t) {
  return (0, js.sha256)(t);
}
Lt.sha256 = Rs;
var Ft = {}, Os = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(Ft, "__esModule", { value: !0 });
Ft.sha512 = Ft.sha512_fallback = Ft.sha512_sync = void 0;
const zs = Os(xa), Ns = Yr;
function Bi(t) {
  let e;
  typeof t == "string" ? e = Buffer.from(t, "utf-8").toString("hex") : e = t.toString("hex");
  let r = new zs.default("SHA-512", "HEX");
  r.update(e);
  let i = r.getHash("HEX");
  return Buffer.from(i, "hex");
}
Ft.sha512_sync = Bi;
async function qs(t) {
  return Bi(t);
}
Ft.sha512_fallback = qs;
async function Ds(t) {
  return (0, Ns.sha512)(t);
}
Ft.sha512 = Ds;
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.pbkdf2_sha512 = void 0;
const $s = Yr;
function Ls(t, e, r, i) {
  return (0, $s.pbkdf2_sha512)(t, e, r, i);
}
fn.pbkdf2_sha512 = Ls;
var Pt = {}, Fs = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.hmac_sha512 = Pt.hmac_sha512_fallback = void 0;
const Ks = Fs(xa), Hs = Yr;
async function Vs(t, e) {
  let r = typeof t == "string" ? Buffer.from(t, "utf-8") : t, i = typeof e == "string" ? Buffer.from(e, "utf-8") : e;
  const u = new Ks.default("SHA-512", "HEX", {
    hmacKey: { value: r.toString("hex"), format: "HEX" }
  });
  u.update(i.toString("hex"));
  const f = u.getHash("HEX");
  return Buffer.from(f, "hex");
}
Pt.hmac_sha512_fallback = Vs;
function Gs(t, e) {
  return (0, Hs.hmac_sha512)(t, e);
}
Pt.hmac_sha512 = Gs;
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.getSecureRandomNumber = St.getSecureRandomWords = St.getSecureRandomBytes = void 0;
const Ys = Yr;
async function Si(t) {
  return (0, Ys.getSecureRandomBytes)(t);
}
St.getSecureRandomBytes = Si;
async function Pi(t) {
  return Pi();
}
St.getSecureRandomWords = Pi;
async function Ws(t, e) {
  let r = e - t;
  var i = Math.ceil(Math.log2(r));
  if (i > 53)
    throw new Error("Range is too large");
  for (var u = Math.ceil(i / 8), f = Math.pow(2, i) - 1; ; ) {
    let h = await Si(i), m = (u - 1) * 8, k = 0;
    for (var o = 0; o < u; o++)
      k += h[o] * Math.pow(2, m), m -= 8;
    if (k = k & f, !(k >= r))
      return t + k;
  }
}
St.getSecureRandomNumber = Ws;
var Ln = {}, Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.wordlist = void 0;
Fn.wordlist = [
  "abacus",
  "abdomen",
  "abdominal",
  "abide",
  "abiding",
  "ability",
  "ablaze",
  "able",
  "abnormal",
  "abrasion",
  "abrasive",
  "abreast",
  "abridge",
  "abroad",
  "abruptly",
  "absence",
  "absentee",
  "absently",
  "absinthe",
  "absolute",
  "absolve",
  "abstain",
  "abstract",
  "absurd",
  "accent",
  "acclaim",
  "acclimate",
  "accompany",
  "account",
  "accuracy",
  "accurate",
  "accustom",
  "acetone",
  "achiness",
  "aching",
  "acid",
  "acorn",
  "acquaint",
  "acquire",
  "acre",
  "acrobat",
  "acronym",
  "acting",
  "action",
  "activate",
  "activator",
  "active",
  "activism",
  "activist",
  "activity",
  "actress",
  "acts",
  "acutely",
  "acuteness",
  "aeration",
  "aerobics",
  "aerosol",
  "aerospace",
  "afar",
  "affair",
  "affected",
  "affecting",
  "affection",
  "affidavit",
  "affiliate",
  "affirm",
  "affix",
  "afflicted",
  "affluent",
  "afford",
  "affront",
  "aflame",
  "afloat",
  "aflutter",
  "afoot",
  "afraid",
  "afterglow",
  "afterlife",
  "aftermath",
  "aftermost",
  "afternoon",
  "aged",
  "ageless",
  "agency",
  "agenda",
  "agent",
  "aggregate",
  "aghast",
  "agile",
  "agility",
  "aging",
  "agnostic",
  "agonize",
  "agonizing",
  "agony",
  "agreeable",
  "agreeably",
  "agreed",
  "agreeing",
  "agreement",
  "aground",
  "ahead",
  "ahoy",
  "aide",
  "aids",
  "aim",
  "ajar",
  "alabaster",
  "alarm",
  "albatross",
  "album",
  "alfalfa",
  "algebra",
  "algorithm",
  "alias",
  "alibi",
  "alienable",
  "alienate",
  "aliens",
  "alike",
  "alive",
  "alkaline",
  "alkalize",
  "almanac",
  "almighty",
  "almost",
  "aloe",
  "aloft",
  "aloha",
  "alone",
  "alongside",
  "aloof",
  "alphabet",
  "alright",
  "although",
  "altitude",
  "alto",
  "aluminum",
  "alumni",
  "always",
  "amaretto",
  "amaze",
  "amazingly",
  "amber",
  "ambiance",
  "ambiguity",
  "ambiguous",
  "ambition",
  "ambitious",
  "ambulance",
  "ambush",
  "amendable",
  "amendment",
  "amends",
  "amenity",
  "amiable",
  "amicably",
  "amid",
  "amigo",
  "amino",
  "amiss",
  "ammonia",
  "ammonium",
  "amnesty",
  "amniotic",
  "among",
  "amount",
  "amperage",
  "ample",
  "amplifier",
  "amplify",
  "amply",
  "amuck",
  "amulet",
  "amusable",
  "amused",
  "amusement",
  "amuser",
  "amusing",
  "anaconda",
  "anaerobic",
  "anagram",
  "anatomist",
  "anatomy",
  "anchor",
  "anchovy",
  "ancient",
  "android",
  "anemia",
  "anemic",
  "aneurism",
  "anew",
  "angelfish",
  "angelic",
  "anger",
  "angled",
  "angler",
  "angles",
  "angling",
  "angrily",
  "angriness",
  "anguished",
  "angular",
  "animal",
  "animate",
  "animating",
  "animation",
  "animator",
  "anime",
  "animosity",
  "ankle",
  "annex",
  "annotate",
  "announcer",
  "annoying",
  "annually",
  "annuity",
  "anointer",
  "another",
  "answering",
  "antacid",
  "antarctic",
  "anteater",
  "antelope",
  "antennae",
  "anthem",
  "anthill",
  "anthology",
  "antibody",
  "antics",
  "antidote",
  "antihero",
  "antiquely",
  "antiques",
  "antiquity",
  "antirust",
  "antitoxic",
  "antitrust",
  "antiviral",
  "antivirus",
  "antler",
  "antonym",
  "antsy",
  "anvil",
  "anybody",
  "anyhow",
  "anymore",
  "anyone",
  "anyplace",
  "anything",
  "anytime",
  "anyway",
  "anywhere",
  "aorta",
  "apache",
  "apostle",
  "appealing",
  "appear",
  "appease",
  "appeasing",
  "appendage",
  "appendix",
  "appetite",
  "appetizer",
  "applaud",
  "applause",
  "apple",
  "appliance",
  "applicant",
  "applied",
  "apply",
  "appointee",
  "appraisal",
  "appraiser",
  "apprehend",
  "approach",
  "approval",
  "approve",
  "apricot",
  "april",
  "apron",
  "aptitude",
  "aptly",
  "aqua",
  "aqueduct",
  "arbitrary",
  "arbitrate",
  "ardently",
  "area",
  "arena",
  "arguable",
  "arguably",
  "argue",
  "arise",
  "armadillo",
  "armband",
  "armchair",
  "armed",
  "armful",
  "armhole",
  "arming",
  "armless",
  "armoire",
  "armored",
  "armory",
  "armrest",
  "army",
  "aroma",
  "arose",
  "around",
  "arousal",
  "arrange",
  "array",
  "arrest",
  "arrival",
  "arrive",
  "arrogance",
  "arrogant",
  "arson",
  "art",
  "ascend",
  "ascension",
  "ascent",
  "ascertain",
  "ashamed",
  "ashen",
  "ashes",
  "ashy",
  "aside",
  "askew",
  "asleep",
  "asparagus",
  "aspect",
  "aspirate",
  "aspire",
  "aspirin",
  "astonish",
  "astound",
  "astride",
  "astrology",
  "astronaut",
  "astronomy",
  "astute",
  "atlantic",
  "atlas",
  "atom",
  "atonable",
  "atop",
  "atrium",
  "atrocious",
  "atrophy",
  "attach",
  "attain",
  "attempt",
  "attendant",
  "attendee",
  "attention",
  "attentive",
  "attest",
  "attic",
  "attire",
  "attitude",
  "attractor",
  "attribute",
  "atypical",
  "auction",
  "audacious",
  "audacity",
  "audible",
  "audibly",
  "audience",
  "audio",
  "audition",
  "augmented",
  "august",
  "authentic",
  "author",
  "autism",
  "autistic",
  "autograph",
  "automaker",
  "automated",
  "automatic",
  "autopilot",
  "available",
  "avalanche",
  "avatar",
  "avenge",
  "avenging",
  "avenue",
  "average",
  "aversion",
  "avert",
  "aviation",
  "aviator",
  "avid",
  "avoid",
  "await",
  "awaken",
  "award",
  "aware",
  "awhile",
  "awkward",
  "awning",
  "awoke",
  "awry",
  "axis",
  "babble",
  "babbling",
  "babied",
  "baboon",
  "backache",
  "backboard",
  "backboned",
  "backdrop",
  "backed",
  "backer",
  "backfield",
  "backfire",
  "backhand",
  "backing",
  "backlands",
  "backlash",
  "backless",
  "backlight",
  "backlit",
  "backlog",
  "backpack",
  "backpedal",
  "backrest",
  "backroom",
  "backshift",
  "backside",
  "backslid",
  "backspace",
  "backspin",
  "backstab",
  "backstage",
  "backtalk",
  "backtrack",
  "backup",
  "backward",
  "backwash",
  "backwater",
  "backyard",
  "bacon",
  "bacteria",
  "bacterium",
  "badass",
  "badge",
  "badland",
  "badly",
  "badness",
  "baffle",
  "baffling",
  "bagel",
  "bagful",
  "baggage",
  "bagged",
  "baggie",
  "bagginess",
  "bagging",
  "baggy",
  "bagpipe",
  "baguette",
  "baked",
  "bakery",
  "bakeshop",
  "baking",
  "balance",
  "balancing",
  "balcony",
  "balmy",
  "balsamic",
  "bamboo",
  "banana",
  "banish",
  "banister",
  "banjo",
  "bankable",
  "bankbook",
  "banked",
  "banker",
  "banking",
  "banknote",
  "bankroll",
  "banner",
  "bannister",
  "banshee",
  "banter",
  "barbecue",
  "barbed",
  "barbell",
  "barber",
  "barcode",
  "barge",
  "bargraph",
  "barista",
  "baritone",
  "barley",
  "barmaid",
  "barman",
  "barn",
  "barometer",
  "barrack",
  "barracuda",
  "barrel",
  "barrette",
  "barricade",
  "barrier",
  "barstool",
  "bartender",
  "barterer",
  "bash",
  "basically",
  "basics",
  "basil",
  "basin",
  "basis",
  "basket",
  "batboy",
  "batch",
  "bath",
  "baton",
  "bats",
  "battalion",
  "battered",
  "battering",
  "battery",
  "batting",
  "battle",
  "bauble",
  "bazooka",
  "blabber",
  "bladder",
  "blade",
  "blah",
  "blame",
  "blaming",
  "blanching",
  "blandness",
  "blank",
  "blaspheme",
  "blasphemy",
  "blast",
  "blatancy",
  "blatantly",
  "blazer",
  "blazing",
  "bleach",
  "bleak",
  "bleep",
  "blemish",
  "blend",
  "bless",
  "blighted",
  "blimp",
  "bling",
  "blinked",
  "blinker",
  "blinking",
  "blinks",
  "blip",
  "blissful",
  "blitz",
  "blizzard",
  "bloated",
  "bloating",
  "blob",
  "blog",
  "bloomers",
  "blooming",
  "blooper",
  "blot",
  "blouse",
  "blubber",
  "bluff",
  "bluish",
  "blunderer",
  "blunt",
  "blurb",
  "blurred",
  "blurry",
  "blurt",
  "blush",
  "blustery",
  "boaster",
  "boastful",
  "boasting",
  "boat",
  "bobbed",
  "bobbing",
  "bobble",
  "bobcat",
  "bobsled",
  "bobtail",
  "bodacious",
  "body",
  "bogged",
  "boggle",
  "bogus",
  "boil",
  "bok",
  "bolster",
  "bolt",
  "bonanza",
  "bonded",
  "bonding",
  "bondless",
  "boned",
  "bonehead",
  "boneless",
  "bonelike",
  "boney",
  "bonfire",
  "bonnet",
  "bonsai",
  "bonus",
  "bony",
  "boogeyman",
  "boogieman",
  "book",
  "boondocks",
  "booted",
  "booth",
  "bootie",
  "booting",
  "bootlace",
  "bootleg",
  "boots",
  "boozy",
  "borax",
  "boring",
  "borough",
  "borrower",
  "borrowing",
  "boss",
  "botanical",
  "botanist",
  "botany",
  "botch",
  "both",
  "bottle",
  "bottling",
  "bottom",
  "bounce",
  "bouncing",
  "bouncy",
  "bounding",
  "boundless",
  "bountiful",
  "bovine",
  "boxcar",
  "boxer",
  "boxing",
  "boxlike",
  "boxy",
  "breach",
  "breath",
  "breeches",
  "breeching",
  "breeder",
  "breeding",
  "breeze",
  "breezy",
  "brethren",
  "brewery",
  "brewing",
  "briar",
  "bribe",
  "brick",
  "bride",
  "bridged",
  "brigade",
  "bright",
  "brilliant",
  "brim",
  "bring",
  "brink",
  "brisket",
  "briskly",
  "briskness",
  "bristle",
  "brittle",
  "broadband",
  "broadcast",
  "broaden",
  "broadly",
  "broadness",
  "broadside",
  "broadways",
  "broiler",
  "broiling",
  "broken",
  "broker",
  "bronchial",
  "bronco",
  "bronze",
  "bronzing",
  "brook",
  "broom",
  "brought",
  "browbeat",
  "brownnose",
  "browse",
  "browsing",
  "bruising",
  "brunch",
  "brunette",
  "brunt",
  "brush",
  "brussels",
  "brute",
  "brutishly",
  "bubble",
  "bubbling",
  "bubbly",
  "buccaneer",
  "bucked",
  "bucket",
  "buckle",
  "buckshot",
  "buckskin",
  "bucktooth",
  "buckwheat",
  "buddhism",
  "buddhist",
  "budding",
  "buddy",
  "budget",
  "buffalo",
  "buffed",
  "buffer",
  "buffing",
  "buffoon",
  "buggy",
  "bulb",
  "bulge",
  "bulginess",
  "bulgur",
  "bulk",
  "bulldog",
  "bulldozer",
  "bullfight",
  "bullfrog",
  "bullhorn",
  "bullion",
  "bullish",
  "bullpen",
  "bullring",
  "bullseye",
  "bullwhip",
  "bully",
  "bunch",
  "bundle",
  "bungee",
  "bunion",
  "bunkbed",
  "bunkhouse",
  "bunkmate",
  "bunny",
  "bunt",
  "busboy",
  "bush",
  "busily",
  "busload",
  "bust",
  "busybody",
  "buzz",
  "cabana",
  "cabbage",
  "cabbie",
  "cabdriver",
  "cable",
  "caboose",
  "cache",
  "cackle",
  "cacti",
  "cactus",
  "caddie",
  "caddy",
  "cadet",
  "cadillac",
  "cadmium",
  "cage",
  "cahoots",
  "cake",
  "calamari",
  "calamity",
  "calcium",
  "calculate",
  "calculus",
  "caliber",
  "calibrate",
  "calm",
  "caloric",
  "calorie",
  "calzone",
  "camcorder",
  "cameo",
  "camera",
  "camisole",
  "camper",
  "campfire",
  "camping",
  "campsite",
  "campus",
  "canal",
  "canary",
  "cancel",
  "candied",
  "candle",
  "candy",
  "cane",
  "canine",
  "canister",
  "cannabis",
  "canned",
  "canning",
  "cannon",
  "cannot",
  "canola",
  "canon",
  "canopener",
  "canopy",
  "canteen",
  "canyon",
  "capable",
  "capably",
  "capacity",
  "cape",
  "capillary",
  "capital",
  "capitol",
  "capped",
  "capricorn",
  "capsize",
  "capsule",
  "caption",
  "captivate",
  "captive",
  "captivity",
  "capture",
  "caramel",
  "carat",
  "caravan",
  "carbon",
  "cardboard",
  "carded",
  "cardiac",
  "cardigan",
  "cardinal",
  "cardstock",
  "carefully",
  "caregiver",
  "careless",
  "caress",
  "caretaker",
  "cargo",
  "caring",
  "carless",
  "carload",
  "carmaker",
  "carnage",
  "carnation",
  "carnival",
  "carnivore",
  "carol",
  "carpenter",
  "carpentry",
  "carpool",
  "carport",
  "carried",
  "carrot",
  "carrousel",
  "carry",
  "cartel",
  "cartload",
  "carton",
  "cartoon",
  "cartridge",
  "cartwheel",
  "carve",
  "carving",
  "carwash",
  "cascade",
  "case",
  "cash",
  "casing",
  "casino",
  "casket",
  "cassette",
  "casually",
  "casualty",
  "catacomb",
  "catalog",
  "catalyst",
  "catalyze",
  "catapult",
  "cataract",
  "catatonic",
  "catcall",
  "catchable",
  "catcher",
  "catching",
  "catchy",
  "caterer",
  "catering",
  "catfight",
  "catfish",
  "cathedral",
  "cathouse",
  "catlike",
  "catnap",
  "catnip",
  "catsup",
  "cattail",
  "cattishly",
  "cattle",
  "catty",
  "catwalk",
  "caucasian",
  "caucus",
  "causal",
  "causation",
  "cause",
  "causing",
  "cauterize",
  "caution",
  "cautious",
  "cavalier",
  "cavalry",
  "caviar",
  "cavity",
  "cedar",
  "celery",
  "celestial",
  "celibacy",
  "celibate",
  "celtic",
  "cement",
  "census",
  "ceramics",
  "ceremony",
  "certainly",
  "certainty",
  "certified",
  "certify",
  "cesarean",
  "cesspool",
  "chafe",
  "chaffing",
  "chain",
  "chair",
  "chalice",
  "challenge",
  "chamber",
  "chamomile",
  "champion",
  "chance",
  "change",
  "channel",
  "chant",
  "chaos",
  "chaperone",
  "chaplain",
  "chapped",
  "chaps",
  "chapter",
  "character",
  "charbroil",
  "charcoal",
  "charger",
  "charging",
  "chariot",
  "charity",
  "charm",
  "charred",
  "charter",
  "charting",
  "chase",
  "chasing",
  "chaste",
  "chastise",
  "chastity",
  "chatroom",
  "chatter",
  "chatting",
  "chatty",
  "cheating",
  "cheddar",
  "cheek",
  "cheer",
  "cheese",
  "cheesy",
  "chef",
  "chemicals",
  "chemist",
  "chemo",
  "cherisher",
  "cherub",
  "chess",
  "chest",
  "chevron",
  "chevy",
  "chewable",
  "chewer",
  "chewing",
  "chewy",
  "chief",
  "chihuahua",
  "childcare",
  "childhood",
  "childish",
  "childless",
  "childlike",
  "chili",
  "chill",
  "chimp",
  "chip",
  "chirping",
  "chirpy",
  "chitchat",
  "chivalry",
  "chive",
  "chloride",
  "chlorine",
  "choice",
  "chokehold",
  "choking",
  "chomp",
  "chooser",
  "choosing",
  "choosy",
  "chop",
  "chosen",
  "chowder",
  "chowtime",
  "chrome",
  "chubby",
  "chuck",
  "chug",
  "chummy",
  "chump",
  "chunk",
  "churn",
  "chute",
  "cider",
  "cilantro",
  "cinch",
  "cinema",
  "cinnamon",
  "circle",
  "circling",
  "circular",
  "circulate",
  "circus",
  "citable",
  "citadel",
  "citation",
  "citizen",
  "citric",
  "citrus",
  "city",
  "civic",
  "civil",
  "clad",
  "claim",
  "clambake",
  "clammy",
  "clamor",
  "clamp",
  "clamshell",
  "clang",
  "clanking",
  "clapped",
  "clapper",
  "clapping",
  "clarify",
  "clarinet",
  "clarity",
  "clash",
  "clasp",
  "class",
  "clatter",
  "clause",
  "clavicle",
  "claw",
  "clay",
  "clean",
  "clear",
  "cleat",
  "cleaver",
  "cleft",
  "clench",
  "clergyman",
  "clerical",
  "clerk",
  "clever",
  "clicker",
  "client",
  "climate",
  "climatic",
  "cling",
  "clinic",
  "clinking",
  "clip",
  "clique",
  "cloak",
  "clobber",
  "clock",
  "clone",
  "cloning",
  "closable",
  "closure",
  "clothes",
  "clothing",
  "cloud",
  "clover",
  "clubbed",
  "clubbing",
  "clubhouse",
  "clump",
  "clumsily",
  "clumsy",
  "clunky",
  "clustered",
  "clutch",
  "clutter",
  "coach",
  "coagulant",
  "coastal",
  "coaster",
  "coasting",
  "coastland",
  "coastline",
  "coat",
  "coauthor",
  "cobalt",
  "cobbler",
  "cobweb",
  "cocoa",
  "coconut",
  "cod",
  "coeditor",
  "coerce",
  "coexist",
  "coffee",
  "cofounder",
  "cognition",
  "cognitive",
  "cogwheel",
  "coherence",
  "coherent",
  "cohesive",
  "coil",
  "coke",
  "cola",
  "cold",
  "coleslaw",
  "coliseum",
  "collage",
  "collapse",
  "collar",
  "collected",
  "collector",
  "collide",
  "collie",
  "collision",
  "colonial",
  "colonist",
  "colonize",
  "colony",
  "colossal",
  "colt",
  "coma",
  "come",
  "comfort",
  "comfy",
  "comic",
  "coming",
  "comma",
  "commence",
  "commend",
  "comment",
  "commerce",
  "commode",
  "commodity",
  "commodore",
  "common",
  "commotion",
  "commute",
  "commuting",
  "compacted",
  "compacter",
  "compactly",
  "compactor",
  "companion",
  "company",
  "compare",
  "compel",
  "compile",
  "comply",
  "component",
  "composed",
  "composer",
  "composite",
  "compost",
  "composure",
  "compound",
  "compress",
  "comprised",
  "computer",
  "computing",
  "comrade",
  "concave",
  "conceal",
  "conceded",
  "concept",
  "concerned",
  "concert",
  "conch",
  "concierge",
  "concise",
  "conclude",
  "concrete",
  "concur",
  "condense",
  "condiment",
  "condition",
  "condone",
  "conducive",
  "conductor",
  "conduit",
  "cone",
  "confess",
  "confetti",
  "confidant",
  "confident",
  "confider",
  "confiding",
  "configure",
  "confined",
  "confining",
  "confirm",
  "conflict",
  "conform",
  "confound",
  "confront",
  "confused",
  "confusing",
  "confusion",
  "congenial",
  "congested",
  "congrats",
  "congress",
  "conical",
  "conjoined",
  "conjure",
  "conjuror",
  "connected",
  "connector",
  "consensus",
  "consent",
  "console",
  "consoling",
  "consonant",
  "constable",
  "constant",
  "constrain",
  "constrict",
  "construct",
  "consult",
  "consumer",
  "consuming",
  "contact",
  "container",
  "contempt",
  "contend",
  "contented",
  "contently",
  "contents",
  "contest",
  "context",
  "contort",
  "contour",
  "contrite",
  "control",
  "contusion",
  "convene",
  "convent",
  "copartner",
  "cope",
  "copied",
  "copier",
  "copilot",
  "coping",
  "copious",
  "copper",
  "copy",
  "coral",
  "cork",
  "cornball",
  "cornbread",
  "corncob",
  "cornea",
  "corned",
  "corner",
  "cornfield",
  "cornflake",
  "cornhusk",
  "cornmeal",
  "cornstalk",
  "corny",
  "coronary",
  "coroner",
  "corporal",
  "corporate",
  "corral",
  "correct",
  "corridor",
  "corrode",
  "corroding",
  "corrosive",
  "corsage",
  "corset",
  "cortex",
  "cosigner",
  "cosmetics",
  "cosmic",
  "cosmos",
  "cosponsor",
  "cost",
  "cottage",
  "cotton",
  "couch",
  "cough",
  "could",
  "countable",
  "countdown",
  "counting",
  "countless",
  "country",
  "county",
  "courier",
  "covenant",
  "cover",
  "coveted",
  "coveting",
  "coyness",
  "cozily",
  "coziness",
  "cozy",
  "crabbing",
  "crabgrass",
  "crablike",
  "crabmeat",
  "cradle",
  "cradling",
  "crafter",
  "craftily",
  "craftsman",
  "craftwork",
  "crafty",
  "cramp",
  "cranberry",
  "crane",
  "cranial",
  "cranium",
  "crank",
  "crate",
  "crave",
  "craving",
  "crawfish",
  "crawlers",
  "crawling",
  "crayfish",
  "crayon",
  "crazed",
  "crazily",
  "craziness",
  "crazy",
  "creamed",
  "creamer",
  "creamlike",
  "crease",
  "creasing",
  "creatable",
  "create",
  "creation",
  "creative",
  "creature",
  "credible",
  "credibly",
  "credit",
  "creed",
  "creme",
  "creole",
  "crepe",
  "crept",
  "crescent",
  "crested",
  "cresting",
  "crestless",
  "crevice",
  "crewless",
  "crewman",
  "crewmate",
  "crib",
  "cricket",
  "cried",
  "crier",
  "crimp",
  "crimson",
  "cringe",
  "cringing",
  "crinkle",
  "crinkly",
  "crisped",
  "crisping",
  "crisply",
  "crispness",
  "crispy",
  "criteria",
  "critter",
  "croak",
  "crock",
  "crook",
  "croon",
  "crop",
  "cross",
  "crouch",
  "crouton",
  "crowbar",
  "crowd",
  "crown",
  "crucial",
  "crudely",
  "crudeness",
  "cruelly",
  "cruelness",
  "cruelty",
  "crumb",
  "crummiest",
  "crummy",
  "crumpet",
  "crumpled",
  "cruncher",
  "crunching",
  "crunchy",
  "crusader",
  "crushable",
  "crushed",
  "crusher",
  "crushing",
  "crust",
  "crux",
  "crying",
  "cryptic",
  "crystal",
  "cubbyhole",
  "cube",
  "cubical",
  "cubicle",
  "cucumber",
  "cuddle",
  "cuddly",
  "cufflink",
  "culinary",
  "culminate",
  "culpable",
  "culprit",
  "cultivate",
  "cultural",
  "culture",
  "cupbearer",
  "cupcake",
  "cupid",
  "cupped",
  "cupping",
  "curable",
  "curator",
  "curdle",
  "cure",
  "curfew",
  "curing",
  "curled",
  "curler",
  "curliness",
  "curling",
  "curly",
  "curry",
  "curse",
  "cursive",
  "cursor",
  "curtain",
  "curtly",
  "curtsy",
  "curvature",
  "curve",
  "curvy",
  "cushy",
  "cusp",
  "cussed",
  "custard",
  "custodian",
  "custody",
  "customary",
  "customer",
  "customize",
  "customs",
  "cut",
  "cycle",
  "cyclic",
  "cycling",
  "cyclist",
  "cylinder",
  "cymbal",
  "cytoplasm",
  "cytoplast",
  "dab",
  "dad",
  "daffodil",
  "dagger",
  "daily",
  "daintily",
  "dainty",
  "dairy",
  "daisy",
  "dallying",
  "dance",
  "dancing",
  "dandelion",
  "dander",
  "dandruff",
  "dandy",
  "danger",
  "dangle",
  "dangling",
  "daredevil",
  "dares",
  "daringly",
  "darkened",
  "darkening",
  "darkish",
  "darkness",
  "darkroom",
  "darling",
  "darn",
  "dart",
  "darwinism",
  "dash",
  "dastardly",
  "data",
  "datebook",
  "dating",
  "daughter",
  "daunting",
  "dawdler",
  "dawn",
  "daybed",
  "daybreak",
  "daycare",
  "daydream",
  "daylight",
  "daylong",
  "dayroom",
  "daytime",
  "dazzler",
  "dazzling",
  "deacon",
  "deafening",
  "deafness",
  "dealer",
  "dealing",
  "dealmaker",
  "dealt",
  "dean",
  "debatable",
  "debate",
  "debating",
  "debit",
  "debrief",
  "debtless",
  "debtor",
  "debug",
  "debunk",
  "decade",
  "decaf",
  "decal",
  "decathlon",
  "decay",
  "deceased",
  "deceit",
  "deceiver",
  "deceiving",
  "december",
  "decency",
  "decent",
  "deception",
  "deceptive",
  "decibel",
  "decidable",
  "decimal",
  "decimeter",
  "decipher",
  "deck",
  "declared",
  "decline",
  "decode",
  "decompose",
  "decorated",
  "decorator",
  "decoy",
  "decrease",
  "decree",
  "dedicate",
  "dedicator",
  "deduce",
  "deduct",
  "deed",
  "deem",
  "deepen",
  "deeply",
  "deepness",
  "deface",
  "defacing",
  "defame",
  "default",
  "defeat",
  "defection",
  "defective",
  "defendant",
  "defender",
  "defense",
  "defensive",
  "deferral",
  "deferred",
  "defiance",
  "defiant",
  "defile",
  "defiling",
  "define",
  "definite",
  "deflate",
  "deflation",
  "deflator",
  "deflected",
  "deflector",
  "defog",
  "deforest",
  "defraud",
  "defrost",
  "deftly",
  "defuse",
  "defy",
  "degraded",
  "degrading",
  "degrease",
  "degree",
  "dehydrate",
  "deity",
  "dejected",
  "delay",
  "delegate",
  "delegator",
  "delete",
  "deletion",
  "delicacy",
  "delicate",
  "delicious",
  "delighted",
  "delirious",
  "delirium",
  "deliverer",
  "delivery",
  "delouse",
  "delta",
  "deluge",
  "delusion",
  "deluxe",
  "demanding",
  "demeaning",
  "demeanor",
  "demise",
  "democracy",
  "democrat",
  "demote",
  "demotion",
  "demystify",
  "denatured",
  "deniable",
  "denial",
  "denim",
  "denote",
  "dense",
  "density",
  "dental",
  "dentist",
  "denture",
  "deny",
  "deodorant",
  "deodorize",
  "departed",
  "departure",
  "depict",
  "deplete",
  "depletion",
  "deplored",
  "deploy",
  "deport",
  "depose",
  "depraved",
  "depravity",
  "deprecate",
  "depress",
  "deprive",
  "depth",
  "deputize",
  "deputy",
  "derail",
  "deranged",
  "derby",
  "derived",
  "desecrate",
  "deserve",
  "deserving",
  "designate",
  "designed",
  "designer",
  "designing",
  "deskbound",
  "desktop",
  "deskwork",
  "desolate",
  "despair",
  "despise",
  "despite",
  "destiny",
  "destitute",
  "destruct",
  "detached",
  "detail",
  "detection",
  "detective",
  "detector",
  "detention",
  "detergent",
  "detest",
  "detonate",
  "detonator",
  "detoxify",
  "detract",
  "deuce",
  "devalue",
  "deviancy",
  "deviant",
  "deviate",
  "deviation",
  "deviator",
  "device",
  "devious",
  "devotedly",
  "devotee",
  "devotion",
  "devourer",
  "devouring",
  "devoutly",
  "dexterity",
  "dexterous",
  "diabetes",
  "diabetic",
  "diabolic",
  "diagnoses",
  "diagnosis",
  "diagram",
  "dial",
  "diameter",
  "diaper",
  "diaphragm",
  "diary",
  "dice",
  "dicing",
  "dictate",
  "dictation",
  "dictator",
  "difficult",
  "diffused",
  "diffuser",
  "diffusion",
  "diffusive",
  "dig",
  "dilation",
  "diligence",
  "diligent",
  "dill",
  "dilute",
  "dime",
  "diminish",
  "dimly",
  "dimmed",
  "dimmer",
  "dimness",
  "dimple",
  "diner",
  "dingbat",
  "dinghy",
  "dinginess",
  "dingo",
  "dingy",
  "dining",
  "dinner",
  "diocese",
  "dioxide",
  "diploma",
  "dipped",
  "dipper",
  "dipping",
  "directed",
  "direction",
  "directive",
  "directly",
  "directory",
  "direness",
  "dirtiness",
  "disabled",
  "disagree",
  "disallow",
  "disarm",
  "disarray",
  "disaster",
  "disband",
  "disbelief",
  "disburse",
  "discard",
  "discern",
  "discharge",
  "disclose",
  "discolor",
  "discount",
  "discourse",
  "discover",
  "discuss",
  "disdain",
  "disengage",
  "disfigure",
  "disgrace",
  "dish",
  "disinfect",
  "disjoin",
  "disk",
  "dislike",
  "disliking",
  "dislocate",
  "dislodge",
  "disloyal",
  "dismantle",
  "dismay",
  "dismiss",
  "dismount",
  "disobey",
  "disorder",
  "disown",
  "disparate",
  "disparity",
  "dispatch",
  "dispense",
  "dispersal",
  "dispersed",
  "disperser",
  "displace",
  "display",
  "displease",
  "disposal",
  "dispose",
  "disprove",
  "dispute",
  "disregard",
  "disrupt",
  "dissuade",
  "distance",
  "distant",
  "distaste",
  "distill",
  "distinct",
  "distort",
  "distract",
  "distress",
  "district",
  "distrust",
  "ditch",
  "ditto",
  "ditzy",
  "dividable",
  "divided",
  "dividend",
  "dividers",
  "dividing",
  "divinely",
  "diving",
  "divinity",
  "divisible",
  "divisibly",
  "division",
  "divisive",
  "divorcee",
  "dizziness",
  "dizzy",
  "doable",
  "docile",
  "dock",
  "doctrine",
  "document",
  "dodge",
  "dodgy",
  "doily",
  "doing",
  "dole",
  "dollar",
  "dollhouse",
  "dollop",
  "dolly",
  "dolphin",
  "domain",
  "domelike",
  "domestic",
  "dominion",
  "dominoes",
  "donated",
  "donation",
  "donator",
  "donor",
  "donut",
  "doodle",
  "doorbell",
  "doorframe",
  "doorknob",
  "doorman",
  "doormat",
  "doornail",
  "doorpost",
  "doorstep",
  "doorstop",
  "doorway",
  "doozy",
  "dork",
  "dormitory",
  "dorsal",
  "dosage",
  "dose",
  "dotted",
  "doubling",
  "douche",
  "dove",
  "down",
  "dowry",
  "doze",
  "drab",
  "dragging",
  "dragonfly",
  "dragonish",
  "dragster",
  "drainable",
  "drainage",
  "drained",
  "drainer",
  "drainpipe",
  "dramatic",
  "dramatize",
  "drank",
  "drapery",
  "drastic",
  "draw",
  "dreaded",
  "dreadful",
  "dreadlock",
  "dreamboat",
  "dreamily",
  "dreamland",
  "dreamless",
  "dreamlike",
  "dreamt",
  "dreamy",
  "drearily",
  "dreary",
  "drench",
  "dress",
  "drew",
  "dribble",
  "dried",
  "drier",
  "drift",
  "driller",
  "drilling",
  "drinkable",
  "drinking",
  "dripping",
  "drippy",
  "drivable",
  "driven",
  "driver",
  "driveway",
  "driving",
  "drizzle",
  "drizzly",
  "drone",
  "drool",
  "droop",
  "drop-down",
  "dropbox",
  "dropkick",
  "droplet",
  "dropout",
  "dropper",
  "drove",
  "drown",
  "drowsily",
  "drudge",
  "drum",
  "dry",
  "dubbed",
  "dubiously",
  "duchess",
  "duckbill",
  "ducking",
  "duckling",
  "ducktail",
  "ducky",
  "duct",
  "dude",
  "duffel",
  "dugout",
  "duh",
  "duke",
  "duller",
  "dullness",
  "duly",
  "dumping",
  "dumpling",
  "dumpster",
  "duo",
  "dupe",
  "duplex",
  "duplicate",
  "duplicity",
  "durable",
  "durably",
  "duration",
  "duress",
  "during",
  "dusk",
  "dust",
  "dutiful",
  "duty",
  "duvet",
  "dwarf",
  "dweeb",
  "dwelled",
  "dweller",
  "dwelling",
  "dwindle",
  "dwindling",
  "dynamic",
  "dynamite",
  "dynasty",
  "dyslexia",
  "dyslexic",
  "each",
  "eagle",
  "earache",
  "eardrum",
  "earflap",
  "earful",
  "earlobe",
  "early",
  "earmark",
  "earmuff",
  "earphone",
  "earpiece",
  "earplugs",
  "earring",
  "earshot",
  "earthen",
  "earthlike",
  "earthling",
  "earthly",
  "earthworm",
  "earthy",
  "earwig",
  "easeful",
  "easel",
  "easiest",
  "easily",
  "easiness",
  "easing",
  "eastbound",
  "eastcoast",
  "easter",
  "eastward",
  "eatable",
  "eaten",
  "eatery",
  "eating",
  "eats",
  "ebay",
  "ebony",
  "ebook",
  "ecard",
  "eccentric",
  "echo",
  "eclair",
  "eclipse",
  "ecologist",
  "ecology",
  "economic",
  "economist",
  "economy",
  "ecosphere",
  "ecosystem",
  "edge",
  "edginess",
  "edging",
  "edgy",
  "edition",
  "editor",
  "educated",
  "education",
  "educator",
  "eel",
  "effective",
  "effects",
  "efficient",
  "effort",
  "eggbeater",
  "egging",
  "eggnog",
  "eggplant",
  "eggshell",
  "egomaniac",
  "egotism",
  "egotistic",
  "either",
  "eject",
  "elaborate",
  "elastic",
  "elated",
  "elbow",
  "eldercare",
  "elderly",
  "eldest",
  "electable",
  "election",
  "elective",
  "elephant",
  "elevate",
  "elevating",
  "elevation",
  "elevator",
  "eleven",
  "elf",
  "eligible",
  "eligibly",
  "eliminate",
  "elite",
  "elitism",
  "elixir",
  "elk",
  "ellipse",
  "elliptic",
  "elm",
  "elongated",
  "elope",
  "eloquence",
  "eloquent",
  "elsewhere",
  "elude",
  "elusive",
  "elves",
  "email",
  "embargo",
  "embark",
  "embassy",
  "embattled",
  "embellish",
  "ember",
  "embezzle",
  "emblaze",
  "emblem",
  "embody",
  "embolism",
  "emboss",
  "embroider",
  "emcee",
  "emerald",
  "emergency",
  "emission",
  "emit",
  "emote",
  "emoticon",
  "emotion",
  "empathic",
  "empathy",
  "emperor",
  "emphases",
  "emphasis",
  "emphasize",
  "emphatic",
  "empirical",
  "employed",
  "employee",
  "employer",
  "emporium",
  "empower",
  "emptier",
  "emptiness",
  "empty",
  "emu",
  "enable",
  "enactment",
  "enamel",
  "enchanted",
  "enchilada",
  "encircle",
  "enclose",
  "enclosure",
  "encode",
  "encore",
  "encounter",
  "encourage",
  "encroach",
  "encrust",
  "encrypt",
  "endanger",
  "endeared",
  "endearing",
  "ended",
  "ending",
  "endless",
  "endnote",
  "endocrine",
  "endorphin",
  "endorse",
  "endowment",
  "endpoint",
  "endurable",
  "endurance",
  "enduring",
  "energetic",
  "energize",
  "energy",
  "enforced",
  "enforcer",
  "engaged",
  "engaging",
  "engine",
  "engorge",
  "engraved",
  "engraver",
  "engraving",
  "engross",
  "engulf",
  "enhance",
  "enigmatic",
  "enjoyable",
  "enjoyably",
  "enjoyer",
  "enjoying",
  "enjoyment",
  "enlarged",
  "enlarging",
  "enlighten",
  "enlisted",
  "enquirer",
  "enrage",
  "enrich",
  "enroll",
  "enslave",
  "ensnare",
  "ensure",
  "entail",
  "entangled",
  "entering",
  "entertain",
  "enticing",
  "entire",
  "entitle",
  "entity",
  "entomb",
  "entourage",
  "entrap",
  "entree",
  "entrench",
  "entrust",
  "entryway",
  "entwine",
  "enunciate",
  "envelope",
  "enviable",
  "enviably",
  "envious",
  "envision",
  "envoy",
  "envy",
  "enzyme",
  "epic",
  "epidemic",
  "epidermal",
  "epidermis",
  "epidural",
  "epilepsy",
  "epileptic",
  "epilogue",
  "epiphany",
  "episode",
  "equal",
  "equate",
  "equation",
  "equator",
  "equinox",
  "equipment",
  "equity",
  "equivocal",
  "eradicate",
  "erasable",
  "erased",
  "eraser",
  "erasure",
  "ergonomic",
  "errand",
  "errant",
  "erratic",
  "error",
  "erupt",
  "escalate",
  "escalator",
  "escapable",
  "escapade",
  "escapist",
  "escargot",
  "eskimo",
  "esophagus",
  "espionage",
  "espresso",
  "esquire",
  "essay",
  "essence",
  "essential",
  "establish",
  "estate",
  "esteemed",
  "estimate",
  "estimator",
  "estranged",
  "estrogen",
  "etching",
  "eternal",
  "eternity",
  "ethanol",
  "ether",
  "ethically",
  "ethics",
  "euphemism",
  "evacuate",
  "evacuee",
  "evade",
  "evaluate",
  "evaluator",
  "evaporate",
  "evasion",
  "evasive",
  "even",
  "everglade",
  "evergreen",
  "everybody",
  "everyday",
  "everyone",
  "evict",
  "evidence",
  "evident",
  "evil",
  "evoke",
  "evolution",
  "evolve",
  "exact",
  "exalted",
  "example",
  "excavate",
  "excavator",
  "exceeding",
  "exception",
  "excess",
  "exchange",
  "excitable",
  "exciting",
  "exclaim",
  "exclude",
  "excluding",
  "exclusion",
  "exclusive",
  "excretion",
  "excretory",
  "excursion",
  "excusable",
  "excusably",
  "excuse",
  "exemplary",
  "exemplify",
  "exemption",
  "exerciser",
  "exert",
  "exes",
  "exfoliate",
  "exhale",
  "exhaust",
  "exhume",
  "exile",
  "existing",
  "exit",
  "exodus",
  "exonerate",
  "exorcism",
  "exorcist",
  "expand",
  "expanse",
  "expansion",
  "expansive",
  "expectant",
  "expedited",
  "expediter",
  "expel",
  "expend",
  "expenses",
  "expensive",
  "expert",
  "expire",
  "expiring",
  "explain",
  "expletive",
  "explicit",
  "explode",
  "exploit",
  "explore",
  "exploring",
  "exponent",
  "exporter",
  "exposable",
  "expose",
  "exposure",
  "express",
  "expulsion",
  "exquisite",
  "extended",
  "extending",
  "extent",
  "extenuate",
  "exterior",
  "external",
  "extinct",
  "extortion",
  "extradite",
  "extras",
  "extrovert",
  "extrude",
  "extruding",
  "exuberant",
  "fable",
  "fabric",
  "fabulous",
  "facebook",
  "facecloth",
  "facedown",
  "faceless",
  "facelift",
  "faceplate",
  "faceted",
  "facial",
  "facility",
  "facing",
  "facsimile",
  "faction",
  "factoid",
  "factor",
  "factsheet",
  "factual",
  "faculty",
  "fade",
  "fading",
  "failing",
  "falcon",
  "fall",
  "false",
  "falsify",
  "fame",
  "familiar",
  "family",
  "famine",
  "famished",
  "fanatic",
  "fancied",
  "fanciness",
  "fancy",
  "fanfare",
  "fang",
  "fanning",
  "fantasize",
  "fantastic",
  "fantasy",
  "fascism",
  "fastball",
  "faster",
  "fasting",
  "fastness",
  "faucet",
  "favorable",
  "favorably",
  "favored",
  "favoring",
  "favorite",
  "fax",
  "feast",
  "federal",
  "fedora",
  "feeble",
  "feed",
  "feel",
  "feisty",
  "feline",
  "felt-tip",
  "feminine",
  "feminism",
  "feminist",
  "feminize",
  "femur",
  "fence",
  "fencing",
  "fender",
  "ferment",
  "fernlike",
  "ferocious",
  "ferocity",
  "ferret",
  "ferris",
  "ferry",
  "fervor",
  "fester",
  "festival",
  "festive",
  "festivity",
  "fetal",
  "fetch",
  "fever",
  "fiber",
  "fiction",
  "fiddle",
  "fiddling",
  "fidelity",
  "fidgeting",
  "fidgety",
  "fifteen",
  "fifth",
  "fiftieth",
  "fifty",
  "figment",
  "figure",
  "figurine",
  "filing",
  "filled",
  "filler",
  "filling",
  "film",
  "filter",
  "filth",
  "filtrate",
  "finale",
  "finalist",
  "finalize",
  "finally",
  "finance",
  "financial",
  "finch",
  "fineness",
  "finer",
  "finicky",
  "finished",
  "finisher",
  "finishing",
  "finite",
  "finless",
  "finlike",
  "fiscally",
  "fit",
  "five",
  "flaccid",
  "flagman",
  "flagpole",
  "flagship",
  "flagstick",
  "flagstone",
  "flail",
  "flakily",
  "flaky",
  "flame",
  "flammable",
  "flanked",
  "flanking",
  "flannels",
  "flap",
  "flaring",
  "flashback",
  "flashbulb",
  "flashcard",
  "flashily",
  "flashing",
  "flashy",
  "flask",
  "flatbed",
  "flatfoot",
  "flatly",
  "flatness",
  "flatten",
  "flattered",
  "flatterer",
  "flattery",
  "flattop",
  "flatware",
  "flatworm",
  "flavored",
  "flavorful",
  "flavoring",
  "flaxseed",
  "fled",
  "fleshed",
  "fleshy",
  "flick",
  "flier",
  "flight",
  "flinch",
  "fling",
  "flint",
  "flip",
  "flirt",
  "float",
  "flock",
  "flogging",
  "flop",
  "floral",
  "florist",
  "floss",
  "flounder",
  "flyable",
  "flyaway",
  "flyer",
  "flying",
  "flyover",
  "flypaper",
  "foam",
  "foe",
  "fog",
  "foil",
  "folic",
  "folk",
  "follicle",
  "follow",
  "fondling",
  "fondly",
  "fondness",
  "fondue",
  "font",
  "food",
  "fool",
  "footage",
  "football",
  "footbath",
  "footboard",
  "footer",
  "footgear",
  "foothill",
  "foothold",
  "footing",
  "footless",
  "footman",
  "footnote",
  "footpad",
  "footpath",
  "footprint",
  "footrest",
  "footsie",
  "footsore",
  "footwear",
  "footwork",
  "fossil",
  "foster",
  "founder",
  "founding",
  "fountain",
  "fox",
  "foyer",
  "fraction",
  "fracture",
  "fragile",
  "fragility",
  "fragment",
  "fragrance",
  "fragrant",
  "frail",
  "frame",
  "framing",
  "frantic",
  "fraternal",
  "frayed",
  "fraying",
  "frays",
  "freckled",
  "freckles",
  "freebase",
  "freebee",
  "freebie",
  "freedom",
  "freefall",
  "freehand",
  "freeing",
  "freeload",
  "freely",
  "freemason",
  "freeness",
  "freestyle",
  "freeware",
  "freeway",
  "freewill",
  "freezable",
  "freezing",
  "freight",
  "french",
  "frenzied",
  "frenzy",
  "frequency",
  "frequent",
  "fresh",
  "fretful",
  "fretted",
  "friction",
  "friday",
  "fridge",
  "fried",
  "friend",
  "frighten",
  "frightful",
  "frigidity",
  "frigidly",
  "frill",
  "fringe",
  "frisbee",
  "frisk",
  "fritter",
  "frivolous",
  "frolic",
  "from",
  "front",
  "frostbite",
  "frosted",
  "frostily",
  "frosting",
  "frostlike",
  "frosty",
  "froth",
  "frown",
  "frozen",
  "fructose",
  "frugality",
  "frugally",
  "fruit",
  "frustrate",
  "frying",
  "gab",
  "gaffe",
  "gag",
  "gainfully",
  "gaining",
  "gains",
  "gala",
  "gallantly",
  "galleria",
  "gallery",
  "galley",
  "gallon",
  "gallows",
  "gallstone",
  "galore",
  "galvanize",
  "gambling",
  "game",
  "gaming",
  "gamma",
  "gander",
  "gangly",
  "gangrene",
  "gangway",
  "gap",
  "garage",
  "garbage",
  "garden",
  "gargle",
  "garland",
  "garlic",
  "garment",
  "garnet",
  "garnish",
  "garter",
  "gas",
  "gatherer",
  "gathering",
  "gating",
  "gauging",
  "gauntlet",
  "gauze",
  "gave",
  "gawk",
  "gazing",
  "gear",
  "gecko",
  "geek",
  "geiger",
  "gem",
  "gender",
  "generic",
  "generous",
  "genetics",
  "genre",
  "gentile",
  "gentleman",
  "gently",
  "gents",
  "geography",
  "geologic",
  "geologist",
  "geology",
  "geometric",
  "geometry",
  "geranium",
  "gerbil",
  "geriatric",
  "germicide",
  "germinate",
  "germless",
  "germproof",
  "gestate",
  "gestation",
  "gesture",
  "getaway",
  "getting",
  "getup",
  "giant",
  "gibberish",
  "giblet",
  "giddily",
  "giddiness",
  "giddy",
  "gift",
  "gigabyte",
  "gigahertz",
  "gigantic",
  "giggle",
  "giggling",
  "giggly",
  "gigolo",
  "gilled",
  "gills",
  "gimmick",
  "girdle",
  "giveaway",
  "given",
  "giver",
  "giving",
  "gizmo",
  "gizzard",
  "glacial",
  "glacier",
  "glade",
  "gladiator",
  "gladly",
  "glamorous",
  "glamour",
  "glance",
  "glancing",
  "glandular",
  "glare",
  "glaring",
  "glass",
  "glaucoma",
  "glazing",
  "gleaming",
  "gleeful",
  "glider",
  "gliding",
  "glimmer",
  "glimpse",
  "glisten",
  "glitch",
  "glitter",
  "glitzy",
  "gloater",
  "gloating",
  "gloomily",
  "gloomy",
  "glorified",
  "glorifier",
  "glorify",
  "glorious",
  "glory",
  "gloss",
  "glove",
  "glowing",
  "glowworm",
  "glucose",
  "glue",
  "gluten",
  "glutinous",
  "glutton",
  "gnarly",
  "gnat",
  "goal",
  "goatskin",
  "goes",
  "goggles",
  "going",
  "goldfish",
  "goldmine",
  "goldsmith",
  "golf",
  "goliath",
  "gonad",
  "gondola",
  "gone",
  "gong",
  "good",
  "gooey",
  "goofball",
  "goofiness",
  "goofy",
  "google",
  "goon",
  "gopher",
  "gore",
  "gorged",
  "gorgeous",
  "gory",
  "gosling",
  "gossip",
  "gothic",
  "gotten",
  "gout",
  "gown",
  "grab",
  "graceful",
  "graceless",
  "gracious",
  "gradation",
  "graded",
  "grader",
  "gradient",
  "grading",
  "gradually",
  "graduate",
  "graffiti",
  "grafted",
  "grafting",
  "grain",
  "granddad",
  "grandkid",
  "grandly",
  "grandma",
  "grandpa",
  "grandson",
  "granite",
  "granny",
  "granola",
  "grant",
  "granular",
  "grape",
  "graph",
  "grapple",
  "grappling",
  "grasp",
  "grass",
  "gratified",
  "gratify",
  "grating",
  "gratitude",
  "gratuity",
  "gravel",
  "graveness",
  "graves",
  "graveyard",
  "gravitate",
  "gravity",
  "gravy",
  "gray",
  "grazing",
  "greasily",
  "greedily",
  "greedless",
  "greedy",
  "green",
  "greeter",
  "greeting",
  "grew",
  "greyhound",
  "grid",
  "grief",
  "grievance",
  "grieving",
  "grievous",
  "grill",
  "grimace",
  "grimacing",
  "grime",
  "griminess",
  "grimy",
  "grinch",
  "grinning",
  "grip",
  "gristle",
  "grit",
  "groggily",
  "groggy",
  "groin",
  "groom",
  "groove",
  "grooving",
  "groovy",
  "grope",
  "ground",
  "grouped",
  "grout",
  "grove",
  "grower",
  "growing",
  "growl",
  "grub",
  "grudge",
  "grudging",
  "grueling",
  "gruffly",
  "grumble",
  "grumbling",
  "grumbly",
  "grumpily",
  "grunge",
  "grunt",
  "guacamole",
  "guidable",
  "guidance",
  "guide",
  "guiding",
  "guileless",
  "guise",
  "gulf",
  "gullible",
  "gully",
  "gulp",
  "gumball",
  "gumdrop",
  "gumminess",
  "gumming",
  "gummy",
  "gurgle",
  "gurgling",
  "guru",
  "gush",
  "gusto",
  "gusty",
  "gutless",
  "guts",
  "gutter",
  "guy",
  "guzzler",
  "gyration",
  "habitable",
  "habitant",
  "habitat",
  "habitual",
  "hacked",
  "hacker",
  "hacking",
  "hacksaw",
  "had",
  "haggler",
  "haiku",
  "half",
  "halogen",
  "halt",
  "halved",
  "halves",
  "hamburger",
  "hamlet",
  "hammock",
  "hamper",
  "hamster",
  "hamstring",
  "handbag",
  "handball",
  "handbook",
  "handbrake",
  "handcart",
  "handclap",
  "handclasp",
  "handcraft",
  "handcuff",
  "handed",
  "handful",
  "handgrip",
  "handgun",
  "handheld",
  "handiness",
  "handiwork",
  "handlebar",
  "handled",
  "handler",
  "handling",
  "handmade",
  "handoff",
  "handpick",
  "handprint",
  "handrail",
  "handsaw",
  "handset",
  "handsfree",
  "handshake",
  "handstand",
  "handwash",
  "handwork",
  "handwoven",
  "handwrite",
  "handyman",
  "hangnail",
  "hangout",
  "hangover",
  "hangup",
  "hankering",
  "hankie",
  "hanky",
  "haphazard",
  "happening",
  "happier",
  "happiest",
  "happily",
  "happiness",
  "happy",
  "harbor",
  "hardcopy",
  "hardcore",
  "hardcover",
  "harddisk",
  "hardened",
  "hardener",
  "hardening",
  "hardhat",
  "hardhead",
  "hardiness",
  "hardly",
  "hardness",
  "hardship",
  "hardware",
  "hardwired",
  "hardwood",
  "hardy",
  "harmful",
  "harmless",
  "harmonica",
  "harmonics",
  "harmonize",
  "harmony",
  "harness",
  "harpist",
  "harsh",
  "harvest",
  "hash",
  "hassle",
  "haste",
  "hastily",
  "hastiness",
  "hasty",
  "hatbox",
  "hatchback",
  "hatchery",
  "hatchet",
  "hatching",
  "hatchling",
  "hate",
  "hatless",
  "hatred",
  "haunt",
  "haven",
  "hazard",
  "hazelnut",
  "hazily",
  "haziness",
  "hazing",
  "hazy",
  "headache",
  "headband",
  "headboard",
  "headcount",
  "headdress",
  "headed",
  "header",
  "headfirst",
  "headgear",
  "heading",
  "headlamp",
  "headless",
  "headlock",
  "headphone",
  "headpiece",
  "headrest",
  "headroom",
  "headscarf",
  "headset",
  "headsman",
  "headstand",
  "headstone",
  "headway",
  "headwear",
  "heap",
  "heat",
  "heave",
  "heavily",
  "heaviness",
  "heaving",
  "hedge",
  "hedging",
  "heftiness",
  "hefty",
  "helium",
  "helmet",
  "helper",
  "helpful",
  "helping",
  "helpless",
  "helpline",
  "hemlock",
  "hemstitch",
  "hence",
  "henchman",
  "henna",
  "herald",
  "herbal",
  "herbicide",
  "herbs",
  "heritage",
  "hermit",
  "heroics",
  "heroism",
  "herring",
  "herself",
  "hertz",
  "hesitancy",
  "hesitant",
  "hesitate",
  "hexagon",
  "hexagram",
  "hubcap",
  "huddle",
  "huddling",
  "huff",
  "hug",
  "hula",
  "hulk",
  "hull",
  "human",
  "humble",
  "humbling",
  "humbly",
  "humid",
  "humiliate",
  "humility",
  "humming",
  "hummus",
  "humongous",
  "humorist",
  "humorless",
  "humorous",
  "humpback",
  "humped",
  "humvee",
  "hunchback",
  "hundredth",
  "hunger",
  "hungrily",
  "hungry",
  "hunk",
  "hunter",
  "hunting",
  "huntress",
  "huntsman",
  "hurdle",
  "hurled",
  "hurler",
  "hurling",
  "hurray",
  "hurricane",
  "hurried",
  "hurry",
  "hurt",
  "husband",
  "hush",
  "husked",
  "huskiness",
  "hut",
  "hybrid",
  "hydrant",
  "hydrated",
  "hydration",
  "hydrogen",
  "hydroxide",
  "hyperlink",
  "hypertext",
  "hyphen",
  "hypnoses",
  "hypnosis",
  "hypnotic",
  "hypnotism",
  "hypnotist",
  "hypnotize",
  "hypocrisy",
  "hypocrite",
  "ibuprofen",
  "ice",
  "iciness",
  "icing",
  "icky",
  "icon",
  "icy",
  "idealism",
  "idealist",
  "idealize",
  "ideally",
  "idealness",
  "identical",
  "identify",
  "identity",
  "ideology",
  "idiocy",
  "idiom",
  "idly",
  "igloo",
  "ignition",
  "ignore",
  "iguana",
  "illicitly",
  "illusion",
  "illusive",
  "image",
  "imaginary",
  "imagines",
  "imaging",
  "imbecile",
  "imitate",
  "imitation",
  "immature",
  "immerse",
  "immersion",
  "imminent",
  "immobile",
  "immodest",
  "immorally",
  "immortal",
  "immovable",
  "immovably",
  "immunity",
  "immunize",
  "impaired",
  "impale",
  "impart",
  "impatient",
  "impeach",
  "impeding",
  "impending",
  "imperfect",
  "imperial",
  "impish",
  "implant",
  "implement",
  "implicate",
  "implicit",
  "implode",
  "implosion",
  "implosive",
  "imply",
  "impolite",
  "important",
  "importer",
  "impose",
  "imposing",
  "impotence",
  "impotency",
  "impotent",
  "impound",
  "imprecise",
  "imprint",
  "imprison",
  "impromptu",
  "improper",
  "improve",
  "improving",
  "improvise",
  "imprudent",
  "impulse",
  "impulsive",
  "impure",
  "impurity",
  "iodine",
  "iodize",
  "ion",
  "ipad",
  "iphone",
  "ipod",
  "irate",
  "irk",
  "iron",
  "irregular",
  "irrigate",
  "irritable",
  "irritably",
  "irritant",
  "irritate",
  "islamic",
  "islamist",
  "isolated",
  "isolating",
  "isolation",
  "isotope",
  "issue",
  "issuing",
  "italicize",
  "italics",
  "item",
  "itinerary",
  "itunes",
  "ivory",
  "ivy",
  "jab",
  "jackal",
  "jacket",
  "jackknife",
  "jackpot",
  "jailbird",
  "jailbreak",
  "jailer",
  "jailhouse",
  "jalapeno",
  "jam",
  "janitor",
  "january",
  "jargon",
  "jarring",
  "jasmine",
  "jaundice",
  "jaunt",
  "java",
  "jawed",
  "jawless",
  "jawline",
  "jaws",
  "jaybird",
  "jaywalker",
  "jazz",
  "jeep",
  "jeeringly",
  "jellied",
  "jelly",
  "jersey",
  "jester",
  "jet",
  "jiffy",
  "jigsaw",
  "jimmy",
  "jingle",
  "jingling",
  "jinx",
  "jitters",
  "jittery",
  "job",
  "jockey",
  "jockstrap",
  "jogger",
  "jogging",
  "john",
  "joining",
  "jokester",
  "jokingly",
  "jolliness",
  "jolly",
  "jolt",
  "jot",
  "jovial",
  "joyfully",
  "joylessly",
  "joyous",
  "joyride",
  "joystick",
  "jubilance",
  "jubilant",
  "judge",
  "judgingly",
  "judicial",
  "judiciary",
  "judo",
  "juggle",
  "juggling",
  "jugular",
  "juice",
  "juiciness",
  "juicy",
  "jujitsu",
  "jukebox",
  "july",
  "jumble",
  "jumbo",
  "jump",
  "junction",
  "juncture",
  "june",
  "junior",
  "juniper",
  "junkie",
  "junkman",
  "junkyard",
  "jurist",
  "juror",
  "jury",
  "justice",
  "justifier",
  "justify",
  "justly",
  "justness",
  "juvenile",
  "kabob",
  "kangaroo",
  "karaoke",
  "karate",
  "karma",
  "kebab",
  "keenly",
  "keenness",
  "keep",
  "keg",
  "kelp",
  "kennel",
  "kept",
  "kerchief",
  "kerosene",
  "kettle",
  "kick",
  "kiln",
  "kilobyte",
  "kilogram",
  "kilometer",
  "kilowatt",
  "kilt",
  "kimono",
  "kindle",
  "kindling",
  "kindly",
  "kindness",
  "kindred",
  "kinetic",
  "kinfolk",
  "king",
  "kinship",
  "kinsman",
  "kinswoman",
  "kissable",
  "kisser",
  "kissing",
  "kitchen",
  "kite",
  "kitten",
  "kitty",
  "kiwi",
  "kleenex",
  "knapsack",
  "knee",
  "knelt",
  "knickers",
  "knoll",
  "koala",
  "kooky",
  "kosher",
  "krypton",
  "kudos",
  "kung",
  "labored",
  "laborer",
  "laboring",
  "laborious",
  "labrador",
  "ladder",
  "ladies",
  "ladle",
  "ladybug",
  "ladylike",
  "lagged",
  "lagging",
  "lagoon",
  "lair",
  "lake",
  "lance",
  "landed",
  "landfall",
  "landfill",
  "landing",
  "landlady",
  "landless",
  "landline",
  "landlord",
  "landmark",
  "landmass",
  "landmine",
  "landowner",
  "landscape",
  "landside",
  "landslide",
  "language",
  "lankiness",
  "lanky",
  "lantern",
  "lapdog",
  "lapel",
  "lapped",
  "lapping",
  "laptop",
  "lard",
  "large",
  "lark",
  "lash",
  "lasso",
  "last",
  "latch",
  "late",
  "lather",
  "latitude",
  "latrine",
  "latter",
  "latticed",
  "launch",
  "launder",
  "laundry",
  "laurel",
  "lavender",
  "lavish",
  "laxative",
  "lazily",
  "laziness",
  "lazy",
  "lecturer",
  "left",
  "legacy",
  "legal",
  "legend",
  "legged",
  "leggings",
  "legible",
  "legibly",
  "legislate",
  "lego",
  "legroom",
  "legume",
  "legwarmer",
  "legwork",
  "lemon",
  "lend",
  "length",
  "lens",
  "lent",
  "leotard",
  "lesser",
  "letdown",
  "lethargic",
  "lethargy",
  "letter",
  "lettuce",
  "level",
  "leverage",
  "levers",
  "levitate",
  "levitator",
  "liability",
  "liable",
  "liberty",
  "librarian",
  "library",
  "licking",
  "licorice",
  "lid",
  "life",
  "lifter",
  "lifting",
  "liftoff",
  "ligament",
  "likely",
  "likeness",
  "likewise",
  "liking",
  "lilac",
  "lilly",
  "lily",
  "limb",
  "limeade",
  "limelight",
  "limes",
  "limit",
  "limping",
  "limpness",
  "line",
  "lingo",
  "linguini",
  "linguist",
  "lining",
  "linked",
  "linoleum",
  "linseed",
  "lint",
  "lion",
  "lip",
  "liquefy",
  "liqueur",
  "liquid",
  "lisp",
  "list",
  "litigate",
  "litigator",
  "litmus",
  "litter",
  "little",
  "livable",
  "lived",
  "lively",
  "liver",
  "livestock",
  "lividly",
  "living",
  "lizard",
  "lubricant",
  "lubricate",
  "lucid",
  "luckily",
  "luckiness",
  "luckless",
  "lucrative",
  "ludicrous",
  "lugged",
  "lukewarm",
  "lullaby",
  "lumber",
  "luminance",
  "luminous",
  "lumpiness",
  "lumping",
  "lumpish",
  "lunacy",
  "lunar",
  "lunchbox",
  "luncheon",
  "lunchroom",
  "lunchtime",
  "lung",
  "lurch",
  "lure",
  "luridness",
  "lurk",
  "lushly",
  "lushness",
  "luster",
  "lustfully",
  "lustily",
  "lustiness",
  "lustrous",
  "lusty",
  "luxurious",
  "luxury",
  "lying",
  "lyrically",
  "lyricism",
  "lyricist",
  "lyrics",
  "macarena",
  "macaroni",
  "macaw",
  "mace",
  "machine",
  "machinist",
  "magazine",
  "magenta",
  "maggot",
  "magical",
  "magician",
  "magma",
  "magnesium",
  "magnetic",
  "magnetism",
  "magnetize",
  "magnifier",
  "magnify",
  "magnitude",
  "magnolia",
  "mahogany",
  "maimed",
  "majestic",
  "majesty",
  "majorette",
  "majority",
  "makeover",
  "maker",
  "makeshift",
  "making",
  "malformed",
  "malt",
  "mama",
  "mammal",
  "mammary",
  "mammogram",
  "manager",
  "managing",
  "manatee",
  "mandarin",
  "mandate",
  "mandatory",
  "mandolin",
  "manger",
  "mangle",
  "mango",
  "mangy",
  "manhandle",
  "manhole",
  "manhood",
  "manhunt",
  "manicotti",
  "manicure",
  "manifesto",
  "manila",
  "mankind",
  "manlike",
  "manliness",
  "manly",
  "manmade",
  "manned",
  "mannish",
  "manor",
  "manpower",
  "mantis",
  "mantra",
  "manual",
  "many",
  "map",
  "marathon",
  "marauding",
  "marbled",
  "marbles",
  "marbling",
  "march",
  "mardi",
  "margarine",
  "margarita",
  "margin",
  "marigold",
  "marina",
  "marine",
  "marital",
  "maritime",
  "marlin",
  "marmalade",
  "maroon",
  "married",
  "marrow",
  "marry",
  "marshland",
  "marshy",
  "marsupial",
  "marvelous",
  "marxism",
  "mascot",
  "masculine",
  "mashed",
  "mashing",
  "massager",
  "masses",
  "massive",
  "mastiff",
  "matador",
  "matchbook",
  "matchbox",
  "matcher",
  "matching",
  "matchless",
  "material",
  "maternal",
  "maternity",
  "math",
  "mating",
  "matriarch",
  "matrimony",
  "matrix",
  "matron",
  "matted",
  "matter",
  "maturely",
  "maturing",
  "maturity",
  "mauve",
  "maverick",
  "maximize",
  "maximum",
  "maybe",
  "mayday",
  "mayflower",
  "moaner",
  "moaning",
  "mobile",
  "mobility",
  "mobilize",
  "mobster",
  "mocha",
  "mocker",
  "mockup",
  "modified",
  "modify",
  "modular",
  "modulator",
  "module",
  "moisten",
  "moistness",
  "moisture",
  "molar",
  "molasses",
  "mold",
  "molecular",
  "molecule",
  "molehill",
  "mollusk",
  "mom",
  "monastery",
  "monday",
  "monetary",
  "monetize",
  "moneybags",
  "moneyless",
  "moneywise",
  "mongoose",
  "mongrel",
  "monitor",
  "monkhood",
  "monogamy",
  "monogram",
  "monologue",
  "monopoly",
  "monorail",
  "monotone",
  "monotype",
  "monoxide",
  "monsieur",
  "monsoon",
  "monstrous",
  "monthly",
  "monument",
  "moocher",
  "moodiness",
  "moody",
  "mooing",
  "moonbeam",
  "mooned",
  "moonlight",
  "moonlike",
  "moonlit",
  "moonrise",
  "moonscape",
  "moonshine",
  "moonstone",
  "moonwalk",
  "mop",
  "morale",
  "morality",
  "morally",
  "morbidity",
  "morbidly",
  "morphine",
  "morphing",
  "morse",
  "mortality",
  "mortally",
  "mortician",
  "mortified",
  "mortify",
  "mortuary",
  "mosaic",
  "mossy",
  "most",
  "mothball",
  "mothproof",
  "motion",
  "motivate",
  "motivator",
  "motive",
  "motocross",
  "motor",
  "motto",
  "mountable",
  "mountain",
  "mounted",
  "mounting",
  "mourner",
  "mournful",
  "mouse",
  "mousiness",
  "moustache",
  "mousy",
  "mouth",
  "movable",
  "move",
  "movie",
  "moving",
  "mower",
  "mowing",
  "much",
  "muck",
  "mud",
  "mug",
  "mulberry",
  "mulch",
  "mule",
  "mulled",
  "mullets",
  "multiple",
  "multiply",
  "multitask",
  "multitude",
  "mumble",
  "mumbling",
  "mumbo",
  "mummified",
  "mummify",
  "mummy",
  "mumps",
  "munchkin",
  "mundane",
  "municipal",
  "muppet",
  "mural",
  "murkiness",
  "murky",
  "murmuring",
  "muscular",
  "museum",
  "mushily",
  "mushiness",
  "mushroom",
  "mushy",
  "music",
  "musket",
  "muskiness",
  "musky",
  "mustang",
  "mustard",
  "muster",
  "mustiness",
  "musty",
  "mutable",
  "mutate",
  "mutation",
  "mute",
  "mutilated",
  "mutilator",
  "mutiny",
  "mutt",
  "mutual",
  "muzzle",
  "myself",
  "myspace",
  "mystified",
  "mystify",
  "myth",
  "nacho",
  "nag",
  "nail",
  "name",
  "naming",
  "nanny",
  "nanometer",
  "nape",
  "napkin",
  "napped",
  "napping",
  "nappy",
  "narrow",
  "nastily",
  "nastiness",
  "national",
  "native",
  "nativity",
  "natural",
  "nature",
  "naturist",
  "nautical",
  "navigate",
  "navigator",
  "navy",
  "nearby",
  "nearest",
  "nearly",
  "nearness",
  "neatly",
  "neatness",
  "nebula",
  "nebulizer",
  "nectar",
  "negate",
  "negation",
  "negative",
  "neglector",
  "negligee",
  "negligent",
  "negotiate",
  "nemeses",
  "nemesis",
  "neon",
  "nephew",
  "nerd",
  "nervous",
  "nervy",
  "nest",
  "net",
  "neurology",
  "neuron",
  "neurosis",
  "neurotic",
  "neuter",
  "neutron",
  "never",
  "next",
  "nibble",
  "nickname",
  "nicotine",
  "niece",
  "nifty",
  "nimble",
  "nimbly",
  "nineteen",
  "ninetieth",
  "ninja",
  "nintendo",
  "ninth",
  "nuclear",
  "nuclei",
  "nucleus",
  "nugget",
  "nullify",
  "number",
  "numbing",
  "numbly",
  "numbness",
  "numeral",
  "numerate",
  "numerator",
  "numeric",
  "numerous",
  "nuptials",
  "nursery",
  "nursing",
  "nurture",
  "nutcase",
  "nutlike",
  "nutmeg",
  "nutrient",
  "nutshell",
  "nuttiness",
  "nutty",
  "nuzzle",
  "nylon",
  "oaf",
  "oak",
  "oasis",
  "oat",
  "obedience",
  "obedient",
  "obituary",
  "object",
  "obligate",
  "obliged",
  "oblivion",
  "oblivious",
  "oblong",
  "obnoxious",
  "oboe",
  "obscure",
  "obscurity",
  "observant",
  "observer",
  "observing",
  "obsessed",
  "obsession",
  "obsessive",
  "obsolete",
  "obstacle",
  "obstinate",
  "obstruct",
  "obtain",
  "obtrusive",
  "obtuse",
  "obvious",
  "occultist",
  "occupancy",
  "occupant",
  "occupier",
  "occupy",
  "ocean",
  "ocelot",
  "octagon",
  "octane",
  "october",
  "octopus",
  "ogle",
  "oil",
  "oink",
  "ointment",
  "okay",
  "old",
  "olive",
  "olympics",
  "omega",
  "omen",
  "ominous",
  "omission",
  "omit",
  "omnivore",
  "onboard",
  "oncoming",
  "ongoing",
  "onion",
  "online",
  "onlooker",
  "only",
  "onscreen",
  "onset",
  "onshore",
  "onslaught",
  "onstage",
  "onto",
  "onward",
  "onyx",
  "oops",
  "ooze",
  "oozy",
  "opacity",
  "opal",
  "open",
  "operable",
  "operate",
  "operating",
  "operation",
  "operative",
  "operator",
  "opium",
  "opossum",
  "opponent",
  "oppose",
  "opposing",
  "opposite",
  "oppressed",
  "oppressor",
  "opt",
  "opulently",
  "osmosis",
  "other",
  "otter",
  "ouch",
  "ought",
  "ounce",
  "outage",
  "outback",
  "outbid",
  "outboard",
  "outbound",
  "outbreak",
  "outburst",
  "outcast",
  "outclass",
  "outcome",
  "outdated",
  "outdoors",
  "outer",
  "outfield",
  "outfit",
  "outflank",
  "outgoing",
  "outgrow",
  "outhouse",
  "outing",
  "outlast",
  "outlet",
  "outline",
  "outlook",
  "outlying",
  "outmatch",
  "outmost",
  "outnumber",
  "outplayed",
  "outpost",
  "outpour",
  "output",
  "outrage",
  "outrank",
  "outreach",
  "outright",
  "outscore",
  "outsell",
  "outshine",
  "outshoot",
  "outsider",
  "outskirts",
  "outsmart",
  "outsource",
  "outspoken",
  "outtakes",
  "outthink",
  "outward",
  "outweigh",
  "outwit",
  "oval",
  "ovary",
  "oven",
  "overact",
  "overall",
  "overarch",
  "overbid",
  "overbill",
  "overbite",
  "overblown",
  "overboard",
  "overbook",
  "overbuilt",
  "overcast",
  "overcoat",
  "overcome",
  "overcook",
  "overcrowd",
  "overdraft",
  "overdrawn",
  "overdress",
  "overdrive",
  "overdue",
  "overeager",
  "overeater",
  "overexert",
  "overfed",
  "overfeed",
  "overfill",
  "overflow",
  "overfull",
  "overgrown",
  "overhand",
  "overhang",
  "overhaul",
  "overhead",
  "overhear",
  "overheat",
  "overhung",
  "overjoyed",
  "overkill",
  "overlabor",
  "overlaid",
  "overlap",
  "overlay",
  "overload",
  "overlook",
  "overlord",
  "overlying",
  "overnight",
  "overpass",
  "overpay",
  "overplant",
  "overplay",
  "overpower",
  "overprice",
  "overrate",
  "overreach",
  "overreact",
  "override",
  "overripe",
  "overrule",
  "overrun",
  "overshoot",
  "overshot",
  "oversight",
  "oversized",
  "oversleep",
  "oversold",
  "overspend",
  "overstate",
  "overstay",
  "overstep",
  "overstock",
  "overstuff",
  "oversweet",
  "overtake",
  "overthrow",
  "overtime",
  "overtly",
  "overtone",
  "overture",
  "overturn",
  "overuse",
  "overvalue",
  "overview",
  "overwrite",
  "owl",
  "oxford",
  "oxidant",
  "oxidation",
  "oxidize",
  "oxidizing",
  "oxygen",
  "oxymoron",
  "oyster",
  "ozone",
  "paced",
  "pacemaker",
  "pacific",
  "pacifier",
  "pacifism",
  "pacifist",
  "pacify",
  "padded",
  "padding",
  "paddle",
  "paddling",
  "padlock",
  "pagan",
  "pager",
  "paging",
  "pajamas",
  "palace",
  "palatable",
  "palm",
  "palpable",
  "palpitate",
  "paltry",
  "pampered",
  "pamperer",
  "pampers",
  "pamphlet",
  "panama",
  "pancake",
  "pancreas",
  "panda",
  "pandemic",
  "pang",
  "panhandle",
  "panic",
  "panning",
  "panorama",
  "panoramic",
  "panther",
  "pantomime",
  "pantry",
  "pants",
  "pantyhose",
  "paparazzi",
  "papaya",
  "paper",
  "paprika",
  "papyrus",
  "parabola",
  "parachute",
  "parade",
  "paradox",
  "paragraph",
  "parakeet",
  "paralegal",
  "paralyses",
  "paralysis",
  "paralyze",
  "paramedic",
  "parameter",
  "paramount",
  "parasail",
  "parasite",
  "parasitic",
  "parcel",
  "parched",
  "parchment",
  "pardon",
  "parish",
  "parka",
  "parking",
  "parkway",
  "parlor",
  "parmesan",
  "parole",
  "parrot",
  "parsley",
  "parsnip",
  "partake",
  "parted",
  "parting",
  "partition",
  "partly",
  "partner",
  "partridge",
  "party",
  "passable",
  "passably",
  "passage",
  "passcode",
  "passenger",
  "passerby",
  "passing",
  "passion",
  "passive",
  "passivism",
  "passover",
  "passport",
  "password",
  "pasta",
  "pasted",
  "pastel",
  "pastime",
  "pastor",
  "pastrami",
  "pasture",
  "pasty",
  "patchwork",
  "patchy",
  "paternal",
  "paternity",
  "path",
  "patience",
  "patient",
  "patio",
  "patriarch",
  "patriot",
  "patrol",
  "patronage",
  "patronize",
  "pauper",
  "pavement",
  "paver",
  "pavestone",
  "pavilion",
  "paving",
  "pawing",
  "payable",
  "payback",
  "paycheck",
  "payday",
  "payee",
  "payer",
  "paying",
  "payment",
  "payphone",
  "payroll",
  "pebble",
  "pebbly",
  "pecan",
  "pectin",
  "peculiar",
  "peddling",
  "pediatric",
  "pedicure",
  "pedigree",
  "pedometer",
  "pegboard",
  "pelican",
  "pellet",
  "pelt",
  "pelvis",
  "penalize",
  "penalty",
  "pencil",
  "pendant",
  "pending",
  "penholder",
  "penknife",
  "pennant",
  "penniless",
  "penny",
  "penpal",
  "pension",
  "pentagon",
  "pentagram",
  "pep",
  "perceive",
  "percent",
  "perch",
  "percolate",
  "perennial",
  "perfected",
  "perfectly",
  "perfume",
  "periscope",
  "perish",
  "perjurer",
  "perjury",
  "perkiness",
  "perky",
  "perm",
  "peroxide",
  "perpetual",
  "perplexed",
  "persecute",
  "persevere",
  "persuaded",
  "persuader",
  "pesky",
  "peso",
  "pessimism",
  "pessimist",
  "pester",
  "pesticide",
  "petal",
  "petite",
  "petition",
  "petri",
  "petroleum",
  "petted",
  "petticoat",
  "pettiness",
  "petty",
  "petunia",
  "phantom",
  "phobia",
  "phoenix",
  "phonebook",
  "phoney",
  "phonics",
  "phoniness",
  "phony",
  "phosphate",
  "photo",
  "phrase",
  "phrasing",
  "placard",
  "placate",
  "placidly",
  "plank",
  "planner",
  "plant",
  "plasma",
  "plaster",
  "plastic",
  "plated",
  "platform",
  "plating",
  "platinum",
  "platonic",
  "platter",
  "platypus",
  "plausible",
  "plausibly",
  "playable",
  "playback",
  "player",
  "playful",
  "playgroup",
  "playhouse",
  "playing",
  "playlist",
  "playmaker",
  "playmate",
  "playoff",
  "playpen",
  "playroom",
  "playset",
  "plaything",
  "playtime",
  "plaza",
  "pleading",
  "pleat",
  "pledge",
  "plentiful",
  "plenty",
  "plethora",
  "plexiglas",
  "pliable",
  "plod",
  "plop",
  "plot",
  "plow",
  "ploy",
  "pluck",
  "plug",
  "plunder",
  "plunging",
  "plural",
  "plus",
  "plutonium",
  "plywood",
  "poach",
  "pod",
  "poem",
  "poet",
  "pogo",
  "pointed",
  "pointer",
  "pointing",
  "pointless",
  "pointy",
  "poise",
  "poison",
  "poker",
  "poking",
  "polar",
  "police",
  "policy",
  "polio",
  "polish",
  "politely",
  "polka",
  "polo",
  "polyester",
  "polygon",
  "polygraph",
  "polymer",
  "poncho",
  "pond",
  "pony",
  "popcorn",
  "pope",
  "poplar",
  "popper",
  "poppy",
  "popsicle",
  "populace",
  "popular",
  "populate",
  "porcupine",
  "pork",
  "porous",
  "porridge",
  "portable",
  "portal",
  "portfolio",
  "porthole",
  "portion",
  "portly",
  "portside",
  "poser",
  "posh",
  "posing",
  "possible",
  "possibly",
  "possum",
  "postage",
  "postal",
  "postbox",
  "postcard",
  "posted",
  "poster",
  "posting",
  "postnasal",
  "posture",
  "postwar",
  "pouch",
  "pounce",
  "pouncing",
  "pound",
  "pouring",
  "pout",
  "powdered",
  "powdering",
  "powdery",
  "power",
  "powwow",
  "pox",
  "praising",
  "prance",
  "prancing",
  "pranker",
  "prankish",
  "prankster",
  "prayer",
  "praying",
  "preacher",
  "preaching",
  "preachy",
  "preamble",
  "precinct",
  "precise",
  "precision",
  "precook",
  "precut",
  "predator",
  "predefine",
  "predict",
  "preface",
  "prefix",
  "preflight",
  "preformed",
  "pregame",
  "pregnancy",
  "pregnant",
  "preheated",
  "prelaunch",
  "prelaw",
  "prelude",
  "premiere",
  "premises",
  "premium",
  "prenatal",
  "preoccupy",
  "preorder",
  "prepaid",
  "prepay",
  "preplan",
  "preppy",
  "preschool",
  "prescribe",
  "preseason",
  "preset",
  "preshow",
  "president",
  "presoak",
  "press",
  "presume",
  "presuming",
  "preteen",
  "pretended",
  "pretender",
  "pretense",
  "pretext",
  "pretty",
  "pretzel",
  "prevail",
  "prevalent",
  "prevent",
  "preview",
  "previous",
  "prewar",
  "prewashed",
  "prideful",
  "pried",
  "primal",
  "primarily",
  "primary",
  "primate",
  "primer",
  "primp",
  "princess",
  "print",
  "prior",
  "prism",
  "prison",
  "prissy",
  "pristine",
  "privacy",
  "private",
  "privatize",
  "prize",
  "proactive",
  "probable",
  "probably",
  "probation",
  "probe",
  "probing",
  "probiotic",
  "problem",
  "procedure",
  "process",
  "proclaim",
  "procreate",
  "procurer",
  "prodigal",
  "prodigy",
  "produce",
  "product",
  "profane",
  "profanity",
  "professed",
  "professor",
  "profile",
  "profound",
  "profusely",
  "progeny",
  "prognosis",
  "program",
  "progress",
  "projector",
  "prologue",
  "prolonged",
  "promenade",
  "prominent",
  "promoter",
  "promotion",
  "prompter",
  "promptly",
  "prone",
  "prong",
  "pronounce",
  "pronto",
  "proofing",
  "proofread",
  "proofs",
  "propeller",
  "properly",
  "property",
  "proponent",
  "proposal",
  "propose",
  "props",
  "prorate",
  "protector",
  "protegee",
  "proton",
  "prototype",
  "protozoan",
  "protract",
  "protrude",
  "proud",
  "provable",
  "proved",
  "proven",
  "provided",
  "provider",
  "providing",
  "province",
  "proving",
  "provoke",
  "provoking",
  "provolone",
  "prowess",
  "prowler",
  "prowling",
  "proximity",
  "proxy",
  "prozac",
  "prude",
  "prudishly",
  "prune",
  "pruning",
  "pry",
  "psychic",
  "public",
  "publisher",
  "pucker",
  "pueblo",
  "pug",
  "pull",
  "pulmonary",
  "pulp",
  "pulsate",
  "pulse",
  "pulverize",
  "puma",
  "pumice",
  "pummel",
  "punch",
  "punctual",
  "punctuate",
  "punctured",
  "pungent",
  "punisher",
  "punk",
  "pupil",
  "puppet",
  "puppy",
  "purchase",
  "pureblood",
  "purebred",
  "purely",
  "pureness",
  "purgatory",
  "purge",
  "purging",
  "purifier",
  "purify",
  "purist",
  "puritan",
  "purity",
  "purple",
  "purplish",
  "purposely",
  "purr",
  "purse",
  "pursuable",
  "pursuant",
  "pursuit",
  "purveyor",
  "pushcart",
  "pushchair",
  "pusher",
  "pushiness",
  "pushing",
  "pushover",
  "pushpin",
  "pushup",
  "pushy",
  "putdown",
  "putt",
  "puzzle",
  "puzzling",
  "pyramid",
  "pyromania",
  "python",
  "quack",
  "quadrant",
  "quail",
  "quaintly",
  "quake",
  "quaking",
  "qualified",
  "qualifier",
  "qualify",
  "quality",
  "qualm",
  "quantum",
  "quarrel",
  "quarry",
  "quartered",
  "quarterly",
  "quarters",
  "quartet",
  "quench",
  "query",
  "quicken",
  "quickly",
  "quickness",
  "quicksand",
  "quickstep",
  "quiet",
  "quill",
  "quilt",
  "quintet",
  "quintuple",
  "quirk",
  "quit",
  "quiver",
  "quizzical",
  "quotable",
  "quotation",
  "quote",
  "rabid",
  "race",
  "racing",
  "racism",
  "rack",
  "racoon",
  "radar",
  "radial",
  "radiance",
  "radiantly",
  "radiated",
  "radiation",
  "radiator",
  "radio",
  "radish",
  "raffle",
  "raft",
  "rage",
  "ragged",
  "raging",
  "ragweed",
  "raider",
  "railcar",
  "railing",
  "railroad",
  "railway",
  "raisin",
  "rake",
  "raking",
  "rally",
  "ramble",
  "rambling",
  "ramp",
  "ramrod",
  "ranch",
  "rancidity",
  "random",
  "ranged",
  "ranger",
  "ranging",
  "ranked",
  "ranking",
  "ransack",
  "ranting",
  "rants",
  "rare",
  "rarity",
  "rascal",
  "rash",
  "rasping",
  "ravage",
  "raven",
  "ravine",
  "raving",
  "ravioli",
  "ravishing",
  "reabsorb",
  "reach",
  "reacquire",
  "reaction",
  "reactive",
  "reactor",
  "reaffirm",
  "ream",
  "reanalyze",
  "reappear",
  "reapply",
  "reappoint",
  "reapprove",
  "rearrange",
  "rearview",
  "reason",
  "reassign",
  "reassure",
  "reattach",
  "reawake",
  "rebalance",
  "rebate",
  "rebel",
  "rebirth",
  "reboot",
  "reborn",
  "rebound",
  "rebuff",
  "rebuild",
  "rebuilt",
  "reburial",
  "rebuttal",
  "recall",
  "recant",
  "recapture",
  "recast",
  "recede",
  "recent",
  "recess",
  "recharger",
  "recipient",
  "recital",
  "recite",
  "reckless",
  "reclaim",
  "recliner",
  "reclining",
  "recluse",
  "reclusive",
  "recognize",
  "recoil",
  "recollect",
  "recolor",
  "reconcile",
  "reconfirm",
  "reconvene",
  "recopy",
  "record",
  "recount",
  "recoup",
  "recovery",
  "recreate",
  "rectal",
  "rectangle",
  "rectified",
  "rectify",
  "recycled",
  "recycler",
  "recycling",
  "reemerge",
  "reenact",
  "reenter",
  "reentry",
  "reexamine",
  "referable",
  "referee",
  "reference",
  "refill",
  "refinance",
  "refined",
  "refinery",
  "refining",
  "refinish",
  "reflected",
  "reflector",
  "reflex",
  "reflux",
  "refocus",
  "refold",
  "reforest",
  "reformat",
  "reformed",
  "reformer",
  "reformist",
  "refract",
  "refrain",
  "refreeze",
  "refresh",
  "refried",
  "refueling",
  "refund",
  "refurbish",
  "refurnish",
  "refusal",
  "refuse",
  "refusing",
  "refutable",
  "refute",
  "regain",
  "regalia",
  "regally",
  "reggae",
  "regime",
  "region",
  "register",
  "registrar",
  "registry",
  "regress",
  "regretful",
  "regroup",
  "regular",
  "regulate",
  "regulator",
  "rehab",
  "reheat",
  "rehire",
  "rehydrate",
  "reimburse",
  "reissue",
  "reiterate",
  "rejoice",
  "rejoicing",
  "rejoin",
  "rekindle",
  "relapse",
  "relapsing",
  "relatable",
  "related",
  "relation",
  "relative",
  "relax",
  "relay",
  "relearn",
  "release",
  "relenting",
  "reliable",
  "reliably",
  "reliance",
  "reliant",
  "relic",
  "relieve",
  "relieving",
  "relight",
  "relish",
  "relive",
  "reload",
  "relocate",
  "relock",
  "reluctant",
  "rely",
  "remake",
  "remark",
  "remarry",
  "rematch",
  "remedial",
  "remedy",
  "remember",
  "reminder",
  "remindful",
  "remission",
  "remix",
  "remnant",
  "remodeler",
  "remold",
  "remorse",
  "remote",
  "removable",
  "removal",
  "removed",
  "remover",
  "removing",
  "rename",
  "renderer",
  "rendering",
  "rendition",
  "renegade",
  "renewable",
  "renewably",
  "renewal",
  "renewed",
  "renounce",
  "renovate",
  "renovator",
  "rentable",
  "rental",
  "rented",
  "renter",
  "reoccupy",
  "reoccur",
  "reopen",
  "reorder",
  "repackage",
  "repacking",
  "repaint",
  "repair",
  "repave",
  "repaying",
  "repayment",
  "repeal",
  "repeated",
  "repeater",
  "repent",
  "rephrase",
  "replace",
  "replay",
  "replica",
  "reply",
  "reporter",
  "repose",
  "repossess",
  "repost",
  "repressed",
  "reprimand",
  "reprint",
  "reprise",
  "reproach",
  "reprocess",
  "reproduce",
  "reprogram",
  "reps",
  "reptile",
  "reptilian",
  "repugnant",
  "repulsion",
  "repulsive",
  "repurpose",
  "reputable",
  "reputably",
  "request",
  "require",
  "requisite",
  "reroute",
  "rerun",
  "resale",
  "resample",
  "rescuer",
  "reseal",
  "research",
  "reselect",
  "reseller",
  "resemble",
  "resend",
  "resent",
  "reset",
  "reshape",
  "reshoot",
  "reshuffle",
  "residence",
  "residency",
  "resident",
  "residual",
  "residue",
  "resigned",
  "resilient",
  "resistant",
  "resisting",
  "resize",
  "resolute",
  "resolved",
  "resonant",
  "resonate",
  "resort",
  "resource",
  "respect",
  "resubmit",
  "result",
  "resume",
  "resupply",
  "resurface",
  "resurrect",
  "retail",
  "retainer",
  "retaining",
  "retake",
  "retaliate",
  "retention",
  "rethink",
  "retinal",
  "retired",
  "retiree",
  "retiring",
  "retold",
  "retool",
  "retorted",
  "retouch",
  "retrace",
  "retract",
  "retrain",
  "retread",
  "retreat",
  "retrial",
  "retrieval",
  "retriever",
  "retry",
  "return",
  "retying",
  "retype",
  "reunion",
  "reunite",
  "reusable",
  "reuse",
  "reveal",
  "reveler",
  "revenge",
  "revenue",
  "reverb",
  "revered",
  "reverence",
  "reverend",
  "reversal",
  "reverse",
  "reversing",
  "reversion",
  "revert",
  "revisable",
  "revise",
  "revision",
  "revisit",
  "revivable",
  "revival",
  "reviver",
  "reviving",
  "revocable",
  "revoke",
  "revolt",
  "revolver",
  "revolving",
  "reward",
  "rewash",
  "rewind",
  "rewire",
  "reword",
  "rework",
  "rewrap",
  "rewrite",
  "rhyme",
  "ribbon",
  "ribcage",
  "rice",
  "riches",
  "richly",
  "richness",
  "rickety",
  "ricotta",
  "riddance",
  "ridden",
  "ride",
  "riding",
  "rifling",
  "rift",
  "rigging",
  "rigid",
  "rigor",
  "rimless",
  "rimmed",
  "rind",
  "rink",
  "rinse",
  "rinsing",
  "riot",
  "ripcord",
  "ripeness",
  "ripening",
  "ripping",
  "ripple",
  "rippling",
  "riptide",
  "rise",
  "rising",
  "risk",
  "risotto",
  "ritalin",
  "ritzy",
  "rival",
  "riverbank",
  "riverbed",
  "riverboat",
  "riverside",
  "riveter",
  "riveting",
  "roamer",
  "roaming",
  "roast",
  "robbing",
  "robe",
  "robin",
  "robotics",
  "robust",
  "rockband",
  "rocker",
  "rocket",
  "rockfish",
  "rockiness",
  "rocking",
  "rocklike",
  "rockslide",
  "rockstar",
  "rocky",
  "rogue",
  "roman",
  "romp",
  "rope",
  "roping",
  "roster",
  "rosy",
  "rotten",
  "rotting",
  "rotunda",
  "roulette",
  "rounding",
  "roundish",
  "roundness",
  "roundup",
  "roundworm",
  "routine",
  "routing",
  "rover",
  "roving",
  "royal",
  "rubbed",
  "rubber",
  "rubbing",
  "rubble",
  "rubdown",
  "ruby",
  "ruckus",
  "rudder",
  "rug",
  "ruined",
  "rule",
  "rumble",
  "rumbling",
  "rummage",
  "rumor",
  "runaround",
  "rundown",
  "runner",
  "running",
  "runny",
  "runt",
  "runway",
  "rupture",
  "rural",
  "ruse",
  "rush",
  "rust",
  "rut",
  "sabbath",
  "sabotage",
  "sacrament",
  "sacred",
  "sacrifice",
  "sadden",
  "saddlebag",
  "saddled",
  "saddling",
  "sadly",
  "sadness",
  "safari",
  "safeguard",
  "safehouse",
  "safely",
  "safeness",
  "saffron",
  "saga",
  "sage",
  "sagging",
  "saggy",
  "said",
  "saint",
  "sake",
  "salad",
  "salami",
  "salaried",
  "salary",
  "saline",
  "salon",
  "saloon",
  "salsa",
  "salt",
  "salutary",
  "salute",
  "salvage",
  "salvaging",
  "salvation",
  "same",
  "sample",
  "sampling",
  "sanction",
  "sanctity",
  "sanctuary",
  "sandal",
  "sandbag",
  "sandbank",
  "sandbar",
  "sandblast",
  "sandbox",
  "sanded",
  "sandfish",
  "sanding",
  "sandlot",
  "sandpaper",
  "sandpit",
  "sandstone",
  "sandstorm",
  "sandworm",
  "sandy",
  "sanitary",
  "sanitizer",
  "sank",
  "santa",
  "sapling",
  "sappiness",
  "sappy",
  "sarcasm",
  "sarcastic",
  "sardine",
  "sash",
  "sasquatch",
  "sassy",
  "satchel",
  "satiable",
  "satin",
  "satirical",
  "satisfied",
  "satisfy",
  "saturate",
  "saturday",
  "sauciness",
  "saucy",
  "sauna",
  "savage",
  "savanna",
  "saved",
  "savings",
  "savior",
  "savor",
  "saxophone",
  "say",
  "scabbed",
  "scabby",
  "scalded",
  "scalding",
  "scale",
  "scaling",
  "scallion",
  "scallop",
  "scalping",
  "scam",
  "scandal",
  "scanner",
  "scanning",
  "scant",
  "scapegoat",
  "scarce",
  "scarcity",
  "scarecrow",
  "scared",
  "scarf",
  "scarily",
  "scariness",
  "scarring",
  "scary",
  "scavenger",
  "scenic",
  "schedule",
  "schematic",
  "scheme",
  "scheming",
  "schilling",
  "schnapps",
  "scholar",
  "science",
  "scientist",
  "scion",
  "scoff",
  "scolding",
  "scone",
  "scoop",
  "scooter",
  "scope",
  "scorch",
  "scorebook",
  "scorecard",
  "scored",
  "scoreless",
  "scorer",
  "scoring",
  "scorn",
  "scorpion",
  "scotch",
  "scoundrel",
  "scoured",
  "scouring",
  "scouting",
  "scouts",
  "scowling",
  "scrabble",
  "scraggly",
  "scrambled",
  "scrambler",
  "scrap",
  "scratch",
  "scrawny",
  "screen",
  "scribble",
  "scribe",
  "scribing",
  "scrimmage",
  "script",
  "scroll",
  "scrooge",
  "scrounger",
  "scrubbed",
  "scrubber",
  "scruffy",
  "scrunch",
  "scrutiny",
  "scuba",
  "scuff",
  "sculptor",
  "sculpture",
  "scurvy",
  "scuttle",
  "secluded",
  "secluding",
  "seclusion",
  "second",
  "secrecy",
  "secret",
  "sectional",
  "sector",
  "secular",
  "securely",
  "security",
  "sedan",
  "sedate",
  "sedation",
  "sedative",
  "sediment",
  "seduce",
  "seducing",
  "segment",
  "seismic",
  "seizing",
  "seldom",
  "selected",
  "selection",
  "selective",
  "selector",
  "self",
  "seltzer",
  "semantic",
  "semester",
  "semicolon",
  "semifinal",
  "seminar",
  "semisoft",
  "semisweet",
  "senate",
  "senator",
  "send",
  "senior",
  "senorita",
  "sensation",
  "sensitive",
  "sensitize",
  "sensually",
  "sensuous",
  "sepia",
  "september",
  "septic",
  "septum",
  "sequel",
  "sequence",
  "sequester",
  "series",
  "sermon",
  "serotonin",
  "serpent",
  "serrated",
  "serve",
  "service",
  "serving",
  "sesame",
  "sessions",
  "setback",
  "setting",
  "settle",
  "settling",
  "setup",
  "sevenfold",
  "seventeen",
  "seventh",
  "seventy",
  "severity",
  "shabby",
  "shack",
  "shaded",
  "shadily",
  "shadiness",
  "shading",
  "shadow",
  "shady",
  "shaft",
  "shakable",
  "shakily",
  "shakiness",
  "shaking",
  "shaky",
  "shale",
  "shallot",
  "shallow",
  "shame",
  "shampoo",
  "shamrock",
  "shank",
  "shanty",
  "shape",
  "shaping",
  "share",
  "sharpener",
  "sharper",
  "sharpie",
  "sharply",
  "sharpness",
  "shawl",
  "sheath",
  "shed",
  "sheep",
  "sheet",
  "shelf",
  "shell",
  "shelter",
  "shelve",
  "shelving",
  "sherry",
  "shield",
  "shifter",
  "shifting",
  "shiftless",
  "shifty",
  "shimmer",
  "shimmy",
  "shindig",
  "shine",
  "shingle",
  "shininess",
  "shining",
  "shiny",
  "ship",
  "shirt",
  "shivering",
  "shock",
  "shone",
  "shoplift",
  "shopper",
  "shopping",
  "shoptalk",
  "shore",
  "shortage",
  "shortcake",
  "shortcut",
  "shorten",
  "shorter",
  "shorthand",
  "shortlist",
  "shortly",
  "shortness",
  "shorts",
  "shortwave",
  "shorty",
  "shout",
  "shove",
  "showbiz",
  "showcase",
  "showdown",
  "shower",
  "showgirl",
  "showing",
  "showman",
  "shown",
  "showoff",
  "showpiece",
  "showplace",
  "showroom",
  "showy",
  "shrank",
  "shrapnel",
  "shredder",
  "shredding",
  "shrewdly",
  "shriek",
  "shrill",
  "shrimp",
  "shrine",
  "shrink",
  "shrivel",
  "shrouded",
  "shrubbery",
  "shrubs",
  "shrug",
  "shrunk",
  "shucking",
  "shudder",
  "shuffle",
  "shuffling",
  "shun",
  "shush",
  "shut",
  "shy",
  "siamese",
  "siberian",
  "sibling",
  "siding",
  "sierra",
  "siesta",
  "sift",
  "sighing",
  "silenced",
  "silencer",
  "silent",
  "silica",
  "silicon",
  "silk",
  "silliness",
  "silly",
  "silo",
  "silt",
  "silver",
  "similarly",
  "simile",
  "simmering",
  "simple",
  "simplify",
  "simply",
  "sincere",
  "sincerity",
  "singer",
  "singing",
  "single",
  "singular",
  "sinister",
  "sinless",
  "sinner",
  "sinuous",
  "sip",
  "siren",
  "sister",
  "sitcom",
  "sitter",
  "sitting",
  "situated",
  "situation",
  "sixfold",
  "sixteen",
  "sixth",
  "sixties",
  "sixtieth",
  "sixtyfold",
  "sizable",
  "sizably",
  "size",
  "sizing",
  "sizzle",
  "sizzling",
  "skater",
  "skating",
  "skedaddle",
  "skeletal",
  "skeleton",
  "skeptic",
  "sketch",
  "skewed",
  "skewer",
  "skid",
  "skied",
  "skier",
  "skies",
  "skiing",
  "skilled",
  "skillet",
  "skillful",
  "skimmed",
  "skimmer",
  "skimming",
  "skimpily",
  "skincare",
  "skinhead",
  "skinless",
  "skinning",
  "skinny",
  "skintight",
  "skipper",
  "skipping",
  "skirmish",
  "skirt",
  "skittle",
  "skydiver",
  "skylight",
  "skyline",
  "skype",
  "skyrocket",
  "skyward",
  "slab",
  "slacked",
  "slacker",
  "slacking",
  "slackness",
  "slacks",
  "slain",
  "slam",
  "slander",
  "slang",
  "slapping",
  "slapstick",
  "slashed",
  "slashing",
  "slate",
  "slather",
  "slaw",
  "sled",
  "sleek",
  "sleep",
  "sleet",
  "sleeve",
  "slept",
  "sliceable",
  "sliced",
  "slicer",
  "slicing",
  "slick",
  "slider",
  "slideshow",
  "sliding",
  "slighted",
  "slighting",
  "slightly",
  "slimness",
  "slimy",
  "slinging",
  "slingshot",
  "slinky",
  "slip",
  "slit",
  "sliver",
  "slobbery",
  "slogan",
  "sloped",
  "sloping",
  "sloppily",
  "sloppy",
  "slot",
  "slouching",
  "slouchy",
  "sludge",
  "slug",
  "slum",
  "slurp",
  "slush",
  "sly",
  "small",
  "smartly",
  "smartness",
  "smasher",
  "smashing",
  "smashup",
  "smell",
  "smelting",
  "smile",
  "smilingly",
  "smirk",
  "smite",
  "smith",
  "smitten",
  "smock",
  "smog",
  "smoked",
  "smokeless",
  "smokiness",
  "smoking",
  "smoky",
  "smolder",
  "smooth",
  "smother",
  "smudge",
  "smudgy",
  "smuggler",
  "smuggling",
  "smugly",
  "smugness",
  "snack",
  "snagged",
  "snaking",
  "snap",
  "snare",
  "snarl",
  "snazzy",
  "sneak",
  "sneer",
  "sneeze",
  "sneezing",
  "snide",
  "sniff",
  "snippet",
  "snipping",
  "snitch",
  "snooper",
  "snooze",
  "snore",
  "snoring",
  "snorkel",
  "snort",
  "snout",
  "snowbird",
  "snowboard",
  "snowbound",
  "snowcap",
  "snowdrift",
  "snowdrop",
  "snowfall",
  "snowfield",
  "snowflake",
  "snowiness",
  "snowless",
  "snowman",
  "snowplow",
  "snowshoe",
  "snowstorm",
  "snowsuit",
  "snowy",
  "snub",
  "snuff",
  "snuggle",
  "snugly",
  "snugness",
  "speak",
  "spearfish",
  "spearhead",
  "spearman",
  "spearmint",
  "species",
  "specimen",
  "specked",
  "speckled",
  "specks",
  "spectacle",
  "spectator",
  "spectrum",
  "speculate",
  "speech",
  "speed",
  "spellbind",
  "speller",
  "spelling",
  "spendable",
  "spender",
  "spending",
  "spent",
  "spew",
  "sphere",
  "spherical",
  "sphinx",
  "spider",
  "spied",
  "spiffy",
  "spill",
  "spilt",
  "spinach",
  "spinal",
  "spindle",
  "spinner",
  "spinning",
  "spinout",
  "spinster",
  "spiny",
  "spiral",
  "spirited",
  "spiritism",
  "spirits",
  "spiritual",
  "splashed",
  "splashing",
  "splashy",
  "splatter",
  "spleen",
  "splendid",
  "splendor",
  "splice",
  "splicing",
  "splinter",
  "splotchy",
  "splurge",
  "spoilage",
  "spoiled",
  "spoiler",
  "spoiling",
  "spoils",
  "spoken",
  "spokesman",
  "sponge",
  "spongy",
  "sponsor",
  "spoof",
  "spookily",
  "spooky",
  "spool",
  "spoon",
  "spore",
  "sporting",
  "sports",
  "sporty",
  "spotless",
  "spotlight",
  "spotted",
  "spotter",
  "spotting",
  "spotty",
  "spousal",
  "spouse",
  "spout",
  "sprain",
  "sprang",
  "sprawl",
  "spray",
  "spree",
  "sprig",
  "spring",
  "sprinkled",
  "sprinkler",
  "sprint",
  "sprite",
  "sprout",
  "spruce",
  "sprung",
  "spry",
  "spud",
  "spur",
  "sputter",
  "spyglass",
  "squabble",
  "squad",
  "squall",
  "squander",
  "squash",
  "squatted",
  "squatter",
  "squatting",
  "squeak",
  "squealer",
  "squealing",
  "squeamish",
  "squeegee",
  "squeeze",
  "squeezing",
  "squid",
  "squiggle",
  "squiggly",
  "squint",
  "squire",
  "squirt",
  "squishier",
  "squishy",
  "stability",
  "stabilize",
  "stable",
  "stack",
  "stadium",
  "staff",
  "stage",
  "staging",
  "stagnant",
  "stagnate",
  "stainable",
  "stained",
  "staining",
  "stainless",
  "stalemate",
  "staleness",
  "stalling",
  "stallion",
  "stamina",
  "stammer",
  "stamp",
  "stand",
  "stank",
  "staple",
  "stapling",
  "starboard",
  "starch",
  "stardom",
  "stardust",
  "starfish",
  "stargazer",
  "staring",
  "stark",
  "starless",
  "starlet",
  "starlight",
  "starlit",
  "starring",
  "starry",
  "starship",
  "starter",
  "starting",
  "startle",
  "startling",
  "startup",
  "starved",
  "starving",
  "stash",
  "state",
  "static",
  "statistic",
  "statue",
  "stature",
  "status",
  "statute",
  "statutory",
  "staunch",
  "stays",
  "steadfast",
  "steadier",
  "steadily",
  "steadying",
  "steam",
  "steed",
  "steep",
  "steerable",
  "steering",
  "steersman",
  "stegosaur",
  "stellar",
  "stem",
  "stench",
  "stencil",
  "step",
  "stereo",
  "sterile",
  "sterility",
  "sterilize",
  "sterling",
  "sternness",
  "sternum",
  "stew",
  "stick",
  "stiffen",
  "stiffly",
  "stiffness",
  "stifle",
  "stifling",
  "stillness",
  "stilt",
  "stimulant",
  "stimulate",
  "stimuli",
  "stimulus",
  "stinger",
  "stingily",
  "stinging",
  "stingray",
  "stingy",
  "stinking",
  "stinky",
  "stipend",
  "stipulate",
  "stir",
  "stitch",
  "stock",
  "stoic",
  "stoke",
  "stole",
  "stomp",
  "stonewall",
  "stoneware",
  "stonework",
  "stoning",
  "stony",
  "stood",
  "stooge",
  "stool",
  "stoop",
  "stoplight",
  "stoppable",
  "stoppage",
  "stopped",
  "stopper",
  "stopping",
  "stopwatch",
  "storable",
  "storage",
  "storeroom",
  "storewide",
  "storm",
  "stout",
  "stove",
  "stowaway",
  "stowing",
  "straddle",
  "straggler",
  "strained",
  "strainer",
  "straining",
  "strangely",
  "stranger",
  "strangle",
  "strategic",
  "strategy",
  "stratus",
  "straw",
  "stray",
  "streak",
  "stream",
  "street",
  "strength",
  "strenuous",
  "strep",
  "stress",
  "stretch",
  "strewn",
  "stricken",
  "strict",
  "stride",
  "strife",
  "strike",
  "striking",
  "strive",
  "striving",
  "strobe",
  "strode",
  "stroller",
  "strongbox",
  "strongly",
  "strongman",
  "struck",
  "structure",
  "strudel",
  "struggle",
  "strum",
  "strung",
  "strut",
  "stubbed",
  "stubble",
  "stubbly",
  "stubborn",
  "stucco",
  "stuck",
  "student",
  "studied",
  "studio",
  "study",
  "stuffed",
  "stuffing",
  "stuffy",
  "stumble",
  "stumbling",
  "stump",
  "stung",
  "stunned",
  "stunner",
  "stunning",
  "stunt",
  "stupor",
  "sturdily",
  "sturdy",
  "styling",
  "stylishly",
  "stylist",
  "stylized",
  "stylus",
  "suave",
  "subarctic",
  "subatomic",
  "subdivide",
  "subdued",
  "subduing",
  "subfloor",
  "subgroup",
  "subheader",
  "subject",
  "sublease",
  "sublet",
  "sublevel",
  "sublime",
  "submarine",
  "submerge",
  "submersed",
  "submitter",
  "subpanel",
  "subpar",
  "subplot",
  "subprime",
  "subscribe",
  "subscript",
  "subsector",
  "subside",
  "subsiding",
  "subsidize",
  "subsidy",
  "subsoil",
  "subsonic",
  "substance",
  "subsystem",
  "subtext",
  "subtitle",
  "subtly",
  "subtotal",
  "subtract",
  "subtype",
  "suburb",
  "subway",
  "subwoofer",
  "subzero",
  "succulent",
  "such",
  "suction",
  "sudden",
  "sudoku",
  "suds",
  "sufferer",
  "suffering",
  "suffice",
  "suffix",
  "suffocate",
  "suffrage",
  "sugar",
  "suggest",
  "suing",
  "suitable",
  "suitably",
  "suitcase",
  "suitor",
  "sulfate",
  "sulfide",
  "sulfite",
  "sulfur",
  "sulk",
  "sullen",
  "sulphate",
  "sulphuric",
  "sultry",
  "superbowl",
  "superglue",
  "superhero",
  "superior",
  "superjet",
  "superman",
  "supermom",
  "supernova",
  "supervise",
  "supper",
  "supplier",
  "supply",
  "support",
  "supremacy",
  "supreme",
  "surcharge",
  "surely",
  "sureness",
  "surface",
  "surfacing",
  "surfboard",
  "surfer",
  "surgery",
  "surgical",
  "surging",
  "surname",
  "surpass",
  "surplus",
  "surprise",
  "surreal",
  "surrender",
  "surrogate",
  "surround",
  "survey",
  "survival",
  "survive",
  "surviving",
  "survivor",
  "sushi",
  "suspect",
  "suspend",
  "suspense",
  "sustained",
  "sustainer",
  "swab",
  "swaddling",
  "swagger",
  "swampland",
  "swan",
  "swapping",
  "swarm",
  "sway",
  "swear",
  "sweat",
  "sweep",
  "swell",
  "swept",
  "swerve",
  "swifter",
  "swiftly",
  "swiftness",
  "swimmable",
  "swimmer",
  "swimming",
  "swimsuit",
  "swimwear",
  "swinger",
  "swinging",
  "swipe",
  "swirl",
  "switch",
  "swivel",
  "swizzle",
  "swooned",
  "swoop",
  "swoosh",
  "swore",
  "sworn",
  "swung",
  "sycamore",
  "sympathy",
  "symphonic",
  "symphony",
  "symptom",
  "synapse",
  "syndrome",
  "synergy",
  "synopses",
  "synopsis",
  "synthesis",
  "synthetic",
  "syrup",
  "system",
  "t-shirt",
  "tabasco",
  "tabby",
  "tableful",
  "tables",
  "tablet",
  "tableware",
  "tabloid",
  "tackiness",
  "tacking",
  "tackle",
  "tackling",
  "tacky",
  "taco",
  "tactful",
  "tactical",
  "tactics",
  "tactile",
  "tactless",
  "tadpole",
  "taekwondo",
  "tag",
  "tainted",
  "take",
  "taking",
  "talcum",
  "talisman",
  "tall",
  "talon",
  "tamale",
  "tameness",
  "tamer",
  "tamper",
  "tank",
  "tanned",
  "tannery",
  "tanning",
  "tantrum",
  "tapeless",
  "tapered",
  "tapering",
  "tapestry",
  "tapioca",
  "tapping",
  "taps",
  "tarantula",
  "target",
  "tarmac",
  "tarnish",
  "tarot",
  "tartar",
  "tartly",
  "tartness",
  "task",
  "tassel",
  "taste",
  "tastiness",
  "tasting",
  "tasty",
  "tattered",
  "tattle",
  "tattling",
  "tattoo",
  "taunt",
  "tavern",
  "thank",
  "that",
  "thaw",
  "theater",
  "theatrics",
  "thee",
  "theft",
  "theme",
  "theology",
  "theorize",
  "thermal",
  "thermos",
  "thesaurus",
  "these",
  "thesis",
  "thespian",
  "thicken",
  "thicket",
  "thickness",
  "thieving",
  "thievish",
  "thigh",
  "thimble",
  "thing",
  "think",
  "thinly",
  "thinner",
  "thinness",
  "thinning",
  "thirstily",
  "thirsting",
  "thirsty",
  "thirteen",
  "thirty",
  "thong",
  "thorn",
  "those",
  "thousand",
  "thrash",
  "thread",
  "threaten",
  "threefold",
  "thrift",
  "thrill",
  "thrive",
  "thriving",
  "throat",
  "throbbing",
  "throng",
  "throttle",
  "throwaway",
  "throwback",
  "thrower",
  "throwing",
  "thud",
  "thumb",
  "thumping",
  "thursday",
  "thus",
  "thwarting",
  "thyself",
  "tiara",
  "tibia",
  "tidal",
  "tidbit",
  "tidiness",
  "tidings",
  "tidy",
  "tiger",
  "tighten",
  "tightly",
  "tightness",
  "tightrope",
  "tightwad",
  "tigress",
  "tile",
  "tiling",
  "till",
  "tilt",
  "timid",
  "timing",
  "timothy",
  "tinderbox",
  "tinfoil",
  "tingle",
  "tingling",
  "tingly",
  "tinker",
  "tinkling",
  "tinsel",
  "tinsmith",
  "tint",
  "tinwork",
  "tiny",
  "tipoff",
  "tipped",
  "tipper",
  "tipping",
  "tiptoeing",
  "tiptop",
  "tiring",
  "tissue",
  "trace",
  "tracing",
  "track",
  "traction",
  "tractor",
  "trade",
  "trading",
  "tradition",
  "traffic",
  "tragedy",
  "trailing",
  "trailside",
  "train",
  "traitor",
  "trance",
  "tranquil",
  "transfer",
  "transform",
  "translate",
  "transpire",
  "transport",
  "transpose",
  "trapdoor",
  "trapeze",
  "trapezoid",
  "trapped",
  "trapper",
  "trapping",
  "traps",
  "trash",
  "travel",
  "traverse",
  "travesty",
  "tray",
  "treachery",
  "treading",
  "treadmill",
  "treason",
  "treat",
  "treble",
  "tree",
  "trekker",
  "tremble",
  "trembling",
  "tremor",
  "trench",
  "trend",
  "trespass",
  "triage",
  "trial",
  "triangle",
  "tribesman",
  "tribunal",
  "tribune",
  "tributary",
  "tribute",
  "triceps",
  "trickery",
  "trickily",
  "tricking",
  "trickle",
  "trickster",
  "tricky",
  "tricolor",
  "tricycle",
  "trident",
  "tried",
  "trifle",
  "trifocals",
  "trillion",
  "trilogy",
  "trimester",
  "trimmer",
  "trimming",
  "trimness",
  "trinity",
  "trio",
  "tripod",
  "tripping",
  "triumph",
  "trivial",
  "trodden",
  "trolling",
  "trombone",
  "trophy",
  "tropical",
  "tropics",
  "trouble",
  "troubling",
  "trough",
  "trousers",
  "trout",
  "trowel",
  "truce",
  "truck",
  "truffle",
  "trump",
  "trunks",
  "trustable",
  "trustee",
  "trustful",
  "trusting",
  "trustless",
  "truth",
  "try",
  "tubby",
  "tubeless",
  "tubular",
  "tucking",
  "tuesday",
  "tug",
  "tuition",
  "tulip",
  "tumble",
  "tumbling",
  "tummy",
  "turban",
  "turbine",
  "turbofan",
  "turbojet",
  "turbulent",
  "turf",
  "turkey",
  "turmoil",
  "turret",
  "turtle",
  "tusk",
  "tutor",
  "tutu",
  "tux",
  "tweak",
  "tweed",
  "tweet",
  "tweezers",
  "twelve",
  "twentieth",
  "twenty",
  "twerp",
  "twice",
  "twiddle",
  "twiddling",
  "twig",
  "twilight",
  "twine",
  "twins",
  "twirl",
  "twistable",
  "twisted",
  "twister",
  "twisting",
  "twisty",
  "twitch",
  "twitter",
  "tycoon",
  "tying",
  "tyke",
  "udder",
  "ultimate",
  "ultimatum",
  "ultra",
  "umbilical",
  "umbrella",
  "umpire",
  "unabashed",
  "unable",
  "unadorned",
  "unadvised",
  "unafraid",
  "unaired",
  "unaligned",
  "unaltered",
  "unarmored",
  "unashamed",
  "unaudited",
  "unawake",
  "unaware",
  "unbaked",
  "unbalance",
  "unbeaten",
  "unbend",
  "unbent",
  "unbiased",
  "unbitten",
  "unblended",
  "unblessed",
  "unblock",
  "unbolted",
  "unbounded",
  "unboxed",
  "unbraided",
  "unbridle",
  "unbroken",
  "unbuckled",
  "unbundle",
  "unburned",
  "unbutton",
  "uncanny",
  "uncapped",
  "uncaring",
  "uncertain",
  "unchain",
  "unchanged",
  "uncharted",
  "uncheck",
  "uncivil",
  "unclad",
  "unclaimed",
  "unclamped",
  "unclasp",
  "uncle",
  "unclip",
  "uncloak",
  "unclog",
  "unclothed",
  "uncoated",
  "uncoiled",
  "uncolored",
  "uncombed",
  "uncommon",
  "uncooked",
  "uncork",
  "uncorrupt",
  "uncounted",
  "uncouple",
  "uncouth",
  "uncover",
  "uncross",
  "uncrown",
  "uncrushed",
  "uncured",
  "uncurious",
  "uncurled",
  "uncut",
  "undamaged",
  "undated",
  "undaunted",
  "undead",
  "undecided",
  "undefined",
  "underage",
  "underarm",
  "undercoat",
  "undercook",
  "undercut",
  "underdog",
  "underdone",
  "underfed",
  "underfeed",
  "underfoot",
  "undergo",
  "undergrad",
  "underhand",
  "underline",
  "underling",
  "undermine",
  "undermost",
  "underpaid",
  "underpass",
  "underpay",
  "underrate",
  "undertake",
  "undertone",
  "undertook",
  "undertow",
  "underuse",
  "underwear",
  "underwent",
  "underwire",
  "undesired",
  "undiluted",
  "undivided",
  "undocked",
  "undoing",
  "undone",
  "undrafted",
  "undress",
  "undrilled",
  "undusted",
  "undying",
  "unearned",
  "unearth",
  "unease",
  "uneasily",
  "uneasy",
  "uneatable",
  "uneaten",
  "unedited",
  "unelected",
  "unending",
  "unengaged",
  "unenvied",
  "unequal",
  "unethical",
  "uneven",
  "unexpired",
  "unexposed",
  "unfailing",
  "unfair",
  "unfasten",
  "unfazed",
  "unfeeling",
  "unfiled",
  "unfilled",
  "unfitted",
  "unfitting",
  "unfixable",
  "unfixed",
  "unflawed",
  "unfocused",
  "unfold",
  "unfounded",
  "unframed",
  "unfreeze",
  "unfrosted",
  "unfrozen",
  "unfunded",
  "unglazed",
  "ungloved",
  "unglue",
  "ungodly",
  "ungraded",
  "ungreased",
  "unguarded",
  "unguided",
  "unhappily",
  "unhappy",
  "unharmed",
  "unhealthy",
  "unheard",
  "unhearing",
  "unheated",
  "unhelpful",
  "unhidden",
  "unhinge",
  "unhitched",
  "unholy",
  "unhook",
  "unicorn",
  "unicycle",
  "unified",
  "unifier",
  "uniformed",
  "uniformly",
  "unify",
  "unimpeded",
  "uninjured",
  "uninstall",
  "uninsured",
  "uninvited",
  "union",
  "uniquely",
  "unisexual",
  "unison",
  "unissued",
  "unit",
  "universal",
  "universe",
  "unjustly",
  "unkempt",
  "unkind",
  "unknotted",
  "unknowing",
  "unknown",
  "unlaced",
  "unlatch",
  "unlawful",
  "unleaded",
  "unlearned",
  "unleash",
  "unless",
  "unleveled",
  "unlighted",
  "unlikable",
  "unlimited",
  "unlined",
  "unlinked",
  "unlisted",
  "unlit",
  "unlivable",
  "unloaded",
  "unloader",
  "unlocked",
  "unlocking",
  "unlovable",
  "unloved",
  "unlovely",
  "unloving",
  "unluckily",
  "unlucky",
  "unmade",
  "unmanaged",
  "unmanned",
  "unmapped",
  "unmarked",
  "unmasked",
  "unmasking",
  "unmatched",
  "unmindful",
  "unmixable",
  "unmixed",
  "unmolded",
  "unmoral",
  "unmovable",
  "unmoved",
  "unmoving",
  "unnamable",
  "unnamed",
  "unnatural",
  "unneeded",
  "unnerve",
  "unnerving",
  "unnoticed",
  "unopened",
  "unopposed",
  "unpack",
  "unpadded",
  "unpaid",
  "unpainted",
  "unpaired",
  "unpaved",
  "unpeeled",
  "unpicked",
  "unpiloted",
  "unpinned",
  "unplanned",
  "unplanted",
  "unpleased",
  "unpledged",
  "unplowed",
  "unplug",
  "unpopular",
  "unproven",
  "unquote",
  "unranked",
  "unrated",
  "unraveled",
  "unreached",
  "unread",
  "unreal",
  "unreeling",
  "unrefined",
  "unrelated",
  "unrented",
  "unrest",
  "unretired",
  "unrevised",
  "unrigged",
  "unripe",
  "unrivaled",
  "unroasted",
  "unrobed",
  "unroll",
  "unruffled",
  "unruly",
  "unrushed",
  "unsaddle",
  "unsafe",
  "unsaid",
  "unsalted",
  "unsaved",
  "unsavory",
  "unscathed",
  "unscented",
  "unscrew",
  "unsealed",
  "unseated",
  "unsecured",
  "unseeing",
  "unseemly",
  "unseen",
  "unselect",
  "unselfish",
  "unsent",
  "unsettled",
  "unshackle",
  "unshaken",
  "unshaved",
  "unshaven",
  "unsheathe",
  "unshipped",
  "unsightly",
  "unsigned",
  "unskilled",
  "unsliced",
  "unsmooth",
  "unsnap",
  "unsocial",
  "unsoiled",
  "unsold",
  "unsolved",
  "unsorted",
  "unspoiled",
  "unspoken",
  "unstable",
  "unstaffed",
  "unstamped",
  "unsteady",
  "unsterile",
  "unstirred",
  "unstitch",
  "unstopped",
  "unstuck",
  "unstuffed",
  "unstylish",
  "unsubtle",
  "unsubtly",
  "unsuited",
  "unsure",
  "unsworn",
  "untagged",
  "untainted",
  "untaken",
  "untamed",
  "untangled",
  "untapped",
  "untaxed",
  "unthawed",
  "unthread",
  "untidy",
  "untie",
  "until",
  "untimed",
  "untimely",
  "untitled",
  "untoasted",
  "untold",
  "untouched",
  "untracked",
  "untrained",
  "untreated",
  "untried",
  "untrimmed",
  "untrue",
  "untruth",
  "unturned",
  "untwist",
  "untying",
  "unusable",
  "unused",
  "unusual",
  "unvalued",
  "unvaried",
  "unvarying",
  "unveiled",
  "unveiling",
  "unvented",
  "unviable",
  "unvisited",
  "unvocal",
  "unwanted",
  "unwarlike",
  "unwary",
  "unwashed",
  "unwatched",
  "unweave",
  "unwed",
  "unwelcome",
  "unwell",
  "unwieldy",
  "unwilling",
  "unwind",
  "unwired",
  "unwitting",
  "unwomanly",
  "unworldly",
  "unworn",
  "unworried",
  "unworthy",
  "unwound",
  "unwoven",
  "unwrapped",
  "unwritten",
  "unzip",
  "upbeat",
  "upchuck",
  "upcoming",
  "upcountry",
  "update",
  "upfront",
  "upgrade",
  "upheaval",
  "upheld",
  "uphill",
  "uphold",
  "uplifted",
  "uplifting",
  "upload",
  "upon",
  "upper",
  "upright",
  "uprising",
  "upriver",
  "uproar",
  "uproot",
  "upscale",
  "upside",
  "upstage",
  "upstairs",
  "upstart",
  "upstate",
  "upstream",
  "upstroke",
  "upswing",
  "uptake",
  "uptight",
  "uptown",
  "upturned",
  "upward",
  "upwind",
  "uranium",
  "urban",
  "urchin",
  "urethane",
  "urgency",
  "urgent",
  "urging",
  "urologist",
  "urology",
  "usable",
  "usage",
  "useable",
  "used",
  "uselessly",
  "user",
  "usher",
  "usual",
  "utensil",
  "utility",
  "utilize",
  "utmost",
  "utopia",
  "utter",
  "vacancy",
  "vacant",
  "vacate",
  "vacation",
  "vagabond",
  "vagrancy",
  "vagrantly",
  "vaguely",
  "vagueness",
  "valiant",
  "valid",
  "valium",
  "valley",
  "valuables",
  "value",
  "vanilla",
  "vanish",
  "vanity",
  "vanquish",
  "vantage",
  "vaporizer",
  "variable",
  "variably",
  "varied",
  "variety",
  "various",
  "varmint",
  "varnish",
  "varsity",
  "varying",
  "vascular",
  "vaseline",
  "vastly",
  "vastness",
  "veal",
  "vegan",
  "veggie",
  "vehicular",
  "velcro",
  "velocity",
  "velvet",
  "vendetta",
  "vending",
  "vendor",
  "veneering",
  "vengeful",
  "venomous",
  "ventricle",
  "venture",
  "venue",
  "venus",
  "verbalize",
  "verbally",
  "verbose",
  "verdict",
  "verify",
  "verse",
  "version",
  "versus",
  "vertebrae",
  "vertical",
  "vertigo",
  "very",
  "vessel",
  "vest",
  "veteran",
  "veto",
  "vexingly",
  "viability",
  "viable",
  "vibes",
  "vice",
  "vicinity",
  "victory",
  "video",
  "viewable",
  "viewer",
  "viewing",
  "viewless",
  "viewpoint",
  "vigorous",
  "village",
  "villain",
  "vindicate",
  "vineyard",
  "vintage",
  "violate",
  "violation",
  "violator",
  "violet",
  "violin",
  "viper",
  "viral",
  "virtual",
  "virtuous",
  "virus",
  "visa",
  "viscosity",
  "viscous",
  "viselike",
  "visible",
  "visibly",
  "vision",
  "visiting",
  "visitor",
  "visor",
  "vista",
  "vitality",
  "vitalize",
  "vitally",
  "vitamins",
  "vivacious",
  "vividly",
  "vividness",
  "vixen",
  "vocalist",
  "vocalize",
  "vocally",
  "vocation",
  "voice",
  "voicing",
  "void",
  "volatile",
  "volley",
  "voltage",
  "volumes",
  "voter",
  "voting",
  "voucher",
  "vowed",
  "vowel",
  "voyage",
  "wackiness",
  "wad",
  "wafer",
  "waffle",
  "waged",
  "wager",
  "wages",
  "waggle",
  "wagon",
  "wake",
  "waking",
  "walk",
  "walmart",
  "walnut",
  "walrus",
  "waltz",
  "wand",
  "wannabe",
  "wanted",
  "wanting",
  "wasabi",
  "washable",
  "washbasin",
  "washboard",
  "washbowl",
  "washcloth",
  "washday",
  "washed",
  "washer",
  "washhouse",
  "washing",
  "washout",
  "washroom",
  "washstand",
  "washtub",
  "wasp",
  "wasting",
  "watch",
  "water",
  "waviness",
  "waving",
  "wavy",
  "whacking",
  "whacky",
  "wham",
  "wharf",
  "wheat",
  "whenever",
  "whiff",
  "whimsical",
  "whinny",
  "whiny",
  "whisking",
  "whoever",
  "whole",
  "whomever",
  "whoopee",
  "whooping",
  "whoops",
  "why",
  "wick",
  "widely",
  "widen",
  "widget",
  "widow",
  "width",
  "wieldable",
  "wielder",
  "wife",
  "wifi",
  "wikipedia",
  "wildcard",
  "wildcat",
  "wilder",
  "wildfire",
  "wildfowl",
  "wildland",
  "wildlife",
  "wildly",
  "wildness",
  "willed",
  "willfully",
  "willing",
  "willow",
  "willpower",
  "wilt",
  "wimp",
  "wince",
  "wincing",
  "wind",
  "wing",
  "winking",
  "winner",
  "winnings",
  "winter",
  "wipe",
  "wired",
  "wireless",
  "wiring",
  "wiry",
  "wisdom",
  "wise",
  "wish",
  "wisplike",
  "wispy",
  "wistful",
  "wizard",
  "wobble",
  "wobbling",
  "wobbly",
  "wok",
  "wolf",
  "wolverine",
  "womanhood",
  "womankind",
  "womanless",
  "womanlike",
  "womanly",
  "womb",
  "woof",
  "wooing",
  "wool",
  "woozy",
  "word",
  "work",
  "worried",
  "worrier",
  "worrisome",
  "worry",
  "worsening",
  "worshiper",
  "worst",
  "wound",
  "woven",
  "wow",
  "wrangle",
  "wrath",
  "wreath",
  "wreckage",
  "wrecker",
  "wrecking",
  "wrench",
  "wriggle",
  "wriggly",
  "wrinkle",
  "wrinkly",
  "wrist",
  "writing",
  "written",
  "wrongdoer",
  "wronged",
  "wrongful",
  "wrongly",
  "wrongness",
  "wrought",
  "xbox",
  "xerox",
  "yahoo",
  "yam",
  "yanking",
  "yapping",
  "yard",
  "yarn",
  "yeah",
  "yearbook",
  "yearling",
  "yearly",
  "yearning",
  "yeast",
  "yelling",
  "yelp",
  "yen",
  "yesterday",
  "yiddish",
  "yield",
  "yin",
  "yippee",
  "yo-yo",
  "yodel",
  "yoga",
  "yogurt",
  "yonder",
  "yoyo",
  "yummy",
  "zap",
  "zealous",
  "zebra",
  "zen",
  "zeppelin",
  "zero",
  "zestfully",
  "zesty",
  "zigzagged",
  "zipfile",
  "zipping",
  "zippy",
  "zips",
  "zit",
  "zodiac",
  "zombie",
  "zone",
  "zoning",
  "zookeeper",
  "zoologist",
  "zoology",
  "zoom"
];
Object.defineProperty(Ln, "__esModule", { value: !0 });
Ln.newSecureWords = void 0;
const Xs = St, Ka = Fn;
async function Js(t = 6) {
  let e = [];
  for (let r = 0; r < t; r++)
    e.push(Ka.wordlist[await (0, Xs.getSecureRandomNumber)(0, Ka.wordlist.length)]);
  return e;
}
Ln.newSecureWords = Js;
var on = {}, Ha;
function Zs() {
  if (Ha) return on;
  Ha = 1, Object.defineProperty(on, "__esModule", { value: !0 }), on.newSecurePassphrase = void 0;
  const t = Pa();
  async function e(r = 6) {
    return (await (0, t.newSecureWords)(r)).join("-");
  }
  return on.newSecurePassphrase = e, on;
}
var Ge = {};
function Qs(t) {
  throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ai = { exports: {} };
const el = {}, tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: el
}, Symbol.toStringTag, { value: "Module" })), rl = /* @__PURE__ */ Ro(tl);
(function(t) {
  (function(e) {
    var r = function(a) {
      var l, s = new Float64Array(16);
      if (a) for (l = 0; l < a.length; l++) s[l] = a[l];
      return s;
    }, i = function() {
      throw new Error("no PRNG");
    }, u = new Uint8Array(16), f = new Uint8Array(32);
    f[0] = 9;
    var o = r(), h = r([1]), m = r([56129, 1]), k = r([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), P = r([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), E = r([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), $ = r([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), L = r([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function ee(a, l, s, n) {
      a[l] = s >> 24 & 255, a[l + 1] = s >> 16 & 255, a[l + 2] = s >> 8 & 255, a[l + 3] = s & 255, a[l + 4] = n >> 24 & 255, a[l + 5] = n >> 16 & 255, a[l + 6] = n >> 8 & 255, a[l + 7] = n & 255;
    }
    function ae(a, l, s, n, c) {
      var w, B = 0;
      for (w = 0; w < c; w++) B |= a[l + w] ^ s[n + w];
      return (1 & B - 1 >>> 8) - 1;
    }
    function fe(a, l, s, n) {
      return ae(a, l, s, n, 16);
    }
    function X(a, l, s, n) {
      return ae(a, l, s, n, 32);
    }
    function Y(a, l, s, n) {
      for (var c = n[0] & 255 | (n[1] & 255) << 8 | (n[2] & 255) << 16 | (n[3] & 255) << 24, w = s[0] & 255 | (s[1] & 255) << 8 | (s[2] & 255) << 16 | (s[3] & 255) << 24, B = s[4] & 255 | (s[5] & 255) << 8 | (s[6] & 255) << 16 | (s[7] & 255) << 24, I = s[8] & 255 | (s[9] & 255) << 8 | (s[10] & 255) << 16 | (s[11] & 255) << 24, K = s[12] & 255 | (s[13] & 255) << 8 | (s[14] & 255) << 16 | (s[15] & 255) << 24, de = n[4] & 255 | (n[5] & 255) << 8 | (n[6] & 255) << 16 | (n[7] & 255) << 24, te = l[0] & 255 | (l[1] & 255) << 8 | (l[2] & 255) << 16 | (l[3] & 255) << 24, ze = l[4] & 255 | (l[5] & 255) << 8 | (l[6] & 255) << 16 | (l[7] & 255) << 24, ne = l[8] & 255 | (l[9] & 255) << 8 | (l[10] & 255) << 16 | (l[11] & 255) << 24, pe = l[12] & 255 | (l[13] & 255) << 8 | (l[14] & 255) << 16 | (l[15] & 255) << 24, ye = n[8] & 255 | (n[9] & 255) << 8 | (n[10] & 255) << 16 | (n[11] & 255) << 24, _e = s[16] & 255 | (s[17] & 255) << 8 | (s[18] & 255) << 16 | (s[19] & 255) << 24, xe = s[20] & 255 | (s[21] & 255) << 8 | (s[22] & 255) << 16 | (s[23] & 255) << 24, be = s[24] & 255 | (s[25] & 255) << 8 | (s[26] & 255) << 16 | (s[27] & 255) << 24, we = s[28] & 255 | (s[29] & 255) << 8 | (s[30] & 255) << 16 | (s[31] & 255) << 24, ve = n[12] & 255 | (n[13] & 255) << 8 | (n[14] & 255) << 16 | (n[15] & 255) << 24, oe = c, he = w, re = B, se = I, ce = K, Q = de, A = te, C = ze, N = ne, j = pe, R = ye, D = _e, ge = xe, ke = be, Se = we, Be = ve, p, Ee = 0; Ee < 20; Ee += 2)
        p = oe + ge | 0, ce ^= p << 7 | p >>> 25, p = ce + oe | 0, N ^= p << 9 | p >>> 23, p = N + ce | 0, ge ^= p << 13 | p >>> 19, p = ge + N | 0, oe ^= p << 18 | p >>> 14, p = Q + he | 0, j ^= p << 7 | p >>> 25, p = j + Q | 0, ke ^= p << 9 | p >>> 23, p = ke + j | 0, he ^= p << 13 | p >>> 19, p = he + ke | 0, Q ^= p << 18 | p >>> 14, p = R + A | 0, Se ^= p << 7 | p >>> 25, p = Se + R | 0, re ^= p << 9 | p >>> 23, p = re + Se | 0, A ^= p << 13 | p >>> 19, p = A + re | 0, R ^= p << 18 | p >>> 14, p = Be + D | 0, se ^= p << 7 | p >>> 25, p = se + Be | 0, C ^= p << 9 | p >>> 23, p = C + se | 0, D ^= p << 13 | p >>> 19, p = D + C | 0, Be ^= p << 18 | p >>> 14, p = oe + se | 0, he ^= p << 7 | p >>> 25, p = he + oe | 0, re ^= p << 9 | p >>> 23, p = re + he | 0, se ^= p << 13 | p >>> 19, p = se + re | 0, oe ^= p << 18 | p >>> 14, p = Q + ce | 0, A ^= p << 7 | p >>> 25, p = A + Q | 0, C ^= p << 9 | p >>> 23, p = C + A | 0, ce ^= p << 13 | p >>> 19, p = ce + C | 0, Q ^= p << 18 | p >>> 14, p = R + j | 0, D ^= p << 7 | p >>> 25, p = D + R | 0, N ^= p << 9 | p >>> 23, p = N + D | 0, j ^= p << 13 | p >>> 19, p = j + N | 0, R ^= p << 18 | p >>> 14, p = Be + Se | 0, ge ^= p << 7 | p >>> 25, p = ge + Be | 0, ke ^= p << 9 | p >>> 23, p = ke + ge | 0, Se ^= p << 13 | p >>> 19, p = Se + ke | 0, Be ^= p << 18 | p >>> 14;
      oe = oe + c | 0, he = he + w | 0, re = re + B | 0, se = se + I | 0, ce = ce + K | 0, Q = Q + de | 0, A = A + te | 0, C = C + ze | 0, N = N + ne | 0, j = j + pe | 0, R = R + ye | 0, D = D + _e | 0, ge = ge + xe | 0, ke = ke + be | 0, Se = Se + we | 0, Be = Be + ve | 0, a[0] = oe >>> 0 & 255, a[1] = oe >>> 8 & 255, a[2] = oe >>> 16 & 255, a[3] = oe >>> 24 & 255, a[4] = he >>> 0 & 255, a[5] = he >>> 8 & 255, a[6] = he >>> 16 & 255, a[7] = he >>> 24 & 255, a[8] = re >>> 0 & 255, a[9] = re >>> 8 & 255, a[10] = re >>> 16 & 255, a[11] = re >>> 24 & 255, a[12] = se >>> 0 & 255, a[13] = se >>> 8 & 255, a[14] = se >>> 16 & 255, a[15] = se >>> 24 & 255, a[16] = ce >>> 0 & 255, a[17] = ce >>> 8 & 255, a[18] = ce >>> 16 & 255, a[19] = ce >>> 24 & 255, a[20] = Q >>> 0 & 255, a[21] = Q >>> 8 & 255, a[22] = Q >>> 16 & 255, a[23] = Q >>> 24 & 255, a[24] = A >>> 0 & 255, a[25] = A >>> 8 & 255, a[26] = A >>> 16 & 255, a[27] = A >>> 24 & 255, a[28] = C >>> 0 & 255, a[29] = C >>> 8 & 255, a[30] = C >>> 16 & 255, a[31] = C >>> 24 & 255, a[32] = N >>> 0 & 255, a[33] = N >>> 8 & 255, a[34] = N >>> 16 & 255, a[35] = N >>> 24 & 255, a[36] = j >>> 0 & 255, a[37] = j >>> 8 & 255, a[38] = j >>> 16 & 255, a[39] = j >>> 24 & 255, a[40] = R >>> 0 & 255, a[41] = R >>> 8 & 255, a[42] = R >>> 16 & 255, a[43] = R >>> 24 & 255, a[44] = D >>> 0 & 255, a[45] = D >>> 8 & 255, a[46] = D >>> 16 & 255, a[47] = D >>> 24 & 255, a[48] = ge >>> 0 & 255, a[49] = ge >>> 8 & 255, a[50] = ge >>> 16 & 255, a[51] = ge >>> 24 & 255, a[52] = ke >>> 0 & 255, a[53] = ke >>> 8 & 255, a[54] = ke >>> 16 & 255, a[55] = ke >>> 24 & 255, a[56] = Se >>> 0 & 255, a[57] = Se >>> 8 & 255, a[58] = Se >>> 16 & 255, a[59] = Se >>> 24 & 255, a[60] = Be >>> 0 & 255, a[61] = Be >>> 8 & 255, a[62] = Be >>> 16 & 255, a[63] = Be >>> 24 & 255;
    }
    function O(a, l, s, n) {
      for (var c = n[0] & 255 | (n[1] & 255) << 8 | (n[2] & 255) << 16 | (n[3] & 255) << 24, w = s[0] & 255 | (s[1] & 255) << 8 | (s[2] & 255) << 16 | (s[3] & 255) << 24, B = s[4] & 255 | (s[5] & 255) << 8 | (s[6] & 255) << 16 | (s[7] & 255) << 24, I = s[8] & 255 | (s[9] & 255) << 8 | (s[10] & 255) << 16 | (s[11] & 255) << 24, K = s[12] & 255 | (s[13] & 255) << 8 | (s[14] & 255) << 16 | (s[15] & 255) << 24, de = n[4] & 255 | (n[5] & 255) << 8 | (n[6] & 255) << 16 | (n[7] & 255) << 24, te = l[0] & 255 | (l[1] & 255) << 8 | (l[2] & 255) << 16 | (l[3] & 255) << 24, ze = l[4] & 255 | (l[5] & 255) << 8 | (l[6] & 255) << 16 | (l[7] & 255) << 24, ne = l[8] & 255 | (l[9] & 255) << 8 | (l[10] & 255) << 16 | (l[11] & 255) << 24, pe = l[12] & 255 | (l[13] & 255) << 8 | (l[14] & 255) << 16 | (l[15] & 255) << 24, ye = n[8] & 255 | (n[9] & 255) << 8 | (n[10] & 255) << 16 | (n[11] & 255) << 24, _e = s[16] & 255 | (s[17] & 255) << 8 | (s[18] & 255) << 16 | (s[19] & 255) << 24, xe = s[20] & 255 | (s[21] & 255) << 8 | (s[22] & 255) << 16 | (s[23] & 255) << 24, be = s[24] & 255 | (s[25] & 255) << 8 | (s[26] & 255) << 16 | (s[27] & 255) << 24, we = s[28] & 255 | (s[29] & 255) << 8 | (s[30] & 255) << 16 | (s[31] & 255) << 24, ve = n[12] & 255 | (n[13] & 255) << 8 | (n[14] & 255) << 16 | (n[15] & 255) << 24, oe = c, he = w, re = B, se = I, ce = K, Q = de, A = te, C = ze, N = ne, j = pe, R = ye, D = _e, ge = xe, ke = be, Se = we, Be = ve, p, Ee = 0; Ee < 20; Ee += 2)
        p = oe + ge | 0, ce ^= p << 7 | p >>> 25, p = ce + oe | 0, N ^= p << 9 | p >>> 23, p = N + ce | 0, ge ^= p << 13 | p >>> 19, p = ge + N | 0, oe ^= p << 18 | p >>> 14, p = Q + he | 0, j ^= p << 7 | p >>> 25, p = j + Q | 0, ke ^= p << 9 | p >>> 23, p = ke + j | 0, he ^= p << 13 | p >>> 19, p = he + ke | 0, Q ^= p << 18 | p >>> 14, p = R + A | 0, Se ^= p << 7 | p >>> 25, p = Se + R | 0, re ^= p << 9 | p >>> 23, p = re + Se | 0, A ^= p << 13 | p >>> 19, p = A + re | 0, R ^= p << 18 | p >>> 14, p = Be + D | 0, se ^= p << 7 | p >>> 25, p = se + Be | 0, C ^= p << 9 | p >>> 23, p = C + se | 0, D ^= p << 13 | p >>> 19, p = D + C | 0, Be ^= p << 18 | p >>> 14, p = oe + se | 0, he ^= p << 7 | p >>> 25, p = he + oe | 0, re ^= p << 9 | p >>> 23, p = re + he | 0, se ^= p << 13 | p >>> 19, p = se + re | 0, oe ^= p << 18 | p >>> 14, p = Q + ce | 0, A ^= p << 7 | p >>> 25, p = A + Q | 0, C ^= p << 9 | p >>> 23, p = C + A | 0, ce ^= p << 13 | p >>> 19, p = ce + C | 0, Q ^= p << 18 | p >>> 14, p = R + j | 0, D ^= p << 7 | p >>> 25, p = D + R | 0, N ^= p << 9 | p >>> 23, p = N + D | 0, j ^= p << 13 | p >>> 19, p = j + N | 0, R ^= p << 18 | p >>> 14, p = Be + Se | 0, ge ^= p << 7 | p >>> 25, p = ge + Be | 0, ke ^= p << 9 | p >>> 23, p = ke + ge | 0, Se ^= p << 13 | p >>> 19, p = Se + ke | 0, Be ^= p << 18 | p >>> 14;
      a[0] = oe >>> 0 & 255, a[1] = oe >>> 8 & 255, a[2] = oe >>> 16 & 255, a[3] = oe >>> 24 & 255, a[4] = Q >>> 0 & 255, a[5] = Q >>> 8 & 255, a[6] = Q >>> 16 & 255, a[7] = Q >>> 24 & 255, a[8] = R >>> 0 & 255, a[9] = R >>> 8 & 255, a[10] = R >>> 16 & 255, a[11] = R >>> 24 & 255, a[12] = Be >>> 0 & 255, a[13] = Be >>> 8 & 255, a[14] = Be >>> 16 & 255, a[15] = Be >>> 24 & 255, a[16] = A >>> 0 & 255, a[17] = A >>> 8 & 255, a[18] = A >>> 16 & 255, a[19] = A >>> 24 & 255, a[20] = C >>> 0 & 255, a[21] = C >>> 8 & 255, a[22] = C >>> 16 & 255, a[23] = C >>> 24 & 255, a[24] = N >>> 0 & 255, a[25] = N >>> 8 & 255, a[26] = N >>> 16 & 255, a[27] = N >>> 24 & 255, a[28] = j >>> 0 & 255, a[29] = j >>> 8 & 255, a[30] = j >>> 16 & 255, a[31] = j >>> 24 & 255;
    }
    function T(a, l, s, n) {
      Y(a, l, s, n);
    }
    function W(a, l, s, n) {
      O(a, l, s, n);
    }
    var H = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function ie(a, l, s, n, c, w, B) {
      var I = new Uint8Array(16), K = new Uint8Array(64), de, te;
      for (te = 0; te < 16; te++) I[te] = 0;
      for (te = 0; te < 8; te++) I[te] = w[te];
      for (; c >= 64; ) {
        for (T(K, I, B, H), te = 0; te < 64; te++) a[l + te] = s[n + te] ^ K[te];
        for (de = 1, te = 8; te < 16; te++)
          de = de + (I[te] & 255) | 0, I[te] = de & 255, de >>>= 8;
        c -= 64, l += 64, n += 64;
      }
      if (c > 0)
        for (T(K, I, B, H), te = 0; te < c; te++) a[l + te] = s[n + te] ^ K[te];
      return 0;
    }
    function Me(a, l, s, n, c) {
      var w = new Uint8Array(16), B = new Uint8Array(64), I, K;
      for (K = 0; K < 16; K++) w[K] = 0;
      for (K = 0; K < 8; K++) w[K] = n[K];
      for (; s >= 64; ) {
        for (T(B, w, c, H), K = 0; K < 64; K++) a[l + K] = B[K];
        for (I = 1, K = 8; K < 16; K++)
          I = I + (w[K] & 255) | 0, w[K] = I & 255, I >>>= 8;
        s -= 64, l += 64;
      }
      if (s > 0)
        for (T(B, w, c, H), K = 0; K < s; K++) a[l + K] = B[K];
      return 0;
    }
    function Pe(a, l, s, n, c) {
      var w = new Uint8Array(32);
      W(w, n, c, H);
      for (var B = new Uint8Array(8), I = 0; I < 8; I++) B[I] = n[I + 16];
      return Me(a, l, s, B, w);
    }
    function Fe(a, l, s, n, c, w, B) {
      var I = new Uint8Array(32);
      W(I, w, B, H);
      for (var K = new Uint8Array(8), de = 0; de < 8; de++) K[de] = w[de + 16];
      return ie(a, l, s, n, c, K, I);
    }
    var Ye = function(a) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var l, s, n, c, w, B, I, K;
      l = a[0] & 255 | (a[1] & 255) << 8, this.r[0] = l & 8191, s = a[2] & 255 | (a[3] & 255) << 8, this.r[1] = (l >>> 13 | s << 3) & 8191, n = a[4] & 255 | (a[5] & 255) << 8, this.r[2] = (s >>> 10 | n << 6) & 7939, c = a[6] & 255 | (a[7] & 255) << 8, this.r[3] = (n >>> 7 | c << 9) & 8191, w = a[8] & 255 | (a[9] & 255) << 8, this.r[4] = (c >>> 4 | w << 12) & 255, this.r[5] = w >>> 1 & 8190, B = a[10] & 255 | (a[11] & 255) << 8, this.r[6] = (w >>> 14 | B << 2) & 8191, I = a[12] & 255 | (a[13] & 255) << 8, this.r[7] = (B >>> 11 | I << 5) & 8065, K = a[14] & 255 | (a[15] & 255) << 8, this.r[8] = (I >>> 8 | K << 8) & 8191, this.r[9] = K >>> 5 & 127, this.pad[0] = a[16] & 255 | (a[17] & 255) << 8, this.pad[1] = a[18] & 255 | (a[19] & 255) << 8, this.pad[2] = a[20] & 255 | (a[21] & 255) << 8, this.pad[3] = a[22] & 255 | (a[23] & 255) << 8, this.pad[4] = a[24] & 255 | (a[25] & 255) << 8, this.pad[5] = a[26] & 255 | (a[27] & 255) << 8, this.pad[6] = a[28] & 255 | (a[29] & 255) << 8, this.pad[7] = a[30] & 255 | (a[31] & 255) << 8;
    };
    Ye.prototype.blocks = function(a, l, s) {
      for (var n = this.fin ? 0 : 2048, c, w, B, I, K, de, te, ze, ne, pe, ye, _e, xe, be, we, ve, oe, he, re, se = this.h[0], ce = this.h[1], Q = this.h[2], A = this.h[3], C = this.h[4], N = this.h[5], j = this.h[6], R = this.h[7], D = this.h[8], ge = this.h[9], ke = this.r[0], Se = this.r[1], Be = this.r[2], p = this.r[3], Ee = this.r[4], Ne = this.r[5], qe = this.r[6], Ce = this.r[7], Ie = this.r[8], Re = this.r[9]; s >= 16; )
        c = a[l + 0] & 255 | (a[l + 1] & 255) << 8, se += c & 8191, w = a[l + 2] & 255 | (a[l + 3] & 255) << 8, ce += (c >>> 13 | w << 3) & 8191, B = a[l + 4] & 255 | (a[l + 5] & 255) << 8, Q += (w >>> 10 | B << 6) & 8191, I = a[l + 6] & 255 | (a[l + 7] & 255) << 8, A += (B >>> 7 | I << 9) & 8191, K = a[l + 8] & 255 | (a[l + 9] & 255) << 8, C += (I >>> 4 | K << 12) & 8191, N += K >>> 1 & 8191, de = a[l + 10] & 255 | (a[l + 11] & 255) << 8, j += (K >>> 14 | de << 2) & 8191, te = a[l + 12] & 255 | (a[l + 13] & 255) << 8, R += (de >>> 11 | te << 5) & 8191, ze = a[l + 14] & 255 | (a[l + 15] & 255) << 8, D += (te >>> 8 | ze << 8) & 8191, ge += ze >>> 5 | n, ne = 0, pe = ne, pe += se * ke, pe += ce * (5 * Re), pe += Q * (5 * Ie), pe += A * (5 * Ce), pe += C * (5 * qe), ne = pe >>> 13, pe &= 8191, pe += N * (5 * Ne), pe += j * (5 * Ee), pe += R * (5 * p), pe += D * (5 * Be), pe += ge * (5 * Se), ne += pe >>> 13, pe &= 8191, ye = ne, ye += se * Se, ye += ce * ke, ye += Q * (5 * Re), ye += A * (5 * Ie), ye += C * (5 * Ce), ne = ye >>> 13, ye &= 8191, ye += N * (5 * qe), ye += j * (5 * Ne), ye += R * (5 * Ee), ye += D * (5 * p), ye += ge * (5 * Be), ne += ye >>> 13, ye &= 8191, _e = ne, _e += se * Be, _e += ce * Se, _e += Q * ke, _e += A * (5 * Re), _e += C * (5 * Ie), ne = _e >>> 13, _e &= 8191, _e += N * (5 * Ce), _e += j * (5 * qe), _e += R * (5 * Ne), _e += D * (5 * Ee), _e += ge * (5 * p), ne += _e >>> 13, _e &= 8191, xe = ne, xe += se * p, xe += ce * Be, xe += Q * Se, xe += A * ke, xe += C * (5 * Re), ne = xe >>> 13, xe &= 8191, xe += N * (5 * Ie), xe += j * (5 * Ce), xe += R * (5 * qe), xe += D * (5 * Ne), xe += ge * (5 * Ee), ne += xe >>> 13, xe &= 8191, be = ne, be += se * Ee, be += ce * p, be += Q * Be, be += A * Se, be += C * ke, ne = be >>> 13, be &= 8191, be += N * (5 * Re), be += j * (5 * Ie), be += R * (5 * Ce), be += D * (5 * qe), be += ge * (5 * Ne), ne += be >>> 13, be &= 8191, we = ne, we += se * Ne, we += ce * Ee, we += Q * p, we += A * Be, we += C * Se, ne = we >>> 13, we &= 8191, we += N * ke, we += j * (5 * Re), we += R * (5 * Ie), we += D * (5 * Ce), we += ge * (5 * qe), ne += we >>> 13, we &= 8191, ve = ne, ve += se * qe, ve += ce * Ne, ve += Q * Ee, ve += A * p, ve += C * Be, ne = ve >>> 13, ve &= 8191, ve += N * Se, ve += j * ke, ve += R * (5 * Re), ve += D * (5 * Ie), ve += ge * (5 * Ce), ne += ve >>> 13, ve &= 8191, oe = ne, oe += se * Ce, oe += ce * qe, oe += Q * Ne, oe += A * Ee, oe += C * p, ne = oe >>> 13, oe &= 8191, oe += N * Be, oe += j * Se, oe += R * ke, oe += D * (5 * Re), oe += ge * (5 * Ie), ne += oe >>> 13, oe &= 8191, he = ne, he += se * Ie, he += ce * Ce, he += Q * qe, he += A * Ne, he += C * Ee, ne = he >>> 13, he &= 8191, he += N * p, he += j * Be, he += R * Se, he += D * ke, he += ge * (5 * Re), ne += he >>> 13, he &= 8191, re = ne, re += se * Re, re += ce * Ie, re += Q * Ce, re += A * qe, re += C * Ne, ne = re >>> 13, re &= 8191, re += N * Ee, re += j * p, re += R * Be, re += D * Se, re += ge * ke, ne += re >>> 13, re &= 8191, ne = (ne << 2) + ne | 0, ne = ne + pe | 0, pe = ne & 8191, ne = ne >>> 13, ye += ne, se = pe, ce = ye, Q = _e, A = xe, C = be, N = we, j = ve, R = oe, D = he, ge = re, l += 16, s -= 16;
      this.h[0] = se, this.h[1] = ce, this.h[2] = Q, this.h[3] = A, this.h[4] = C, this.h[5] = N, this.h[6] = j, this.h[7] = R, this.h[8] = D, this.h[9] = ge;
    }, Ye.prototype.finish = function(a, l) {
      var s = new Uint16Array(10), n, c, w, B;
      if (this.leftover) {
        for (B = this.leftover, this.buffer[B++] = 1; B < 16; B++) this.buffer[B] = 0;
        this.fin = 1, this.blocks(this.buffer, 0, 16);
      }
      for (n = this.h[1] >>> 13, this.h[1] &= 8191, B = 2; B < 10; B++)
        this.h[B] += n, n = this.h[B] >>> 13, this.h[B] &= 8191;
      for (this.h[0] += n * 5, n = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += n, n = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += n, s[0] = this.h[0] + 5, n = s[0] >>> 13, s[0] &= 8191, B = 1; B < 10; B++)
        s[B] = this.h[B] + n, n = s[B] >>> 13, s[B] &= 8191;
      for (s[9] -= 8192, c = (n ^ 1) - 1, B = 0; B < 10; B++) s[B] &= c;
      for (c = ~c, B = 0; B < 10; B++) this.h[B] = this.h[B] & c | s[B];
      for (this.h[0] = (this.h[0] | this.h[1] << 13) & 65535, this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535, this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535, this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535, this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535, this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535, this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535, this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535, w = this.h[0] + this.pad[0], this.h[0] = w & 65535, B = 1; B < 8; B++)
        w = (this.h[B] + this.pad[B] | 0) + (w >>> 16) | 0, this.h[B] = w & 65535;
      a[l + 0] = this.h[0] >>> 0 & 255, a[l + 1] = this.h[0] >>> 8 & 255, a[l + 2] = this.h[1] >>> 0 & 255, a[l + 3] = this.h[1] >>> 8 & 255, a[l + 4] = this.h[2] >>> 0 & 255, a[l + 5] = this.h[2] >>> 8 & 255, a[l + 6] = this.h[3] >>> 0 & 255, a[l + 7] = this.h[3] >>> 8 & 255, a[l + 8] = this.h[4] >>> 0 & 255, a[l + 9] = this.h[4] >>> 8 & 255, a[l + 10] = this.h[5] >>> 0 & 255, a[l + 11] = this.h[5] >>> 8 & 255, a[l + 12] = this.h[6] >>> 0 & 255, a[l + 13] = this.h[6] >>> 8 & 255, a[l + 14] = this.h[7] >>> 0 & 255, a[l + 15] = this.h[7] >>> 8 & 255;
    }, Ye.prototype.update = function(a, l, s) {
      var n, c;
      if (this.leftover) {
        for (c = 16 - this.leftover, c > s && (c = s), n = 0; n < c; n++)
          this.buffer[this.leftover + n] = a[l + n];
        if (s -= c, l += c, this.leftover += c, this.leftover < 16)
          return;
        this.blocks(this.buffer, 0, 16), this.leftover = 0;
      }
      if (s >= 16 && (c = s - s % 16, this.blocks(a, l, c), l += c, s -= c), s) {
        for (n = 0; n < s; n++)
          this.buffer[this.leftover + n] = a[l + n];
        this.leftover += s;
      }
    };
    function He(a, l, s, n, c, w) {
      var B = new Ye(w);
      return B.update(s, n, c), B.finish(a, l), 0;
    }
    function U(a, l, s, n, c, w) {
      var B = new Uint8Array(16);
      return He(B, 0, s, n, c, w), fe(a, l, B, 0);
    }
    function S(a, l, s, n, c) {
      var w;
      if (s < 32) return -1;
      for (Fe(a, 0, l, 0, s, n, c), He(a, 16, a, 32, s - 32, a), w = 0; w < 16; w++) a[w] = 0;
      return 0;
    }
    function Z(a, l, s, n, c) {
      var w, B = new Uint8Array(32);
      if (s < 32 || (Pe(B, 0, 32, n, c), U(l, 16, l, 32, s - 32, B) !== 0)) return -1;
      for (Fe(a, 0, l, 0, s, n, c), w = 0; w < 32; w++) a[w] = 0;
      return 0;
    }
    function le(a, l) {
      var s;
      for (s = 0; s < 16; s++) a[s] = l[s] | 0;
    }
    function Ae(a) {
      var l, s, n = 1;
      for (l = 0; l < 16; l++)
        s = a[l] + n + 65535, n = Math.floor(s / 65536), a[l] = s - n * 65536;
      a[0] += n - 1 + 37 * (n - 1);
    }
    function Oe(a, l, s) {
      for (var n, c = ~(s - 1), w = 0; w < 16; w++)
        n = c & (a[w] ^ l[w]), a[w] ^= n, l[w] ^= n;
    }
    function x(a, l) {
      var s, n, c, w = r(), B = r();
      for (s = 0; s < 16; s++) B[s] = l[s];
      for (Ae(B), Ae(B), Ae(B), n = 0; n < 2; n++) {
        for (w[0] = B[0] - 65517, s = 1; s < 15; s++)
          w[s] = B[s] - 65535 - (w[s - 1] >> 16 & 1), w[s - 1] &= 65535;
        w[15] = B[15] - 32767 - (w[14] >> 16 & 1), c = w[15] >> 16 & 1, w[14] &= 65535, Oe(B, w, 1 - c);
      }
      for (s = 0; s < 16; s++)
        a[2 * s] = B[s] & 255, a[2 * s + 1] = B[s] >> 8;
    }
    function vt(a, l) {
      var s = new Uint8Array(32), n = new Uint8Array(32);
      return x(s, a), x(n, l), X(s, 0, n, 0);
    }
    function rt(a) {
      var l = new Uint8Array(32);
      return x(l, a), l[0] & 1;
    }
    function Ot(a, l) {
      var s;
      for (s = 0; s < 16; s++) a[s] = l[2 * s] + (l[2 * s + 1] << 8);
      a[15] &= 32767;
    }
    function ht(a, l, s) {
      for (var n = 0; n < 16; n++) a[n] = l[n] + s[n];
    }
    function gt(a, l, s) {
      for (var n = 0; n < 16; n++) a[n] = l[n] - s[n];
    }
    function Ue(a, l, s) {
      var n, c, w = 0, B = 0, I = 0, K = 0, de = 0, te = 0, ze = 0, ne = 0, pe = 0, ye = 0, _e = 0, xe = 0, be = 0, we = 0, ve = 0, oe = 0, he = 0, re = 0, se = 0, ce = 0, Q = 0, A = 0, C = 0, N = 0, j = 0, R = 0, D = 0, ge = 0, ke = 0, Se = 0, Be = 0, p = s[0], Ee = s[1], Ne = s[2], qe = s[3], Ce = s[4], Ie = s[5], Re = s[6], et = s[7], $e = s[8], Xe = s[9], Je = s[10], Ze = s[11], at = s[12], st = s[13], lt = s[14], ut = s[15];
      n = l[0], w += n * p, B += n * Ee, I += n * Ne, K += n * qe, de += n * Ce, te += n * Ie, ze += n * Re, ne += n * et, pe += n * $e, ye += n * Xe, _e += n * Je, xe += n * Ze, be += n * at, we += n * st, ve += n * lt, oe += n * ut, n = l[1], B += n * p, I += n * Ee, K += n * Ne, de += n * qe, te += n * Ce, ze += n * Ie, ne += n * Re, pe += n * et, ye += n * $e, _e += n * Xe, xe += n * Je, be += n * Ze, we += n * at, ve += n * st, oe += n * lt, he += n * ut, n = l[2], I += n * p, K += n * Ee, de += n * Ne, te += n * qe, ze += n * Ce, ne += n * Ie, pe += n * Re, ye += n * et, _e += n * $e, xe += n * Xe, be += n * Je, we += n * Ze, ve += n * at, oe += n * st, he += n * lt, re += n * ut, n = l[3], K += n * p, de += n * Ee, te += n * Ne, ze += n * qe, ne += n * Ce, pe += n * Ie, ye += n * Re, _e += n * et, xe += n * $e, be += n * Xe, we += n * Je, ve += n * Ze, oe += n * at, he += n * st, re += n * lt, se += n * ut, n = l[4], de += n * p, te += n * Ee, ze += n * Ne, ne += n * qe, pe += n * Ce, ye += n * Ie, _e += n * Re, xe += n * et, be += n * $e, we += n * Xe, ve += n * Je, oe += n * Ze, he += n * at, re += n * st, se += n * lt, ce += n * ut, n = l[5], te += n * p, ze += n * Ee, ne += n * Ne, pe += n * qe, ye += n * Ce, _e += n * Ie, xe += n * Re, be += n * et, we += n * $e, ve += n * Xe, oe += n * Je, he += n * Ze, re += n * at, se += n * st, ce += n * lt, Q += n * ut, n = l[6], ze += n * p, ne += n * Ee, pe += n * Ne, ye += n * qe, _e += n * Ce, xe += n * Ie, be += n * Re, we += n * et, ve += n * $e, oe += n * Xe, he += n * Je, re += n * Ze, se += n * at, ce += n * st, Q += n * lt, A += n * ut, n = l[7], ne += n * p, pe += n * Ee, ye += n * Ne, _e += n * qe, xe += n * Ce, be += n * Ie, we += n * Re, ve += n * et, oe += n * $e, he += n * Xe, re += n * Je, se += n * Ze, ce += n * at, Q += n * st, A += n * lt, C += n * ut, n = l[8], pe += n * p, ye += n * Ee, _e += n * Ne, xe += n * qe, be += n * Ce, we += n * Ie, ve += n * Re, oe += n * et, he += n * $e, re += n * Xe, se += n * Je, ce += n * Ze, Q += n * at, A += n * st, C += n * lt, N += n * ut, n = l[9], ye += n * p, _e += n * Ee, xe += n * Ne, be += n * qe, we += n * Ce, ve += n * Ie, oe += n * Re, he += n * et, re += n * $e, se += n * Xe, ce += n * Je, Q += n * Ze, A += n * at, C += n * st, N += n * lt, j += n * ut, n = l[10], _e += n * p, xe += n * Ee, be += n * Ne, we += n * qe, ve += n * Ce, oe += n * Ie, he += n * Re, re += n * et, se += n * $e, ce += n * Xe, Q += n * Je, A += n * Ze, C += n * at, N += n * st, j += n * lt, R += n * ut, n = l[11], xe += n * p, be += n * Ee, we += n * Ne, ve += n * qe, oe += n * Ce, he += n * Ie, re += n * Re, se += n * et, ce += n * $e, Q += n * Xe, A += n * Je, C += n * Ze, N += n * at, j += n * st, R += n * lt, D += n * ut, n = l[12], be += n * p, we += n * Ee, ve += n * Ne, oe += n * qe, he += n * Ce, re += n * Ie, se += n * Re, ce += n * et, Q += n * $e, A += n * Xe, C += n * Je, N += n * Ze, j += n * at, R += n * st, D += n * lt, ge += n * ut, n = l[13], we += n * p, ve += n * Ee, oe += n * Ne, he += n * qe, re += n * Ce, se += n * Ie, ce += n * Re, Q += n * et, A += n * $e, C += n * Xe, N += n * Je, j += n * Ze, R += n * at, D += n * st, ge += n * lt, ke += n * ut, n = l[14], ve += n * p, oe += n * Ee, he += n * Ne, re += n * qe, se += n * Ce, ce += n * Ie, Q += n * Re, A += n * et, C += n * $e, N += n * Xe, j += n * Je, R += n * Ze, D += n * at, ge += n * st, ke += n * lt, Se += n * ut, n = l[15], oe += n * p, he += n * Ee, re += n * Ne, se += n * qe, ce += n * Ce, Q += n * Ie, A += n * Re, C += n * et, N += n * $e, j += n * Xe, R += n * Je, D += n * Ze, ge += n * at, ke += n * st, Se += n * lt, Be += n * ut, w += 38 * he, B += 38 * re, I += 38 * se, K += 38 * ce, de += 38 * Q, te += 38 * A, ze += 38 * C, ne += 38 * N, pe += 38 * j, ye += 38 * R, _e += 38 * D, xe += 38 * ge, be += 38 * ke, we += 38 * Se, ve += 38 * Be, c = 1, n = w + c + 65535, c = Math.floor(n / 65536), w = n - c * 65536, n = B + c + 65535, c = Math.floor(n / 65536), B = n - c * 65536, n = I + c + 65535, c = Math.floor(n / 65536), I = n - c * 65536, n = K + c + 65535, c = Math.floor(n / 65536), K = n - c * 65536, n = de + c + 65535, c = Math.floor(n / 65536), de = n - c * 65536, n = te + c + 65535, c = Math.floor(n / 65536), te = n - c * 65536, n = ze + c + 65535, c = Math.floor(n / 65536), ze = n - c * 65536, n = ne + c + 65535, c = Math.floor(n / 65536), ne = n - c * 65536, n = pe + c + 65535, c = Math.floor(n / 65536), pe = n - c * 65536, n = ye + c + 65535, c = Math.floor(n / 65536), ye = n - c * 65536, n = _e + c + 65535, c = Math.floor(n / 65536), _e = n - c * 65536, n = xe + c + 65535, c = Math.floor(n / 65536), xe = n - c * 65536, n = be + c + 65535, c = Math.floor(n / 65536), be = n - c * 65536, n = we + c + 65535, c = Math.floor(n / 65536), we = n - c * 65536, n = ve + c + 65535, c = Math.floor(n / 65536), ve = n - c * 65536, n = oe + c + 65535, c = Math.floor(n / 65536), oe = n - c * 65536, w += c - 1 + 37 * (c - 1), c = 1, n = w + c + 65535, c = Math.floor(n / 65536), w = n - c * 65536, n = B + c + 65535, c = Math.floor(n / 65536), B = n - c * 65536, n = I + c + 65535, c = Math.floor(n / 65536), I = n - c * 65536, n = K + c + 65535, c = Math.floor(n / 65536), K = n - c * 65536, n = de + c + 65535, c = Math.floor(n / 65536), de = n - c * 65536, n = te + c + 65535, c = Math.floor(n / 65536), te = n - c * 65536, n = ze + c + 65535, c = Math.floor(n / 65536), ze = n - c * 65536, n = ne + c + 65535, c = Math.floor(n / 65536), ne = n - c * 65536, n = pe + c + 65535, c = Math.floor(n / 65536), pe = n - c * 65536, n = ye + c + 65535, c = Math.floor(n / 65536), ye = n - c * 65536, n = _e + c + 65535, c = Math.floor(n / 65536), _e = n - c * 65536, n = xe + c + 65535, c = Math.floor(n / 65536), xe = n - c * 65536, n = be + c + 65535, c = Math.floor(n / 65536), be = n - c * 65536, n = we + c + 65535, c = Math.floor(n / 65536), we = n - c * 65536, n = ve + c + 65535, c = Math.floor(n / 65536), ve = n - c * 65536, n = oe + c + 65535, c = Math.floor(n / 65536), oe = n - c * 65536, w += c - 1 + 37 * (c - 1), a[0] = w, a[1] = B, a[2] = I, a[3] = K, a[4] = de, a[5] = te, a[6] = ze, a[7] = ne, a[8] = pe, a[9] = ye, a[10] = _e, a[11] = xe, a[12] = be, a[13] = we, a[14] = ve, a[15] = oe;
    }
    function We(a, l) {
      Ue(a, l, l);
    }
    function yn(a, l) {
      var s = r(), n;
      for (n = 0; n < 16; n++) s[n] = l[n];
      for (n = 253; n >= 0; n--)
        We(s, s), n !== 2 && n !== 4 && Ue(s, s, l);
      for (n = 0; n < 16; n++) a[n] = s[n];
    }
    function bn(a, l) {
      var s = r(), n;
      for (n = 0; n < 16; n++) s[n] = l[n];
      for (n = 250; n >= 0; n--)
        We(s, s), n !== 1 && Ue(s, s, l);
      for (n = 0; n < 16; n++) a[n] = s[n];
    }
    function _t(a, l, s) {
      var n = new Uint8Array(32), c = new Float64Array(80), w, B, I = r(), K = r(), de = r(), te = r(), ze = r(), ne = r();
      for (B = 0; B < 31; B++) n[B] = l[B];
      for (n[31] = l[31] & 127 | 64, n[0] &= 248, Ot(c, s), B = 0; B < 16; B++)
        K[B] = c[B], te[B] = I[B] = de[B] = 0;
      for (I[0] = te[0] = 1, B = 254; B >= 0; --B)
        w = n[B >>> 3] >>> (B & 7) & 1, Oe(I, K, w), Oe(de, te, w), ht(ze, I, de), gt(I, I, de), ht(de, K, te), gt(K, K, te), We(te, ze), We(ne, I), Ue(I, de, I), Ue(de, K, ze), ht(ze, I, de), gt(I, I, de), We(K, I), gt(de, te, ne), Ue(I, de, m), ht(I, I, te), Ue(de, de, I), Ue(I, te, ne), Ue(te, K, c), We(K, ze), Oe(I, K, w), Oe(de, te, w);
      for (B = 0; B < 16; B++)
        c[B + 16] = I[B], c[B + 32] = de[B], c[B + 48] = K[B], c[B + 64] = te[B];
      var pe = c.subarray(32), ye = c.subarray(16);
      return yn(pe, pe), Ue(ye, ye, pe), x(a, ye), 0;
    }
    function Er(a, l) {
      return _t(a, l, f);
    }
    function vn(a, l) {
      return i(l, 32), Er(a, l);
    }
    function Ur(a, l, s) {
      var n = new Uint8Array(32);
      return _t(n, s, l), W(a, u, n, H);
    }
    var Xr = S, wn = Z;
    function Qn(a, l, s, n, c, w) {
      var B = new Uint8Array(32);
      return Ur(B, c, w), Xr(a, l, s, n, B);
    }
    function ea(a, l, s, n, c, w) {
      var B = new Uint8Array(32);
      return Ur(B, c, w), wn(a, l, s, n, B);
    }
    var xn = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function Tr(a, l, s, n) {
      for (var c = new Int32Array(16), w = new Int32Array(16), B, I, K, de, te, ze, ne, pe, ye, _e, xe, be, we, ve, oe, he, re, se, ce, Q, A, C, N, j, R, D, ge = a[0], ke = a[1], Se = a[2], Be = a[3], p = a[4], Ee = a[5], Ne = a[6], qe = a[7], Ce = l[0], Ie = l[1], Re = l[2], et = l[3], $e = l[4], Xe = l[5], Je = l[6], Ze = l[7], at = 0; n >= 128; ) {
        for (ce = 0; ce < 16; ce++)
          Q = 8 * ce + at, c[ce] = s[Q + 0] << 24 | s[Q + 1] << 16 | s[Q + 2] << 8 | s[Q + 3], w[ce] = s[Q + 4] << 24 | s[Q + 5] << 16 | s[Q + 6] << 8 | s[Q + 7];
        for (ce = 0; ce < 80; ce++)
          if (B = ge, I = ke, K = Se, de = Be, te = p, ze = Ee, ne = Ne, pe = qe, ye = Ce, _e = Ie, xe = Re, be = et, we = $e, ve = Xe, oe = Je, he = Ze, A = qe, C = Ze, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = (p >>> 14 | $e << 18) ^ (p >>> 18 | $e << 14) ^ ($e >>> 9 | p << 23), C = ($e >>> 14 | p << 18) ^ ($e >>> 18 | p << 14) ^ (p >>> 9 | $e << 23), N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, A = p & Ee ^ ~p & Ne, C = $e & Xe ^ ~$e & Je, N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, A = xn[ce * 2], C = xn[ce * 2 + 1], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, A = c[ce % 16], C = w[ce % 16], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, re = R & 65535 | D << 16, se = N & 65535 | j << 16, A = re, C = se, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = (ge >>> 28 | Ce << 4) ^ (Ce >>> 2 | ge << 30) ^ (Ce >>> 7 | ge << 25), C = (Ce >>> 28 | ge << 4) ^ (ge >>> 2 | Ce << 30) ^ (ge >>> 7 | Ce << 25), N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, A = ge & ke ^ ge & Se ^ ke & Se, C = Ce & Ie ^ Ce & Re ^ Ie & Re, N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, pe = R & 65535 | D << 16, he = N & 65535 | j << 16, A = de, C = be, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = re, C = se, N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, de = R & 65535 | D << 16, be = N & 65535 | j << 16, ke = B, Se = I, Be = K, p = de, Ee = te, Ne = ze, qe = ne, ge = pe, Ie = ye, Re = _e, et = xe, $e = be, Xe = we, Je = ve, Ze = oe, Ce = he, ce % 16 === 15)
            for (Q = 0; Q < 16; Q++)
              A = c[Q], C = w[Q], N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = c[(Q + 9) % 16], C = w[(Q + 9) % 16], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, re = c[(Q + 1) % 16], se = w[(Q + 1) % 16], A = (re >>> 1 | se << 31) ^ (re >>> 8 | se << 24) ^ re >>> 7, C = (se >>> 1 | re << 31) ^ (se >>> 8 | re << 24) ^ (se >>> 7 | re << 25), N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, re = c[(Q + 14) % 16], se = w[(Q + 14) % 16], A = (re >>> 19 | se << 13) ^ (se >>> 29 | re << 3) ^ re >>> 6, C = (se >>> 19 | re << 13) ^ (re >>> 29 | se << 3) ^ (se >>> 6 | re << 26), N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, c[Q] = R & 65535 | D << 16, w[Q] = N & 65535 | j << 16;
        A = ge, C = Ce, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[0], C = l[0], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[0] = ge = R & 65535 | D << 16, l[0] = Ce = N & 65535 | j << 16, A = ke, C = Ie, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[1], C = l[1], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[1] = ke = R & 65535 | D << 16, l[1] = Ie = N & 65535 | j << 16, A = Se, C = Re, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[2], C = l[2], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[2] = Se = R & 65535 | D << 16, l[2] = Re = N & 65535 | j << 16, A = Be, C = et, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[3], C = l[3], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[3] = Be = R & 65535 | D << 16, l[3] = et = N & 65535 | j << 16, A = p, C = $e, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[4], C = l[4], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[4] = p = R & 65535 | D << 16, l[4] = $e = N & 65535 | j << 16, A = Ee, C = Xe, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[5], C = l[5], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[5] = Ee = R & 65535 | D << 16, l[5] = Xe = N & 65535 | j << 16, A = Ne, C = Je, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[6], C = l[6], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[6] = Ne = R & 65535 | D << 16, l[6] = Je = N & 65535 | j << 16, A = qe, C = Ze, N = C & 65535, j = C >>> 16, R = A & 65535, D = A >>> 16, A = a[7], C = l[7], N += C & 65535, j += C >>> 16, R += A & 65535, D += A >>> 16, j += N >>> 16, R += j >>> 16, D += R >>> 16, a[7] = qe = R & 65535 | D << 16, l[7] = Ze = N & 65535 | j << 16, at += 128, n -= 128;
      }
      return n;
    }
    function Ct(a, l, s) {
      var n = new Int32Array(8), c = new Int32Array(8), w = new Uint8Array(256), B, I = s;
      for (n[0] = 1779033703, n[1] = 3144134277, n[2] = 1013904242, n[3] = 2773480762, n[4] = 1359893119, n[5] = 2600822924, n[6] = 528734635, n[7] = 1541459225, c[0] = 4089235720, c[1] = 2227873595, c[2] = 4271175723, c[3] = 1595750129, c[4] = 2917565137, c[5] = 725511199, c[6] = 4215389547, c[7] = 327033209, Tr(n, c, l, s), s %= 128, B = 0; B < s; B++) w[B] = l[I - s + B];
      for (w[s] = 128, s = 256 - 128 * (s < 112 ? 1 : 0), w[s - 9] = 0, ee(w, s - 8, I / 536870912 | 0, I << 3), Tr(n, c, w, s), B = 0; B < 8; B++) ee(a, 8 * B, n[B], c[B]);
      return 0;
    }
    function Et(a, l) {
      var s = r(), n = r(), c = r(), w = r(), B = r(), I = r(), K = r(), de = r(), te = r();
      gt(s, a[1], a[0]), gt(te, l[1], l[0]), Ue(s, s, te), ht(n, a[0], a[1]), ht(te, l[0], l[1]), Ue(n, n, te), Ue(c, a[3], l[3]), Ue(c, c, P), Ue(w, a[2], l[2]), ht(w, w, w), gt(B, n, s), gt(I, w, c), ht(K, w, c), ht(de, n, s), Ue(a[0], B, I), Ue(a[1], de, K), Ue(a[2], K, I), Ue(a[3], B, de);
    }
    function Jr(a, l, s) {
      var n;
      for (n = 0; n < 4; n++)
        Oe(a[n], l[n], s);
    }
    function Zt(a, l) {
      var s = r(), n = r(), c = r();
      yn(c, l[2]), Ue(s, l[0], c), Ue(n, l[1], c), x(a, n), a[31] ^= rt(s) << 7;
    }
    function Mr(a, l, s) {
      var n, c;
      for (le(a[0], o), le(a[1], h), le(a[2], h), le(a[3], o), c = 255; c >= 0; --c)
        n = s[c / 8 | 0] >> (c & 7) & 1, Jr(a, l, n), Et(l, a), Et(a, a), Jr(a, l, n);
    }
    function jr(a, l) {
      var s = [r(), r(), r(), r()];
      le(s[0], E), le(s[1], $), le(s[2], h), Ue(s[3], E, $), Mr(a, s, l);
    }
    function v(a, l, s) {
      var n = new Uint8Array(64), c = [r(), r(), r(), r()], w;
      for (s || i(l, 32), Ct(n, l, 32), n[0] &= 248, n[31] &= 127, n[31] |= 64, jr(c, n), Zt(a, c), w = 0; w < 32; w++) l[w + 32] = a[w];
      return 0;
    }
    var d = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function y(a, l) {
      var s, n, c, w;
      for (n = 63; n >= 32; --n) {
        for (s = 0, c = n - 32, w = n - 12; c < w; ++c)
          l[c] += s - 16 * l[n] * d[c - (n - 32)], s = Math.floor((l[c] + 128) / 256), l[c] -= s * 256;
        l[c] += s, l[n] = 0;
      }
      for (s = 0, c = 0; c < 32; c++)
        l[c] += s - (l[31] >> 4) * d[c], s = l[c] >> 8, l[c] &= 255;
      for (c = 0; c < 32; c++) l[c] -= s * d[c];
      for (n = 0; n < 32; n++)
        l[n + 1] += l[n] >> 8, a[n] = l[n] & 255;
    }
    function b(a) {
      var l = new Float64Array(64), s;
      for (s = 0; s < 64; s++) l[s] = a[s];
      for (s = 0; s < 64; s++) a[s] = 0;
      y(a, l);
    }
    function _(a, l, s, n) {
      var c = new Uint8Array(64), w = new Uint8Array(64), B = new Uint8Array(64), I, K, de = new Float64Array(64), te = [r(), r(), r(), r()];
      Ct(c, n, 32), c[0] &= 248, c[31] &= 127, c[31] |= 64;
      var ze = s + 64;
      for (I = 0; I < s; I++) a[64 + I] = l[I];
      for (I = 0; I < 32; I++) a[32 + I] = c[32 + I];
      for (Ct(B, a.subarray(32), s + 32), b(B), jr(te, B), Zt(a, te), I = 32; I < 64; I++) a[I] = n[I];
      for (Ct(w, a, s + 64), b(w), I = 0; I < 64; I++) de[I] = 0;
      for (I = 0; I < 32; I++) de[I] = B[I];
      for (I = 0; I < 32; I++)
        for (K = 0; K < 32; K++)
          de[I + K] += w[I] * c[K];
      return y(a.subarray(32), de), ze;
    }
    function g(a, l) {
      var s = r(), n = r(), c = r(), w = r(), B = r(), I = r(), K = r();
      return le(a[2], h), Ot(a[1], l), We(c, a[1]), Ue(w, c, k), gt(c, c, a[2]), ht(w, a[2], w), We(B, w), We(I, B), Ue(K, I, B), Ue(s, K, c), Ue(s, s, w), bn(s, s), Ue(s, s, c), Ue(s, s, w), Ue(s, s, w), Ue(a[0], s, w), We(n, a[0]), Ue(n, n, w), vt(n, c) && Ue(a[0], a[0], L), We(n, a[0]), Ue(n, n, w), vt(n, c) ? -1 : (rt(a[0]) === l[31] >> 7 && gt(a[0], o, a[0]), Ue(a[3], a[0], a[1]), 0);
    }
    function M(a, l, s, n) {
      var c, w = new Uint8Array(32), B = new Uint8Array(64), I = [r(), r(), r(), r()], K = [r(), r(), r(), r()];
      if (s < 64 || g(K, n)) return -1;
      for (c = 0; c < s; c++) a[c] = l[c];
      for (c = 0; c < 32; c++) a[c + 32] = n[c];
      if (Ct(B, a, s), b(B), Mr(I, K, B), jr(K, l.subarray(32)), Et(I, K), Zt(w, I), s -= 64, X(l, 0, w, 0)) {
        for (c = 0; c < s; c++) a[c] = 0;
        return -1;
      }
      for (c = 0; c < s; c++) a[c] = l[c + 64];
      return s;
    }
    var z = 32, q = 24, G = 32, ue = 16, V = 32, J = 32, me = 32, F = 32, je = 32, Te = q, De = G, Ve = ue, nt = 64, Qe = 32, ot = 64, Qt = 32, zt = 64;
    e.lowlevel = {
      crypto_core_hsalsa20: W,
      crypto_stream_xor: Fe,
      crypto_stream: Pe,
      crypto_stream_salsa20_xor: ie,
      crypto_stream_salsa20: Me,
      crypto_onetimeauth: He,
      crypto_onetimeauth_verify: U,
      crypto_verify_16: fe,
      crypto_verify_32: X,
      crypto_secretbox: S,
      crypto_secretbox_open: Z,
      crypto_scalarmult: _t,
      crypto_scalarmult_base: Er,
      crypto_box_beforenm: Ur,
      crypto_box_afternm: Xr,
      crypto_box: Qn,
      crypto_box_open: ea,
      crypto_box_keypair: vn,
      crypto_hash: Ct,
      crypto_sign: _,
      crypto_sign_keypair: v,
      crypto_sign_open: M,
      crypto_secretbox_KEYBYTES: z,
      crypto_secretbox_NONCEBYTES: q,
      crypto_secretbox_ZEROBYTES: G,
      crypto_secretbox_BOXZEROBYTES: ue,
      crypto_scalarmult_BYTES: V,
      crypto_scalarmult_SCALARBYTES: J,
      crypto_box_PUBLICKEYBYTES: me,
      crypto_box_SECRETKEYBYTES: F,
      crypto_box_BEFORENMBYTES: je,
      crypto_box_NONCEBYTES: Te,
      crypto_box_ZEROBYTES: De,
      crypto_box_BOXZEROBYTES: Ve,
      crypto_sign_BYTES: nt,
      crypto_sign_PUBLICKEYBYTES: Qe,
      crypto_sign_SECRETKEYBYTES: ot,
      crypto_sign_SEEDBYTES: Qt,
      crypto_hash_BYTES: zt,
      gf: r,
      D: k,
      L: d,
      pack25519: x,
      unpack25519: Ot,
      M: Ue,
      A: ht,
      S: We,
      Z: gt,
      pow2523: bn,
      add: Et,
      set25519: le,
      modL: y,
      scalarmult: Mr,
      scalarbase: jr
    };
    function Nt(a, l) {
      if (a.length !== z) throw new Error("bad key size");
      if (l.length !== q) throw new Error("bad nonce size");
    }
    function Ir(a, l) {
      if (a.length !== me) throw new Error("bad public key size");
      if (l.length !== F) throw new Error("bad secret key size");
    }
    function ct() {
      for (var a = 0; a < arguments.length; a++)
        if (!(arguments[a] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function Ua(a) {
      for (var l = 0; l < a.length; l++) a[l] = 0;
    }
    e.randomBytes = function(a) {
      var l = new Uint8Array(a);
      return i(l, a), l;
    }, e.secretbox = function(a, l, s) {
      ct(a, l, s), Nt(s, l);
      for (var n = new Uint8Array(G + a.length), c = new Uint8Array(n.length), w = 0; w < a.length; w++) n[w + G] = a[w];
      return S(c, n, n.length, l, s), c.subarray(ue);
    }, e.secretbox.open = function(a, l, s) {
      ct(a, l, s), Nt(s, l);
      for (var n = new Uint8Array(ue + a.length), c = new Uint8Array(n.length), w = 0; w < a.length; w++) n[w + ue] = a[w];
      return n.length < 32 || Z(c, n, n.length, l, s) !== 0 ? null : c.subarray(G);
    }, e.secretbox.keyLength = z, e.secretbox.nonceLength = q, e.secretbox.overheadLength = ue, e.scalarMult = function(a, l) {
      if (ct(a, l), a.length !== J) throw new Error("bad n size");
      if (l.length !== V) throw new Error("bad p size");
      var s = new Uint8Array(V);
      return _t(s, a, l), s;
    }, e.scalarMult.base = function(a) {
      if (ct(a), a.length !== J) throw new Error("bad n size");
      var l = new Uint8Array(V);
      return Er(l, a), l;
    }, e.scalarMult.scalarLength = J, e.scalarMult.groupElementLength = V, e.box = function(a, l, s, n) {
      var c = e.box.before(s, n);
      return e.secretbox(a, l, c);
    }, e.box.before = function(a, l) {
      ct(a, l), Ir(a, l);
      var s = new Uint8Array(je);
      return Ur(s, a, l), s;
    }, e.box.after = e.secretbox, e.box.open = function(a, l, s, n) {
      var c = e.box.before(s, n);
      return e.secretbox.open(a, l, c);
    }, e.box.open.after = e.secretbox.open, e.box.keyPair = function() {
      var a = new Uint8Array(me), l = new Uint8Array(F);
      return vn(a, l), { publicKey: a, secretKey: l };
    }, e.box.keyPair.fromSecretKey = function(a) {
      if (ct(a), a.length !== F)
        throw new Error("bad secret key size");
      var l = new Uint8Array(me);
      return Er(l, a), { publicKey: l, secretKey: new Uint8Array(a) };
    }, e.box.publicKeyLength = me, e.box.secretKeyLength = F, e.box.sharedKeyLength = je, e.box.nonceLength = Te, e.box.overheadLength = e.secretbox.overheadLength, e.sign = function(a, l) {
      if (ct(a, l), l.length !== ot)
        throw new Error("bad secret key size");
      var s = new Uint8Array(nt + a.length);
      return _(s, a, a.length, l), s;
    }, e.sign.open = function(a, l) {
      if (ct(a, l), l.length !== Qe)
        throw new Error("bad public key size");
      var s = new Uint8Array(a.length), n = M(s, a, a.length, l);
      if (n < 0) return null;
      for (var c = new Uint8Array(n), w = 0; w < c.length; w++) c[w] = s[w];
      return c;
    }, e.sign.detached = function(a, l) {
      for (var s = e.sign(a, l), n = new Uint8Array(nt), c = 0; c < n.length; c++) n[c] = s[c];
      return n;
    }, e.sign.detached.verify = function(a, l, s) {
      if (ct(a, l, s), l.length !== nt)
        throw new Error("bad signature size");
      if (s.length !== Qe)
        throw new Error("bad public key size");
      var n = new Uint8Array(nt + a.length), c = new Uint8Array(nt + a.length), w;
      for (w = 0; w < nt; w++) n[w] = l[w];
      for (w = 0; w < a.length; w++) n[w + nt] = a[w];
      return M(c, n, n.length, s) >= 0;
    }, e.sign.keyPair = function() {
      var a = new Uint8Array(Qe), l = new Uint8Array(ot);
      return v(a, l), { publicKey: a, secretKey: l };
    }, e.sign.keyPair.fromSecretKey = function(a) {
      if (ct(a), a.length !== ot)
        throw new Error("bad secret key size");
      for (var l = new Uint8Array(Qe), s = 0; s < l.length; s++) l[s] = a[32 + s];
      return { publicKey: l, secretKey: new Uint8Array(a) };
    }, e.sign.keyPair.fromSeed = function(a) {
      if (ct(a), a.length !== Qt)
        throw new Error("bad seed size");
      for (var l = new Uint8Array(Qe), s = new Uint8Array(ot), n = 0; n < 32; n++) s[n] = a[n];
      return v(l, s, !0), { publicKey: l, secretKey: s };
    }, e.sign.publicKeyLength = Qe, e.sign.secretKeyLength = ot, e.sign.seedLength = Qt, e.sign.signatureLength = nt, e.hash = function(a) {
      ct(a);
      var l = new Uint8Array(zt);
      return Ct(l, a, a.length), l;
    }, e.hash.hashLength = zt, e.verify = function(a, l) {
      return ct(a, l), a.length === 0 || l.length === 0 || a.length !== l.length ? !1 : ae(a, 0, l, 0, a.length) === 0;
    }, e.setPRNG = function(a) {
      i = a;
    }, function() {
      var a = typeof self < "u" ? self.crypto || self.msCrypto : null;
      if (a && a.getRandomValues) {
        var l = 65536;
        e.setPRNG(function(s, n) {
          var c, w = new Uint8Array(n);
          for (c = 0; c < n; c += l)
            a.getRandomValues(w.subarray(c, c + Math.min(n - c, l)));
          for (c = 0; c < n; c++) s[c] = w[c];
          Ua(w);
        });
      } else typeof Qs < "u" && (a = rl, a && a.randomBytes && e.setPRNG(function(s, n) {
        var c, w = a.randomBytes(n);
        for (c = 0; c < n; c++) s[c] = w[c];
        Ua(w);
      }));
    }();
  })(t.exports ? t.exports : self.nacl = self.nacl || {});
})(Ai);
var Ci = Ai.exports, Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.bitsToBytes = Kt.bytesToBits = Kt.lpad = void 0;
function Ei(t, e, r) {
  for (; t.length < r; )
    t = e + t;
  return t;
}
Kt.lpad = Ei;
function nl(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    let i = t.at(r);
    e += Ei(i.toString(2), "0", 8);
  }
  return e;
}
Kt.bytesToBits = nl;
function al(t) {
  if (t.length % 8 !== 0)
    throw Error("Uneven bits");
  let e = [];
  for (; t.length > 0; )
    e.push(parseInt(t.slice(0, 8), 2)), t = t.slice(8);
  return Buffer.from(e);
}
Kt.bitsToBytes = al;
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.wordlist = void 0;
const il = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acoustic",
  "acquire",
  "across",
  "act",
  "action",
  "actor",
  "actress",
  "actual",
  "adapt",
  "add",
  "addict",
  "address",
  "adjust",
  "admit",
  "adult",
  "advance",
  "advice",
  "aerobic",
  "affair",
  "afford",
  "afraid",
  "again",
  "age",
  "agent",
  "agree",
  "ahead",
  "aim",
  "air",
  "airport",
  "aisle",
  "alarm",
  "album",
  "alcohol",
  "alert",
  "alien",
  "all",
  "alley",
  "allow",
  "almost",
  "alone",
  "alpha",
  "already",
  "also",
  "alter",
  "always",
  "amateur",
  "amazing",
  "among",
  "amount",
  "amused",
  "analyst",
  "anchor",
  "ancient",
  "anger",
  "angle",
  "angry",
  "animal",
  "ankle",
  "announce",
  "annual",
  "another",
  "answer",
  "antenna",
  "antique",
  "anxiety",
  "any",
  "apart",
  "apology",
  "appear",
  "apple",
  "approve",
  "april",
  "arch",
  "arctic",
  "area",
  "arena",
  "argue",
  "arm",
  "armed",
  "armor",
  "army",
  "around",
  "arrange",
  "arrest",
  "arrive",
  "arrow",
  "art",
  "artefact",
  "artist",
  "artwork",
  "ask",
  "aspect",
  "assault",
  "asset",
  "assist",
  "assume",
  "asthma",
  "athlete",
  "atom",
  "attack",
  "attend",
  "attitude",
  "attract",
  "auction",
  "audit",
  "august",
  "aunt",
  "author",
  "auto",
  "autumn",
  "average",
  "avocado",
  "avoid",
  "awake",
  "aware",
  "away",
  "awesome",
  "awful",
  "awkward",
  "axis",
  "baby",
  "bachelor",
  "bacon",
  "badge",
  "bag",
  "balance",
  "balcony",
  "ball",
  "bamboo",
  "banana",
  "banner",
  "bar",
  "barely",
  "bargain",
  "barrel",
  "base",
  "basic",
  "basket",
  "battle",
  "beach",
  "bean",
  "beauty",
  "because",
  "become",
  "beef",
  "before",
  "begin",
  "behave",
  "behind",
  "believe",
  "below",
  "belt",
  "bench",
  "benefit",
  "best",
  "betray",
  "better",
  "between",
  "beyond",
  "bicycle",
  "bid",
  "bike",
  "bind",
  "biology",
  "bird",
  "birth",
  "bitter",
  "black",
  "blade",
  "blame",
  "blanket",
  "blast",
  "bleak",
  "bless",
  "blind",
  "blood",
  "blossom",
  "blouse",
  "blue",
  "blur",
  "blush",
  "board",
  "boat",
  "body",
  "boil",
  "bomb",
  "bone",
  "bonus",
  "book",
  "boost",
  "border",
  "boring",
  "borrow",
  "boss",
  "bottom",
  "bounce",
  "box",
  "boy",
  "bracket",
  "brain",
  "brand",
  "brass",
  "brave",
  "bread",
  "breeze",
  "brick",
  "bridge",
  "brief",
  "bright",
  "bring",
  "brisk",
  "broccoli",
  "broken",
  "bronze",
  "broom",
  "brother",
  "brown",
  "brush",
  "bubble",
  "buddy",
  "budget",
  "buffalo",
  "build",
  "bulb",
  "bulk",
  "bullet",
  "bundle",
  "bunker",
  "burden",
  "burger",
  "burst",
  "bus",
  "business",
  "busy",
  "butter",
  "buyer",
  "buzz",
  "cabbage",
  "cabin",
  "cable",
  "cactus",
  "cage",
  "cake",
  "call",
  "calm",
  "camera",
  "camp",
  "can",
  "canal",
  "cancel",
  "candy",
  "cannon",
  "canoe",
  "canvas",
  "canyon",
  "capable",
  "capital",
  "captain",
  "car",
  "carbon",
  "card",
  "cargo",
  "carpet",
  "carry",
  "cart",
  "case",
  "cash",
  "casino",
  "castle",
  "casual",
  "cat",
  "catalog",
  "catch",
  "category",
  "cattle",
  "caught",
  "cause",
  "caution",
  "cave",
  "ceiling",
  "celery",
  "cement",
  "census",
  "century",
  "cereal",
  "certain",
  "chair",
  "chalk",
  "champion",
  "change",
  "chaos",
  "chapter",
  "charge",
  "chase",
  "chat",
  "cheap",
  "check",
  "cheese",
  "chef",
  "cherry",
  "chest",
  "chicken",
  "chief",
  "child",
  "chimney",
  "choice",
  "choose",
  "chronic",
  "chuckle",
  "chunk",
  "churn",
  "cigar",
  "cinnamon",
  "circle",
  "citizen",
  "city",
  "civil",
  "claim",
  "clap",
  "clarify",
  "claw",
  "clay",
  "clean",
  "clerk",
  "clever",
  "click",
  "client",
  "cliff",
  "climb",
  "clinic",
  "clip",
  "clock",
  "clog",
  "close",
  "cloth",
  "cloud",
  "clown",
  "club",
  "clump",
  "cluster",
  "clutch",
  "coach",
  "coast",
  "coconut",
  "code",
  "coffee",
  "coil",
  "coin",
  "collect",
  "color",
  "column",
  "combine",
  "come",
  "comfort",
  "comic",
  "common",
  "company",
  "concert",
  "conduct",
  "confirm",
  "congress",
  "connect",
  "consider",
  "control",
  "convince",
  "cook",
  "cool",
  "copper",
  "copy",
  "coral",
  "core",
  "corn",
  "correct",
  "cost",
  "cotton",
  "couch",
  "country",
  "couple",
  "course",
  "cousin",
  "cover",
  "coyote",
  "crack",
  "cradle",
  "craft",
  "cram",
  "crane",
  "crash",
  "crater",
  "crawl",
  "crazy",
  "cream",
  "credit",
  "creek",
  "crew",
  "cricket",
  "crime",
  "crisp",
  "critic",
  "crop",
  "cross",
  "crouch",
  "crowd",
  "crucial",
  "cruel",
  "cruise",
  "crumble",
  "crunch",
  "crush",
  "cry",
  "crystal",
  "cube",
  "culture",
  "cup",
  "cupboard",
  "curious",
  "current",
  "curtain",
  "curve",
  "cushion",
  "custom",
  "cute",
  "cycle",
  "dad",
  "damage",
  "damp",
  "dance",
  "danger",
  "daring",
  "dash",
  "daughter",
  "dawn",
  "day",
  "deal",
  "debate",
  "debris",
  "decade",
  "december",
  "decide",
  "decline",
  "decorate",
  "decrease",
  "deer",
  "defense",
  "define",
  "defy",
  "degree",
  "delay",
  "deliver",
  "demand",
  "demise",
  "denial",
  "dentist",
  "deny",
  "depart",
  "depend",
  "deposit",
  "depth",
  "deputy",
  "derive",
  "describe",
  "desert",
  "design",
  "desk",
  "despair",
  "destroy",
  "detail",
  "detect",
  "develop",
  "device",
  "devote",
  "diagram",
  "dial",
  "diamond",
  "diary",
  "dice",
  "diesel",
  "diet",
  "differ",
  "digital",
  "dignity",
  "dilemma",
  "dinner",
  "dinosaur",
  "direct",
  "dirt",
  "disagree",
  "discover",
  "disease",
  "dish",
  "dismiss",
  "disorder",
  "display",
  "distance",
  "divert",
  "divide",
  "divorce",
  "dizzy",
  "doctor",
  "document",
  "dog",
  "doll",
  "dolphin",
  "domain",
  "donate",
  "donkey",
  "donor",
  "door",
  "dose",
  "double",
  "dove",
  "draft",
  "dragon",
  "drama",
  "drastic",
  "draw",
  "dream",
  "dress",
  "drift",
  "drill",
  "drink",
  "drip",
  "drive",
  "drop",
  "drum",
  "dry",
  "duck",
  "dumb",
  "dune",
  "during",
  "dust",
  "dutch",
  "duty",
  "dwarf",
  "dynamic",
  "eager",
  "eagle",
  "early",
  "earn",
  "earth",
  "easily",
  "east",
  "easy",
  "echo",
  "ecology",
  "economy",
  "edge",
  "edit",
  "educate",
  "effort",
  "egg",
  "eight",
  "either",
  "elbow",
  "elder",
  "electric",
  "elegant",
  "element",
  "elephant",
  "elevator",
  "elite",
  "else",
  "embark",
  "embody",
  "embrace",
  "emerge",
  "emotion",
  "employ",
  "empower",
  "empty",
  "enable",
  "enact",
  "end",
  "endless",
  "endorse",
  "enemy",
  "energy",
  "enforce",
  "engage",
  "engine",
  "enhance",
  "enjoy",
  "enlist",
  "enough",
  "enrich",
  "enroll",
  "ensure",
  "enter",
  "entire",
  "entry",
  "envelope",
  "episode",
  "equal",
  "equip",
  "era",
  "erase",
  "erode",
  "erosion",
  "error",
  "erupt",
  "escape",
  "essay",
  "essence",
  "estate",
  "eternal",
  "ethics",
  "evidence",
  "evil",
  "evoke",
  "evolve",
  "exact",
  "example",
  "excess",
  "exchange",
  "excite",
  "exclude",
  "excuse",
  "execute",
  "exercise",
  "exhaust",
  "exhibit",
  "exile",
  "exist",
  "exit",
  "exotic",
  "expand",
  "expect",
  "expire",
  "explain",
  "expose",
  "express",
  "extend",
  "extra",
  "eye",
  "eyebrow",
  "fabric",
  "face",
  "faculty",
  "fade",
  "faint",
  "faith",
  "fall",
  "false",
  "fame",
  "family",
  "famous",
  "fan",
  "fancy",
  "fantasy",
  "farm",
  "fashion",
  "fat",
  "fatal",
  "father",
  "fatigue",
  "fault",
  "favorite",
  "feature",
  "february",
  "federal",
  "fee",
  "feed",
  "feel",
  "female",
  "fence",
  "festival",
  "fetch",
  "fever",
  "few",
  "fiber",
  "fiction",
  "field",
  "figure",
  "file",
  "film",
  "filter",
  "final",
  "find",
  "fine",
  "finger",
  "finish",
  "fire",
  "firm",
  "first",
  "fiscal",
  "fish",
  "fit",
  "fitness",
  "fix",
  "flag",
  "flame",
  "flash",
  "flat",
  "flavor",
  "flee",
  "flight",
  "flip",
  "float",
  "flock",
  "floor",
  "flower",
  "fluid",
  "flush",
  "fly",
  "foam",
  "focus",
  "fog",
  "foil",
  "fold",
  "follow",
  "food",
  "foot",
  "force",
  "forest",
  "forget",
  "fork",
  "fortune",
  "forum",
  "forward",
  "fossil",
  "foster",
  "found",
  "fox",
  "fragile",
  "frame",
  "frequent",
  "fresh",
  "friend",
  "fringe",
  "frog",
  "front",
  "frost",
  "frown",
  "frozen",
  "fruit",
  "fuel",
  "fun",
  "funny",
  "furnace",
  "fury",
  "future",
  "gadget",
  "gain",
  "galaxy",
  "gallery",
  "game",
  "gap",
  "garage",
  "garbage",
  "garden",
  "garlic",
  "garment",
  "gas",
  "gasp",
  "gate",
  "gather",
  "gauge",
  "gaze",
  "general",
  "genius",
  "genre",
  "gentle",
  "genuine",
  "gesture",
  "ghost",
  "giant",
  "gift",
  "giggle",
  "ginger",
  "giraffe",
  "girl",
  "give",
  "glad",
  "glance",
  "glare",
  "glass",
  "glide",
  "glimpse",
  "globe",
  "gloom",
  "glory",
  "glove",
  "glow",
  "glue",
  "goat",
  "goddess",
  "gold",
  "good",
  "goose",
  "gorilla",
  "gospel",
  "gossip",
  "govern",
  "gown",
  "grab",
  "grace",
  "grain",
  "grant",
  "grape",
  "grass",
  "gravity",
  "great",
  "green",
  "grid",
  "grief",
  "grit",
  "grocery",
  "group",
  "grow",
  "grunt",
  "guard",
  "guess",
  "guide",
  "guilt",
  "guitar",
  "gun",
  "gym",
  "habit",
  "hair",
  "half",
  "hammer",
  "hamster",
  "hand",
  "happy",
  "harbor",
  "hard",
  "harsh",
  "harvest",
  "hat",
  "have",
  "hawk",
  "hazard",
  "head",
  "health",
  "heart",
  "heavy",
  "hedgehog",
  "height",
  "hello",
  "helmet",
  "help",
  "hen",
  "hero",
  "hidden",
  "high",
  "hill",
  "hint",
  "hip",
  "hire",
  "history",
  "hobby",
  "hockey",
  "hold",
  "hole",
  "holiday",
  "hollow",
  "home",
  "honey",
  "hood",
  "hope",
  "horn",
  "horror",
  "horse",
  "hospital",
  "host",
  "hotel",
  "hour",
  "hover",
  "hub",
  "huge",
  "human",
  "humble",
  "humor",
  "hundred",
  "hungry",
  "hunt",
  "hurdle",
  "hurry",
  "hurt",
  "husband",
  "hybrid",
  "ice",
  "icon",
  "idea",
  "identify",
  "idle",
  "ignore",
  "ill",
  "illegal",
  "illness",
  "image",
  "imitate",
  "immense",
  "immune",
  "impact",
  "impose",
  "improve",
  "impulse",
  "inch",
  "include",
  "income",
  "increase",
  "index",
  "indicate",
  "indoor",
  "industry",
  "infant",
  "inflict",
  "inform",
  "inhale",
  "inherit",
  "initial",
  "inject",
  "injury",
  "inmate",
  "inner",
  "innocent",
  "input",
  "inquiry",
  "insane",
  "insect",
  "inside",
  "inspire",
  "install",
  "intact",
  "interest",
  "into",
  "invest",
  "invite",
  "involve",
  "iron",
  "island",
  "isolate",
  "issue",
  "item",
  "ivory",
  "jacket",
  "jaguar",
  "jar",
  "jazz",
  "jealous",
  "jeans",
  "jelly",
  "jewel",
  "job",
  "join",
  "joke",
  "journey",
  "joy",
  "judge",
  "juice",
  "jump",
  "jungle",
  "junior",
  "junk",
  "just",
  "kangaroo",
  "keen",
  "keep",
  "ketchup",
  "key",
  "kick",
  "kid",
  "kidney",
  "kind",
  "kingdom",
  "kiss",
  "kit",
  "kitchen",
  "kite",
  "kitten",
  "kiwi",
  "knee",
  "knife",
  "knock",
  "know",
  "lab",
  "label",
  "labor",
  "ladder",
  "lady",
  "lake",
  "lamp",
  "language",
  "laptop",
  "large",
  "later",
  "latin",
  "laugh",
  "laundry",
  "lava",
  "law",
  "lawn",
  "lawsuit",
  "layer",
  "lazy",
  "leader",
  "leaf",
  "learn",
  "leave",
  "lecture",
  "left",
  "leg",
  "legal",
  "legend",
  "leisure",
  "lemon",
  "lend",
  "length",
  "lens",
  "leopard",
  "lesson",
  "letter",
  "level",
  "liar",
  "liberty",
  "library",
  "license",
  "life",
  "lift",
  "light",
  "like",
  "limb",
  "limit",
  "link",
  "lion",
  "liquid",
  "list",
  "little",
  "live",
  "lizard",
  "load",
  "loan",
  "lobster",
  "local",
  "lock",
  "logic",
  "lonely",
  "long",
  "loop",
  "lottery",
  "loud",
  "lounge",
  "love",
  "loyal",
  "lucky",
  "luggage",
  "lumber",
  "lunar",
  "lunch",
  "luxury",
  "lyrics",
  "machine",
  "mad",
  "magic",
  "magnet",
  "maid",
  "mail",
  "main",
  "major",
  "make",
  "mammal",
  "man",
  "manage",
  "mandate",
  "mango",
  "mansion",
  "manual",
  "maple",
  "marble",
  "march",
  "margin",
  "marine",
  "market",
  "marriage",
  "mask",
  "mass",
  "master",
  "match",
  "material",
  "math",
  "matrix",
  "matter",
  "maximum",
  "maze",
  "meadow",
  "mean",
  "measure",
  "meat",
  "mechanic",
  "medal",
  "media",
  "melody",
  "melt",
  "member",
  "memory",
  "mention",
  "menu",
  "mercy",
  "merge",
  "merit",
  "merry",
  "mesh",
  "message",
  "metal",
  "method",
  "middle",
  "midnight",
  "milk",
  "million",
  "mimic",
  "mind",
  "minimum",
  "minor",
  "minute",
  "miracle",
  "mirror",
  "misery",
  "miss",
  "mistake",
  "mix",
  "mixed",
  "mixture",
  "mobile",
  "model",
  "modify",
  "mom",
  "moment",
  "monitor",
  "monkey",
  "monster",
  "month",
  "moon",
  "moral",
  "more",
  "morning",
  "mosquito",
  "mother",
  "motion",
  "motor",
  "mountain",
  "mouse",
  "move",
  "movie",
  "much",
  "muffin",
  "mule",
  "multiply",
  "muscle",
  "museum",
  "mushroom",
  "music",
  "must",
  "mutual",
  "myself",
  "mystery",
  "myth",
  "naive",
  "name",
  "napkin",
  "narrow",
  "nasty",
  "nation",
  "nature",
  "near",
  "neck",
  "need",
  "negative",
  "neglect",
  "neither",
  "nephew",
  "nerve",
  "nest",
  "net",
  "network",
  "neutral",
  "never",
  "news",
  "next",
  "nice",
  "night",
  "noble",
  "noise",
  "nominee",
  "noodle",
  "normal",
  "north",
  "nose",
  "notable",
  "note",
  "nothing",
  "notice",
  "novel",
  "now",
  "nuclear",
  "number",
  "nurse",
  "nut",
  "oak",
  "obey",
  "object",
  "oblige",
  "obscure",
  "observe",
  "obtain",
  "obvious",
  "occur",
  "ocean",
  "october",
  "odor",
  "off",
  "offer",
  "office",
  "often",
  "oil",
  "okay",
  "old",
  "olive",
  "olympic",
  "omit",
  "once",
  "one",
  "onion",
  "online",
  "only",
  "open",
  "opera",
  "opinion",
  "oppose",
  "option",
  "orange",
  "orbit",
  "orchard",
  "order",
  "ordinary",
  "organ",
  "orient",
  "original",
  "orphan",
  "ostrich",
  "other",
  "outdoor",
  "outer",
  "output",
  "outside",
  "oval",
  "oven",
  "over",
  "own",
  "owner",
  "oxygen",
  "oyster",
  "ozone",
  "pact",
  "paddle",
  "page",
  "pair",
  "palace",
  "palm",
  "panda",
  "panel",
  "panic",
  "panther",
  "paper",
  "parade",
  "parent",
  "park",
  "parrot",
  "party",
  "pass",
  "patch",
  "path",
  "patient",
  "patrol",
  "pattern",
  "pause",
  "pave",
  "payment",
  "peace",
  "peanut",
  "pear",
  "peasant",
  "pelican",
  "pen",
  "penalty",
  "pencil",
  "people",
  "pepper",
  "perfect",
  "permit",
  "person",
  "pet",
  "phone",
  "photo",
  "phrase",
  "physical",
  "piano",
  "picnic",
  "picture",
  "piece",
  "pig",
  "pigeon",
  "pill",
  "pilot",
  "pink",
  "pioneer",
  "pipe",
  "pistol",
  "pitch",
  "pizza",
  "place",
  "planet",
  "plastic",
  "plate",
  "play",
  "please",
  "pledge",
  "pluck",
  "plug",
  "plunge",
  "poem",
  "poet",
  "point",
  "polar",
  "pole",
  "police",
  "pond",
  "pony",
  "pool",
  "popular",
  "portion",
  "position",
  "possible",
  "post",
  "potato",
  "pottery",
  "poverty",
  "powder",
  "power",
  "practice",
  "praise",
  "predict",
  "prefer",
  "prepare",
  "present",
  "pretty",
  "prevent",
  "price",
  "pride",
  "primary",
  "print",
  "priority",
  "prison",
  "private",
  "prize",
  "problem",
  "process",
  "produce",
  "profit",
  "program",
  "project",
  "promote",
  "proof",
  "property",
  "prosper",
  "protect",
  "proud",
  "provide",
  "public",
  "pudding",
  "pull",
  "pulp",
  "pulse",
  "pumpkin",
  "punch",
  "pupil",
  "puppy",
  "purchase",
  "purity",
  "purpose",
  "purse",
  "push",
  "put",
  "puzzle",
  "pyramid",
  "quality",
  "quantum",
  "quarter",
  "question",
  "quick",
  "quit",
  "quiz",
  "quote",
  "rabbit",
  "raccoon",
  "race",
  "rack",
  "radar",
  "radio",
  "rail",
  "rain",
  "raise",
  "rally",
  "ramp",
  "ranch",
  "random",
  "range",
  "rapid",
  "rare",
  "rate",
  "rather",
  "raven",
  "raw",
  "razor",
  "ready",
  "real",
  "reason",
  "rebel",
  "rebuild",
  "recall",
  "receive",
  "recipe",
  "record",
  "recycle",
  "reduce",
  "reflect",
  "reform",
  "refuse",
  "region",
  "regret",
  "regular",
  "reject",
  "relax",
  "release",
  "relief",
  "rely",
  "remain",
  "remember",
  "remind",
  "remove",
  "render",
  "renew",
  "rent",
  "reopen",
  "repair",
  "repeat",
  "replace",
  "report",
  "require",
  "rescue",
  "resemble",
  "resist",
  "resource",
  "response",
  "result",
  "retire",
  "retreat",
  "return",
  "reunion",
  "reveal",
  "review",
  "reward",
  "rhythm",
  "rib",
  "ribbon",
  "rice",
  "rich",
  "ride",
  "ridge",
  "rifle",
  "right",
  "rigid",
  "ring",
  "riot",
  "ripple",
  "risk",
  "ritual",
  "rival",
  "river",
  "road",
  "roast",
  "robot",
  "robust",
  "rocket",
  "romance",
  "roof",
  "rookie",
  "room",
  "rose",
  "rotate",
  "rough",
  "round",
  "route",
  "royal",
  "rubber",
  "rude",
  "rug",
  "rule",
  "run",
  "runway",
  "rural",
  "sad",
  "saddle",
  "sadness",
  "safe",
  "sail",
  "salad",
  "salmon",
  "salon",
  "salt",
  "salute",
  "same",
  "sample",
  "sand",
  "satisfy",
  "satoshi",
  "sauce",
  "sausage",
  "save",
  "say",
  "scale",
  "scan",
  "scare",
  "scatter",
  "scene",
  "scheme",
  "school",
  "science",
  "scissors",
  "scorpion",
  "scout",
  "scrap",
  "screen",
  "script",
  "scrub",
  "sea",
  "search",
  "season",
  "seat",
  "second",
  "secret",
  "section",
  "security",
  "seed",
  "seek",
  "segment",
  "select",
  "sell",
  "seminar",
  "senior",
  "sense",
  "sentence",
  "series",
  "service",
  "session",
  "settle",
  "setup",
  "seven",
  "shadow",
  "shaft",
  "shallow",
  "share",
  "shed",
  "shell",
  "sheriff",
  "shield",
  "shift",
  "shine",
  "ship",
  "shiver",
  "shock",
  "shoe",
  "shoot",
  "shop",
  "short",
  "shoulder",
  "shove",
  "shrimp",
  "shrug",
  "shuffle",
  "shy",
  "sibling",
  "sick",
  "side",
  "siege",
  "sight",
  "sign",
  "silent",
  "silk",
  "silly",
  "silver",
  "similar",
  "simple",
  "since",
  "sing",
  "siren",
  "sister",
  "situate",
  "six",
  "size",
  "skate",
  "sketch",
  "ski",
  "skill",
  "skin",
  "skirt",
  "skull",
  "slab",
  "slam",
  "sleep",
  "slender",
  "slice",
  "slide",
  "slight",
  "slim",
  "slogan",
  "slot",
  "slow",
  "slush",
  "small",
  "smart",
  "smile",
  "smoke",
  "smooth",
  "snack",
  "snake",
  "snap",
  "sniff",
  "snow",
  "soap",
  "soccer",
  "social",
  "sock",
  "soda",
  "soft",
  "solar",
  "soldier",
  "solid",
  "solution",
  "solve",
  "someone",
  "song",
  "soon",
  "sorry",
  "sort",
  "soul",
  "sound",
  "soup",
  "source",
  "south",
  "space",
  "spare",
  "spatial",
  "spawn",
  "speak",
  "special",
  "speed",
  "spell",
  "spend",
  "sphere",
  "spice",
  "spider",
  "spike",
  "spin",
  "spirit",
  "split",
  "spoil",
  "sponsor",
  "spoon",
  "sport",
  "spot",
  "spray",
  "spread",
  "spring",
  "spy",
  "square",
  "squeeze",
  "squirrel",
  "stable",
  "stadium",
  "staff",
  "stage",
  "stairs",
  "stamp",
  "stand",
  "start",
  "state",
  "stay",
  "steak",
  "steel",
  "stem",
  "step",
  "stereo",
  "stick",
  "still",
  "sting",
  "stock",
  "stomach",
  "stone",
  "stool",
  "story",
  "stove",
  "strategy",
  "street",
  "strike",
  "strong",
  "struggle",
  "student",
  "stuff",
  "stumble",
  "style",
  "subject",
  "submit",
  "subway",
  "success",
  "such",
  "sudden",
  "suffer",
  "sugar",
  "suggest",
  "suit",
  "summer",
  "sun",
  "sunny",
  "sunset",
  "super",
  "supply",
  "supreme",
  "sure",
  "surface",
  "surge",
  "surprise",
  "surround",
  "survey",
  "suspect",
  "sustain",
  "swallow",
  "swamp",
  "swap",
  "swarm",
  "swear",
  "sweet",
  "swift",
  "swim",
  "swing",
  "switch",
  "sword",
  "symbol",
  "symptom",
  "syrup",
  "system",
  "table",
  "tackle",
  "tag",
  "tail",
  "talent",
  "talk",
  "tank",
  "tape",
  "target",
  "task",
  "taste",
  "tattoo",
  "taxi",
  "teach",
  "team",
  "tell",
  "ten",
  "tenant",
  "tennis",
  "tent",
  "term",
  "test",
  "text",
  "thank",
  "that",
  "theme",
  "then",
  "theory",
  "there",
  "they",
  "thing",
  "this",
  "thought",
  "three",
  "thrive",
  "throw",
  "thumb",
  "thunder",
  "ticket",
  "tide",
  "tiger",
  "tilt",
  "timber",
  "time",
  "tiny",
  "tip",
  "tired",
  "tissue",
  "title",
  "toast",
  "tobacco",
  "today",
  "toddler",
  "toe",
  "together",
  "toilet",
  "token",
  "tomato",
  "tomorrow",
  "tone",
  "tongue",
  "tonight",
  "tool",
  "tooth",
  "top",
  "topic",
  "topple",
  "torch",
  "tornado",
  "tortoise",
  "toss",
  "total",
  "tourist",
  "toward",
  "tower",
  "town",
  "toy",
  "track",
  "trade",
  "traffic",
  "tragic",
  "train",
  "transfer",
  "trap",
  "trash",
  "travel",
  "tray",
  "treat",
  "tree",
  "trend",
  "trial",
  "tribe",
  "trick",
  "trigger",
  "trim",
  "trip",
  "trophy",
  "trouble",
  "truck",
  "true",
  "truly",
  "trumpet",
  "trust",
  "truth",
  "try",
  "tube",
  "tuition",
  "tumble",
  "tuna",
  "tunnel",
  "turkey",
  "turn",
  "turtle",
  "twelve",
  "twenty",
  "twice",
  "twin",
  "twist",
  "two",
  "type",
  "typical",
  "ugly",
  "umbrella",
  "unable",
  "unaware",
  "uncle",
  "uncover",
  "under",
  "undo",
  "unfair",
  "unfold",
  "unhappy",
  "uniform",
  "unique",
  "unit",
  "universe",
  "unknown",
  "unlock",
  "until",
  "unusual",
  "unveil",
  "update",
  "upgrade",
  "uphold",
  "upon",
  "upper",
  "upset",
  "urban",
  "urge",
  "usage",
  "use",
  "used",
  "useful",
  "useless",
  "usual",
  "utility",
  "vacant",
  "vacuum",
  "vague",
  "valid",
  "valley",
  "valve",
  "van",
  "vanish",
  "vapor",
  "various",
  "vast",
  "vault",
  "vehicle",
  "velvet",
  "vendor",
  "venture",
  "venue",
  "verb",
  "verify",
  "version",
  "very",
  "vessel",
  "veteran",
  "viable",
  "vibrant",
  "vicious",
  "victory",
  "video",
  "view",
  "village",
  "vintage",
  "violin",
  "virtual",
  "virus",
  "visa",
  "visit",
  "visual",
  "vital",
  "vivid",
  "vocal",
  "voice",
  "void",
  "volcano",
  "volume",
  "vote",
  "voyage",
  "wage",
  "wagon",
  "wait",
  "walk",
  "wall",
  "walnut",
  "want",
  "warfare",
  "warm",
  "warrior",
  "wash",
  "wasp",
  "waste",
  "water",
  "wave",
  "way",
  "wealth",
  "weapon",
  "wear",
  "weasel",
  "weather",
  "web",
  "wedding",
  "weekend",
  "weird",
  "welcome",
  "west",
  "wet",
  "whale",
  "what",
  "wheat",
  "wheel",
  "when",
  "where",
  "whip",
  "whisper",
  "wide",
  "width",
  "wife",
  "wild",
  "will",
  "win",
  "window",
  "wine",
  "wing",
  "wink",
  "winner",
  "winter",
  "wire",
  "wisdom",
  "wise",
  "wish",
  "witness",
  "wolf",
  "woman",
  "wonder",
  "wood",
  "wool",
  "word",
  "work",
  "world",
  "worry",
  "worth",
  "wrap",
  "wreck",
  "wrestle",
  "wrist",
  "write",
  "wrong",
  "yard",
  "year",
  "yellow",
  "you",
  "young",
  "youth",
  "zebra",
  "zero",
  "zone",
  "zoo"
];
hn.wordlist = il;
var ol = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.mnemonicFromRandomSeed = Ge.mnemonicIndexesToBytes = Ge.bytesToMnemonics = Ge.bytesToMnemonicIndexes = Ge.mnemonicNew = Ge.mnemonicValidate = Ge.mnemonicToHDSeed = Ge.mnemonicToWalletKey = Ge.mnemonicToPrivateKey = Ge.mnemonicToSeed = Ge.mnemonicToEntropy = void 0;
const Ui = ol(Ci), sl = St, ll = Pt, Kn = fn, fa = Kt, Bn = hn, _a = 1e5;
async function Ti(t) {
  const e = await gn(t);
  return await ul(e) && !await Ba(e);
}
function ka(t) {
  return t.map((e) => e.toLowerCase().trim());
}
async function Ba(t) {
  return (await (0, Kn.pbkdf2_sha512)(t, "TON seed version", Math.max(1, Math.floor(_a / 256)), 64))[0] == 0;
}
async function ul(t) {
  return (await (0, Kn.pbkdf2_sha512)(t, "TON fast seed version", 1, 64))[0] == 1;
}
async function gn(t, e) {
  return await (0, ll.hmac_sha512)(t.join(" "), e && e.length > 0 ? e : "");
}
Ge.mnemonicToEntropy = gn;
async function Sa(t, e, r) {
  const i = await gn(t, r);
  return await (0, Kn.pbkdf2_sha512)(i, e, _a, 64);
}
Ge.mnemonicToSeed = Sa;
async function Mi(t, e) {
  t = ka(t);
  const r = await Sa(t, "TON default seed", e);
  let i = Ui.default.sign.keyPair.fromSeed(r.slice(0, 32));
  return {
    publicKey: Buffer.from(i.publicKey),
    secretKey: Buffer.from(i.secretKey)
  };
}
Ge.mnemonicToPrivateKey = Mi;
async function cl(t, e) {
  let i = (await Mi(t, e)).secretKey.slice(0, 32);
  const u = Ui.default.sign.keyPair.fromSeed(i);
  return {
    publicKey: Buffer.from(u.publicKey),
    secretKey: Buffer.from(u.secretKey)
  };
}
Ge.mnemonicToWalletKey = cl;
async function dl(t, e) {
  return t = ka(t), await Sa(t, "TON HD Keys seed", e);
}
Ge.mnemonicToHDSeed = dl;
async function ji(t, e) {
  t = ka(t);
  for (let r of t)
    if (Bn.wordlist.indexOf(r) < 0)
      return !1;
  return e && e.length > 0 && !await Ti(t) ? !1 : await Ba(await gn(t, e));
}
Ge.mnemonicValidate = ji;
async function fl(t = 24, e) {
  let r = [];
  for (; ; ) {
    r = [];
    for (let i = 0; i < t; i++) {
      let u = await (0, sl.getSecureRandomNumber)(0, Bn.wordlist.length);
      r.push(Bn.wordlist[u]);
    }
    if (!(e && e.length > 0 && !await Ti(r)) && await Ba(await gn(r, e)))
      break;
  }
  return r;
}
Ge.mnemonicNew = fl;
function Ii(t, e) {
  let r = (0, fa.bytesToBits)(t), i = [];
  for (let u = 0; u < e; u++) {
    let f = r.slice(u * 11, u * 11 + 11);
    i.push(parseInt(f, 2));
  }
  return i;
}
Ge.bytesToMnemonicIndexes = Ii;
function Ri(t, e) {
  let r = Ii(t, e), i = [];
  for (let u of r)
    i.push(Bn.wordlist[u]);
  return i;
}
Ge.bytesToMnemonics = Ri;
function hl(t) {
  let e = "";
  for (let r of t) {
    if (!Number.isSafeInteger(r) || r < 0 || r >= 2028)
      throw Error("Invalid input");
    e += (0, fa.lpad)(r.toString(2), "0", 11);
  }
  for (; e.length % 8 !== 0; )
    e = e + "0";
  return (0, fa.bitsToBytes)(e);
}
Ge.mnemonicIndexesToBytes = hl;
async function gl(t, e = 24, r) {
  const i = Math.ceil(e * 11 / 8);
  let u = t;
  for (; ; ) {
    let f = await (0, Kn.pbkdf2_sha512)(u, "TON mnemonic seed", Math.max(1, Math.floor(_a / 256)), i), o = Ri(f, e);
    if (await ji(o, r))
      return o;
    u = f;
  }
}
Ge.mnemonicFromRandomSeed = gl;
var ft = {}, pl = Ke && Ke.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.openBox = ft.sealBox = ft.signVerify = ft.sign = ft.keyPairFromSeed = ft.keyPairFromSecretKey = void 0;
const Wr = pl(Ci);
function ml(t) {
  let e = Wr.default.sign.keyPair.fromSecretKey(new Uint8Array(t));
  return {
    publicKey: Buffer.from(e.publicKey),
    secretKey: Buffer.from(e.secretKey)
  };
}
ft.keyPairFromSecretKey = ml;
function yl(t) {
  let e = Wr.default.sign.keyPair.fromSeed(new Uint8Array(t));
  return {
    publicKey: Buffer.from(e.publicKey),
    secretKey: Buffer.from(e.secretKey)
  };
}
ft.keyPairFromSeed = yl;
function bl(t, e) {
  return Buffer.from(Wr.default.sign.detached(new Uint8Array(t), new Uint8Array(e)));
}
ft.sign = bl;
function vl(t, e, r) {
  return Wr.default.sign.detached.verify(new Uint8Array(t), new Uint8Array(e), new Uint8Array(r));
}
ft.signVerify = vl;
function wl(t, e, r) {
  return Buffer.from(Wr.default.secretbox(t, e, r));
}
ft.sealBox = wl;
function xl(t, e, r) {
  let i = Wr.default.secretbox.open(t, e, r);
  return i ? Buffer.from(i) : null;
}
ft.openBox = xl;
var Ht = {};
Object.defineProperty(Ht, "__esModule", { value: !0 });
Ht.deriveEd25519Path = Ht.deriveED25519HardenedKey = Ht.getED25519MasterKeyFromSeed = void 0;
const Oi = Pt, _l = "ed25519 seed", Va = 2147483648;
async function zi(t) {
  const e = await (0, Oi.hmac_sha512)(_l, t), r = e.slice(0, 32), i = e.slice(32);
  return {
    key: r,
    chainCode: i
  };
}
Ht.getED25519MasterKeyFromSeed = zi;
async function Ni(t, e) {
  if (e >= Va)
    throw Error("Key index must be less than offset");
  const r = Buffer.alloc(4);
  r.writeUInt32BE(e + Va, 0);
  const i = Buffer.concat([Buffer.alloc(1, 0), t.key, r]), u = await (0, Oi.hmac_sha512)(t.chainCode, i), f = u.slice(0, 32), o = u.slice(32);
  return {
    key: f,
    chainCode: o
  };
}
Ht.deriveED25519HardenedKey = Ni;
async function kl(t, e) {
  let r = await zi(t), i = [...e];
  for (; i.length > 0; ) {
    let u = i[0];
    i = i.slice(1), r = await Ni(r, u);
  }
  return r.key;
}
Ht.deriveEd25519Path = kl;
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.deriveSymmetricPath = Vt.deriveSymmetricHardenedKey = Vt.getSymmetricMasterKeyFromSeed = void 0;
const qi = Pt, Bl = "Symmetric key seed";
async function Di(t) {
  const e = await (0, qi.hmac_sha512)(Bl, t), r = e.slice(32), i = e.slice(0, 32);
  return {
    key: r,
    chainCode: i
  };
}
Vt.getSymmetricMasterKeyFromSeed = Di;
async function $i(t, e) {
  const r = Buffer.concat([Buffer.alloc(1, 0), Buffer.from(e)]), i = await (0, qi.hmac_sha512)(t.chainCode, r), u = i.slice(32), f = i.slice(0, 32);
  return {
    key: u,
    chainCode: f
  };
}
Vt.deriveSymmetricHardenedKey = $i;
async function Sl(t, e) {
  let r = await Di(t), i = [...e];
  for (; i.length > 0; ) {
    let u = i[0];
    i = i.slice(1), r = await $i(r, u);
  }
  return r.key;
}
Vt.deriveSymmetricPath = Sl;
var Gt = {};
Object.defineProperty(Gt, "__esModule", { value: !0 });
Gt.deriveMnemonicsPath = Gt.deriveMnemonicHardenedKey = Gt.getMnemonicsMasterKeyFromSeed = void 0;
const Pl = Ge, Li = Pt, Ga = 2147483648, Al = "TON Mnemonics HD seed";
async function Fi(t) {
  const e = await (0, Li.hmac_sha512)(Al, t), r = e.slice(0, 32), i = e.slice(32);
  return {
    key: r,
    chainCode: i
  };
}
Gt.getMnemonicsMasterKeyFromSeed = Fi;
async function Ki(t, e) {
  if (e >= Ga)
    throw Error("Key index must be less than offset");
  const r = Buffer.alloc(4);
  r.writeUInt32BE(e + Ga, 0);
  const i = Buffer.concat([Buffer.alloc(1, 0), t.key, r]), u = await (0, Li.hmac_sha512)(t.chainCode, i), f = u.slice(0, 32), o = u.slice(32);
  return {
    key: f,
    chainCode: o
  };
}
Gt.deriveMnemonicHardenedKey = Ki;
async function Cl(t, e, r = 24, i) {
  let u = await Fi(t), f = [...e];
  for (; f.length > 0; ) {
    let o = f[0];
    f = f.slice(1), u = await Ki(u, o);
  }
  return await (0, Pl.mnemonicFromRandomSeed)(u.key, r, i);
}
Gt.deriveMnemonicsPath = Cl;
var Ya;
function Pa() {
  return Ya || (Ya = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.getMnemonicsMasterKeyFromSeed = t.deriveMnemonicHardenedKey = t.deriveMnemonicsPath = t.deriveSymmetricPath = t.deriveSymmetricHardenedKey = t.getSymmetricMasterKeyFromSeed = t.deriveEd25519Path = t.deriveED25519HardenedKey = t.getED25519MasterKeyFromSeed = t.signVerify = t.sign = t.keyPairFromSecretKey = t.keyPairFromSeed = t.openBox = t.sealBox = t.mnemonicWordList = t.mnemonicToHDSeed = t.mnemonicToSeed = t.mnemonicToWalletKey = t.mnemonicToPrivateKey = t.mnemonicValidate = t.mnemonicNew = t.newSecurePassphrase = t.newSecureWords = t.getSecureRandomNumber = t.getSecureRandomWords = t.getSecureRandomBytes = t.hmac_sha512 = t.pbkdf2_sha512 = t.sha512_sync = t.sha512 = t.sha256_sync = t.sha256 = void 0;
    var e = Lt;
    Object.defineProperty(t, "sha256", { enumerable: !0, get: function() {
      return e.sha256;
    } }), Object.defineProperty(t, "sha256_sync", { enumerable: !0, get: function() {
      return e.sha256_sync;
    } });
    var r = Ft;
    Object.defineProperty(t, "sha512", { enumerable: !0, get: function() {
      return r.sha512;
    } }), Object.defineProperty(t, "sha512_sync", { enumerable: !0, get: function() {
      return r.sha512_sync;
    } });
    var i = fn;
    Object.defineProperty(t, "pbkdf2_sha512", { enumerable: !0, get: function() {
      return i.pbkdf2_sha512;
    } });
    var u = Pt;
    Object.defineProperty(t, "hmac_sha512", { enumerable: !0, get: function() {
      return u.hmac_sha512;
    } });
    var f = St;
    Object.defineProperty(t, "getSecureRandomBytes", { enumerable: !0, get: function() {
      return f.getSecureRandomBytes;
    } }), Object.defineProperty(t, "getSecureRandomWords", { enumerable: !0, get: function() {
      return f.getSecureRandomWords;
    } }), Object.defineProperty(t, "getSecureRandomNumber", { enumerable: !0, get: function() {
      return f.getSecureRandomNumber;
    } });
    var o = Ln;
    Object.defineProperty(t, "newSecureWords", { enumerable: !0, get: function() {
      return o.newSecureWords;
    } });
    var h = Zs();
    Object.defineProperty(t, "newSecurePassphrase", { enumerable: !0, get: function() {
      return h.newSecurePassphrase;
    } });
    var m = Ge;
    Object.defineProperty(t, "mnemonicNew", { enumerable: !0, get: function() {
      return m.mnemonicNew;
    } }), Object.defineProperty(t, "mnemonicValidate", { enumerable: !0, get: function() {
      return m.mnemonicValidate;
    } }), Object.defineProperty(t, "mnemonicToPrivateKey", { enumerable: !0, get: function() {
      return m.mnemonicToPrivateKey;
    } }), Object.defineProperty(t, "mnemonicToWalletKey", { enumerable: !0, get: function() {
      return m.mnemonicToWalletKey;
    } }), Object.defineProperty(t, "mnemonicToSeed", { enumerable: !0, get: function() {
      return m.mnemonicToSeed;
    } }), Object.defineProperty(t, "mnemonicToHDSeed", { enumerable: !0, get: function() {
      return m.mnemonicToHDSeed;
    } });
    var k = hn;
    Object.defineProperty(t, "mnemonicWordList", { enumerable: !0, get: function() {
      return k.wordlist;
    } });
    var P = ft;
    Object.defineProperty(t, "sealBox", { enumerable: !0, get: function() {
      return P.sealBox;
    } }), Object.defineProperty(t, "openBox", { enumerable: !0, get: function() {
      return P.openBox;
    } });
    var E = ft;
    Object.defineProperty(t, "keyPairFromSeed", { enumerable: !0, get: function() {
      return E.keyPairFromSeed;
    } }), Object.defineProperty(t, "keyPairFromSecretKey", { enumerable: !0, get: function() {
      return E.keyPairFromSecretKey;
    } }), Object.defineProperty(t, "sign", { enumerable: !0, get: function() {
      return E.sign;
    } }), Object.defineProperty(t, "signVerify", { enumerable: !0, get: function() {
      return E.signVerify;
    } });
    var $ = Ht;
    Object.defineProperty(t, "getED25519MasterKeyFromSeed", { enumerable: !0, get: function() {
      return $.getED25519MasterKeyFromSeed;
    } }), Object.defineProperty(t, "deriveED25519HardenedKey", { enumerable: !0, get: function() {
      return $.deriveED25519HardenedKey;
    } }), Object.defineProperty(t, "deriveEd25519Path", { enumerable: !0, get: function() {
      return $.deriveEd25519Path;
    } });
    var L = Vt;
    Object.defineProperty(t, "getSymmetricMasterKeyFromSeed", { enumerable: !0, get: function() {
      return L.getSymmetricMasterKeyFromSeed;
    } }), Object.defineProperty(t, "deriveSymmetricHardenedKey", { enumerable: !0, get: function() {
      return L.deriveSymmetricHardenedKey;
    } }), Object.defineProperty(t, "deriveSymmetricPath", { enumerable: !0, get: function() {
      return L.deriveSymmetricPath;
    } });
    var ee = Gt;
    Object.defineProperty(t, "deriveMnemonicsPath", { enumerable: !0, get: function() {
      return ee.deriveMnemonicsPath;
    } }), Object.defineProperty(t, "deriveMnemonicHardenedKey", { enumerable: !0, get: function() {
      return ee.deriveMnemonicHardenedKey;
    } }), Object.defineProperty(t, "getMnemonicsMasterKeyFromSeed", { enumerable: !0, get: function() {
      return ee.getMnemonicsMasterKeyFromSeed;
    } });
  }(ta)), ta;
}
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.wonderCalculator = void 0;
const El = Jt(), kt = Fr, sn = Gr, Ul = Vr, Tl = Kr, Ml = jt, jl = Pa(), Il = Hr, Rl = dn;
function Ol(t, e, r) {
  let i, u = null;
  if (t === kt.CellType.Ordinary) {
    let $ = 0;
    for (let L of r)
      $ = $ | L.mask.value;
    i = new sn.LevelMask($);
  } else if (t === kt.CellType.PrunedBranch)
    u = (0, Ul.exoticPruned)(e, r), i = new sn.LevelMask(u.mask);
  else if (t === kt.CellType.MerkleProof)
    (0, Tl.exoticMerkleProof)(e, r), i = new sn.LevelMask(r[0].mask.value >> 1);
  else if (t === kt.CellType.MerkleUpdate)
    (0, Il.exoticMerkleUpdate)(e, r), i = new sn.LevelMask((r[0].mask.value | r[1].mask.value) >> 1);
  else if (t === kt.CellType.Library)
    (0, Rl.exoticLibrary)(e, r), i = new sn.LevelMask();
  else
    throw new Error("Unsupported exotic type");
  let f = [], o = [], h = t === kt.CellType.PrunedBranch ? 1 : i.hashCount, k = i.hashCount - h;
  for (let $ = 0, L = 0; $ <= i.level; $++) {
    if (!i.isSignificant($))
      continue;
    if (L < k) {
      L++;
      continue;
    }
    let ee;
    if (L === k) {
      if (!($ === 0 || t === kt.CellType.PrunedBranch))
        throw Error("Invalid");
      ee = e;
    } else {
      if (!($ !== 0 && t !== kt.CellType.PrunedBranch))
        throw Error("Invalid: " + $ + ", " + t);
      ee = new El.BitString(o[L - k - 1], 0, 256);
    }
    let ae = 0;
    for (let O of r) {
      let T;
      t == kt.CellType.MerkleProof || t == kt.CellType.MerkleUpdate ? T = O.depth($ + 1) : T = O.depth($), ae = Math.max(ae, T);
    }
    r.length > 0 && ae++;
    let fe = (0, Ml.getRepr)(e, ee, r, $, t), X = (0, jl.sha256_sync)(fe), Y = L - k;
    f[Y] = ae, o[Y] = X, L++;
  }
  let P = [], E = [];
  if (u)
    for (let $ = 0; $ < 4; $++) {
      const { hashIndex: L } = i.apply($), { hashIndex: ee } = i;
      L !== ee ? (P.push(u.pruned[L].hash), E.push(u.pruned[L].depth)) : (P.push(o[0]), E.push(f[0]));
    }
  else
    for (let $ = 0; $ < 4; $++)
      P.push(o[i.apply($).hashIndex]), E.push(f[i.apply($).hashIndex]);
  return {
    mask: i,
    hashes: P,
    depths: E
  };
}
zn.wonderCalculator = Ol;
var Tt = {}, Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.topologicalSort = void 0;
function zl(t) {
  let e = [t], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set(), u = [];
  for (; e.length > 0; ) {
    const k = [...e];
    e = [];
    for (let P of k) {
      const E = P.hash().toString("hex");
      if (!r.has(E)) {
        i.add(E), r.set(E, { cell: P, refs: P.refs.map(($) => $.hash().toString("hex")) });
        for (let $ of P.refs)
          e.push($);
      }
    }
  }
  let f = /* @__PURE__ */ new Set();
  function o(k) {
    if (!i.has(k))
      return;
    if (f.has(k))
      throw Error("Not a DAG");
    f.add(k);
    let P = r.get(k).refs;
    for (let E = P.length - 1; E >= 0; E--)
      o(P[E]);
    u.push(k), f.delete(k), i.delete(k);
  }
  for (; i.size > 0; ) {
    const k = Array.from(i)[0];
    o(k);
  }
  let h = /* @__PURE__ */ new Map();
  for (let k = 0; k < u.length; k++)
    h.set(u[u.length - k - 1], k);
  let m = [];
  for (let k = u.length - 1; k >= 0; k--) {
    let P = u[k];
    const E = r.get(P);
    m.push({ cell: E.cell, refs: E.refs.map(($) => h.get($)) });
  }
  return m;
}
Hn.topologicalSort = zl;
var Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.bitsForNumber = void 0;
function Nl(t, e) {
  let r = BigInt(t);
  if (e === "int")
    return r === 0n || r === -1n ? 1 : (r > 0 ? r : -r).toString(2).length + 1;
  if (e === "uint") {
    if (r < 0)
      throw Error(`value is negative. Got ${t}`);
    return r.toString(2).length;
  } else
    throw Error(`invalid mode. Got ${e}`);
}
Vn.bitsForNumber = Nl;
var pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.crc32c = void 0;
const qt = 2197175160;
function ql(t) {
  let e = -1;
  for (let i = 0; i < t.length; i++)
    e ^= t[i], e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1, e = e & 1 ? e >>> 1 ^ qt : e >>> 1;
  e = e ^ 4294967295;
  let r = Buffer.alloc(4);
  return r.writeInt32LE(e), r;
}
pn.crc32c = ql;
var Wa;
function Dl() {
  if (Wa) return Tt;
  Wa = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt.serializeBoc = Tt.deserializeBoc = Tt.parseBoc = void 0;
  const t = xt, e = Jt(), r = Cr(), i = Hn, u = Vn, f = Un(), o = jt, h = En(), m = pn;
  function k(X) {
    return P(X & 7);
  }
  function P(X) {
    let Y = 0;
    for (let O = 0; O < 3; O++)
      Y += X & 1, X = X >> 1;
    return Y + 1;
  }
  function E(X, Y) {
    const O = X.loadUint(8), T = O % 8, W = !!(O & 8), H = X.loadUint(8), ie = Math.ceil(H / 2), Me = !!(H % 2), Pe = O >> 5, Fe = (O & 16) != 0, He = Fe ? k(Pe) * 32 : 0, U = Fe ? k(Pe) * 2 : 0;
    X.skip(He * 8), X.skip(U * 8);
    let S = e.BitString.EMPTY;
    ie > 0 && (Me ? S = X.loadPaddedBits(ie * 8) : S = X.loadBits(ie * 8));
    let Z = [];
    for (let le = 0; le < T; le++)
      Z.push(X.loadUint(Y * 8));
    return {
      bits: S,
      refs: Z,
      exotic: W
    };
  }
  function $(X, Y) {
    return 2 + Math.ceil(X.bits.length / 8) + X.refs.length * Y;
  }
  function L(X) {
    let Y = new t.BitReader(new e.BitString(X, 0, X.length * 8)), O = Y.loadUint(32);
    if (O === 1761568243) {
      let T = Y.loadUint(8), W = Y.loadUint(8), H = Y.loadUint(T * 8), ie = Y.loadUint(T * 8), Me = Y.loadUint(T * 8), Pe = Y.loadUint(W * 8), Fe = Y.loadBuffer(H * W), Ye = Y.loadBuffer(Pe);
      return {
        size: T,
        offBytes: W,
        cells: H,
        roots: ie,
        absent: Me,
        totalCellSize: Pe,
        index: Fe,
        cellData: Ye,
        root: [0]
      };
    } else if (O === 2898503464) {
      let T = Y.loadUint(8), W = Y.loadUint(8), H = Y.loadUint(T * 8), ie = Y.loadUint(T * 8), Me = Y.loadUint(T * 8), Pe = Y.loadUint(W * 8), Fe = Y.loadBuffer(H * W), Ye = Y.loadBuffer(Pe), He = Y.loadBuffer(4);
      if (!(0, m.crc32c)(X.subarray(0, X.length - 4)).equals(He))
        throw Error("Invalid CRC32C");
      return {
        size: T,
        offBytes: W,
        cells: H,
        roots: ie,
        absent: Me,
        totalCellSize: Pe,
        index: Fe,
        cellData: Ye,
        root: [0]
      };
    } else if (O === 3052313714) {
      let T = Y.loadUint(1), W = Y.loadUint(1);
      Y.loadUint(1), Y.loadUint(2);
      let H = Y.loadUint(3), ie = Y.loadUint(8), Me = Y.loadUint(H * 8), Pe = Y.loadUint(H * 8), Fe = Y.loadUint(H * 8), Ye = Y.loadUint(ie * 8), He = [];
      for (let Z = 0; Z < Pe; Z++)
        He.push(Y.loadUint(H * 8));
      let U = null;
      T && (U = Y.loadBuffer(Me * ie));
      let S = Y.loadBuffer(Ye);
      if (W) {
        let Z = Y.loadBuffer(4);
        if (!(0, m.crc32c)(X.subarray(0, X.length - 4)).equals(Z))
          throw Error("Invalid CRC32C");
      }
      return {
        size: H,
        offBytes: ie,
        cells: Me,
        roots: Pe,
        absent: Fe,
        totalCellSize: Ye,
        index: U,
        cellData: S,
        root: He
      };
    } else
      throw Error("Invalid magic");
  }
  Tt.parseBoc = L;
  function ee(X) {
    let Y = L(X), O = new t.BitReader(new e.BitString(Y.cellData, 0, Y.cellData.length * 8)), T = [];
    for (let H = 0; H < Y.cells; H++) {
      let ie = E(O, Y.size);
      T.push({ ...ie, result: null });
    }
    for (let H = T.length - 1; H >= 0; H--) {
      if (T[H].result)
        throw Error("Impossible");
      let ie = [];
      for (let Me of T[H].refs) {
        if (!T[Me].result)
          throw Error("Invalid BOC file");
        ie.push(T[Me].result);
      }
      T[H].result = new r.Cell({ bits: T[H].bits, refs: ie, exotic: T[H].exotic });
    }
    let W = [];
    for (let H = 0; H < Y.root.length; H++)
      W.push(T[Y.root[H]].result);
    return W;
  }
  Tt.deserializeBoc = ee;
  function ae(X, Y, O, T) {
    let W = (0, o.getRefsDescriptor)(X.refs, X.level(), X.type), H = (0, o.getBitsDescriptor)(X.bits);
    T.writeUint(W, 8), T.writeUint(H, 8), T.writeBuffer((0, h.bitsToPaddedBuffer)(X.bits));
    for (let ie of Y)
      T.writeUint(ie, O * 8);
  }
  function fe(X, Y) {
    let O = (0, i.topologicalSort)(X), T = O.length, W = Y.idx, H = Y.crc32, ie = !1, Me = 0, Pe = Math.max(Math.ceil((0, u.bitsForNumber)(T, "uint") / 8), 1), Fe = 0, Ye = [];
    for (let le of O) {
      let Ae = $(le.cell, Pe);
      Fe += Ae, Ye.push(Fe);
    }
    let He = Math.max(Math.ceil((0, u.bitsForNumber)(Fe, "uint") / 8), 1), U = (6 + // offset_bytes
    3 * Pe + // cells_num, roots, complete
    He + // full_size
    1 * Pe + // root_idx
    (W ? T * He : 0) + Fe + (H ? 4 : 0)) * 8, S = new f.BitBuilder(U);
    if (S.writeUint(3052313714, 32), S.writeBit(W), S.writeBit(H), S.writeBit(ie), S.writeUint(Me, 2), S.writeUint(Pe, 3), S.writeUint(He, 8), S.writeUint(T, Pe * 8), S.writeUint(1, Pe * 8), S.writeUint(0, Pe * 8), S.writeUint(Fe, He * 8), S.writeUint(0, Pe * 8), W)
      for (let le = 0; le < T; le++)
        S.writeUint(Ye[le], He * 8);
    for (let le = 0; le < T; le++)
      ae(O[le].cell, O[le].refs, Pe, S);
    if (H) {
      let le = (0, m.crc32c)(S.buffer());
      S.writeBuffer(le);
    }
    let Z = S.buffer();
    if (Z.length !== U / 8)
      throw Error("Internal error");
    return Z;
  }
  return Tt.serializeBoc = fe, Tt;
}
var Xa;
function Cr() {
  if (Xa) return en;
  Xa = 1;
  var t = Ke && Ke.__importDefault || function($) {
    return $ && $.__esModule ? $ : { default: $ };
  }, e;
  Object.defineProperty(en, "__esModule", { value: !0 }), en.Cell = void 0;
  const r = t(Dr), i = Jt(), u = Fr, f = ba(), o = In, h = zn, m = Dl(), k = xt, P = it();
  let E = class Hi {
    /**
     * Deserialize cells from BOC
     * @param src source buffer
     * @returns array of cells
     */
    static fromBoc(L) {
      return (0, m.deserializeBoc)(L);
    }
    /**
     * Helper class that deserializes a single cell from BOC in base64
     * @param src source string
     */
    static fromBase64(L) {
      let ee = Hi.fromBoc(Buffer.from(L, "base64"));
      if (ee.length !== 1)
        throw new Error("Deserialized more than one cell");
      return ee[0];
    }
    constructor(L) {
      this._hashes = [], this._depths = [], this.beginParse = (T = !1) => {
        if (this.isExotic && !T)
          throw new Error("Exotic cells cannot be parsed");
        return new f.Slice(new k.BitReader(this.bits), this.refs);
      }, this.hash = (T = 3) => this._hashes[Math.min(this._hashes.length - 1, T)], this.depth = (T = 3) => this._depths[Math.min(this._depths.length - 1, T)], this.level = () => this.mask.level, this.equals = (T) => this.hash().equals(T.hash()), this[e] = () => this.toString();
      let ee = i.BitString.EMPTY;
      L && L.bits && (ee = L.bits);
      let ae = [];
      L && L.refs && (ae = [...L.refs]);
      let fe, X, Y, O = u.CellType.Ordinary;
      if (L && L.exotic) {
        let T = (0, o.resolveExotic)(ee, ae), W = (0, h.wonderCalculator)(T.type, ee, ae);
        Y = W.mask, X = W.depths, fe = W.hashes, O = T.type;
      } else {
        if (ae.length > 4)
          throw new Error("Invalid number of references");
        if (ee.length > 1023)
          throw new Error(`Bits overflow: ${ee.length} > 1023`);
        let T = (0, h.wonderCalculator)(u.CellType.Ordinary, ee, ae);
        Y = T.mask, X = T.depths, fe = T.hashes, O = u.CellType.Ordinary;
      }
      this.type = O, this.bits = ee, this.refs = ae, this.mask = Y, this._depths = X, this._hashes = fe, Object.freeze(this), Object.freeze(this.refs), Object.freeze(this.bits), Object.freeze(this.mask), Object.freeze(this._depths), Object.freeze(this._hashes);
    }
    /**
     * Check if cell is exotic
     */
    get isExotic() {
      return this.type !== u.CellType.Ordinary;
    }
    /**
     * Serializes cell to BOC
     * @param opts options
     */
    toBoc(L) {
      let ee = L && L.idx !== null && L.idx !== void 0 ? L.idx : !1, ae = L && L.crc32 !== null && L.crc32 !== void 0 ? L.crc32 : !0;
      return (0, m.serializeBoc)(this, { idx: ee, crc32: ae });
    }
    /**
     * Format cell to string
     * @param indent indentation
     * @returns string representation
     */
    toString(L) {
      let ee = L || "", ae = "x";
      this.isExotic && (this.type === u.CellType.MerkleProof ? ae = "p" : this.type === u.CellType.MerkleUpdate ? ae = "u" : this.type === u.CellType.PrunedBranch && (ae = "p"));
      let fe = ee + (this.isExotic ? ae : "x") + "{" + this.bits.toString() + "}";
      for (let X in this.refs) {
        const Y = this.refs[X];
        fe += `
` + Y.toString(ee + " ");
      }
      return fe;
    }
    /**
     * Covnert cell to slice
     * @returns slice
     */
    asSlice() {
      return this.beginParse();
    }
    /**
     * Convert cell to a builder that has this cell stored
     * @returns builder
     */
    asBuilder() {
      return (0, P.beginCell)().storeSlice(this.asSlice());
    }
  };
  return en.Cell = E, e = r.default, E.EMPTY = new E(), en;
}
var Ja;
function it() {
  if (Ja) return er;
  Ja = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.Builder = er.beginCell = void 0;
  const t = Un(), e = Cr(), r = vi();
  function i() {
    return new u();
  }
  er.beginCell = i;
  let u = class Vi {
    constructor() {
      this._bits = new t.BitBuilder(), this._refs = [];
    }
    /**
     * Bits written so far
     */
    get bits() {
      return this._bits.length;
    }
    /**
     * References written so far
     */
    get refs() {
      return this._refs.length;
    }
    /**
     * Available bits
     */
    get availableBits() {
      return 1023 - this.bits;
    }
    /**
     * Available references
     */
    get availableRefs() {
      return 4 - this.refs;
    }
    /**
     * Write a single bit
     * @param value bit to write, true or positive number for 1, false or zero or negative for 0
     * @returns this builder
     */
    storeBit(o) {
      return this._bits.writeBit(o), this;
    }
    /**
     * Write bits from BitString
     * @param src source bits
     * @returns this builder
     */
    storeBits(o) {
      return this._bits.writeBits(o), this;
    }
    /**
     * Store Buffer
     * @param src source buffer
     * @param bytes optional number of bytes to write
     * @returns this builder
     */
    storeBuffer(o, h) {
      if (h != null && o.length !== h)
        throw Error(`Buffer length ${o.length} is not equal to ${h}`);
      return this._bits.writeBuffer(o), this;
    }
    /**
     * Store Maybe Buffer
     * @param src source buffer or null
     * @param bytes optional number of bytes to write
     * @returns this builder
     */
    storeMaybeBuffer(o, h) {
      return o !== null ? (this.storeBit(1), this.storeBuffer(o, h)) : this.storeBit(0), this;
    }
    /**
     * Store uint value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeUint(o, h) {
      return this._bits.writeUint(o, h), this;
    }
    /**
     * Store maybe uint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write
     * @returns this builder
     */
    storeMaybeUint(o, h) {
      return o != null ? (this.storeBit(1), this.storeUint(o, h)) : this.storeBit(0), this;
    }
    /**
     * Store int value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeInt(o, h) {
      return this._bits.writeInt(o, h), this;
    }
    /**
     * Store maybe int value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write
     * @returns this builder
     */
    storeMaybeInt(o, h) {
      return o != null ? (this.storeBit(1), this.storeInt(o, h)) : this.storeBit(0), this;
    }
    /**
     * Store varuint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarUint(o, h) {
      return this._bits.writeVarUint(o, h), this;
    }
    /**
     * Store maybe varuint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeMaybeVarUint(o, h) {
      return o != null ? (this.storeBit(1), this.storeVarUint(o, h)) : this.storeBit(0), this;
    }
    /**
     * Store varint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarInt(o, h) {
      return this._bits.writeVarInt(o, h), this;
    }
    /**
     * Store maybe varint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeMaybeVarInt(o, h) {
      return o != null ? (this.storeBit(1), this.storeVarInt(o, h)) : this.storeBit(0), this;
    }
    /**
     * Store coins value
     * @param amount amount of coins
     * @returns this builder
     */
    storeCoins(o) {
      return this._bits.writeCoins(o), this;
    }
    /**
     * Store maybe coins value
     * @param amount amount of coins, null or undefined
     * @returns this builder
     */
    storeMaybeCoins(o) {
      return o != null ? (this.storeBit(1), this.storeCoins(o)) : this.storeBit(0), this;
    }
    /**
     * Store address
     * @param addres address to store
     * @returns this builder
     */
    storeAddress(o) {
      return this._bits.writeAddress(o), this;
    }
    /**
     * Store reference
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeRef(o) {
      if (this._refs.length >= 4)
        throw new Error("Too many references");
      if (o instanceof e.Cell)
        this._refs.push(o);
      else if (o instanceof Vi)
        this._refs.push(o.endCell());
      else
        throw new Error("Invalid argument");
      return this;
    }
    /**
     * Store reference if not null
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeMaybeRef(o) {
      return o ? (this.storeBit(1), this.storeRef(o)) : this.storeBit(0), this;
    }
    /**
     * Store slice it in this builder
     * @param src source slice
     */
    storeSlice(o) {
      let h = o.clone();
      for (h.remainingBits > 0 && this.storeBits(h.loadBits(h.remainingBits)); h.remainingRefs > 0; )
        this.storeRef(h.loadRef());
      return this;
    }
    /**
     * Store slice in this builder if not null
     * @param src source slice
     */
    storeMaybeSlice(o) {
      return o ? (this.storeBit(1), this.storeSlice(o)) : this.storeBit(0), this;
    }
    /**
     * Store builder
     * @param src builder to store
     * @returns this builder
     */
    storeBuilder(o) {
      return this.storeSlice(o.endCell().beginParse());
    }
    /**
     * Store builder if not null
     * @param src builder to store
     * @returns this builder
     */
    storeMaybeBuilder(o) {
      return o ? (this.storeBit(1), this.storeBuilder(o)) : this.storeBit(0), this;
    }
    /**
     * Store writer or builder
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeWritable(o) {
      return typeof o == "object" ? o.writeTo(this) : o(this), this;
    }
    /**
     * Store writer or builder if not null
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeMaybeWritable(o) {
      return o ? (this.storeBit(1), this.storeWritable(o)) : this.storeBit(0), this;
    }
    /**
     * Store object in this builder
     * @param writer Writable or writer functuin
     */
    store(o) {
      return this.storeWritable(o), this;
    }
    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeStringTail(o) {
      return (0, r.writeString)(o, this), this;
    }
    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringTail(o) {
      return o != null ? (this.storeBit(1), (0, r.writeString)(o, this)) : this.storeBit(0), this;
    }
    /**
     * Store string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeStringRefTail(o) {
      return this.storeRef(i().storeStringTail(o)), this;
    }
    /**
     * Store maybe string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringRefTail(o) {
      return o != null ? (this.storeBit(1), this.storeStringRefTail(o)) : this.storeBit(0), this;
    }
    /**
     * Store dictionary in this builder
     * @param dict dictionary to store
     * @returns this builder
     */
    storeDict(o, h, m) {
      return o ? o.store(this, h, m) : this.storeBit(0), this;
    }
    /**
     * Store dictionary in this builder directly
     * @param dict dictionary to store
     * @returns this builder
     */
    storeDictDirect(o, h, m) {
      return o.storeDirect(this, h, m), this;
    }
    /**
     * Complete cell
     * @param opts options
     * @returns cell
     */
    endCell(o) {
      return new e.Cell({
        bits: this._bits.build(),
        refs: this._refs,
        exotic: o == null ? void 0 : o.exotic
      });
    }
    /**
     * Convert to cell
     * @returns cell
     */
    asCell() {
      return this.endCell();
    }
    /**
     * Convert to slice
     * @returns slice
     */
    asSlice() {
      return this.endCell().beginParse();
    }
  };
  return er.Builder = u, er;
}
var At = {}, It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.SimpleLibraryValue = It.storeSimpleLibrary = It.loadSimpleLibrary = void 0;
function Gi(t) {
  return {
    public: t.loadBit(),
    root: t.loadRef()
  };
}
It.loadSimpleLibrary = Gi;
function Yi(t) {
  return (e) => {
    e.storeBit(t.public), e.storeRef(t.root);
  };
}
It.storeSimpleLibrary = Yi;
It.SimpleLibraryValue = {
  serialize(t, e) {
    Yi(t)(e);
  },
  parse(t) {
    return Gi(t);
  }
};
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.storeTickTock = ir.loadTickTock = void 0;
function $l(t) {
  return {
    tick: t.loadBit(),
    tock: t.loadBit()
  };
}
ir.loadTickTock = $l;
function Ll(t) {
  return (e) => {
    e.storeBit(t.tick), e.storeBit(t.tock);
  };
}
ir.storeTickTock = Ll;
Object.defineProperty(At, "__esModule", { value: !0 });
At.storeStateInit = At.loadStateInit = void 0;
const Fl = Ar(), Kl = It, Wi = ir;
function Hl(t) {
  let e;
  t.loadBit() && (e = t.loadUint(5));
  let r;
  t.loadBit() && (r = (0, Wi.loadTickTock)(t));
  let i = t.loadMaybeRef(), u = t.loadMaybeRef(), f = t.loadDict(Fl.Dictionary.Keys.BigUint(256), Kl.SimpleLibraryValue);
  return f.size === 0 && (f = void 0), {
    splitDepth: e,
    special: r,
    code: i,
    data: u,
    libraries: f
  };
}
At.loadStateInit = Hl;
function Vl(t) {
  return (e) => {
    t.splitDepth !== null && t.splitDepth !== void 0 ? (e.storeBit(!0), e.storeUint(t.splitDepth, 5)) : e.storeBit(!1), t.special !== null && t.special !== void 0 ? (e.storeBit(!0), e.store((0, Wi.storeTickTock)(t.special))) : e.storeBit(!1), e.storeMaybeRef(t.code), e.storeMaybeRef(t.data), e.storeDict(t.libraries);
  };
}
At.storeStateInit = Vl;
Object.defineProperty(Cn, "__esModule", { value: !0 });
Cn.contractAddress = void 0;
const Gl = it(), Yl = At, Wl = yt;
function Xl(t, e) {
  let r = (0, Gl.beginCell)().store((0, Yl.storeStateInit)(e)).endCell().hash();
  return new Wl.Address(t, r);
}
Cn.contractAddress = Xl;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.parseTuple = Nr.serializeTuple = void 0;
const cn = it(), Jl = BigInt("-9223372036854775808"), Zl = BigInt("9223372036854775807");
function Xi(t, e) {
  if (t.type === "null")
    e.storeUint(0, 8);
  else if (t.type === "int")
    t.value <= Zl && t.value >= Jl ? (e.storeUint(1, 8), e.storeInt(t.value, 64)) : (e.storeUint(256, 15), e.storeInt(t.value, 257));
  else if (t.type === "nan")
    e.storeInt(767, 16);
  else if (t.type === "cell")
    e.storeUint(3, 8), e.storeRef(t.cell);
  else if (t.type === "slice")
    e.storeUint(4, 8), e.storeUint(0, 10), e.storeUint(t.cell.bits.length, 10), e.storeUint(0, 3), e.storeUint(t.cell.refs.length, 3), e.storeRef(t.cell);
  else if (t.type === "builder")
    e.storeUint(5, 8), e.storeRef(t.cell);
  else if (t.type === "tuple") {
    let r = null, i = null;
    for (let u = 0; u < t.items.length; u++) {
      let f = r;
      r = i, i = f, u > 1 && (r = (0, cn.beginCell)().storeRef(i).storeRef(r).endCell());
      let o = (0, cn.beginCell)();
      Xi(t.items[u], o), i = o.endCell();
    }
    e.storeUint(7, 8), e.storeUint(t.items.length, 16), r && e.storeRef(r), i && e.storeRef(i);
  } else
    throw Error("Invalid value");
}
function un(t) {
  let e = t.loadUint(8);
  if (e === 0)
    return { type: "null" };
  if (e === 1)
    return { type: "int", value: t.loadIntBig(64) };
  if (e === 2)
    return t.loadUint(7) === 0 ? { type: "int", value: t.loadIntBig(257) } : (t.loadBit(), { type: "nan" });
  if (e === 3)
    return { type: "cell", cell: t.loadRef() };
  if (e === 4) {
    let r = t.loadUint(10), i = t.loadUint(10), u = t.loadUint(3), f = t.loadUint(3), o = t.loadRef().beginParse();
    o.skip(r);
    let h = o.loadBits(i - r), m = (0, cn.beginCell)().storeBits(h);
    if (u < f) {
      for (let k = 0; k < u; k++)
        o.loadRef();
      for (let k = 0; k < f - u; k++)
        m.storeRef(o.loadRef());
    }
    return { type: "slice", cell: m.endCell() };
  } else {
    if (e === 5)
      return { type: "builder", cell: t.loadRef() };
    if (e === 7) {
      let r = t.loadUint(16), i = [];
      if (r > 1) {
        let u = t.loadRef().beginParse(), f = t.loadRef().beginParse();
        i.unshift(un(f));
        for (let o = 0; o < r - 2; o++) {
          let h = u;
          u = h.loadRef().beginParse(), f = h.loadRef().beginParse(), i.unshift(un(f));
        }
        i.unshift(un(u));
      } else r === 1 && i.push(un(t.loadRef().beginParse()));
      return { type: "tuple", items: i };
    } else
      throw Error("Unsupported stack item");
  }
}
function Ji(t, e) {
  if (t.length > 0) {
    let r = (0, cn.beginCell)();
    Ji(t.slice(0, t.length - 1), r), e.storeRef(r.endCell()), Xi(t[t.length - 1], e);
  }
}
function Ql(t) {
  let e = (0, cn.beginCell)();
  e.storeUint(t.length, 24);
  let r = [...t];
  return Ji(r, e), e.endCell();
}
Nr.serializeTuple = Ql;
function eu(t) {
  let e = [], r = t.beginParse(), i = r.loadUint(24);
  for (let u = 0; u < i; u++) {
    let f = r.loadRef();
    e.unshift(un(r)), r = f.beginParse();
  }
  return e;
}
Nr.parseTuple = eu;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.TupleReader = void 0;
class Rr {
  constructor(e) {
    this.items = [...e];
  }
  get remaining() {
    return this.items.length;
  }
  peek() {
    if (this.items.length === 0)
      throw Error("EOF");
    return this.items[0];
  }
  pop() {
    if (this.items.length === 0)
      throw Error("EOF");
    let e = this.items[0];
    return this.items.splice(0, 1), e;
  }
  skip(e = 1) {
    for (let r = 0; r < e; r++)
      this.pop();
    return this;
  }
  readBigNumber() {
    let e = this.pop();
    if (e.type !== "int")
      throw Error("Not a number");
    return e.value;
  }
  readBigNumberOpt() {
    let e = this.pop();
    if (e.type === "null")
      return null;
    if (e.type !== "int")
      throw Error("Not a number");
    return e.value;
  }
  readNumber() {
    return Number(this.readBigNumber());
  }
  readNumberOpt() {
    let e = this.readBigNumberOpt();
    return e !== null ? Number(e) : null;
  }
  readBoolean() {
    return this.readNumber() !== 0;
  }
  readBooleanOpt() {
    let e = this.readNumberOpt();
    return e !== null ? e !== 0 : null;
  }
  readAddress() {
    let e = this.readCell().beginParse().loadAddress();
    if (e !== null)
      return e;
    throw Error("Not an address");
  }
  readAddressOpt() {
    let e = this.readCellOpt();
    return e !== null ? e.beginParse().loadMaybeAddress() : null;
  }
  readCell() {
    let e = this.pop();
    if (e.type !== "cell" && e.type !== "slice" && e.type !== "builder")
      throw Error("Not a cell: " + e.type);
    return e.cell;
  }
  readCellOpt() {
    let e = this.pop();
    if (e.type === "null")
      return null;
    if (e.type !== "cell" && e.type !== "slice" && e.type !== "builder")
      throw Error("Not a cell");
    return e.cell;
  }
  readTuple() {
    let e = this.pop();
    if (e.type !== "tuple")
      throw Error("Not a tuple");
    return new Rr(e.items);
  }
  readTupleOpt() {
    let e = this.pop();
    if (e.type === "null")
      return null;
    if (e.type !== "tuple")
      throw Error("Not a tuple");
    return new Rr(e.items);
  }
  static readLispList(e) {
    const r = [];
    let i = e;
    for (; i !== null; ) {
      var u = i.pop();
      if (i.items.length === 0 || i.items[0].type !== "tuple" && i.items[0].type !== "null")
        throw Error("Lisp list consists only from (any, tuple) elements and ends with null");
      i = i.readTupleOpt(), r.push(u);
    }
    return r;
  }
  readLispListDirect() {
    return this.items.length === 1 && this.items[0].type === "null" ? [] : Rr.readLispList(this);
  }
  readLispList() {
    return Rr.readLispList(this.readTupleOpt());
  }
  readBuffer() {
    let e = this.readCell().beginParse();
    if (e.remainingRefs !== 0 || e.remainingBits % 8 !== 0)
      throw Error("Not a buffer");
    return e.loadBuffer(e.remainingBits / 8);
  }
  readBufferOpt() {
    if (this.peek().type === "null")
      return null;
    let r = this.readCell().beginParse();
    if (r.remainingRefs !== 0 || r.remainingBits % 8 !== 0)
      throw Error("Not a buffer");
    return r.loadBuffer(r.remainingBits / 8);
  }
  readString() {
    return this.readCell().beginParse().loadStringTail();
  }
  readStringOpt() {
    return this.peek().type === "null" ? null : this.readCell().beginParse().loadStringTail();
  }
}
Gn.TupleReader = Rr;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.TupleBuilder = void 0;
const ra = it(), na = Cr(), aa = ba();
class tu {
  constructor() {
    this._tuple = [];
  }
  writeNumber(e) {
    e == null ? this._tuple.push({ type: "null" }) : this._tuple.push({ type: "int", value: BigInt(e) });
  }
  writeBoolean(e) {
    e == null ? this._tuple.push({ type: "null" }) : this._tuple.push({ type: "int", value: e ? -1n : 0n });
  }
  writeBuffer(e) {
    e == null ? this._tuple.push({ type: "null" }) : this._tuple.push({ type: "slice", cell: (0, ra.beginCell)().storeBuffer(e).endCell() });
  }
  writeString(e) {
    e == null ? this._tuple.push({ type: "null" }) : this._tuple.push({ type: "slice", cell: (0, ra.beginCell)().storeStringTail(e).endCell() });
  }
  writeCell(e) {
    e == null ? this._tuple.push({ type: "null" }) : e instanceof na.Cell ? this._tuple.push({ type: "cell", cell: e }) : e instanceof aa.Slice && this._tuple.push({ type: "cell", cell: e.asCell() });
  }
  writeSlice(e) {
    e == null ? this._tuple.push({ type: "null" }) : e instanceof na.Cell ? this._tuple.push({ type: "slice", cell: e }) : e instanceof aa.Slice && this._tuple.push({ type: "slice", cell: e.asCell() });
  }
  writeBuilder(e) {
    e == null ? this._tuple.push({ type: "null" }) : e instanceof na.Cell ? this._tuple.push({ type: "builder", cell: e }) : e instanceof aa.Slice && this._tuple.push({ type: "builder", cell: e.asCell() });
  }
  writeTuple(e) {
    e == null ? this._tuple.push({ type: "null" }) : this._tuple.push({ type: "tuple", items: e });
  }
  writeAddress(e) {
    e == null ? this._tuple.push({ type: "null" }) : this._tuple.push({ type: "slice", cell: (0, ra.beginCell)().storeAddress(e).endCell() });
  }
  build() {
    return [...this._tuple];
  }
}
Yn.TupleBuilder = tu;
var Zi = {}, Yt = {}, or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.fromNano = or.toNano = void 0;
function ru(t) {
  if (typeof t == "bigint")
    return t * 1000000000n;
  {
    if (typeof t == "number") {
      if (!Number.isFinite(t))
        throw Error("Invalid number");
      if (Math.log10(t) <= 6)
        t = t.toLocaleString("en", { minimumFractionDigits: 9, useGrouping: !1 });
      else if (t - Math.trunc(t) === 0)
        t = t.toLocaleString("en", { maximumFractionDigits: 0, useGrouping: !1 });
      else
        throw Error("Not enough precision for a number value. Use string value instead");
    }
    let e = !1;
    for (; t.startsWith("-"); )
      e = !e, t = t.slice(1);
    if (t === ".")
      throw Error("Invalid number");
    let r = t.split(".");
    if (r.length > 2)
      throw Error("Invalid number");
    let i = r[0], u = r[1];
    if (i || (i = "0"), u || (u = "0"), u.length > 9)
      throw Error("Invalid number");
    for (; u.length < 9; )
      u += "0";
    let f = BigInt(i) * 1000000000n + BigInt(u);
    return e && (f = -f), f;
  }
}
or.toNano = ru;
function nu(t) {
  let e = BigInt(t), r = !1;
  e < 0 && (r = !0, e = -e);
  let u = (e % 1000000000n).toString();
  for (; u.length < 9; )
    u = "0" + u;
  u = u.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  let h = `${(e / 1000000000n).toString()}${u === "0" ? "" : `.${u}`}`;
  return r && (h = "-" + h), h;
}
or.fromNano = nu;
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.comment = Yt.external = Yt.internal = void 0;
const Sn = yt, Qi = Cr(), eo = it(), au = or;
function iu(t) {
  let e = !0;
  t.bounce !== null && t.bounce !== void 0 && (e = t.bounce);
  let r;
  if (typeof t.to == "string")
    r = Sn.Address.parse(t.to);
  else if (Sn.Address.isAddress(t.to))
    r = t.to;
  else
    throw new Error(`Invalid address ${t.to}`);
  let i;
  typeof t.value == "string" ? i = (0, au.toNano)(t.value) : i = t.value;
  let u = Qi.Cell.EMPTY;
  return typeof t.body == "string" ? u = (0, eo.beginCell)().storeUint(0, 32).storeStringTail(t.body).endCell() : t.body && (u = t.body), {
    info: {
      type: "internal",
      dest: r,
      value: { coins: i },
      bounce: e,
      ihrDisabled: !0,
      bounced: !1,
      ihrFee: 0n,
      forwardFee: 0n,
      createdAt: 0,
      createdLt: 0n
    },
    init: t.init ?? void 0,
    body: u
  };
}
Yt.internal = iu;
function ou(t) {
  let e;
  if (typeof t.to == "string")
    e = Sn.Address.parse(t.to);
  else if (Sn.Address.isAddress(t.to))
    e = t.to;
  else
    throw new Error(`Invalid address ${t.to}`);
  return {
    info: {
      type: "external-in",
      dest: e,
      importFee: 0n
    },
    init: t.init ?? void 0,
    body: t.body || Qi.Cell.EMPTY
  };
}
Yt.external = ou;
function su(t) {
  return (0, eo.beginCell)().storeUint(0, 32).storeStringTail(t).endCell();
}
Yt.comment = su;
var sr = {}, lr = {}, ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.storeAccountState = ur.loadAccountState = void 0;
const to = At;
function lu(t) {
  return t.loadBit() ? { type: "active", state: (0, to.loadStateInit)(t) } : t.loadBit() ? { type: "frozen", stateHash: t.loadUintBig(256) } : { type: "uninit" };
}
ur.loadAccountState = lu;
function uu(t) {
  return (e) => {
    t.type === "active" ? (e.storeBit(!0), e.store((0, to.storeStateInit)(t.state))) : t.type === "frozen" ? (e.storeBit(!1), e.storeBit(!0), e.storeUint(t.stateHash, 256)) : t.type === "uninit" && (e.storeBit(!1), e.storeBit(!1));
  };
}
ur.storeAccountState = uu;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.storeCurrencyCollection = bt.loadCurrencyCollection = void 0;
const Za = Ar();
function cu(t) {
  const e = t.loadCoins(), r = t.loadDict(Za.Dictionary.Keys.Uint(32), Za.Dictionary.Values.BigVarUint(
    5
    /* log2(32) */
  ));
  return r.size === 0 ? { coins: e } : { other: r, coins: e };
}
bt.loadCurrencyCollection = cu;
function du(t) {
  return (e) => {
    e.storeCoins(t.coins), t.other ? e.storeDict(t.other) : e.storeBit(0);
  };
}
bt.storeCurrencyCollection = du;
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.storeAccountStorage = lr.loadAccountStorage = void 0;
const ro = ur, no = bt;
function fu(t) {
  return {
    lastTransLt: t.loadUintBig(64),
    balance: (0, no.loadCurrencyCollection)(t),
    state: (0, ro.loadAccountState)(t)
  };
}
lr.loadAccountStorage = fu;
function hu(t) {
  return (e) => {
    e.storeUint(t.lastTransLt, 64), e.store((0, no.storeCurrencyCollection)(t.balance)), e.store((0, ro.storeAccountState)(t.state));
  };
}
lr.storeAccountStorage = hu;
var cr = {}, dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.storeStorageUsed = dr.loadStorageUsed = void 0;
function gu(t) {
  return {
    cells: t.loadVarUintBig(3),
    bits: t.loadVarUintBig(3),
    publicCells: t.loadVarUintBig(3)
  };
}
dr.loadStorageUsed = gu;
function pu(t) {
  return (e) => {
    e.storeVarUint(t.cells, 3), e.storeVarUint(t.bits, 3), e.storeVarUint(t.publicCells, 3);
  };
}
dr.storeStorageUsed = pu;
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.storeStorageInfo = cr.loadStorageInfo = void 0;
const ao = dr;
function mu(t) {
  return {
    used: (0, ao.loadStorageUsed)(t),
    lastPaid: t.loadUint(32),
    duePayment: t.loadMaybeCoins()
  };
}
cr.loadStorageInfo = mu;
function yu(t) {
  return (e) => {
    e.store((0, ao.storeStorageUsed)(t.used)), e.storeUint(t.lastPaid, 32), e.storeMaybeCoins(t.duePayment);
  };
}
cr.storeStorageInfo = yu;
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.storeAccount = sr.loadAccount = void 0;
const io = lr, oo = cr;
function bu(t) {
  return {
    addr: t.loadAddress(),
    storageStats: (0, oo.loadStorageInfo)(t),
    storage: (0, io.loadAccountStorage)(t)
  };
}
sr.loadAccount = bu;
function vu(t) {
  return (e) => {
    e.storeAddress(t.addr), e.store((0, oo.storeStorageInfo)(t.storageStats)), e.store((0, io.storeAccountStorage)(t.storage));
  };
}
sr.storeAccount = vu;
var fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.storeAccountStatus = fr.loadAccountStatus = void 0;
function wu(t) {
  const e = t.loadUint(2);
  if (e === 0)
    return "uninitialized";
  if (e === 1)
    return "frozen";
  if (e === 2)
    return "active";
  if (e === 3)
    return "non-existing";
  throw Error("Invalid data");
}
fr.loadAccountStatus = wu;
function xu(t) {
  return (e) => {
    if (t === "uninitialized")
      e.storeUint(0, 2);
    else if (t === "frozen")
      e.storeUint(1, 2);
    else if (t === "active")
      e.storeUint(2, 2);
    else if (t === "non-existing")
      e.storeUint(3, 2);
    else
      throw Error("Invalid data");
    return e;
  };
}
fr.storeAccountStatus = xu;
var Wt = {};
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.storeAccountStatusChange = Wt.loadAccountStatusChange = void 0;
function _u(t) {
  return t.loadBit() ? t.loadBit() ? "deleted" : "frozen" : "unchanged";
}
Wt.loadAccountStatusChange = _u;
function ku(t) {
  return (e) => {
    if (t == "unchanged")
      e.storeBit(0);
    else if (t === "frozen")
      e.storeBit(1), e.storeBit(0);
    else if (t === "deleted")
      e.storeBit(1), e.storeBit(1);
    else
      throw Error("Invalid account status change");
  };
}
Wt.storeAccountStatusChange = ku;
var Bt = {}, hr = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.storeCommonMessageInfoRelaxed = gr.loadCommonMessageInfoRelaxed = void 0;
const so = bt;
function Bu(t) {
  if (!t.loadBit()) {
    const f = t.loadBit(), o = t.loadBit(), h = t.loadBit(), m = t.loadMaybeAddress(), k = t.loadAddress(), P = (0, so.loadCurrencyCollection)(t), E = t.loadCoins(), $ = t.loadCoins(), L = t.loadUintBig(64), ee = t.loadUint(32);
    return {
      type: "internal",
      ihrDisabled: f,
      bounce: o,
      bounced: h,
      src: m,
      dest: k,
      value: P,
      ihrFee: E,
      forwardFee: $,
      createdLt: L,
      createdAt: ee
    };
  }
  if (!t.loadBit())
    throw Error("External In message is not possible for CommonMessageInfoRelaxed");
  const e = t.loadMaybeAddress(), r = t.loadMaybeExternalAddress(), i = t.loadUintBig(64), u = t.loadUint(32);
  return {
    type: "external-out",
    src: e,
    dest: r,
    createdLt: i,
    createdAt: u
  };
}
gr.loadCommonMessageInfoRelaxed = Bu;
function Su(t) {
  return (e) => {
    if (t.type === "internal")
      e.storeBit(0), e.storeBit(t.ihrDisabled), e.storeBit(t.bounce), e.storeBit(t.bounced), e.storeAddress(t.src), e.storeAddress(t.dest), e.store((0, so.storeCurrencyCollection)(t.value)), e.storeCoins(t.ihrFee), e.storeCoins(t.forwardFee), e.storeUint(t.createdLt, 64), e.storeUint(t.createdAt, 32);
    else if (t.type === "external-out")
      e.storeBit(1), e.storeBit(1), e.storeAddress(t.src), e.storeAddress(t.dest), e.storeUint(t.createdLt, 64), e.storeUint(t.createdAt, 32);
    else
      throw new Error("Unknown CommonMessageInfo type");
  };
}
gr.storeCommonMessageInfoRelaxed = Su;
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.storeMessageRelaxed = hr.loadMessageRelaxed = void 0;
const Pu = it(), lo = gr, ha = At;
function Au(t) {
  const e = (0, lo.loadCommonMessageInfoRelaxed)(t);
  let r = null;
  t.loadBit() && (t.loadBit() ? r = (0, ha.loadStateInit)(t.loadRef().beginParse()) : r = (0, ha.loadStateInit)(t));
  const i = t.loadBit() ? t.loadRef() : t.asCell();
  return {
    info: e,
    init: r,
    body: i
  };
}
hr.loadMessageRelaxed = Au;
function Cu(t, e) {
  return (r) => {
    if (r.store((0, lo.storeCommonMessageInfoRelaxed)(t.info)), t.init) {
      r.storeBit(!0);
      let u = (0, Pu.beginCell)().store((0, ha.storeStateInit)(t.init)), f = !1;
      e && e.forceRef ? f = !0 : r.availableBits - 2 >= u.bits ? f = !1 : f = !0, f ? (r.storeBit(!0), r.storeRef(u)) : (r.storeBit(!1), r.storeBuilder(u));
    } else
      r.storeBit(!1);
    let i = !1;
    e && e.forceRef ? i = !0 : r.availableBits - 1 >= t.body.bits.length && r.refs + t.body.refs.length <= 4 && !t.body.isExotic ? i = !1 : i = !0, i ? (r.storeBit(!0), r.storeRef(t.body)) : (r.storeBit(!1), r.storeBuilder(t.body.asBuilder()));
  };
}
hr.storeMessageRelaxed = Cu;
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.loadOutList = Bt.storeOutList = Bt.loadOutAction = Bt.storeOutAction = void 0;
const uo = hr, ga = it();
function co(t) {
  switch (t.type) {
    case "sendMsg":
      return Eu(t);
    case "setCode":
      return Uu(t);
    default:
      throw new Error(`Unknown action type ${t.type}`);
  }
}
Bt.storeOutAction = co;
const fo = 247711853;
function Eu(t) {
  return (e) => {
    e.storeUint(fo, 32).storeUint(t.mode, 8).storeRef((0, ga.beginCell)().store((0, uo.storeMessageRelaxed)(t.outMsg)).endCell());
  };
}
const ho = 2907562126;
function Uu(t) {
  return (e) => {
    e.storeUint(ho, 32).storeRef(t.newCode);
  };
}
function go(t) {
  const e = t.loadUint(32);
  if (e === fo) {
    const r = t.loadUint(8), i = (0, uo.loadMessageRelaxed)(t.loadRef().beginParse());
    return {
      type: "sendMsg",
      mode: r,
      outMsg: i
    };
  }
  if (e === ho)
    return {
      type: "setCode",
      newCode: t.loadRef()
    };
  throw new Error(`Unknown out action tag 0x${e.toString(16)}`);
}
Bt.loadOutAction = go;
function Tu(t) {
  const e = t.reduce((r, i) => (0, ga.beginCell)().storeRef(r).store(co(i)).endCell(), (0, ga.beginCell)().endCell());
  return (r) => {
    r.storeSlice(e.beginParse());
  };
}
Bt.storeOutList = Tu;
function Mu(t) {
  const e = [];
  for (; t.remainingRefs; ) {
    const r = t.loadRef();
    e.push(go(t)), t = r.beginParse();
  }
  return e.reverse();
}
Bt.loadOutList = Mu;
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.storeCommonMessageInfo = pr.loadCommonMessageInfo = void 0;
const po = bt;
function ju(t) {
  if (!t.loadBit()) {
    const f = t.loadBit(), o = t.loadBit(), h = t.loadBit(), m = t.loadAddress(), k = t.loadAddress(), P = (0, po.loadCurrencyCollection)(t), E = t.loadCoins(), $ = t.loadCoins(), L = t.loadUintBig(64), ee = t.loadUint(32);
    return {
      type: "internal",
      ihrDisabled: f,
      bounce: o,
      bounced: h,
      src: m,
      dest: k,
      value: P,
      ihrFee: E,
      forwardFee: $,
      createdLt: L,
      createdAt: ee
    };
  }
  if (!t.loadBit()) {
    const f = t.loadMaybeExternalAddress(), o = t.loadAddress(), h = t.loadCoins();
    return {
      type: "external-in",
      src: f,
      dest: o,
      importFee: h
    };
  }
  const e = t.loadAddress(), r = t.loadMaybeExternalAddress(), i = t.loadUintBig(64), u = t.loadUint(32);
  return {
    type: "external-out",
    src: e,
    dest: r,
    createdLt: i,
    createdAt: u
  };
}
pr.loadCommonMessageInfo = ju;
function Iu(t) {
  return (e) => {
    if (t.type === "internal")
      e.storeBit(0), e.storeBit(t.ihrDisabled), e.storeBit(t.bounce), e.storeBit(t.bounced), e.storeAddress(t.src), e.storeAddress(t.dest), e.store((0, po.storeCurrencyCollection)(t.value)), e.storeCoins(t.ihrFee), e.storeCoins(t.forwardFee), e.storeUint(t.createdLt, 64), e.storeUint(t.createdAt, 32);
    else if (t.type === "external-in")
      e.storeBit(1), e.storeBit(0), e.storeAddress(t.src), e.storeAddress(t.dest), e.storeCoins(t.importFee);
    else if (t.type === "external-out")
      e.storeBit(1), e.storeBit(1), e.storeAddress(t.src), e.storeAddress(t.dest), e.storeUint(t.createdLt, 64), e.storeUint(t.createdAt, 32);
    else
      throw new Error("Unknown CommonMessageInfo type");
  };
}
pr.storeCommonMessageInfo = Iu;
var mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.storeComputeSkipReason = mr.loadComputeSkipReason = void 0;
function Ru(t) {
  let e = t.loadUint(2);
  if (e === 0)
    return "no-state";
  if (e === 1)
    return "bad-state";
  if (e === 2)
    return "no-gas";
  throw new Error(`Unknown ComputeSkipReason: ${e}`);
}
mr.loadComputeSkipReason = Ru;
function Ou(t) {
  return (e) => {
    if (t === "no-state")
      e.storeUint(0, 2);
    else if (t === "bad-state")
      e.storeUint(1, 2);
    else if (t === "no-gas")
      e.storeUint(2, 2);
    else
      throw new Error(`Unknown ComputeSkipReason: ${t}`);
  };
}
mr.storeComputeSkipReason = Ou;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.storeDepthBalanceInfo = yr.loadDepthBalanceInfo = void 0;
const mo = bt;
function zu(t) {
  return {
    splitDepth: t.loadUint(5),
    balance: (0, mo.loadCurrencyCollection)(t)
  };
}
yr.loadDepthBalanceInfo = zu;
function Nu(t) {
  return (e) => {
    e.storeUint(t.splitDepth, 5), e.store((0, mo.storeCurrencyCollection)(t.balance));
  };
}
yr.storeDepthBalanceInfo = Nu;
var br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.storeHashUpdate = br.loadHashUpdate = void 0;
function qu(t) {
  if (t.loadUint(8) !== 114)
    throw Error("Invalid data");
  const e = t.loadBuffer(32), r = t.loadBuffer(32);
  return { oldHash: e, newHash: r };
}
br.loadHashUpdate = qu;
function Du(t) {
  return (e) => {
    e.storeUint(114, 8), e.storeBuffer(t.oldHash), e.storeBuffer(t.newHash);
  };
}
br.storeHashUpdate = Du;
var mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.loadMasterchainStateExtra = void 0;
const ia = Ar(), $u = bt;
function Lu(t) {
  if (t.loadUint(16) !== 52262)
    throw Error("Invalid data");
  t.loadBit() && t.loadRef();
  let e = t.loadUintBig(256), r = ia.Dictionary.load(ia.Dictionary.Keys.Int(32), ia.Dictionary.Values.Cell(), t);
  const i = (0, $u.loadCurrencyCollection)(t);
  return {
    config: r,
    configAddress: e,
    globalBalance: i
  };
}
mn.loadMasterchainStateExtra = Lu;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.MessageValue = Rt.storeMessage = Rt.loadMessage = void 0;
const yo = it(), bo = pr, pa = At;
function vo(t) {
  const e = (0, bo.loadCommonMessageInfo)(t);
  let r = null;
  t.loadBit() && (t.loadBit() ? r = (0, pa.loadStateInit)(t.loadRef().beginParse()) : r = (0, pa.loadStateInit)(t));
  const i = t.loadBit() ? t.loadRef() : t.asCell();
  return {
    info: e,
    init: r,
    body: i
  };
}
Rt.loadMessage = vo;
function wo(t, e) {
  return (r) => {
    if (r.store((0, bo.storeCommonMessageInfo)(t.info)), t.init) {
      r.storeBit(!0);
      let u = (0, yo.beginCell)().store((0, pa.storeStateInit)(t.init)), f = !1;
      e && e.forceRef ? f = !0 : f = r.availableBits - 2 < u.bits + t.body.bits.length, f ? (r.storeBit(!0), r.storeRef(u)) : (r.storeBit(!1), r.storeBuilder(u));
    } else
      r.storeBit(!1);
    let i = !1;
    e && e.forceRef ? i = !0 : i = r.availableBits - 1 < t.body.bits.length || r.refs + t.body.refs.length > 4, i ? (r.storeBit(!0), r.storeRef(t.body)) : (r.storeBit(!1), r.storeBuilder(t.body.asBuilder()));
  };
}
Rt.storeMessage = wo;
Rt.MessageValue = {
  serialize(t, e) {
    e.storeRef((0, yo.beginCell)().store(wo(t)));
  },
  parse(t) {
    return vo(t.loadRef().beginParse());
  }
};
var xo = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.SendMode = void 0, function(e) {
    e[e.CARRY_ALL_REMAINING_BALANCE = 128] = "CARRY_ALL_REMAINING_BALANCE", e[e.CARRY_ALL_REMAINING_INCOMING_VALUE = 64] = "CARRY_ALL_REMAINING_INCOMING_VALUE", e[e.DESTROY_ACCOUNT_IF_ZERO = 32] = "DESTROY_ACCOUNT_IF_ZERO", e[e.PAY_GAS_SEPARATELY = 1] = "PAY_GAS_SEPARATELY", e[e.IGNORE_ERRORS = 2] = "IGNORE_ERRORS", e[e.NONE = 0] = "NONE";
  }(t.SendMode || (t.SendMode = {}));
})(xo);
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.storeShardAccount = vr.loadShardAccount = void 0;
const Qa = it(), _o = sr;
function Fu(t) {
  let e = t.loadRef(), r;
  if (!e.isExotic) {
    let i = e.beginParse();
    i.loadBit() && (r = (0, _o.loadAccount)(i));
  }
  return {
    account: r,
    lastTransactionHash: t.loadUintBig(256),
    lastTransactionLt: t.loadUintBig(64)
  };
}
vr.loadShardAccount = Fu;
function Ku(t) {
  return (e) => {
    t.account ? e.storeRef((0, Qa.beginCell)().storeBit(!0).store((0, _o.storeAccount)(t.account))) : e.storeRef((0, Qa.beginCell)().storeBit(!1)), e.storeUint(t.lastTransactionHash, 256), e.storeUint(t.lastTransactionLt, 64);
  };
}
vr.storeShardAccount = Ku;
var Aa = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.storeShardAccounts = t.loadShardAccounts = t.ShardAccountRefValue = void 0;
  const e = Ar(), r = yr, i = vr;
  t.ShardAccountRefValue = {
    parse: (o) => {
      let h = (0, r.loadDepthBalanceInfo)(o), m = (0, i.loadShardAccount)(o);
      return {
        depthBalanceInfo: h,
        shardAccount: m
      };
    },
    serialize(o, h) {
      h.store((0, r.storeDepthBalanceInfo)(o.depthBalanceInfo)), h.store((0, i.storeShardAccount)(o.shardAccount));
    }
  };
  function u(o) {
    return e.Dictionary.load(e.Dictionary.Keys.BigUint(256), t.ShardAccountRefValue, o);
  }
  t.loadShardAccounts = u;
  function f(o) {
    return (h) => {
      h.storeDict(o);
    };
  }
  t.storeShardAccounts = f;
})(Aa);
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.storeShardIdent = wr.loadShardIdent = void 0;
function Hu(t) {
  if (t.loadUint(2) !== 0)
    throw Error("Invalid data");
  return {
    shardPrefixBits: t.loadUint(6),
    workchainId: t.loadInt(32),
    shardPrefix: t.loadUintBig(64)
  };
}
wr.loadShardIdent = Hu;
function Vu(t) {
  return (e) => {
    e.storeUint(0, 2), e.storeUint(t.shardPrefixBits, 6), e.storeInt(t.workchainId, 32), e.storeUint(t.shardPrefix, 64);
  };
}
wr.storeShardIdent = Vu;
var Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.loadShardStateUnsplit = void 0;
const Gu = mn, Yu = Aa, Wu = wr;
function Xu(t) {
  if (t.loadUint(32) !== 2418257890)
    throw Error("Invalid data");
  let e = t.loadInt(32), r = (0, Wu.loadShardIdent)(t), i = t.loadUint(32), u = t.loadUint(32), f = t.loadUint(32), o = t.loadUintBig(64), h = t.loadUint(32);
  t.loadRef();
  let m = t.loadBit(), k = t.loadRef(), P;
  k.isExotic || (P = (0, Yu.loadShardAccounts)(k.beginParse())), t.loadRef();
  let E = t.loadBit(), $ = null;
  if (E) {
    let L = t.loadRef();
    L.isExotic || ($ = (0, Gu.loadMasterchainStateExtra)(L.beginParse()));
  }
  return {
    globalId: e,
    shardId: r,
    seqno: i,
    vertSeqNo: u,
    genUtime: f,
    genLt: o,
    minRefMcSeqno: h,
    beforeSplit: m,
    accounts: P,
    extras: $
  };
}
Wn.loadShardStateUnsplit = Xu;
var xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.storeSplitMergeInfo = xr.loadSplitMergeInfo = void 0;
function Ju(t) {
  let e = t.loadUint(6), r = t.loadUint(6), i = t.loadUintBig(256), u = t.loadUintBig(256);
  return {
    currentShardPrefixLength: e,
    accountSplitDepth: r,
    thisAddress: i,
    siblingAddress: u
  };
}
xr.loadSplitMergeInfo = Ju;
function Zu(t) {
  return (e) => {
    e.storeUint(t.currentShardPrefixLength, 6), e.storeUint(t.accountSplitDepth, 6), e.storeUint(t.thisAddress, 256), e.storeUint(t.siblingAddress, 256);
  };
}
xr.storeSplitMergeInfo = Zu;
var Xt = {};
Object.defineProperty(Xt, "__esModule", { value: !0 });
Xt.storeStorageUsedShort = Xt.loadStorageUsedShort = void 0;
function Qu(t) {
  let e = t.loadVarUintBig(3), r = t.loadVarUintBig(3);
  return {
    cells: e,
    bits: r
  };
}
Xt.loadStorageUsedShort = Qu;
function ec(t) {
  return (e) => {
    e.storeVarUint(t.cells, 3), e.storeVarUint(t.bits, 3);
  };
}
Xt.storeStorageUsedShort = ec;
var rr = {}, nr = {}, _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.storeTransactionActionPhase = _r.loadTransactionActionPhase = void 0;
const ko = Wt, Bo = Xt;
function tc(t) {
  let e = t.loadBit(), r = t.loadBit(), i = t.loadBit(), u = (0, ko.loadAccountStatusChange)(t), f = t.loadBit() ? t.loadCoins() : void 0, o = t.loadBit() ? t.loadCoins() : void 0, h = t.loadInt(32), m = t.loadBit() ? t.loadInt(32) : void 0, k = t.loadUint(16), P = t.loadUint(16), E = t.loadUint(16), $ = t.loadUint(16), L = t.loadUintBig(256), ee = (0, Bo.loadStorageUsedShort)(t);
  return {
    success: e,
    valid: r,
    noFunds: i,
    statusChange: u,
    totalFwdFees: f,
    totalActionFees: o,
    resultCode: h,
    resultArg: m,
    totalActions: k,
    specActions: P,
    skippedActions: E,
    messagesCreated: $,
    actionListHash: L,
    totalMessageSize: ee
  };
}
_r.loadTransactionActionPhase = tc;
function rc(t) {
  return (e) => {
    e.storeBit(t.success), e.storeBit(t.valid), e.storeBit(t.noFunds), e.store((0, ko.storeAccountStatusChange)(t.statusChange)), e.storeMaybeCoins(t.totalFwdFees), e.storeMaybeCoins(t.totalActionFees), e.storeInt(t.resultCode, 32), e.storeMaybeInt(t.resultArg, 32), e.storeUint(t.totalActions, 16), e.storeUint(t.specActions, 16), e.storeUint(t.skippedActions, 16), e.storeUint(t.messagesCreated, 16), e.storeUint(t.actionListHash, 256), e.store((0, Bo.storeStorageUsedShort)(t.totalMessageSize));
  };
}
_r.storeTransactionActionPhase = rc;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.storeTransactionBouncePhase = kr.loadTransactionBouncePhase = void 0;
const Pn = Xt;
function nc(t) {
  if (t.loadBit()) {
    let e = (0, Pn.loadStorageUsedShort)(t), r = t.loadCoins(), i = t.loadCoins();
    return {
      type: "ok",
      messageSize: e,
      messageFees: r,
      forwardFees: i
    };
  }
  if (t.loadBit()) {
    let e = (0, Pn.loadStorageUsedShort)(t), r = t.loadCoins();
    return {
      type: "no-funds",
      messageSize: e,
      requiredForwardFees: r
    };
  }
  return {
    type: "negative-funds"
  };
}
kr.loadTransactionBouncePhase = nc;
function ac(t) {
  return (e) => {
    if (t.type === "ok")
      e.storeBit(!0), e.store((0, Pn.storeStorageUsedShort)(t.messageSize)), e.storeCoins(t.messageFees), e.storeCoins(t.forwardFees);
    else if (t.type === "negative-funds")
      e.storeBit(!1), e.storeBit(!1);
    else if (t.type === "no-funds")
      e.storeBit(!1), e.storeBit(!0), e.store((0, Pn.storeStorageUsedShort)(t.messageSize)), e.storeCoins(t.requiredForwardFees);
    else
      throw new Error("Invalid TransactionBouncePhase type");
  };
}
kr.storeTransactionBouncePhase = ac;
var Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.storeTransactionComputePhase = Br.loadTransactionComputePhase = void 0;
const ic = it(), So = mr;
function oc(t) {
  if (!t.loadBit())
    return {
      type: "skipped",
      reason: (0, So.loadComputeSkipReason)(t)
    };
  let e = t.loadBit(), r = t.loadBit(), i = t.loadBit(), u = t.loadCoins();
  const f = t.loadRef().beginParse();
  let o = f.loadVarUintBig(3), h = f.loadVarUintBig(3), m = f.loadBit() ? f.loadVarUintBig(2) : void 0, k = f.loadUint(8), P = f.loadInt(32), E = f.loadBit() ? f.loadInt(32) : void 0, $ = f.loadUint(32), L = f.loadUintBig(256), ee = f.loadUintBig(256);
  return {
    type: "vm",
    success: e,
    messageStateUsed: r,
    accountActivated: i,
    gasFees: u,
    gasUsed: o,
    gasLimit: h,
    gasCredit: m,
    mode: k,
    exitCode: P,
    exitArg: E,
    vmSteps: $,
    vmInitStateHash: L,
    vmFinalStateHash: ee
  };
}
Br.loadTransactionComputePhase = oc;
function sc(t) {
  return (e) => {
    if (t.type === "skipped") {
      e.storeBit(0), e.store((0, So.storeComputeSkipReason)(t.reason));
      return;
    }
    e.storeBit(1), e.storeBit(t.success), e.storeBit(t.messageStateUsed), e.storeBit(t.accountActivated), e.storeCoins(t.gasFees), e.storeRef((0, ic.beginCell)().storeVarUint(t.gasUsed, 3).storeVarUint(t.gasLimit, 3).store((r) => t.gasCredit !== void 0 && t.gasCredit !== null ? r.storeBit(1).storeVarUint(t.gasCredit, 2) : r.storeBit(0)).storeUint(t.mode, 8).storeInt(t.exitCode, 32).store((r) => t.exitArg !== void 0 && t.exitArg !== null ? r.storeBit(1).storeInt(t.exitArg, 32) : r.storeBit(0)).storeUint(t.vmSteps, 32).storeUint(t.vmInitStateHash, 256).storeUint(t.vmFinalStateHash, 256).endCell());
  };
}
Br.storeTransactionComputePhase = sc;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.storeTransactionCreditPhase = Sr.loadTransactionCreditPhase = void 0;
const Po = bt;
function lc(t) {
  const e = t.loadBit() ? t.loadCoins() : void 0, r = (0, Po.loadCurrencyCollection)(t);
  return {
    dueFeesColelcted: e,
    credit: r
  };
}
Sr.loadTransactionCreditPhase = lc;
function uc(t) {
  return (e) => {
    t.dueFeesColelcted === null || t.dueFeesColelcted === void 0 ? e.storeBit(!1) : (e.storeBit(!0), e.storeCoins(t.dueFeesColelcted)), e.store((0, Po.storeCurrencyCollection)(t.credit));
  };
}
Sr.storeTransactionCreditPhase = uc;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.storeTransactionsStoragePhase = Pr.loadTransactionStoragePhase = void 0;
const Ao = Wt;
function cc(t) {
  const e = t.loadCoins();
  let r;
  t.loadBit() && (r = t.loadCoins());
  const i = (0, Ao.loadAccountStatusChange)(t);
  return {
    storageFeesCollected: e,
    storageFeesDue: r,
    statusChange: i
  };
}
Pr.loadTransactionStoragePhase = cc;
function dc(t) {
  return (e) => {
    e.storeCoins(t.storageFeesCollected), t.storageFeesDue === null || t.storageFeesDue === void 0 ? e.storeBit(!1) : (e.storeBit(!0), e.storeCoins(t.storageFeesDue)), e.store((0, Ao.storeAccountStatusChange)(t.statusChange));
  };
}
Pr.storeTransactionsStoragePhase = dc;
var ei;
function Co() {
  if (ei) return nr;
  ei = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.storeTransactionDescription = nr.loadTransactionDescription = void 0;
  const t = it(), e = xr, r = Eo(), i = _r, u = kr, f = Br, o = Sr, h = Pr;
  function m(P) {
    let E = P.loadUint(4);
    if (E === 0) {
      const $ = P.loadBit();
      let L;
      P.loadBit() && (L = (0, h.loadTransactionStoragePhase)(P));
      let ee;
      P.loadBit() && (ee = (0, o.loadTransactionCreditPhase)(P));
      let ae = (0, f.loadTransactionComputePhase)(P), fe;
      P.loadBit() && (fe = (0, i.loadTransactionActionPhase)(P.loadRef().beginParse()));
      let X = P.loadBit(), Y;
      P.loadBit() && (Y = (0, u.loadTransactionBouncePhase)(P));
      const O = P.loadBit();
      return {
        type: "generic",
        creditFirst: $,
        storagePhase: L,
        creditPhase: ee,
        computePhase: ae,
        actionPhase: fe,
        bouncePhase: Y,
        aborted: X,
        destroyed: O
      };
    }
    if (E === 1)
      return {
        type: "storage",
        storagePhase: (0, h.loadTransactionStoragePhase)(P)
      };
    if (E === 2 || E === 3) {
      const $ = E === 3;
      let L = (0, h.loadTransactionStoragePhase)(P), ee = (0, f.loadTransactionComputePhase)(P), ae;
      P.loadBit() && (ae = (0, i.loadTransactionActionPhase)(P.loadRef().beginParse()));
      const fe = P.loadBit(), X = P.loadBit();
      return {
        type: "tick-tock",
        isTock: $,
        storagePhase: L,
        computePhase: ee,
        actionPhase: ae,
        aborted: fe,
        destroyed: X
      };
    }
    if (E === 4) {
      let $ = (0, e.loadSplitMergeInfo)(P), L;
      P.loadBit() && (L = (0, h.loadTransactionStoragePhase)(P));
      let ee = (0, f.loadTransactionComputePhase)(P), ae;
      P.loadBit() && (ae = (0, i.loadTransactionActionPhase)(P.loadRef().beginParse()));
      const fe = P.loadBit(), X = P.loadBit();
      return {
        type: "split-prepare",
        splitInfo: $,
        storagePhase: L,
        computePhase: ee,
        actionPhase: ae,
        aborted: fe,
        destroyed: X
      };
    }
    if (E === 5) {
      let $ = (0, e.loadSplitMergeInfo)(P), L = (0, r.loadTransaction)(P.loadRef().beginParse());
      const ee = P.loadBit();
      return {
        type: "split-install",
        splitInfo: $,
        prepareTransaction: L,
        installed: ee
      };
    }
    throw Error(`Unsupported transaction description type ${E}`);
  }
  nr.loadTransactionDescription = m;
  function k(P) {
    return (E) => {
      if (P.type === "generic")
        E.storeUint(0, 4), E.storeBit(P.creditFirst), P.storagePhase ? (E.storeBit(!0), E.store((0, h.storeTransactionsStoragePhase)(P.storagePhase))) : E.storeBit(!1), P.creditPhase ? (E.storeBit(!0), E.store((0, o.storeTransactionCreditPhase)(P.creditPhase))) : E.storeBit(!1), E.store((0, f.storeTransactionComputePhase)(P.computePhase)), P.actionPhase ? (E.storeBit(!0), E.storeRef((0, t.beginCell)().store((0, i.storeTransactionActionPhase)(P.actionPhase)))) : E.storeBit(!1), E.storeBit(P.aborted), P.bouncePhase ? (E.storeBit(!0), E.store((0, u.storeTransactionBouncePhase)(P.bouncePhase))) : E.storeBit(!1), E.storeBit(P.destroyed);
      else if (P.type === "storage")
        E.storeUint(1, 4), E.store((0, h.storeTransactionsStoragePhase)(P.storagePhase));
      else if (P.type === "tick-tock")
        E.storeUint(P.isTock ? 3 : 2, 4), E.store((0, h.storeTransactionsStoragePhase)(P.storagePhase)), E.store((0, f.storeTransactionComputePhase)(P.computePhase)), P.actionPhase ? (E.storeBit(!0), E.storeRef((0, t.beginCell)().store((0, i.storeTransactionActionPhase)(P.actionPhase)))) : E.storeBit(!1), E.storeBit(P.aborted), E.storeBit(P.destroyed);
      else if (P.type === "split-prepare")
        E.storeUint(4, 4), E.store((0, e.storeSplitMergeInfo)(P.splitInfo)), P.storagePhase ? (E.storeBit(!0), E.store((0, h.storeTransactionsStoragePhase)(P.storagePhase))) : E.storeBit(!1), E.store((0, f.storeTransactionComputePhase)(P.computePhase)), P.actionPhase ? (E.storeBit(!0), E.store((0, i.storeTransactionActionPhase)(P.actionPhase))) : E.storeBit(!1), E.storeBit(P.aborted), E.storeBit(P.destroyed);
      else if (P.type === "split-install")
        E.storeUint(5, 4), E.store((0, e.storeSplitMergeInfo)(P.splitInfo)), E.storeRef((0, t.beginCell)().store((0, r.storeTransaction)(P.prepareTransaction))), E.storeBit(P.installed);
      else
        throw Error(`Unsupported transaction description type ${P.type}`);
    };
  }
  return nr.storeTransactionDescription = k, nr;
}
var ti;
function Eo() {
  if (ti) return rr;
  ti = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.storeTransaction = rr.loadTransaction = void 0;
  const t = it(), e = Ar(), r = fr, i = bt, u = br, f = Rt, o = Co();
  function h(k) {
    let P = k.asCell();
    if (k.loadUint(4) !== 7)
      throw Error("Invalid data");
    let E = k.loadUintBig(256), $ = k.loadUintBig(64), L = k.loadUintBig(256), ee = k.loadUintBig(64), ae = k.loadUint(32), fe = k.loadUint(15), X = (0, r.loadAccountStatus)(k), Y = (0, r.loadAccountStatus)(k), T = k.loadRef().beginParse(), W = T.loadBit() ? (0, f.loadMessage)(T.loadRef().beginParse()) : void 0, H = T.loadDict(e.Dictionary.Keys.Uint(15), f.MessageValue);
    T.endParse();
    let ie = (0, i.loadCurrencyCollection)(k), Me = (0, u.loadHashUpdate)(k.loadRef().beginParse()), Pe = (0, o.loadTransactionDescription)(k.loadRef().beginParse());
    return {
      address: E,
      lt: $,
      prevTransactionHash: L,
      prevTransactionLt: ee,
      now: ae,
      outMessagesCount: fe,
      oldStatus: X,
      endStatus: Y,
      inMessage: W,
      outMessages: H,
      totalFees: ie,
      stateUpdate: Me,
      description: Pe,
      raw: P,
      hash: () => P.hash()
    };
  }
  rr.loadTransaction = h;
  function m(k) {
    return (P) => {
      P.storeUint(7, 4), P.storeUint(k.address, 256), P.storeUint(k.lt, 64), P.storeUint(k.prevTransactionHash, 256), P.storeUint(k.prevTransactionLt, 64), P.storeUint(k.now, 32), P.storeUint(k.outMessagesCount, 15), P.store((0, r.storeAccountStatus)(k.oldStatus)), P.store((0, r.storeAccountStatus)(k.endStatus));
      let E = (0, t.beginCell)();
      k.inMessage ? (E.storeBit(!0), E.storeRef((0, t.beginCell)().store((0, f.storeMessage)(k.inMessage)))) : E.storeBit(!1), E.storeDict(k.outMessages), P.storeRef(E), P.store((0, i.storeCurrencyCollection)(k.totalFees)), P.storeRef((0, t.beginCell)().store((0, u.storeHashUpdate)(k.stateUpdate))), P.storeRef((0, t.beginCell)().store((0, o.storeTransactionDescription)(k.description)));
    };
  }
  return rr.storeTransaction = m, rr;
}
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.loadStorageInfo = t.storeStateInit = t.loadStateInit = t.storeSplitMergeInfo = t.loadSplitMergeInfo = t.storeSimpleLibrary = t.loadSimpleLibrary = t.loadShardStateUnsplit = t.storeShardIdent = t.loadShardIdent = t.storeShardAccounts = t.loadShardAccounts = t.ShardAccountRefValue = t.storeShardAccount = t.loadShardAccount = t.SendMode = t.storeMessageRelaxed = t.loadMessageRelaxed = t.storeMessage = t.loadMessage = t.loadMasterchainStateExtra = t.storeHashUpdate = t.loadHashUpdate = t.storeDepthBalanceInfo = t.loadDepthBalanceInfo = t.storeCurrencyCollection = t.loadCurrencyCollection = t.storeComputeSkipReason = t.loadComputeSkipReason = t.storeCommonMessageInfoRelaxed = t.loadCommonMessageInfoRelaxed = t.storeCommonMessageInfo = t.loadCommonMessageInfo = t.storeOutList = t.loadOutList = t.storeOutAction = t.loadOutAction = t.storeAccountStorage = t.loadAccountStorage = t.storeAccountStatusChange = t.loadAccountStatusChange = t.storeAccountStatus = t.loadAccountStatus = t.storeAccountState = t.loadAccountState = t.storeAccount = t.loadAccount = t.comment = t.external = t.internal = void 0, t.storeTransactionsStoragePhase = t.loadTransactionStoragePhase = t.storeTransactionDescription = t.loadTransactionDescription = t.storeTransactionCreditPhase = t.loadTransactionCreditPhase = t.storeTransactionComputePhase = t.loadTransactionComputePhase = t.storeTransactionBouncePhase = t.loadTransactionBouncePhase = t.storeTransactionActionPhase = t.loadTransactionActionPhase = t.storeTransaction = t.loadTransaction = t.storeTickTock = t.loadTickTock = t.storeStorageUsedShort = t.loadStorageUsedShort = t.storeStorageUsed = t.loadStorageUsed = t.storeStorageInfo = void 0;
  var e = Yt;
  Object.defineProperty(t, "internal", { enumerable: !0, get: function() {
    return e.internal;
  } }), Object.defineProperty(t, "external", { enumerable: !0, get: function() {
    return e.external;
  } }), Object.defineProperty(t, "comment", { enumerable: !0, get: function() {
    return e.comment;
  } });
  var r = sr;
  Object.defineProperty(t, "loadAccount", { enumerable: !0, get: function() {
    return r.loadAccount;
  } }), Object.defineProperty(t, "storeAccount", { enumerable: !0, get: function() {
    return r.storeAccount;
  } });
  var i = ur;
  Object.defineProperty(t, "loadAccountState", { enumerable: !0, get: function() {
    return i.loadAccountState;
  } }), Object.defineProperty(t, "storeAccountState", { enumerable: !0, get: function() {
    return i.storeAccountState;
  } });
  var u = fr;
  Object.defineProperty(t, "loadAccountStatus", { enumerable: !0, get: function() {
    return u.loadAccountStatus;
  } }), Object.defineProperty(t, "storeAccountStatus", { enumerable: !0, get: function() {
    return u.storeAccountStatus;
  } });
  var f = Wt;
  Object.defineProperty(t, "loadAccountStatusChange", { enumerable: !0, get: function() {
    return f.loadAccountStatusChange;
  } }), Object.defineProperty(t, "storeAccountStatusChange", { enumerable: !0, get: function() {
    return f.storeAccountStatusChange;
  } });
  var o = lr;
  Object.defineProperty(t, "loadAccountStorage", { enumerable: !0, get: function() {
    return o.loadAccountStorage;
  } }), Object.defineProperty(t, "storeAccountStorage", { enumerable: !0, get: function() {
    return o.storeAccountStorage;
  } });
  var h = Bt;
  Object.defineProperty(t, "loadOutAction", { enumerable: !0, get: function() {
    return h.loadOutAction;
  } }), Object.defineProperty(t, "storeOutAction", { enumerable: !0, get: function() {
    return h.storeOutAction;
  } }), Object.defineProperty(t, "loadOutList", { enumerable: !0, get: function() {
    return h.loadOutList;
  } }), Object.defineProperty(t, "storeOutList", { enumerable: !0, get: function() {
    return h.storeOutList;
  } });
  var m = pr;
  Object.defineProperty(t, "loadCommonMessageInfo", { enumerable: !0, get: function() {
    return m.loadCommonMessageInfo;
  } }), Object.defineProperty(t, "storeCommonMessageInfo", { enumerable: !0, get: function() {
    return m.storeCommonMessageInfo;
  } });
  var k = gr;
  Object.defineProperty(t, "loadCommonMessageInfoRelaxed", { enumerable: !0, get: function() {
    return k.loadCommonMessageInfoRelaxed;
  } }), Object.defineProperty(t, "storeCommonMessageInfoRelaxed", { enumerable: !0, get: function() {
    return k.storeCommonMessageInfoRelaxed;
  } });
  var P = mr;
  Object.defineProperty(t, "loadComputeSkipReason", { enumerable: !0, get: function() {
    return P.loadComputeSkipReason;
  } }), Object.defineProperty(t, "storeComputeSkipReason", { enumerable: !0, get: function() {
    return P.storeComputeSkipReason;
  } });
  var E = bt;
  Object.defineProperty(t, "loadCurrencyCollection", { enumerable: !0, get: function() {
    return E.loadCurrencyCollection;
  } }), Object.defineProperty(t, "storeCurrencyCollection", { enumerable: !0, get: function() {
    return E.storeCurrencyCollection;
  } });
  var $ = yr;
  Object.defineProperty(t, "loadDepthBalanceInfo", { enumerable: !0, get: function() {
    return $.loadDepthBalanceInfo;
  } }), Object.defineProperty(t, "storeDepthBalanceInfo", { enumerable: !0, get: function() {
    return $.storeDepthBalanceInfo;
  } });
  var L = br;
  Object.defineProperty(t, "loadHashUpdate", { enumerable: !0, get: function() {
    return L.loadHashUpdate;
  } }), Object.defineProperty(t, "storeHashUpdate", { enumerable: !0, get: function() {
    return L.storeHashUpdate;
  } });
  var ee = mn;
  Object.defineProperty(t, "loadMasterchainStateExtra", { enumerable: !0, get: function() {
    return ee.loadMasterchainStateExtra;
  } });
  var ae = Rt;
  Object.defineProperty(t, "loadMessage", { enumerable: !0, get: function() {
    return ae.loadMessage;
  } }), Object.defineProperty(t, "storeMessage", { enumerable: !0, get: function() {
    return ae.storeMessage;
  } });
  var fe = hr;
  Object.defineProperty(t, "loadMessageRelaxed", { enumerable: !0, get: function() {
    return fe.loadMessageRelaxed;
  } }), Object.defineProperty(t, "storeMessageRelaxed", { enumerable: !0, get: function() {
    return fe.storeMessageRelaxed;
  } });
  var X = xo;
  Object.defineProperty(t, "SendMode", { enumerable: !0, get: function() {
    return X.SendMode;
  } });
  var Y = vr;
  Object.defineProperty(t, "loadShardAccount", { enumerable: !0, get: function() {
    return Y.loadShardAccount;
  } }), Object.defineProperty(t, "storeShardAccount", { enumerable: !0, get: function() {
    return Y.storeShardAccount;
  } });
  var O = Aa;
  Object.defineProperty(t, "ShardAccountRefValue", { enumerable: !0, get: function() {
    return O.ShardAccountRefValue;
  } }), Object.defineProperty(t, "loadShardAccounts", { enumerable: !0, get: function() {
    return O.loadShardAccounts;
  } }), Object.defineProperty(t, "storeShardAccounts", { enumerable: !0, get: function() {
    return O.storeShardAccounts;
  } });
  var T = wr;
  Object.defineProperty(t, "loadShardIdent", { enumerable: !0, get: function() {
    return T.loadShardIdent;
  } }), Object.defineProperty(t, "storeShardIdent", { enumerable: !0, get: function() {
    return T.storeShardIdent;
  } });
  var W = Wn;
  Object.defineProperty(t, "loadShardStateUnsplit", { enumerable: !0, get: function() {
    return W.loadShardStateUnsplit;
  } });
  var H = It;
  Object.defineProperty(t, "loadSimpleLibrary", { enumerable: !0, get: function() {
    return H.loadSimpleLibrary;
  } }), Object.defineProperty(t, "storeSimpleLibrary", { enumerable: !0, get: function() {
    return H.storeSimpleLibrary;
  } });
  var ie = xr;
  Object.defineProperty(t, "loadSplitMergeInfo", { enumerable: !0, get: function() {
    return ie.loadSplitMergeInfo;
  } }), Object.defineProperty(t, "storeSplitMergeInfo", { enumerable: !0, get: function() {
    return ie.storeSplitMergeInfo;
  } });
  var Me = At;
  Object.defineProperty(t, "loadStateInit", { enumerable: !0, get: function() {
    return Me.loadStateInit;
  } }), Object.defineProperty(t, "storeStateInit", { enumerable: !0, get: function() {
    return Me.storeStateInit;
  } });
  var Pe = cr;
  Object.defineProperty(t, "loadStorageInfo", { enumerable: !0, get: function() {
    return Pe.loadStorageInfo;
  } }), Object.defineProperty(t, "storeStorageInfo", { enumerable: !0, get: function() {
    return Pe.storeStorageInfo;
  } });
  var Fe = dr;
  Object.defineProperty(t, "loadStorageUsed", { enumerable: !0, get: function() {
    return Fe.loadStorageUsed;
  } }), Object.defineProperty(t, "storeStorageUsed", { enumerable: !0, get: function() {
    return Fe.storeStorageUsed;
  } });
  var Ye = Xt;
  Object.defineProperty(t, "loadStorageUsedShort", { enumerable: !0, get: function() {
    return Ye.loadStorageUsedShort;
  } }), Object.defineProperty(t, "storeStorageUsedShort", { enumerable: !0, get: function() {
    return Ye.storeStorageUsedShort;
  } });
  var He = ir;
  Object.defineProperty(t, "loadTickTock", { enumerable: !0, get: function() {
    return He.loadTickTock;
  } }), Object.defineProperty(t, "storeTickTock", { enumerable: !0, get: function() {
    return He.storeTickTock;
  } });
  var U = Eo();
  Object.defineProperty(t, "loadTransaction", { enumerable: !0, get: function() {
    return U.loadTransaction;
  } }), Object.defineProperty(t, "storeTransaction", { enumerable: !0, get: function() {
    return U.storeTransaction;
  } });
  var S = _r;
  Object.defineProperty(t, "loadTransactionActionPhase", { enumerable: !0, get: function() {
    return S.loadTransactionActionPhase;
  } }), Object.defineProperty(t, "storeTransactionActionPhase", { enumerable: !0, get: function() {
    return S.storeTransactionActionPhase;
  } });
  var Z = kr;
  Object.defineProperty(t, "loadTransactionBouncePhase", { enumerable: !0, get: function() {
    return Z.loadTransactionBouncePhase;
  } }), Object.defineProperty(t, "storeTransactionBouncePhase", { enumerable: !0, get: function() {
    return Z.storeTransactionBouncePhase;
  } });
  var le = Br;
  Object.defineProperty(t, "loadTransactionComputePhase", { enumerable: !0, get: function() {
    return le.loadTransactionComputePhase;
  } }), Object.defineProperty(t, "storeTransactionComputePhase", { enumerable: !0, get: function() {
    return le.storeTransactionComputePhase;
  } });
  var Ae = Sr;
  Object.defineProperty(t, "loadTransactionCreditPhase", { enumerable: !0, get: function() {
    return Ae.loadTransactionCreditPhase;
  } }), Object.defineProperty(t, "storeTransactionCreditPhase", { enumerable: !0, get: function() {
    return Ae.storeTransactionCreditPhase;
  } });
  var Oe = Co();
  Object.defineProperty(t, "loadTransactionDescription", { enumerable: !0, get: function() {
    return Oe.loadTransactionDescription;
  } }), Object.defineProperty(t, "storeTransactionDescription", { enumerable: !0, get: function() {
    return Oe.storeTransactionDescription;
  } });
  var x = Pr;
  Object.defineProperty(t, "loadTransactionStoragePhase", { enumerable: !0, get: function() {
    return x.loadTransactionStoragePhase;
  } }), Object.defineProperty(t, "storeTransactionsStoragePhase", { enumerable: !0, get: function() {
    return x.storeTransactionsStoragePhase;
  } });
})(Zi);
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.openContract = void 0;
const fc = yt, ri = Cr();
function hc(t, e) {
  let r, i = null;
  if (!fc.Address.isAddress(t.address))
    throw Error("Invalid address");
  if (r = t.address, t.init) {
    if (!(t.init.code instanceof ri.Cell))
      throw Error("Invalid init.code");
    if (!(t.init.data instanceof ri.Cell))
      throw Error("Invalid init.data");
    i = t.init;
  }
  let u = e({ address: r, init: i });
  return new Proxy(t, {
    get(f, o) {
      const h = f[o];
      return typeof o == "string" && (o.startsWith("get") || o.startsWith("send")) && typeof h == "function" ? (...m) => h.apply(f, [u, ...m]) : h;
    }
  });
}
Xn.openContract = hc;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.ComputeError = void 0;
class Ca extends Error {
  constructor(e, r, i) {
    super(e), this.exitCode = r, this.debugLogs = i && i.debugLogs ? i.debugLogs : null, this.logs = i && i.logs ? i.logs : null, Object.setPrototypeOf(this, Ca.prototype);
  }
}
Jn.ComputeError = Ca;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.getMethodId = void 0;
const gc = new Int16Array([
  0,
  4129,
  8258,
  12387,
  16516,
  20645,
  24774,
  28903,
  33032,
  37161,
  41290,
  45419,
  49548,
  53677,
  57806,
  61935,
  4657,
  528,
  12915,
  8786,
  21173,
  17044,
  29431,
  25302,
  37689,
  33560,
  45947,
  41818,
  54205,
  50076,
  62463,
  58334,
  9314,
  13379,
  1056,
  5121,
  25830,
  29895,
  17572,
  21637,
  42346,
  46411,
  34088,
  38153,
  58862,
  62927,
  50604,
  54669,
  13907,
  9842,
  5649,
  1584,
  30423,
  26358,
  22165,
  18100,
  46939,
  42874,
  38681,
  34616,
  63455,
  59390,
  55197,
  51132,
  18628,
  22757,
  26758,
  30887,
  2112,
  6241,
  10242,
  14371,
  51660,
  55789,
  59790,
  63919,
  35144,
  39273,
  43274,
  47403,
  23285,
  19156,
  31415,
  27286,
  6769,
  2640,
  14899,
  10770,
  56317,
  52188,
  64447,
  60318,
  39801,
  35672,
  47931,
  43802,
  27814,
  31879,
  19684,
  23749,
  11298,
  15363,
  3168,
  7233,
  60846,
  64911,
  52716,
  56781,
  44330,
  48395,
  36200,
  40265,
  32407,
  28342,
  24277,
  20212,
  15891,
  11826,
  7761,
  3696,
  65439,
  61374,
  57309,
  53244,
  48923,
  44858,
  40793,
  36728,
  37256,
  33193,
  45514,
  41451,
  53516,
  49453,
  61774,
  57711,
  4224,
  161,
  12482,
  8419,
  20484,
  16421,
  28742,
  24679,
  33721,
  37784,
  41979,
  46042,
  49981,
  54044,
  58239,
  62302,
  689,
  4752,
  8947,
  13010,
  16949,
  21012,
  25207,
  29270,
  46570,
  42443,
  38312,
  34185,
  62830,
  58703,
  54572,
  50445,
  13538,
  9411,
  5280,
  1153,
  29798,
  25671,
  21540,
  17413,
  42971,
  47098,
  34713,
  38840,
  59231,
  63358,
  50973,
  55100,
  9939,
  14066,
  1681,
  5808,
  26199,
  30326,
  17941,
  22068,
  55628,
  51565,
  63758,
  59695,
  39368,
  35305,
  47498,
  43435,
  22596,
  18533,
  30726,
  26663,
  6336,
  2273,
  14466,
  10403,
  52093,
  56156,
  60223,
  64286,
  35833,
  39896,
  43963,
  48026,
  19061,
  23124,
  27191,
  31254,
  2801,
  6864,
  10931,
  14994,
  64814,
  60687,
  56684,
  52557,
  48554,
  44427,
  40424,
  36297,
  31782,
  27655,
  23652,
  19525,
  15522,
  11395,
  7392,
  3265,
  61215,
  65342,
  53085,
  57212,
  44955,
  49082,
  36825,
  40952,
  28183,
  32310,
  20053,
  24180,
  11923,
  16050,
  3793,
  7920
]);
function pc(t) {
  t instanceof Buffer || (t = Buffer.from(t));
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    e = (gc[(e >> 8 ^ i) & 255] ^ e << 8) & 65535;
  }
  return e;
}
function mc(t) {
  return pc(t) & 65535 | 65536;
}
Zn.getMethodId = mc;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.safeSignVerify = qr.safeSign = void 0;
const Ea = Pa(), yc = 8, bc = 64;
function Uo(t, e) {
  let r = Buffer.from(e);
  if (r.length > bc)
    throw Error("Seed can	 be longer than 64 bytes");
  if (r.length < yc)
    throw Error("Seed must be at least 8 bytes");
  return (0, Ea.sha256_sync)(Buffer.concat([Buffer.from([255, 255]), r, t.hash()]));
}
function vc(t, e, r = "ton-safe-sign-magic") {
  return (0, Ea.sign)(Uo(t, r), e);
}
qr.safeSign = vc;
function wc(t, e, r, i = "ton-safe-sign-magic") {
  return (0, Ea.signVerify)(Uo(t, i), e, r);
}
qr.safeSignVerify = wc;
(function(t) {
  var e = Ke && Ke.__createBinding || (Object.create ? function(Z, le, Ae, Oe) {
    Oe === void 0 && (Oe = Ae);
    var x = Object.getOwnPropertyDescriptor(le, Ae);
    (!x || ("get" in x ? !le.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return le[Ae];
    } }), Object.defineProperty(Z, Oe, x);
  } : function(Z, le, Ae, Oe) {
    Oe === void 0 && (Oe = Ae), Z[Oe] = le[Ae];
  }), r = Ke && Ke.__exportStar || function(Z, le) {
    for (var Ae in Z) Ae !== "default" && !Object.prototype.hasOwnProperty.call(le, Ae) && e(le, Z, Ae);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), t.safeSignVerify = t.safeSign = t.getMethodId = t.base32Encode = t.base32Decode = t.crc32c = t.crc16 = t.fromNano = t.toNano = t.ComputeError = t.openContract = t.TupleBuilder = t.TupleReader = t.serializeTuple = t.parseTuple = t.generateMerkleUpdate = t.generateMerkleProof = t.exoticPruned = t.exoticMerkleUpdate = t.exoticMerkleProof = t.Dictionary = t.Cell = t.CellType = t.Slice = t.beginCell = t.Builder = t.BitBuilder = t.BitReader = t.BitString = t.contractAddress = t.ADNLAddress = t.ExternalAddress = t.address = t.Address = void 0;
  var i = yt;
  Object.defineProperty(t, "Address", { enumerable: !0, get: function() {
    return i.Address;
  } }), Object.defineProperty(t, "address", { enumerable: !0, get: function() {
    return i.address;
  } });
  var u = Lr;
  Object.defineProperty(t, "ExternalAddress", { enumerable: !0, get: function() {
    return u.ExternalAddress;
  } });
  var f = An;
  Object.defineProperty(t, "ADNLAddress", { enumerable: !0, get: function() {
    return f.ADNLAddress;
  } });
  var o = Cn;
  Object.defineProperty(t, "contractAddress", { enumerable: !0, get: function() {
    return o.contractAddress;
  } });
  var h = Jt();
  Object.defineProperty(t, "BitString", { enumerable: !0, get: function() {
    return h.BitString;
  } });
  var m = xt;
  Object.defineProperty(t, "BitReader", { enumerable: !0, get: function() {
    return m.BitReader;
  } });
  var k = Un();
  Object.defineProperty(t, "BitBuilder", { enumerable: !0, get: function() {
    return k.BitBuilder;
  } });
  var P = it();
  Object.defineProperty(t, "Builder", { enumerable: !0, get: function() {
    return P.Builder;
  } }), Object.defineProperty(t, "beginCell", { enumerable: !0, get: function() {
    return P.beginCell;
  } });
  var E = ba();
  Object.defineProperty(t, "Slice", { enumerable: !0, get: function() {
    return E.Slice;
  } });
  var $ = Fr;
  Object.defineProperty(t, "CellType", { enumerable: !0, get: function() {
    return $.CellType;
  } });
  var L = Cr();
  Object.defineProperty(t, "Cell", { enumerable: !0, get: function() {
    return L.Cell;
  } });
  var ee = Ar();
  Object.defineProperty(t, "Dictionary", { enumerable: !0, get: function() {
    return ee.Dictionary;
  } });
  var ae = Kr;
  Object.defineProperty(t, "exoticMerkleProof", { enumerable: !0, get: function() {
    return ae.exoticMerkleProof;
  } });
  var fe = Hr;
  Object.defineProperty(t, "exoticMerkleUpdate", { enumerable: !0, get: function() {
    return fe.exoticMerkleUpdate;
  } });
  var X = Vr;
  Object.defineProperty(t, "exoticPruned", { enumerable: !0, get: function() {
    return X.exoticPruned;
  } });
  var Y = ya();
  Object.defineProperty(t, "generateMerkleProof", { enumerable: !0, get: function() {
    return Y.generateMerkleProof;
  } });
  var O = yi();
  Object.defineProperty(t, "generateMerkleUpdate", { enumerable: !0, get: function() {
    return O.generateMerkleUpdate;
  } });
  var T = Nr;
  Object.defineProperty(t, "parseTuple", { enumerable: !0, get: function() {
    return T.parseTuple;
  } }), Object.defineProperty(t, "serializeTuple", { enumerable: !0, get: function() {
    return T.serializeTuple;
  } });
  var W = Gn;
  Object.defineProperty(t, "TupleReader", { enumerable: !0, get: function() {
    return W.TupleReader;
  } });
  var H = Yn;
  Object.defineProperty(t, "TupleBuilder", { enumerable: !0, get: function() {
    return H.TupleBuilder;
  } }), r(Zi, t);
  var ie = Xn;
  Object.defineProperty(t, "openContract", { enumerable: !0, get: function() {
    return ie.openContract;
  } });
  var Me = Jn;
  Object.defineProperty(t, "ComputeError", { enumerable: !0, get: function() {
    return Me.ComputeError;
  } });
  var Pe = or;
  Object.defineProperty(t, "toNano", { enumerable: !0, get: function() {
    return Pe.toNano;
  } }), Object.defineProperty(t, "fromNano", { enumerable: !0, get: function() {
    return Pe.fromNano;
  } });
  var Fe = $r;
  Object.defineProperty(t, "crc16", { enumerable: !0, get: function() {
    return Fe.crc16;
  } });
  var Ye = pn;
  Object.defineProperty(t, "crc32c", { enumerable: !0, get: function() {
    return Ye.crc32c;
  } });
  var He = ar;
  Object.defineProperty(t, "base32Decode", { enumerable: !0, get: function() {
    return He.base32Decode;
  } }), Object.defineProperty(t, "base32Encode", { enumerable: !0, get: function() {
    return He.base32Encode;
  } });
  var U = Zn;
  Object.defineProperty(t, "getMethodId", { enumerable: !0, get: function() {
    return U.getMethodId;
  } });
  var S = qr;
  Object.defineProperty(t, "safeSign", { enumerable: !0, get: function() {
    return S.safeSign;
  } }), Object.defineProperty(t, "safeSignVerify", { enumerable: !0, get: function() {
    return S.safeSignVerify;
  } });
})(pt);
var tt = {};
Object.defineProperty(tt, "__esModule", { value: !0 });
var To = tt.Api = Mo = tt.HttpClient = tt.ContentType = tt.PoolImplementationType = tt.JettonVerificationType = tt.BouncePhaseType = tt.ComputeSkipReason = tt.AccStatusChange = tt.TransactionType = tt.AccountStatus = void 0, ni;
(function(t) {
  t.Nonexist = "nonexist", t.Uninit = "uninit", t.Active = "active", t.Frozen = "frozen";
})(ni || (tt.AccountStatus = ni = {}));
var ai;
(function(t) {
  t.TransOrd = "TransOrd", t.TransTickTock = "TransTickTock", t.TransSplitPrepare = "TransSplitPrepare", t.TransSplitInstall = "TransSplitInstall", t.TransMergePrepare = "TransMergePrepare", t.TransMergeInstall = "TransMergeInstall", t.TransStorage = "TransStorage";
})(ai || (tt.TransactionType = ai = {}));
var ii;
(function(t) {
  t.AcstUnchanged = "acst_unchanged", t.AcstFrozen = "acst_frozen", t.AcstDeleted = "acst_deleted";
})(ii || (tt.AccStatusChange = ii = {}));
var oi;
(function(t) {
  t.CskipNoState = "cskip_no_state", t.CskipBadState = "cskip_bad_state", t.CskipNoGas = "cskip_no_gas";
})(oi || (tt.ComputeSkipReason = oi = {}));
var si;
(function(t) {
  t.TrPhaseBounceNegfunds = "TrPhaseBounceNegfunds", t.TrPhaseBounceNofunds = "TrPhaseBounceNofunds", t.TrPhaseBounceOk = "TrPhaseBounceOk";
})(si || (tt.BouncePhaseType = si = {}));
var li;
(function(t) {
  t.Whitelist = "whitelist", t.Blacklist = "blacklist", t.None = "none";
})(li || (tt.JettonVerificationType = li = {}));
var ui;
(function(t) {
  t.Whales = "whales", t.Tf = "tf", t.LiquidTF = "liquidTF";
})(ui || (tt.PoolImplementationType = ui = {}));
var $t;
(function(t) {
  t.Json = "application/json", t.FormData = "multipart/form-data", t.UrlEncoded = "application/x-www-form-urlencoded", t.Text = "text/plain";
})($t || (tt.ContentType = $t = {}));
class xc {
  constructor(e = {}) {
    Le(this, "baseUrl", "https://tonapi.io");
    Le(this, "securityData", null);
    Le(this, "securityWorker");
    Le(this, "abortControllers", /* @__PURE__ */ new Map());
    Le(this, "customFetch", (...e) => fetch(...e));
    Le(this, "baseApiParams", {
      credentials: "same-origin",
      headers: {},
      redirect: "follow",
      referrerPolicy: "no-referrer"
    });
    Le(this, "setSecurityData", (e) => {
      this.securityData = e;
    });
    Le(this, "contentFormatters", {
      [$t.Json]: (e) => e !== null && (typeof e == "object" || typeof e == "string") ? JSON.stringify(e) : e,
      [$t.Text]: (e) => e !== null && typeof e != "string" ? JSON.stringify(e) : e,
      [$t.FormData]: (e) => Object.keys(e || {}).reduce((r, i) => {
        const u = e[i];
        return r.append(i, u instanceof Blob ? u : typeof u == "object" && u !== null ? JSON.stringify(u) : `${u}`), r;
      }, new FormData()),
      [$t.UrlEncoded]: (e) => this.toQueryString(e)
    });
    Le(this, "createAbortSignal", (e) => {
      if (this.abortControllers.has(e)) {
        const i = this.abortControllers.get(e);
        return i ? i.signal : void 0;
      }
      const r = new AbortController();
      return this.abortControllers.set(e, r), r.signal;
    });
    Le(this, "abortRequest", (e) => {
      const r = this.abortControllers.get(e);
      r && (r.abort(), this.abortControllers.delete(e));
    });
    Le(this, "request", async ({ body: e, secure: r, path: i, type: u, query: f, format: o, baseUrl: h, cancelToken: m, ...k }) => {
      const P = (typeof r == "boolean" ? r : this.baseApiParams.secure) && this.securityWorker && await this.securityWorker(this.securityData) || {}, E = this.mergeRequestParams(k, P), $ = f && this.toQueryString(f), L = this.contentFormatters[u || $t.Json], ee = o || E.format;
      return this.customFetch(`${h || this.baseUrl || ""}${i}${$ ? `?${$}` : ""}`, {
        ...E,
        headers: {
          ...E.headers || {},
          ...u && u !== $t.FormData ? { "Content-Type": u } : {}
        },
        signal: (m ? this.createAbortSignal(m) : E.signal) || null,
        body: typeof e > "u" || e === null ? null : L(e)
      }).then(async (ae) => {
        const fe = ae;
        fe.data = null, fe.error = null;
        const X = ee ? await ae[ee]().then((Y) => (fe.ok ? fe.data = Y : fe.error = Y, fe)).catch((Y) => (fe.error = Y, fe)) : fe;
        if (m && this.abortControllers.delete(m), !ae.ok)
          throw X;
        return X.data;
      });
    });
    Object.assign(this, e);
  }
  encodeQueryParam(e, r) {
    return `${encodeURIComponent(e)}=${encodeURIComponent(typeof r == "number" ? r : `${r}`)}`;
  }
  addQueryParam(e, r) {
    return this.encodeQueryParam(r, e[r]);
  }
  addArrayQueryParam(e, r) {
    return e[r].map((u) => this.encodeQueryParam(r, u)).join("&");
  }
  toQueryString(e) {
    const r = e || {};
    return Object.keys(r).filter((u) => typeof r[u] < "u").map((u) => Array.isArray(r[u]) ? this.addArrayQueryParam(r, u) : this.addQueryParam(r, u)).join("&");
  }
  addQueryParams(e) {
    const r = this.toQueryString(e);
    return r ? `?${r}` : "";
  }
  mergeRequestParams(e, r) {
    return {
      ...this.baseApiParams,
      ...e,
      ...r || {},
      headers: {
        ...this.baseApiParams.headers || {},
        ...e.headers || {},
        ...r && r.headers || {}
      }
    };
  }
}
var Mo = tt.HttpClient = xc;
class _c {
  constructor(e) {
    Le(this, "http");
    Le(this, "blockchain", {
      /**
       * @description Reduce indexing latency
       *
       * @tags Blockchain
       * @name ReduceIndexingLatency
       * @request GET:/v2/status
       */
      reduceIndexingLatency: (e = {}) => this.http.request({
        path: "/v2/status",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get blockchain block data
       *
       * @tags Blockchain
       * @name GetBlockchainBlock
       * @request GET:/v2/blockchain/blocks/{block_id}
       */
      getBlockchainBlock: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/blocks/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get blockchain block shards
       *
       * @tags Blockchain
       * @name GetBlockchainMasterchainShards
       * @request GET:/v2/blockchain/masterchain/{masterchain_seqno}/shards
       */
      getBlockchainMasterchainShards: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/masterchain/${e}/shards`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get all blocks in all shards and workchains between target and previous masterchain block according to shards last blocks snapshot in masterchain.  We don't recommend to build your app around this method because it has problem with scalability and will work very slow in the future.
       *
       * @tags Blockchain
       * @name GetBlockchainMasterchainBlocks
       * @request GET:/v2/blockchain/masterchain/{masterchain_seqno}/blocks
       */
      getBlockchainMasterchainBlocks: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/masterchain/${e}/blocks`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get all transactions in all shards and workchains between target and previous masterchain block according to shards last blocks snapshot in masterchain. We don't recommend to build your app around this method because it has problem with scalability and will work very slow in the future.
       *
       * @tags Blockchain
       * @name GetBlockchainMasterchainTransactions
       * @request GET:/v2/blockchain/masterchain/{masterchain_seqno}/transactions
       */
      getBlockchainMasterchainTransactions: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/masterchain/${e}/transactions`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get blockchain config from a specific block, if present.
       *
       * @tags Blockchain
       * @name GetBlockchainConfigFromBlock
       * @request GET:/v2/blockchain/masterchain/{masterchain_seqno}/config
       */
      getBlockchainConfigFromBlock: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/masterchain/${e}/config`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get raw blockchain config from a specific block, if present.
       *
       * @tags Blockchain
       * @name GetRawBlockchainConfigFromBlock
       * @request GET:/v2/blockchain/masterchain/{masterchain_seqno}/config/raw
       */
      getRawBlockchainConfigFromBlock: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/masterchain/${e}/config/raw`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get transactions from block
       *
       * @tags Blockchain
       * @name GetBlockchainBlockTransactions
       * @request GET:/v2/blockchain/blocks/{block_id}/transactions
       */
      getBlockchainBlockTransactions: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/blocks/${e}/transactions`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get transaction data
       *
       * @tags Blockchain
       * @name GetBlockchainTransaction
       * @request GET:/v2/blockchain/transactions/{transaction_id}
       */
      getBlockchainTransaction: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/transactions/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get transaction data by message hash
       *
       * @tags Blockchain
       * @name GetBlockchainTransactionByMessageHash
       * @request GET:/v2/blockchain/messages/{msg_id}/transaction
       */
      getBlockchainTransactionByMessageHash: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/messages/${e}/transaction`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get blockchain validators
       *
       * @tags Blockchain
       * @name GetBlockchainValidators
       * @request GET:/v2/blockchain/validators
       */
      getBlockchainValidators: (e = {}) => this.http.request({
        path: "/v2/blockchain/validators",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get last known masterchain block
       *
       * @tags Blockchain
       * @name GetBlockchainMasterchainHead
       * @request GET:/v2/blockchain/masterchain-head
       */
      getBlockchainMasterchainHead: (e = {}) => this.http.request({
        path: "/v2/blockchain/masterchain-head",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get low-level information about an account taken directly from the blockchain.
       *
       * @tags Blockchain
       * @name GetBlockchainRawAccount
       * @request GET:/v2/blockchain/accounts/{account_id}
       */
      getBlockchainRawAccount: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/accounts/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get account transactions
       *
       * @tags Blockchain
       * @name GetBlockchainAccountTransactions
       * @request GET:/v2/blockchain/accounts/{account_id}/transactions
       */
      getBlockchainAccountTransactions: (e, r, i = {}) => this.http.request({
        path: `/v2/blockchain/accounts/${e}/transactions`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Execute get method for account
       *
       * @tags Blockchain
       * @name ExecGetMethodForBlockchainAccount
       * @request GET:/v2/blockchain/accounts/{account_id}/methods/{method_name}
       */
      execGetMethodForBlockchainAccount: (e, r, i, u = {}) => this.http.request({
        path: `/v2/blockchain/accounts/${e}/methods/${r}`,
        method: "GET",
        query: i,
        format: "json",
        ...u
      }),
      /**
       * @description Send message to blockchain
       *
       * @tags Blockchain
       * @name SendBlockchainMessage
       * @request POST:/v2/blockchain/message
       */
      sendBlockchainMessage: (e, r = {}) => this.http.request({
        path: "/v2/blockchain/message",
        method: "POST",
        body: e,
        ...r
      }),
      /**
       * @description Get blockchain config
       *
       * @tags Blockchain
       * @name GetBlockchainConfig
       * @request GET:/v2/blockchain/config
       */
      getBlockchainConfig: (e = {}) => this.http.request({
        path: "/v2/blockchain/config",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get raw blockchain config
       *
       * @tags Blockchain
       * @name GetRawBlockchainConfig
       * @request GET:/v2/blockchain/config/raw
       */
      getRawBlockchainConfig: (e = {}) => this.http.request({
        path: "/v2/blockchain/config/raw",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Blockchain account inspect
       *
       * @tags Blockchain
       * @name BlockchainAccountInspect
       * @request GET:/v2/blockchain/accounts/{account_id}/inspect
       */
      blockchainAccountInspect: (e, r = {}) => this.http.request({
        path: `/v2/blockchain/accounts/${e}/inspect`,
        method: "GET",
        format: "json",
        ...r
      })
    });
    Le(this, "emulation", {
      /**
       * @description Decode a given message. Only external incoming messages can be decoded currently.
       *
       * @tags Emulation
       * @name DecodeMessage
       * @request POST:/v2/message/decode
       */
      decodeMessage: (e, r = {}) => this.http.request({
        path: "/v2/message/decode",
        method: "POST",
        body: e,
        format: "json",
        ...r
      }),
      /**
       * @description Emulate sending message to blockchain
       *
       * @tags Emulation
       * @name EmulateMessageToEvent
       * @request POST:/v2/events/emulate
       */
      emulateMessageToEvent: (e, r, i = {}) => this.http.request({
        path: "/v2/events/emulate",
        method: "POST",
        query: r,
        body: e,
        format: "json",
        ...i
      }),
      /**
       * @description Emulate sending message to blockchain
       *
       * @tags Emulation
       * @name EmulateMessageToTrace
       * @request POST:/v2/traces/emulate
       */
      emulateMessageToTrace: (e, r, i = {}) => this.http.request({
        path: "/v2/traces/emulate",
        method: "POST",
        query: r,
        body: e,
        format: "json",
        ...i
      }),
      /**
       * @description Emulate sending message to blockchain
       *
       * @tags Emulation
       * @name EmulateMessageToWallet
       * @request POST:/v2/wallet/emulate
       */
      emulateMessageToWallet: (e, r = {}) => this.http.request({
        path: "/v2/wallet/emulate",
        method: "POST",
        body: e,
        format: "json",
        ...r
      }),
      /**
       * @description Emulate sending message to blockchain
       *
       * @tags Emulation
       * @name EmulateMessageToAccountEvent
       * @request POST:/v2/accounts/{account_id}/events/emulate
       */
      emulateMessageToAccountEvent: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/events/emulate`,
        method: "POST",
        body: r,
        format: "json",
        ...i
      })
    });
    Le(this, "accounts", {
      /**
       * @description parse address and display in all formats
       *
       * @tags Accounts
       * @name AddressParse
       * @request GET:/v2/address/{account_id}/parse
       */
      addressParse: (e, r = {}) => this.http.request({
        path: `/v2/address/${e}/parse`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get human-friendly information about several accounts without low-level details.
       *
       * @tags Accounts
       * @name GetAccounts
       * @request POST:/v2/accounts/_bulk
       */
      getAccounts: (e, r = {}) => this.http.request({
        path: "/v2/accounts/_bulk",
        method: "POST",
        body: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get human-friendly information about an account without low-level details.
       *
       * @tags Accounts
       * @name GetAccount
       * @request GET:/v2/accounts/{account_id}
       */
      getAccount: (e, r = {}) => this.http.request({
        path: `/v2/accounts/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get account's domains
       *
       * @tags Accounts
       * @name AccountDnsBackResolve
       * @request GET:/v2/accounts/{account_id}/dns/backresolve
       */
      accountDnsBackResolve: (e, r = {}) => this.http.request({
        path: `/v2/accounts/${e}/dns/backresolve`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get all Jettons balances by owner address
       *
       * @tags Accounts
       * @name GetAccountJettonsBalances
       * @request GET:/v2/accounts/{account_id}/jettons
       */
      getAccountJettonsBalances: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/jettons`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get the transfer jettons history for account
       *
       * @tags Accounts
       * @name GetAccountJettonsHistory
       * @request GET:/v2/accounts/{account_id}/jettons/history
       */
      getAccountJettonsHistory: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/jettons/history`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get the transfer jetton history for account and jetton
       *
       * @tags Accounts
       * @name GetAccountJettonHistoryById
       * @request GET:/v2/accounts/{account_id}/jettons/{jetton_id}/history
       */
      getAccountJettonHistoryById: (e, r, i, u = {}) => this.http.request({
        path: `/v2/accounts/${e}/jettons/${r}/history`,
        method: "GET",
        query: i,
        format: "json",
        ...u
      }),
      /**
       * @description Get all NFT items by owner address
       *
       * @tags Accounts
       * @name GetAccountNftItems
       * @request GET:/v2/accounts/{account_id}/nfts
       */
      getAccountNftItems: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/nfts`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get events for an account. Each event is built on top of a trace which is a series of transactions caused by one inbound message. TonAPI looks for known patterns inside the trace and splits the trace into actions, where a single action represents a meaningful high-level operation like a Jetton Transfer or an NFT Purchase. Actions are expected to be shown to users. It is advised not to build any logic on top of actions because actions can be changed at any time.
       *
       * @tags Accounts
       * @name GetAccountEvents
       * @request GET:/v2/accounts/{account_id}/events
       */
      getAccountEvents: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/events`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get event for an account by event_id
       *
       * @tags Accounts
       * @name GetAccountEvent
       * @request GET:/v2/accounts/{account_id}/events/{event_id}
       */
      getAccountEvent: (e, r, i, u = {}) => this.http.request({
        path: `/v2/accounts/${e}/events/${r}`,
        method: "GET",
        query: i,
        format: "json",
        ...u
      }),
      /**
       * @description Get traces for account
       *
       * @tags Accounts
       * @name GetAccountTraces
       * @request GET:/v2/accounts/{account_id}/traces
       */
      getAccountTraces: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/traces`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get all subscriptions by wallet address
       *
       * @tags Accounts
       * @name GetAccountSubscriptions
       * @request GET:/v2/accounts/{account_id}/subscriptions
       */
      getAccountSubscriptions: (e, r = {}) => this.http.request({
        path: `/v2/accounts/${e}/subscriptions`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Update internal cache for a particular account
       *
       * @tags Accounts
       * @name ReindexAccount
       * @request POST:/v2/accounts/{account_id}/reindex
       */
      reindexAccount: (e, r = {}) => this.http.request({
        path: `/v2/accounts/${e}/reindex`,
        method: "POST",
        ...r
      }),
      /**
       * @description Search by account domain name
       *
       * @tags Accounts
       * @name SearchAccounts
       * @request GET:/v2/accounts/search
       */
      searchAccounts: (e, r = {}) => this.http.request({
        path: "/v2/accounts/search",
        method: "GET",
        query: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get expiring account .ton dns
       *
       * @tags Accounts
       * @name GetAccountDnsExpiring
       * @request GET:/v2/accounts/{account_id}/dns/expiring
       */
      getAccountDnsExpiring: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/dns/expiring`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get public key by account id
       *
       * @tags Accounts
       * @name GetAccountPublicKey
       * @request GET:/v2/accounts/{account_id}/publickey
       */
      getAccountPublicKey: (e, r = {}) => this.http.request({
        path: `/v2/accounts/${e}/publickey`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get account's balance change
       *
       * @tags Accounts
       * @name GetAccountDiff
       * @request GET:/v2/accounts/{account_id}/diff
       */
      getAccountDiff: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/diff`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      })
    });
    Le(this, "nft", {
      /**
       * @description Get the transfer nft history
       *
       * @tags NFT
       * @name GetAccountNftHistory
       * @request GET:/v2/accounts/{account_id}/nfts/history
       */
      getAccountNftHistory: (e, r, i = {}) => this.http.request({
        path: `/v2/accounts/${e}/nfts/history`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get NFT collections
       *
       * @tags NFT
       * @name GetNftCollections
       * @request GET:/v2/nfts/collections
       */
      getNftCollections: (e, r = {}) => this.http.request({
        path: "/v2/nfts/collections",
        method: "GET",
        query: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get NFT collection by collection address
       *
       * @tags NFT
       * @name GetNftCollection
       * @request GET:/v2/nfts/collections/{account_id}
       */
      getNftCollection: (e, r = {}) => this.http.request({
        path: `/v2/nfts/collections/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get NFT items from collection by collection address
       *
       * @tags NFT
       * @name GetItemsFromCollection
       * @request GET:/v2/nfts/collections/{account_id}/items
       */
      getItemsFromCollection: (e, r, i = {}) => this.http.request({
        path: `/v2/nfts/collections/${e}/items`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get NFT items by their addresses
       *
       * @tags NFT
       * @name GetNftItemsByAddresses
       * @request POST:/v2/nfts/_bulk
       */
      getNftItemsByAddresses: (e, r = {}) => this.http.request({
        path: "/v2/nfts/_bulk",
        method: "POST",
        body: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get NFT item by its address
       *
       * @tags NFT
       * @name GetNftItemByAddress
       * @request GET:/v2/nfts/{account_id}
       */
      getNftItemByAddress: (e, r = {}) => this.http.request({
        path: `/v2/nfts/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get the transfer nfts history for account
       *
       * @tags NFT
       * @name GetNftHistoryById
       * @request GET:/v2/nfts/{account_id}/history
       */
      getNftHistoryById: (e, r, i = {}) => this.http.request({
        path: `/v2/nfts/${e}/history`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      })
    });
    Le(this, "dns", {
      /**
       * @description Get full information about domain name
       *
       * @tags DNS
       * @name GetDnsInfo
       * @request GET:/v2/dns/{domain_name}
       */
      getDnsInfo: (e, r = {}) => this.http.request({
        path: `/v2/dns/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description DNS resolve for domain name
       *
       * @tags DNS
       * @name DnsResolve
       * @request GET:/v2/dns/{domain_name}/resolve
       */
      dnsResolve: (e, r = {}) => this.http.request({
        path: `/v2/dns/${e}/resolve`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get domain bids
       *
       * @tags DNS
       * @name GetDomainBids
       * @request GET:/v2/dns/{domain_name}/bids
       */
      getDomainBids: (e, r = {}) => this.http.request({
        path: `/v2/dns/${e}/bids`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get all auctions
       *
       * @tags DNS
       * @name GetAllAuctions
       * @request GET:/v2/dns/auctions
       */
      getAllAuctions: (e, r = {}) => this.http.request({
        path: "/v2/dns/auctions",
        method: "GET",
        query: e,
        format: "json",
        ...r
      })
    });
    Le(this, "traces", {
      /**
       * @description Get the trace by trace ID or hash of any transaction in trace
       *
       * @tags Traces
       * @name GetTrace
       * @request GET:/v2/traces/{trace_id}
       */
      getTrace: (e, r = {}) => this.http.request({
        path: `/v2/traces/${e}`,
        method: "GET",
        format: "json",
        ...r
      })
    });
    Le(this, "events", {
      /**
       * @description Get an event either by event ID or a hash of any transaction in a trace. An event is built on top of a trace which is a series of transactions caused by one inbound message. TonAPI looks for known patterns inside the trace and splits the trace into actions, where a single action represents a meaningful high-level operation like a Jetton Transfer or an NFT Purchase. Actions are expected to be shown to users. It is advised not to build any logic on top of actions because actions can be changed at any time.
       *
       * @tags Events
       * @name GetEvent
       * @request GET:/v2/events/{event_id}
       */
      getEvent: (e, r = {}) => this.http.request({
        path: `/v2/events/${e}`,
        method: "GET",
        format: "json",
        ...r
      })
    });
    Le(this, "inscriptions", {
      /**
       * @description Get all inscriptions by owner address. It's experimental API and can be dropped in the future.
       *
       * @tags Inscriptions
       * @name GetAccountInscriptions
       * @request GET:/v2/experimental/accounts/{account_id}/inscriptions
       */
      getAccountInscriptions: (e, r, i = {}) => this.http.request({
        path: `/v2/experimental/accounts/${e}/inscriptions`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get the transfer inscriptions history for account. It's experimental API and can be dropped in the future.
       *
       * @tags Inscriptions
       * @name GetAccountInscriptionsHistory
       * @request GET:/v2/experimental/accounts/{account_id}/inscriptions/history
       */
      getAccountInscriptionsHistory: (e, r, i = {}) => this.http.request({
        path: `/v2/experimental/accounts/${e}/inscriptions/history`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get the transfer inscriptions history for account. It's experimental API and can be dropped in the future.
       *
       * @tags Inscriptions
       * @name GetAccountInscriptionsHistoryByTicker
       * @request GET:/v2/experimental/accounts/{account_id}/inscriptions/{ticker}/history
       */
      getAccountInscriptionsHistoryByTicker: (e, r, i, u = {}) => this.http.request({
        path: `/v2/experimental/accounts/${e}/inscriptions/${r}/history`,
        method: "GET",
        query: i,
        format: "json",
        ...u
      }),
      /**
       * @description return comment for making operation with inscription. please don't use it if you don't know what you are doing
       *
       * @tags Inscriptions
       * @name GetInscriptionOpTemplate
       * @request GET:/v2/experimental/inscriptions/op-template
       */
      getInscriptionOpTemplate: (e, r = {}) => this.http.request({
        path: "/v2/experimental/inscriptions/op-template",
        method: "GET",
        query: e,
        format: "json",
        ...r
      })
    });
    Le(this, "jettons", {
      /**
       * @description Get a list of all indexed jetton masters in the blockchain.
       *
       * @tags Jettons
       * @name GetJettons
       * @request GET:/v2/jettons
       */
      getJettons: (e, r = {}) => this.http.request({
        path: "/v2/jettons",
        method: "GET",
        query: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get jetton metadata by jetton master address
       *
       * @tags Jettons
       * @name GetJettonInfo
       * @request GET:/v2/jettons/{account_id}
       */
      getJettonInfo: (e, r = {}) => this.http.request({
        path: `/v2/jettons/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get jetton's holders
       *
       * @tags Jettons
       * @name GetJettonHolders
       * @request GET:/v2/jettons/{account_id}/holders
       */
      getJettonHolders: (e, r, i = {}) => this.http.request({
        path: `/v2/jettons/${e}/holders`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get only jetton transfers in the event
       *
       * @tags Jettons
       * @name GetJettonsEvents
       * @request GET:/v2/events/{event_id}/jettons
       */
      getJettonsEvents: (e, r = {}) => this.http.request({
        path: `/v2/events/${e}/jettons`,
        method: "GET",
        format: "json",
        ...r
      })
    });
    Le(this, "staking", {
      /**
       * @description All pools where account participates
       *
       * @tags Staking
       * @name GetAccountNominatorsPools
       * @request GET:/v2/staking/nominator/{account_id}/pools
       */
      getAccountNominatorsPools: (e, r = {}) => this.http.request({
        path: `/v2/staking/nominator/${e}/pools`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Stacking pool info
       *
       * @tags Staking
       * @name GetStakingPoolInfo
       * @request GET:/v2/staking/pool/{account_id}
       */
      getStakingPoolInfo: (e, r = {}) => this.http.request({
        path: `/v2/staking/pool/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Pool history
       *
       * @tags Staking
       * @name GetStakingPoolHistory
       * @request GET:/v2/staking/pool/{account_id}/history
       */
      getStakingPoolHistory: (e, r = {}) => this.http.request({
        path: `/v2/staking/pool/${e}/history`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description All pools available in network
       *
       * @tags Staking
       * @name GetStakingPools
       * @request GET:/v2/staking/pools
       */
      getStakingPools: (e, r = {}) => this.http.request({
        path: "/v2/staking/pools",
        method: "GET",
        query: e,
        format: "json",
        ...r
      })
    });
    Le(this, "storage", {
      /**
       * @description Get TON storage providers deployed to the blockchain.
       *
       * @tags Storage
       * @name GetStorageProviders
       * @request GET:/v2/storage/providers
       */
      getStorageProviders: (e = {}) => this.http.request({
        path: "/v2/storage/providers",
        method: "GET",
        format: "json",
        ...e
      })
    });
    Le(this, "rates", {
      /**
       * @description Get the token price to the currency
       *
       * @tags Rates
       * @name GetRates
       * @request GET:/v2/rates
       */
      getRates: (e, r = {}) => this.http.request({
        path: "/v2/rates",
        method: "GET",
        query: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get chart by token
       *
       * @tags Rates
       * @name GetChartRates
       * @request GET:/v2/rates/chart
       */
      getChartRates: (e, r = {}) => this.http.request({
        path: "/v2/rates/chart",
        method: "GET",
        query: e,
        format: "json",
        ...r
      })
    });
    Le(this, "connect", {
      /**
       * @description Get a payload for further token receipt
       *
       * @tags Connect
       * @name GetTonConnectPayload
       * @request GET:/v2/tonconnect/payload
       */
      getTonConnectPayload: (e = {}) => this.http.request({
        path: "/v2/tonconnect/payload",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get account info by state init
       *
       * @tags Connect
       * @name GetAccountInfoByStateInit
       * @request POST:/v2/tonconnect/stateinit
       */
      getAccountInfoByStateInit: (e, r = {}) => this.http.request({
        path: "/v2/tonconnect/stateinit",
        method: "POST",
        body: e,
        format: "json",
        ...r
      })
    });
    Le(this, "wallet", {
      /**
       * @description Get backup info
       *
       * @tags Wallet
       * @name GetWalletBackup
       * @request GET:/v2/wallet/backup
       */
      getWalletBackup: (e = {}) => this.http.request({
        path: "/v2/wallet/backup",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Set backup info
       *
       * @tags Wallet
       * @name SetWalletBackup
       * @request PUT:/v2/wallet/backup
       */
      setWalletBackup: (e, r = {}) => this.http.request({
        path: "/v2/wallet/backup",
        method: "PUT",
        body: e,
        ...r
      }),
      /**
       * @description Account verification and token issuance
       *
       * @tags Wallet
       * @name TonConnectProof
       * @request POST:/v2/wallet/auth/proof
       */
      tonConnectProof: (e, r = {}) => this.http.request({
        path: "/v2/wallet/auth/proof",
        method: "POST",
        body: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get wallets by public key
       *
       * @tags Wallet
       * @name GetWalletsByPublicKey
       * @request GET:/v2/pubkeys/{public_key}/wallets
       */
      getWalletsByPublicKey: (e, r = {}) => this.http.request({
        path: `/v2/pubkeys/${e}/wallets`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get account seqno
       *
       * @tags Wallet
       * @name GetAccountSeqno
       * @request GET:/v2/wallet/{account_id}/seqno
       */
      getAccountSeqno: (e, r = {}) => this.http.request({
        path: `/v2/wallet/${e}/seqno`,
        method: "GET",
        format: "json",
        ...r
      })
    });
    Le(this, "liteServer", {
      /**
       * @description Get raw masterchain info
       *
       * @tags Lite Server
       * @name GetRawMasterchainInfo
       * @request GET:/v2/liteserver/get_masterchain_info
       */
      getRawMasterchainInfo: (e = {}) => this.http.request({
        path: "/v2/liteserver/get_masterchain_info",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get raw masterchain info ext
       *
       * @tags Lite Server
       * @name GetRawMasterchainInfoExt
       * @request GET:/v2/liteserver/get_masterchain_info_ext
       */
      getRawMasterchainInfoExt: (e, r = {}) => this.http.request({
        path: "/v2/liteserver/get_masterchain_info_ext",
        method: "GET",
        query: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get raw time
       *
       * @tags Lite Server
       * @name GetRawTime
       * @request GET:/v2/liteserver/get_time
       */
      getRawTime: (e = {}) => this.http.request({
        path: "/v2/liteserver/get_time",
        method: "GET",
        format: "json",
        ...e
      }),
      /**
       * @description Get raw blockchain block
       *
       * @tags Lite Server
       * @name GetRawBlockchainBlock
       * @request GET:/v2/liteserver/get_block/{block_id}
       */
      getRawBlockchainBlock: (e, r = {}) => this.http.request({
        path: `/v2/liteserver/get_block/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get raw blockchain block state
       *
       * @tags Lite Server
       * @name GetRawBlockchainBlockState
       * @request GET:/v2/liteserver/get_state/{block_id}
       */
      getRawBlockchainBlockState: (e, r = {}) => this.http.request({
        path: `/v2/liteserver/get_state/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get raw blockchain block header
       *
       * @tags Lite Server
       * @name GetRawBlockchainBlockHeader
       * @request GET:/v2/liteserver/get_block_header/{block_id}
       */
      getRawBlockchainBlockHeader: (e, r, i = {}) => this.http.request({
        path: `/v2/liteserver/get_block_header/${e}`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Send raw message to blockchain
       *
       * @tags Lite Server
       * @name SendRawMessage
       * @request POST:/v2/liteserver/send_message
       */
      sendRawMessage: (e, r = {}) => this.http.request({
        path: "/v2/liteserver/send_message",
        method: "POST",
        body: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get raw account state
       *
       * @tags Lite Server
       * @name GetRawAccountState
       * @request GET:/v2/liteserver/get_account_state/{account_id}
       */
      getRawAccountState: (e, r, i = {}) => this.http.request({
        path: `/v2/liteserver/get_account_state/${e}`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get raw shard info
       *
       * @tags Lite Server
       * @name GetRawShardInfo
       * @request GET:/v2/liteserver/get_shard_info/{block_id}
       */
      getRawShardInfo: (e, r, i = {}) => this.http.request({
        path: `/v2/liteserver/get_shard_info/${e}`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get all raw shards info
       *
       * @tags Lite Server
       * @name GetAllRawShardsInfo
       * @request GET:/v2/liteserver/get_all_shards_info/{block_id}
       */
      getAllRawShardsInfo: (e, r = {}) => this.http.request({
        path: `/v2/liteserver/get_all_shards_info/${e}`,
        method: "GET",
        format: "json",
        ...r
      }),
      /**
       * @description Get raw transactions
       *
       * @tags Lite Server
       * @name GetRawTransactions
       * @request GET:/v2/liteserver/get_transactions/{account_id}
       */
      getRawTransactions: (e, r, i = {}) => this.http.request({
        path: `/v2/liteserver/get_transactions/${e}`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get raw list block transactions
       *
       * @tags Lite Server
       * @name GetRawListBlockTransactions
       * @request GET:/v2/liteserver/list_block_transactions/{block_id}
       */
      getRawListBlockTransactions: (e, r, i = {}) => this.http.request({
        path: `/v2/liteserver/list_block_transactions/${e}`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get raw block proof
       *
       * @tags Lite Server
       * @name GetRawBlockProof
       * @request GET:/v2/liteserver/get_block_proof
       */
      getRawBlockProof: (e, r = {}) => this.http.request({
        path: "/v2/liteserver/get_block_proof",
        method: "GET",
        query: e,
        format: "json",
        ...r
      }),
      /**
       * @description Get raw config
       *
       * @tags Lite Server
       * @name GetRawConfig
       * @request GET:/v2/liteserver/get_config_all/{block_id}
       */
      getRawConfig: (e, r, i = {}) => this.http.request({
        path: `/v2/liteserver/get_config_all/${e}`,
        method: "GET",
        query: r,
        format: "json",
        ...i
      }),
      /**
       * @description Get raw shard block proof
       *
       * @tags Lite Server
       * @name GetRawShardBlockProof
       * @request GET:/v2/liteserver/get_shard_block_proof/{block_id}
       */
      getRawShardBlockProof: (e, r = {}) => this.http.request({
        path: `/v2/liteserver/get_shard_block_proof/${e}`,
        method: "GET",
        format: "json",
        ...r
      })
    });
    this.http = e;
  }
}
To = tt.Api = _c;
const ci = {
  DEFAULT_INTERVAL: 5e3,
  TIMEOUT: 6e5,
  CACHE_TIMEOUT: 3e4
}, di = {
  CHAIN_DEV: "-3",
  API_URL: "https://tonapi.io",
  API_URL_TESTNET: "https://testnet.tonapi.io"
}, Mt = {
  STAKING_CONTRACT_ADDRESS: "EQCkWxfyhAkim3g2DjKQQg8T5P4g-Q1-K_jErGcDJZ4i-vqR",
  STAKING_CONTRACT_ADDRESS_TESTNET: "kQANFsYyYn-GSZ4oajUJmboDURZU-udMHf9JxzO4vYM_hFP3",
  REFERRAL_CODE: 70457412335,
  PAYLOAD_UNSTAKE: 1499400124,
  PAYLOAD_STAKE: 1205158801,
  STAKE_FEE_RES: 1,
  UNSTAKE_FEE_RES: 1.05,
  RECOMMENDED_FEE_RESERVE: 1.1
};
class kc {
  constructor(e) {
    this.store = {}, this.ttl = e;
  }
  get time() {
    return Date.now();
  }
  isFresh(e) {
    const r = this.store[e];
    return r ? this.time - r.ts < this.ttl : !1;
  }
  async getData(e) {
    return this.store[e].data;
  }
  setData(e, r) {
    this.store[e] = {
      ts: this.time,
      data: r
    };
  }
}
class mt extends EventTarget {
  constructor({
    connector: e,
    referralCode: r = Mt.REFERRAL_CODE,
    tonApiKey: i,
    cacheFor: u
  }) {
    super(), this.connector = e, this.referralCode = r, this.tonApiKey = i, this.cache = new kc(
      u === void 0 ? ci.CACHE_TIMEOUT : u
    ), this.setupClient(), this.initialize().catch((f) => {
      console.error("Initialization error:", f);
    });
  }
  async setupClient() {
    const e = this.tonApiKey ? {
      headers: {
        Authorization: `Bearer ${this.tonApiKey}`,
        "Content-type": "application/json"
      }
    } : {}, r = new Mo({
      baseUrl: di.API_URL,
      baseApiParams: e
    });
    this.client = new To(r), this.stakingContractAddress = pt.Address.parse(
      Mt.STAKING_CONTRACT_ADDRESS
    );
  }
  async initialize() {
    this.connector.onStatusChange(async (e) => {
      var r;
      (r = e == null ? void 0 : e.account) != null && r.address ? await this.setupWallet(e) : this.deinitialize();
    });
  }
  deinitialize() {
    console.log("Deinitializing Tonstakers..."), this.walletAddress = void 0, mt.jettonWalletAddress = void 0, this.dispatchEvent(new Event("deinitialized"));
  }
  async setupWallet(e) {
    console.log("Setting up wallet for Tonstakers..."), e.account.chain, di.CHAIN_DEV, this.walletAddress = pt.Address.parse(e.account.address), mt.jettonWalletAddress || (mt.jettonWalletAddress = await this.getJettonWalletAddress(
      this.walletAddress
    )), this.dispatchEvent(new Event("initialized"));
  }
  async fetchStakingPoolInfo() {
    if (!this.cache.isFresh("poolInfo")) {
      const e = async () => {
        const r = await this.client.staking.getStakingPoolInfo(
          this.stakingContractAddress.toString()
        ), i = await this.client.blockchain.execGetMethodForBlockchainAccount(
          this.stakingContractAddress.toString(),
          "get_pool_full_data"
        );
        return {
          poolInfo: r.pool,
          poolFullData: i.decoded
        };
      };
      this.cache.setData("poolInfo", e());
    }
    return this.cache.getData("poolInfo");
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
      return (await this.client.staking.getStakingPoolHistory(
        this.stakingContractAddress.toString()
      )).apy;
    } catch {
      throw console.error("Failed to get historical APY"), new Error("Could not retrieve historical APY.");
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
      const e = await this.fetchStakingPoolInfo(), r = e.poolFullData.total_balance, i = e.poolFullData.supply, u = r / i, f = e.poolFullData.projected_balance, o = e.poolFullData.projected_supply, h = f / o;
      return {
        TONUSD: await this.getTonPrice(),
        tsTONTON: u,
        tsTONTONProjected: h
      };
    } catch {
      throw console.error("Failed to get rates"), new Error("Could not retrieve rates.");
    }
  }
  async getTonPrice() {
    var e, r, i;
    if (this.cache.isFresh("tonPrice"))
      return this.cache.getData("tonPrice");
    try {
      const f = (i = (r = (e = (await this.client.rates.getRates({
        tokens: ["ton"],
        currencies: ["usd"]
      })).rates) == null ? void 0 : e.TON) == null ? void 0 : r.prices) == null ? void 0 : i.USD;
      return this.cache.setData("tonPrice", f), f;
    } catch {
      return 0;
    }
  }
  async getStakedBalance() {
    if (!mt.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    const e = mt.jettonWalletAddress.toString(), r = `stakedBalance-${e}`;
    if (this.cache.isFresh(r))
      return this.cache.getData(r);
    try {
      const u = (await this.client.blockchain.execGetMethodForBlockchainAccount(
        e,
        "get_wallet_data"
      )).decoded.balance;
      return console.log(`Current tsTON balance: ${u}`), this.cache.setData(r, u), u;
    } catch {
      return 0;
    }
  }
  async getAvailableBalance() {
    if (!this.walletAddress) throw new Error("Wallet is not connected.");
    try {
      let e;
      this.cache.isFresh("account") ? e = await this.cache.getData("account") : (e = await this.client.accounts.getAccount(
        this.walletAddress.toString()
      ), this.cache.setData("account", e));
      const r = Number(e.balance) - Number(pt.toNano(Mt.RECOMMENDED_FEE_RESERVE));
      return Math.max(r, 0);
    } catch {
      return 0;
    }
  }
  async stake(e) {
    if (!this.walletAddress || !mt.jettonWalletAddress)
      throw new Error("Tonstakers is not fully initialized.");
    try {
      await this.validateAmount(e);
      const r = pt.toNano(e + Mt.STAKE_FEE_RES), i = this.preparePayload("stake", e), u = await this.sendTransaction(
        this.stakingContractAddress,
        r,
        i
      );
      return console.log(`Staked ${e} TON successfully.`), u;
    } catch (r) {
      throw console.error(
        "Staking failed:",
        r instanceof Error ? r.message : r
      ), new Error("Staking operation failed.");
    }
  }
  async stakeMax() {
    try {
      const e = await this.getAvailableBalance(), r = await this.stake(e);
      return console.log(
        `Staked maximum amount of ${e} TON successfully.`
      ), r;
    } catch (e) {
      throw console.error(
        "Maximum staking failed:",
        e instanceof Error ? e.message : e
      ), new Error("Maximum staking operation failed.");
    }
  }
  async unstake(e) {
    if (!mt.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(e);
      const r = this.preparePayload("unstake", e), i = await this.sendTransaction(
        mt.jettonWalletAddress,
        pt.toNano(Mt.UNSTAKE_FEE_RES),
        r
      );
      return console.log(`Initiated unstaking of ${e} tsTON.`), i;
    } catch (r) {
      throw console.error(
        "Unstaking failed:",
        r instanceof Error ? r.message : r
      ), new Error("Unstaking operation failed.");
    }
  }
  async unstakeInstant(e) {
    if (!mt.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(e);
      const r = this.preparePayload("unstake", e, !1, !0), i = await this.sendTransaction(
        mt.jettonWalletAddress,
        pt.toNano(Mt.UNSTAKE_FEE_RES),
        r
      );
      return console.log(`Initiated instant unstaking of ${e} tsTON.`), i;
    } catch (r) {
      throw console.error(
        "Instant unstaking failed:",
        r instanceof Error ? r.message : r
      ), new Error("Instant unstaking operation failed.");
    }
  }
  async unstakeBestRate(e) {
    if (!mt.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(e);
      const r = this.preparePayload("unstake", e, !0), i = await this.sendTransaction(
        mt.jettonWalletAddress,
        pt.toNano(Mt.UNSTAKE_FEE_RES),
        r
      );
      return console.log(`Initiated unstaking of ${e} tsTON at the best rate.`), i;
    } catch (r) {
      throw console.error(
        "Best rate unstaking failed:",
        r instanceof Error ? r.message : r
      ), new Error("Best rate unstaking operation failed.");
    }
  }
  preparePayload(e, r, i = !1, u = !1) {
    let f = pt.beginCell();
    switch (e) {
      case "stake":
        f.storeUint(Mt.PAYLOAD_STAKE, 32), f.storeUint(1, 64).storeUint(this.referralCode, 64);
        break;
      case "unstake":
        f.storeUint(Mt.PAYLOAD_UNSTAKE, 32), f.storeUint(0, 64).storeCoins(pt.toNano(r)).storeAddress(this.walletAddress).storeMaybeRef(
          pt.beginCell().storeUint(Number(i), 1).storeUint(Number(u), 1).endCell()
        );
        break;
    }
    return f.endCell().toBoc().toString("base64");
  }
  async getJettonWalletAddress(e) {
    try {
      const r = await this.fetchStakingPoolInfo(), i = pt.Address.parse(
        r.poolInfo.liquid_jetton_master
      ), u = await this.client.blockchain.execGetMethodForBlockchainAccount(
        i.toString(),
        "get_wallet_address",
        { args: [e.toString()] }
      );
      return pt.Address.parse(u.decoded.jetton_wallet_address);
    } catch (r) {
      throw console.error(
        "Failed to get jetton wallet address:",
        r instanceof Error ? r.message : r
      ), new Error("Could not retrieve jetton wallet address.");
    }
  }
  async validateAmount(e) {
    if (typeof e != "number" || e <= 0)
      throw new Error("Invalid amount specified");
  }
  sendTransaction(e, r, i) {
    const f = {
      validUntil: +/* @__PURE__ */ new Date() + ci.TIMEOUT,
      messages: [
        {
          address: e.toString(),
          amount: r.toString(),
          payload: i
        }
      ]
    };
    return this.connector.sendTransaction(f);
  }
}
export {
  mt as Tonstakers
};
