import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  DISCOVERY_BUDGETS,
  DISCOVERY_PRIORITIES,
  DISCOVERY_USE_CASES,
  type DiscoveryBudget,
  type DiscoveryPriority,
  type DiscoveryUseCase,
} from '../../domain/match-headphones.js';

export class MatchDiscoveryDto {
  @ApiProperty({ enum: DISCOVERY_USE_CASES, example: 'work' })
  @IsIn(DISCOVERY_USE_CASES)
  useCase: DiscoveryUseCase;

  @ApiProperty({ enum: DISCOVERY_PRIORITIES, example: 'battery' })
  @IsIn(DISCOVERY_PRIORITIES)
  priority: DiscoveryPriority;

  @ApiProperty({ enum: DISCOVERY_BUDGETS, example: '200_plus' })
  @IsIn(DISCOVERY_BUDGETS)
  budget: DiscoveryBudget;
}
