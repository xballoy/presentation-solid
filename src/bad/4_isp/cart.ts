import assert from 'node:assert';
import type { Item } from '../../common/cart/cart-item';
import type { Province } from '../../common/cart/province';
import type { GetProductById } from '../../common/product/get-product-by-id.usecase';
import type { ProductId } from '../../common/product/types';
import type { CartOperations } from './cart-operations';
import type { GetTotalCartProvider } from './get-total-cart';

export class Cart implements CartOperations {
  //region Existing code
  constructor(
    private readonly getProductById: GetProductById,
    private readonly getTotalCartProvider: GetTotalCartProvider,
  ) {}

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

  public async total(province: Province) {
    return this.getTotalCartProvider.provide(province).total(this._items);
  }

  public applyDiscount(coupon: string) {
    console.log(`Apply coupon ${coupon}`);
  }

  public changeCarrier(carrier: string) {
    console.log(`Changed carrier to ${carrier}`);
  }
}
