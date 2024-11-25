import type { ProductEntity } from './product.entity';
import type { ProductRepository } from './product.repository';

export class LocalProductRepository implements ProductRepository {
  constructor(private readonly products: ProductEntity[]) {}

  public async findById(id: string): Promise<ProductEntity | undefined> {
    return this.products.find((product) => product.id === id);
  }
}
