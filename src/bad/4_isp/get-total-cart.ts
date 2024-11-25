import assert from 'node:assert';
import { Big } from 'big.js';
import type { Item } from '../../common/cart/cart-item';
import type { Province } from '../../common/cart/province';
import type { GetProductById } from '../../common/product/get-product-by-id.usecase';
import type { Product } from '../../common/product/types';

export abstract class GetTotalCart {
  constructor(readonly getProductById: GetProductById) {}

  protected abstract get gst(): number;
  protected abstract get pst(): number | undefined;

  async total(items: Item[]): Promise<number> {
    const products: { product: Product; quantity: number }[] = [];
    for (const { id, quantity } of items) {
      const product = await this.getProductById.run(id);
      assert(product, `Product ${id} not found`);

      products.push({ product, quantity });
    }

    const GST = Big(this.gst);
    const PST = Big(this.pst ?? 0);
    return products
      .reduce((total, { product: { price, taxable }, quantity }) => {
        const productPrice = Big(price);
        if (taxable) {
          const gst = GST.mul(productPrice);
          const pst = PST.mul(productPrice);
          return total.add(productPrice.add(gst).add(pst).mul(Big(quantity)));
        }

        return total.add(productPrice.mul(Big(quantity)));
      }, Big(0))
      .round(2)
      .toNumber();
  }
}

export class GetTotalCartQC extends GetTotalCart {
  override get gst(): number {
    return 0.05;
  }

  override get pst(): number {
    return 0.09975;
  }
}

export class GetTotalCartAB extends GetTotalCart {
  override get gst(): number {
    return 0.05;
  }

  override get pst(): number {
    return 0;
  }
}

export class GetTotalCartON extends GetTotalCart {
  override get gst(): number {
    return 0.13;
  }

  override get pst(): number | undefined {
    return undefined;
  }
}

export class GetTotalCartProvider {
  constructor(private readonly getProductById: GetProductById) {}

  provide(province: Province) {
    if (province === 'QC') {
      return new GetTotalCartQC(this.getProductById);
    }

    if (province === 'ON') {
      return new GetTotalCartON(this.getProductById);
    }

    return new GetTotalCartAB(this.getProductById);
  }
}
