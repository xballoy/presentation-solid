export type ProductId = string & { readonly __brand: unique symbol };
export type Product = {
  id: ProductId;
  title: string;
  price: number;
  taxable: boolean;
};
