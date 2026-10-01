import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto } from '../application/dto/category-response.dto.js';
import { ListCategoriesUseCase } from '../application/use-cases/list-categories.use-case.js';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly listCategories: ListCategoriesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List product categories' })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  list(): Promise<CategoryResponseDto[]> {
    return this.listCategories.execute();
  }
}
