export class UIConfig {
  private _username: string;
  private _admin: boolean;
  private _version: string;
  private _profile?: string;

  constructor(
    username: string,
    version: string,
    admin: boolean = false,
    profile?: string
  ) {
    this._username = username;
    this._admin = admin;
    this._version = version;
    this._profile = profile;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get admin(): boolean {
    return this._admin;
  }

  set admin(value: boolean) {
    this._admin = value;
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get profile(): string | undefined {
    return this._profile;
  }

  set profile(value: string | undefined) {
    this._profile = value;
  }
}
