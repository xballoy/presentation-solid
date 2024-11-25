import type { ProductEntity } from './product.entity';

export const productEntityFixture = (
  overrides?: Partial<ProductEntity>,
): ProductEntity => ({
  id: '123',
  title: '0% milk (1L)',
  price: 2.08,
  taxable: false,
  ...overrides,
});
