export class Customer {
  private _uuid?: string;
  private _firstname?: string;
  private _lastname?: string;
  private _idNumber?: string;

  constructor(uuid?: string, firstname?: string, lastname?: string, idNumber?: string) {
    this._uuid = uuid;
    this._firstname = firstname;
    this._lastname = lastname;
    this._idNumber = idNumber;

  }

  get uuid(): string | undefined {
    return this._uuid;
  }

  set uuid(value: string) {
    this._uuid = value;
  }

  get firstname(): string | undefined {
    return this._firstname;
  }

  set firstname(value: string | undefined) {
    this._firstname = value;
  }

  get lastname(): string | undefined {
    return this._lastname;
  }

  set lastname(value: string | undefined) {
    this._lastname = value;
  }

  get idNumber(): string |undefined {
    return this._idNumber;
  }

  set idNumber(value: string) {
    this._idNumber = value;
  }
}
