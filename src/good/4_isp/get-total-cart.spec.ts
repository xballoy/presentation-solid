import { describe, expect, it } from 'vitest';
import type { Province } from '../../common/cart/province';
import { GetProductById } from '../../common/product/get-product-by-id.usecase';
import { LocalProductRepository } from '../../common/product/repository/local-product.repository';
import type { ProductEntity } from '../../common/product/repository/product.entity';
import { productEntityFixture } from '../../common/product/repository/product.entity.fixture';
import type { ProductId } from '../../common/product/types';
import { GetTotalCartProvider } from './get-total-cart';

describe('Get Total Cart', () => {
  describe('When province is QC', () => {
    it('should return 0 when the cart is empty', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([], 'QC');

      // Act
      const total = await getTotalCart.total([]);

      // Assert
      expect(total).toBe(0);
    });

    it('should return item price when non taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory(
        [productEntityFixture({ id: '123', price: 10, taxable: false })],
        'QC',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
      ]);

      // Assert
      expect(total).toBe(10);
    });

    it('should apply taxes on item price when taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory(
        [productEntityFixture({ id: '123', price: 10, taxable: true })],
        'QC',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
      ]);

      // Assert
      expect(total).toBe(11.5);
    });

    it('should return total on complex cart', async () => {
      const getTotalCart = getTotalCartFactory(
        [
          productEntityFixture({ id: '123', price: 10, taxable: true }),
          productEntityFixture({ id: '456', price: 20, taxable: false }),
        ],
        'QC',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
        { id: '456' as ProductId, quantity: 2 },
      ]);

      // Assert
      expect(total).toBe(51.5);
    });
  });

  describe('When province is AB', () => {
    it('should return 0 when the cart is empty', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([], 'AB');

      // Act
      const total = await getTotalCart.total([]);

      // Assert
      expect(total).toBe(0);
    });

    it('should return item price when non taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory(
        [productEntityFixture({ id: '123', price: 10, taxable: false })],
        'AB',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
      ]);

      // Assert
      expect(total).toBe(10);
    });

    it('should apply taxes on item price when taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory(
        [productEntityFixture({ id: '123', price: 10, taxable: true })],
        'AB',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
      ]);

      // Assert
      expect(total).toBe(10.5);
    });

    it('should return total on complex cart', async () => {
      const getTotalCart = getTotalCartFactory(
        [
          productEntityFixture({ id: '123', price: 10, taxable: true }),
          productEntityFixture({ id: '456', price: 20, taxable: false }),
        ],
        'AB',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
        { id: '456' as ProductId, quantity: 2 },
      ]);

      // Assert
      expect(total).toBe(50.5);
    });
  });

  describe('When province is ON', () => {
    it('should return 0 when the cart is empty', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([], 'ON');

      // Act
      const total = await getTotalCart.total([]);

      // Assert
      expect(total).toBe(0);
    });

    it('should return item price when non taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory(
        [productEntityFixture({ id: '123', price: 10, taxable: false })],
        'ON',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
      ]);

      // Assert
      expect(total).toBe(10);
    });

    it('should apply taxes on item price when taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory(
        [productEntityFixture({ id: '123', price: 10, taxable: true })],
        'ON',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
      ]);

      // Assert
      expect(total).toBe(11.3);
    });

    it('should return total on complex cart', async () => {
      const getTotalCart = getTotalCartFactory(
        [
          productEntityFixture({ id: '123', price: 10, taxable: true }),
          productEntityFixture({ id: '456', price: 20, taxable: false }),
        ],
        'ON',
      );

      // Act
      const total = await getTotalCart.total([
        { id: '123' as ProductId, quantity: 1 },
        { id: '456' as ProductId, quantity: 2 },
      ]);

      // Assert
      expect(total).toBe(51.3);
    });
  });
});

function getTotalCartFactory(products: ProductEntity[], province: Province) {
  return new GetTotalCartProvider(
    new GetProductById(new LocalProductRepository(products)),
  ).provide(province);
}
