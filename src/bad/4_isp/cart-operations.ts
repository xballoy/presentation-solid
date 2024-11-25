export type CartOperations = {
  applyDiscount: (coupon: string) => void;
  changeCarrier: (carrier: string) => void;
};
