import type { ProductEntity } from './product.entity';
import type { ProductRepository } from './product.repository';

export class RemoteProductRepository implements ProductRepository {
  public async findById(_id: string): Promise<ProductEntity | undefined> {
    throw new Error('Not implemented');
  }
}
