import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Vérifier si le nom existe déjà
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Un rôle avec ce nom existe déjà');
    }

    // Récupérer les permissions
    let permissions: Permission[] = [];
    if (createRoleDto.permissionIds?.length) {
      permissions = await this.permissionRepository.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
    }

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      permissions,
      isSystemRole: false,
      isActive: true,
    });

    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new NotFoundException('Rôle non trouvé');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Empêcher la modification des rôles système
    if (role.isSystemRole && (updateRoleDto.name || updateRoleDto.isActive === false)) {
      throw new BadRequestException(
        'Impossible de modifier le nom ou désactiver un rôle système',
      );
    }

    // Vérifier si le nouveau nom existe déjà
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Un rôle avec ce nom existe déjà');
      }

      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    if (updateRoleDto.isActive !== undefined) {
      role.isActive = updateRoleDto.isActive;
    }

    // Mettre à jour les permissions
    if (updateRoleDto.permissionIds) {
      role.permissions = await this.permissionRepository.find({
        where: { id: In(updateRoleDto.permissionIds) },
      });
    }

    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    // Empêcher la suppression des rôles système
    if (role.isSystemRole) {
      throw new BadRequestException(
        'Impossible de supprimer un rôle système',
      );
    }

    // Vérifier si des utilisateurs utilisent ce rôle
    if (role.users?.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer un rôle utilisé par des utilisateurs',
      );
    }

    await this.roleRepository.remove(role);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
    const permissions = await this.permissionRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });

    return permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>,
    );
  }

  async count(): Promise<number> {
    return this.roleRepository.count();
  }
}
