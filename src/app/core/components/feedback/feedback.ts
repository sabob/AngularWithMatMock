export class Feedback {

  constructor(public type: string, public message: string) {
  }

  isError() {
    return this.type == 'error';
  }
}
