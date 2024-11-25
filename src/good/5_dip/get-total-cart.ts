import assert from 'node:assert';
import { Big } from 'big.js';
import type { Item } from '../../common/cart/cart-item';
import type { GetProductById } from '../../common/product/get-product-by-id.usecase';
import type { Product } from '../../common/product/types';

export type GetTotalCart = {
  total: (items: Item[]) => Promise<number>;
};

export class GetTotalCartQC implements GetTotalCart {
  constructor(private readonly getProductById: GetProductById) {}

  public async total(items: Item[]) {
    const products: { product: Product; quantity: number }[] = [];
    for (const { id, quantity } of items) {
      const product = await this.getProductById.run(id);
      assert(product, `Product ${id} not found`);

      products.push({ product, quantity });
    }

    const QUEBEC_GST = Big(0.05);
    const QUEBEC_PST = Big(0.09975);
    return products
      .reduce((total, { product: { price, taxable }, quantity }) => {
        const productPrice = Big(price);
        if (taxable) {
          const gst = QUEBEC_GST.mul(productPrice);
          const pst = QUEBEC_PST.mul(productPrice);
          return total.add(productPrice.add(gst).add(pst).mul(Big(quantity)));
        }

        return total.add(productPrice.mul(Big(quantity)));
      }, Big(0))
      .round(2)
      .toNumber();
  }
}
