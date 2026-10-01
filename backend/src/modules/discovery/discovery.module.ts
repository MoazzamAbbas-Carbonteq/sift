import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { RunGuidedDiscoveryUseCase } from './application/use-cases/run-guided-discovery.use-case.js';
import { DiscoveryController } from './presentation/discovery.controller.js';

@Module({
  imports: [ProductsModule],
  controllers: [DiscoveryController],
  providers: [RunGuidedDiscoveryUseCase],
})
export class DiscoveryModule {}
