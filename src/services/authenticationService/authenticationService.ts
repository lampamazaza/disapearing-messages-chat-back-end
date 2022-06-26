import { injectable } from "inversify";
import { IAuthenticationService } from "./authentication.interface";
import "reflect-metadata";
const crypto = require("node:crypto");

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private readonly pendingChecksStorage;

  constructor() {
    this.pendingChecksStorage = {};
  }

  private deleteRecordInPendingStorage(publicKey: string): void {
    try {
      delete this.pendingChecksStorage[publicKey];
    } catch (error) {
      console.log(error);
    }
  }

  async generateAuthenticationData(publicKey: string) {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );

    const userPublicKey = await this.decodePublicKey(publicKey);

    const secret = await crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: userPublicKey,
      },
      keyPair.privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const msgSeed = crypto.getRandomValues(new Uint8Array(12));
    const msg = await this.encryptMessage(secret, msgSeed, iv);

    this.pendingChecksStorage[publicKey] = msgSeed;
    setTimeout(() => {
      this.deleteRecordInPendingStorage(publicKey);
    }, 30_000);

    return {
      iv: Array.from(iv) as number[],
      msg: Array.from(msg) as number[],
      publicKey: Array.from(
        await this.keyToPortable(keyPair.publicKey)
      ) as number[],
    };
  }

  private async keyToPortable(key: CryptoKey): Promise<Uint8Array> {
    const jwk = await crypto.subtle.exportKey(
      "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      key //can be a publicKey or privateKey, as long as extractable was true
    );

    return new TextEncoder().encode(JSON.stringify(jwk));
  }

  checkAuthenticationResult(msg: number[], publicKey: string): boolean {
    const result = this.pendingChecksStorage[publicKey]?.every(
      (item, index) => msg[index] === item
    );

    if (result) {
      this.deleteRecordInPendingStorage(publicKey);
    }
    return result;
  }

  private async decodePublicKey(portableBase64: string): Promise<CryptoKey> {
    const binaryPortableBase64Key = Uint8Array.from(atob(portableBase64), (c) =>
      c.charCodeAt(0)
    );

    const { kty, crv, x, y, d, ext, key_ops } = JSON.parse(
      new TextDecoder().decode(binaryPortableBase64Key)
    );

    return crypto.subtle.importKey(
      "jwk", //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
      { kty, crv, x, y, ext, key_ops },
      {
        //these are the algorithm options
        name: "ECDH",
        namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      key_ops //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
    );
  }

  private async encryptMessage(
    key: CryptoKey,
    message: Uint8Array,
    iv: Uint8Array
  ): Promise<Uint8Array> {
    const encoded = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      message
    );
    return new Uint8Array(encoded);
  }
}
