export class InitializeStatus {
  private _initialized: boolean;
  private _errorMessage?: string;

  constructor(initialized = false, errorMessage?: string) {
    this._initialized = initialized;
    this._errorMessage = errorMessage;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set initialized(value: boolean) {
    this._initialized = value;
  }

  get errorMessage(): string | undefined {
    return this._errorMessage;
  }

  set errorMessage(message: string) {
    this._errorMessage = message;
  }
}
