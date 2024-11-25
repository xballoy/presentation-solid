import { describe, expect, it } from 'vitest';
import { GetProductById } from '../../common/product/get-product-by-id.usecase';
import { LocalProductRepository } from '../../common/product/repository/local-product.repository';
import type { ProductEntity } from '../../common/product/repository/product.entity';
import { productEntityFixture } from '../../common/product/repository/product.entity.fixture';
import type { ProductId } from '../../common/product/types';
import { GetTotalCart } from './get-total-cart';

describe('Get Total Cart', () => {
  describe('When province is QC', () => {
    it('should return 0 when the cart is empty', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([]);

      // Act
      const total = await getTotalCart.total([], 'QC');

      // Assert
      expect(total).toBe(0);
    });

    it('should return item price when non taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([
        productEntityFixture({ id: '123', price: 10, taxable: false }),
      ]);

      // Act
      const total = await getTotalCart.total(
        [{ id: '123' as ProductId, quantity: 1 }],
        'QC',
      );

      // Assert
      expect(total).toBe(10);
    });

    it('should apply taxes on item price when taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([
        productEntityFixture({ id: '123', price: 10, taxable: true }),
      ]);

      // Act
      const total = await getTotalCart.total(
        [{ id: '123' as ProductId, quantity: 1 }],
        'QC',
      );

      // Assert
      expect(total).toBe(11.5);
    });

    it('should return total on complex cart', async () => {
      const getTotalCart = getTotalCartFactory([
        productEntityFixture({ id: '123', price: 10, taxable: true }),
        productEntityFixture({ id: '456', price: 20, taxable: false }),
      ]);

      // Act
      const total = await getTotalCart.total(
        [
          { id: '123' as ProductId, quantity: 1 },
          { id: '456' as ProductId, quantity: 2 },
        ],
        'QC',
      );

      // Assert
      expect(total).toBe(51.5);
    });
  });

  describe('When province is AB', () => {
    it('should return 0 when the cart is empty', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([]);

      // Act
      const total = await getTotalCart.total([], 'AB');

      // Assert
      expect(total).toBe(0);
    });

    it('should return item price when non taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([
        productEntityFixture({ id: '123', price: 10, taxable: false }),
      ]);

      // Act
      const total = await getTotalCart.total(
        [{ id: '123' as ProductId, quantity: 1 }],
        'AB',
      );

      // Assert
      expect(total).toBe(10);
    });

    it('should apply taxes on item price when taxable product', async () => {
      // Arrange
      const getTotalCart = getTotalCartFactory([
        productEntityFixture({ id: '123', price: 10, taxable: true }),
      ]);

      // Act
      const total = await getTotalCart.total(
        [{ id: '123' as ProductId, quantity: 1 }],
        'AB',
      );

      // Assert
      expect(total).toBe(10.5);
    });

    it('should return total on complex cart', async () => {
      const getTotalCart = getTotalCartFactory([
        productEntityFixture({ id: '123', price: 10, taxable: true }),
        productEntityFixture({ id: '456', price: 20, taxable: false }),
      ]);

      // Act
      const total = await getTotalCart.total(
        [
          { id: '123' as ProductId, quantity: 1 },
          { id: '456' as ProductId, quantity: 2 },
        ],
        'AB',
      );

      // Assert
      expect(total).toBe(50.5);
    });
  });
});

function getTotalCartFactory(products: ProductEntity[]) {
  return new GetTotalCart(
    new GetProductById(new LocalProductRepository(products)),
  );
}
