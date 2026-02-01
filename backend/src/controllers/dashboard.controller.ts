import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { PermissionAction } from '../entities/permission.entity';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @RequirePermissions(PermissionAction.VIEW_DASHBOARD)
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('members')
  @RequirePermissions(PermissionAction.VIEW_MEMBERS)
  async getMembersList(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.dashboardService.getMembersList(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Get('children')
  @RequirePermissions(PermissionAction.VIEW_CHILDREN)
  async getChildrenList(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.dashboardService.getChildrenList(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }
}
