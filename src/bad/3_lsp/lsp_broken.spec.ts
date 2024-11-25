import { describe, expect, it } from 'vitest';
import type { Province } from '../../common/cart/province';
import { GetProductById } from '../../common/product/get-product-by-id.usecase';
import { LocalProductRepository } from '../../common/product/repository/local-product.repository';
import { type GetTotalCart, GetTotalCartProvider } from './get-total-cart';

// TODO: remove skip for demo
describe.skip('LSP Broken', () => {
  it.each(['QC' as Province, 'AB' as Province, 'ON' as Province])(
    'should get PST for %s',
    (province) => {
      const getTotalCart: GetTotalCart = getTotalCartFactory(province);
      expect(getTotalCart.pst).not.toBeUndefined();
    },
  );
});

function getTotalCartFactory(province: Province) {
  return new GetTotalCartProvider(
    new GetProductById(new LocalProductRepository([])),
  ).provide(province);
}
