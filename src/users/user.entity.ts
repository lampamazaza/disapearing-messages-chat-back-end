export class User {
  constructor(
    private readonly _publicKey: string,
    private readonly _name: string,
    private readonly _alias: string
  ) {
    this._publicKey = _publicKey;
    this._name = _name;
    this._alias = _alias;
  }

  get name(): string {
    return this._name;
  }
  get publicKey(): string {
    return this._publicKey;
  }
  get alias(): string {
    return this._alias;
  }
}
