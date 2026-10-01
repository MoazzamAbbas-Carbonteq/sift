import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  DISCOVERY_BUDGETS,
  DISCOVERY_PRIORITIES,
  type DiscoveryBudget,
  type DiscoveryPriority,
} from '../../domain/match-headphones.js';

export class MatchDiscoveryDto {
  @ApiProperty({ enum: DISCOVERY_PRIORITIES, example: 'battery' })
  @IsIn(DISCOVERY_PRIORITIES)
  priority: DiscoveryPriority;

  @ApiProperty({ enum: DISCOVERY_BUDGETS, example: '200_plus' })
  @IsIn(DISCOVERY_BUDGETS)
  budget: DiscoveryBudget;
}
