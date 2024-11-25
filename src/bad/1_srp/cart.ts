import assert from 'node:assert';
import { Big } from 'big.js';
import type { Item } from '../../common/cart/cart-item';
import type { GetProductById } from '../../common/product/get-product-by-id.usecase';
import type { Product, ProductId } from '../../common/product/types';

export class Cart {
  //region Existing code
  constructor(private readonly getProductById: GetProductById) {}

  get items(): Item[] {
    return [...this._items];
  }

  private _items: Item[] = [];

  public async add(id: ProductId, quantity = 1): Promise<Item[]> {
    assert(quantity > 0, 'Quantity must be at least 1');
    assert(await this.getProductById.run(id), `Product ${id} does not exit`);

    const index = this._items.findIndex((item) => item.id === id);
    if (index === -1) {
      this._items.push({ id, quantity });
    } else {
      this._items[index] = {
        id,
        quantity: (this._items[index]?.quantity ?? 0) + quantity,
      };
    }

    return this.items;
  }

  public update(id: ProductId, quantity: number): Item[] {
    assert(quantity >= 0, 'Quantity must be at least 0');

    const index = this._items.findIndex((item) => item.id === id);
    assert(index >= 0, 'Item not found');

    if (quantity === 0) {
      this._items.splice(index, 1);
    } else {
      this._items[index] = {
        id,
        quantity,
      };
    }

    return this.items;
  }

  public clear(): Item[] {
    this._items = [];

    return this.items;
  }
  //endregion

  public async total() {
    const products: { product: Product; quantity: number }[] = [];
    for (const { id, quantity } of this._items) {
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
