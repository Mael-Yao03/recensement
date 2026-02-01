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
import { UserService } from '../services/user.service';
import { RegisterDto, UpdateUserDto, ChangePasswordDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PermissionAction } from '../entities/permission.entity';

@Controller('api/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RequirePermissions(PermissionAction.CREATE_USERS)
  async create(@Body() registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    // Exclure le mot de passe de la réponse
    const { password, ...result } = user as any;
    return result;
  }

  @Get()
  @RequirePermissions(PermissionAction.VIEW_USERS)
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => {
      const { password, ...result } = user as any;
      return result;
    });
  }

  @Get(':id')
  @RequirePermissions(PermissionAction.VIEW_USERS)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    const { password, ...result } = user as any;
    return result;
  }

  @Put(':id')
  @RequirePermissions(PermissionAction.EDIT_USERS)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    const { password, ...result } = user as any;
    return result;
  }

  @Delete(':id')
  @RequirePermissions(PermissionAction.DELETE_USERS)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  @Put(':id/toggle-active')
  @RequirePermissions(PermissionAction.EDIT_USERS)
  async toggleActive(@Param('id') id: string) {
    const user = await this.userService.toggleActive(id);
    const { password, ...result } = user as any;
    return result;
  }

  @Put('change-password/me')
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(userId, changePasswordDto);
    return { message: 'Mot de passe modifié avec succès' };
  }
}
