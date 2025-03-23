// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {ProductRepository} from '../repositories';
import {api, post, requestBody, response} from '@loopback/rest';
import {CREATE_PRODUCT_BODY, CREATE_PRODUCT_RESPONSE} from '../specs';
import {CreateProduct} from '../types/product';
import {ProductStatus} from '../enum';

// import {inject} from '@loopback/core';

@api({
  basePath: '/product'
})
export class ProductController {
  constructor(
    @repository(ProductRepository) private productRepository: ProductRepository
  ) {}

  @post('')
  @response(200, CREATE_PRODUCT_RESPONSE)
  async addProduct(
    @requestBody(CREATE_PRODUCT_BODY) body: CreateProduct
  ) {
    const { name, price } = body;
    const product = await this.productRepository.create({
      name,
      price,
      status: ProductStatus.ACTIVE
    })
    return product;
  }
}
