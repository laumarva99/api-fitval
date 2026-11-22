import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('plans') // en Swagger, agrupadas bajo "plans"
@Controller('plans') // rutas /api/plans
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get() // GET /api/plans
  findAll() {
    return this.plansService.findAll();
  }
}
