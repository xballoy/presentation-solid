import type { CartOperations } from './cart-operations';

export class UserAccount implements CartOperations {
  public applyDiscount(_coupon: string) {
    // Do nothing, not applicable in this context
  }

  public changeCarrier(carrier: string) {
    console.log(`Changed default carrier to ${carrier}`);
  }
}
