import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      return false;
    }

    // Récupérer l'utilisateur avec ses permissions
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'],
    });

    if (!user || !user.isActive) {
      return false;
    }

    // Super admin a toutes les permissions
    if (user.role.name === 'super_admin') {
      return true;
    }

    // Vérifier si l'utilisateur a au moins une des permissions requises
    const userPermissions = user.role.permissions.map((p) => p.name);
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
