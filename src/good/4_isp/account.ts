import type { ChangeCarrier } from './cart.operations';

export class UserAccount implements ChangeCarrier {
  public changeCarrier(carrier: string) {
    console.log(`Changed default carrier to ${carrier}`);
  }
}
