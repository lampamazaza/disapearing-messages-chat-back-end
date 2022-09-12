export interface IAuthenticationService {
  generateAuthenticationData: (publicKey: string) => {
    publicKey: string;
    msg: string;
  };
  checkAuthenticationResult: (msg: string, publicKey: string) => boolean;
}
