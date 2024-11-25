import type { ProductEntity } from './product.entity';

export interface ProductRepository {
  findById(id: string): Promise<ProductEntity | undefined>;
}
