import { describe, expect, it } from 'vitest';
import { GetProductById } from '../../common/product/get-product-by-id.usecase';
import { LocalProductRepository } from '../../common/product/repository/local-product.repository';
import type { ProductEntity } from '../../common/product/repository/product.entity';
import { productEntityFixture } from '../../common/product/repository/product.entity.fixture';
import type { ProductId } from '../../common/product/types';
import { Cart } from './cart';
import { GetTotalCartQC } from './get-total-cart';

describe('Cart', () => {
  describe('Cart operations (add, update, clear)', () => {
    it('should throw an error when adding an item when product does not exist', async () => {
      // Arrange
      const cart = cartFactory([]);

      await expect(() =>
        cart.add('12345' as ProductId, 1),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        '[AssertionError: Product 12345 does not exit]',
      );
    });

    it('should add item when adding an existing product', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);

      // Act
      const items = await cart.add('12345' as ProductId, 1);

      // Assert
      expect(items).toHaveLength(1);
      expect(items).toMatchInlineSnapshot(`
        [
          {
            "id": "12345",
            "quantity": 1,
          },
        ]
      `);
    });

    it('should throw an error when adding an existing product with quantity equal 0', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);

      // Act & Assert
      await expect(
        cart.add('12345' as ProductId, 0),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        '[AssertionError: Quantity must be at least 1]',
      );
    });

    it('should throw an error when adding an existing product with quantity to a negative number', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);

      // Act & Assert
      await expect(
        cart.add('12345' as ProductId, -1),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        '[AssertionError: Quantity must be at least 1]',
      );
    });

    it('should update item quantity when adding a product already in the cart', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);
      await cart.add('12345' as ProductId, 1);

      // Act
      const items = await cart.add('12345' as ProductId, 1);

      // Assert
      expect(items).toHaveLength(1);
      expect(items).toMatchInlineSnapshot(`
        [
          {
            "id": "12345",
            "quantity": 2,
          },
        ]
      `);
    });

    it('should remove item when changing product quantity to 0', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);
      await cart.add('12345' as ProductId, 1);

      // Act
      const items = cart.update('12345' as ProductId, 0);

      // Assert
      expect(items).toHaveLength(0);
    });

    it('should update item quantity when changing product quantity', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);
      await cart.add('12345' as ProductId, 1);

      // Act
      const items = cart.update('12345' as ProductId, 2);

      // Assert
      expect(items).toHaveLength(1);
      expect(items).toMatchInlineSnapshot(`
        [
          {
            "id": "12345",
            "quantity": 2,
          },
        ]
      `);
    });

    it('should throw an error when changing product quantity from a product not in the cart', () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);

      // Act & Assert
      expect(() =>
        cart.update('12345' as ProductId, 1),
      ).toThrowErrorMatchingInlineSnapshot('[AssertionError: Item not found]');
    });

    it('should throw an error when changing product quantity to a negative number', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);
      await cart.add('12345' as ProductId, 1);

      // Act & Assert
      expect(() =>
        cart.update('12345' as ProductId, -1),
      ).toThrowErrorMatchingInlineSnapshot(
        '[AssertionError: Quantity must be at least 0]',
      );
    });

    it('should clear items from cart when cart is not empty', async () => {
      // Arrange
      const cart = cartFactory([productEntityFixture({ id: '12345' })]);
      await cart.add('12345' as ProductId, 1);

      // Act
      const items = cart.clear();

      // Assert
      expect(items).toHaveLength(0);
    });
  });
});

function cartFactory(products: ProductEntity[]) {
  const getProductById = new GetProductById(
    new LocalProductRepository(products),
  );
  return new Cart(getProductById, new GetTotalCartQC(getProductById));
}
