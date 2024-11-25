import type { ProductEntity } from './repository/product.entity';
import type { Product, ProductId } from './types';

export const mapToDomain = (entity?: ProductEntity): Product | undefined => {
  if (!entity) {
    return undefined;
  }

  return {
    ...entity,
    id: entity.id as ProductId,
  };
};
