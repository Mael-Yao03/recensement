import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { PermissionAction } from '../entities/permission.entity';

@Controller('api/roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermissions(PermissionAction.CREATE_ROLES)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions(PermissionAction.VIEW_ROLES)
  async findAll() {
    return this.roleService.findAll();
  }

  @Get('permissions')
  @RequirePermissions(PermissionAction.MANAGE_PERMISSIONS)
  async getAllPermissions() {
    return this.roleService.getAllPermissions();
  }

  @Get('permissions/by-category')
  @RequirePermissions(PermissionAction.MANAGE_PERMISSIONS)
  async getPermissionsByCategory() {
    return this.roleService.getPermissionsByCategory();
  }

  @Get(':id')
  @RequirePermissions(PermissionAction.VIEW_ROLES)
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(PermissionAction.EDIT_ROLES)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionAction.DELETE_ROLES)
  async remove(@Param('id') id: string) {
    await this.roleService.remove(id);
    return { message: 'Rôle supprimé avec succès' };
  }
}
