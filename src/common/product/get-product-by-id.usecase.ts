import { Usecase } from '../core/usecase';
import { mapToDomain } from './mapper';
import type { ProductRepository } from './repository/product.repository';
import type { Product, ProductId } from './types';

export class GetProductById extends Usecase<ProductId, Product | undefined> {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  override async run(id: ProductId): Promise<Product | undefined> {
    const product = await this.productRepository.findById(id);
    return mapToDomain(product);
  }
}
