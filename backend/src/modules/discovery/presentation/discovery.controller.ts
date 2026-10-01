import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscoveryResponseDto } from '../application/dto/discovery-response.dto.js';
import { MatchDiscoveryDto } from '../application/dto/match-discovery.dto.js';
import { RunGuidedDiscoveryUseCase } from '../application/use-cases/run-guided-discovery.use-case.js';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly runGuidedDiscovery: RunGuidedDiscoveryUseCase) {}

  @Post('match')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Match headphones from structured answers' })
  @ApiOkResponse({ type: DiscoveryResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid priority or budget' })
  match(@Body() body: MatchDiscoveryDto): Promise<DiscoveryResponseDto> {
    return this.runGuidedDiscovery.execute(body);
  }
}
