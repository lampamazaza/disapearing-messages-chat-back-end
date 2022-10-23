import { injectable } from "inversify";
import { IAuthenticationService } from "./authentication.interface";
import "reflect-metadata";
import { randomBytes, box } from "tweetnacl";
import { base58_to_binary, binary_to_base58 } from "base58-js";

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
      console.error(error);
    }
  }

  generateAuthenticationData(publicKey: string): {
    publicKey: string;
    msg: string;
  } {
    const keyPair = box.keyPair();

    const userPublicKey: Uint8Array = base58_to_binary(publicKey);
    const sharedKey = box.before(userPublicKey, keyPair.secretKey);

    const msg = randomBytes(box.nonceLength);
    const nonce = randomBytes(box.nonceLength);
    const encrypted = box.after(msg, nonce, sharedKey);

    const fullMessage = new Uint8Array(nonce.length + encrypted.length);
    fullMessage.set(nonce);
    fullMessage.set(encrypted, nonce.length);

    const base58FullMessage = binary_to_base58(fullMessage);

    this.pendingChecksStorage[publicKey] = binary_to_base58(msg);

    setTimeout(() => {
      this.deleteRecordInPendingStorage(publicKey);
    }, 30_000);

    return {
      publicKey: binary_to_base58(keyPair.publicKey),
      msg: base58FullMessage,
    };
  }

  checkAuthenticationResult(msg: string, publicKey: string): boolean {
    const result = this.pendingChecksStorage[publicKey] === msg;

    if (result) {
      this.deleteRecordInPendingStorage(publicKey);
    }
    return result;
  }
}
