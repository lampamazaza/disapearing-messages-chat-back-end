export interface IAuthenticationService {
  generateAuthenticationData: (publicKey: string) => Promise<{
    iv: number[];
    msg: number[];
    publicKey: number[];
  }>;
  checkAuthenticationResult: (msg: number[], publicKey: string) => boolean;
}
