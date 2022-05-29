export class User {
  constructor(
    readonly publicKey: string,
    readonly name: string,
    readonly alias: string
  ) {
    this.publicKey = publicKey;
    this.name = name;
    this.alias = alias;
  }
}
