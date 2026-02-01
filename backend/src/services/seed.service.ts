import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission, PermissionAction } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

// Définition de toutes les permissions avec leurs descriptions
const ALL_PERMISSIONS = [
  // Dashboard
  {
    name: PermissionAction.VIEW_DASHBOARD,
    description: 'Voir le tableau de bord',
    category: 'dashboard',
  },
  {
    name: PermissionAction.VIEW_STATISTICS,
    description: 'Voir les statistiques détaillées',
    category: 'dashboard',
  },

  // Membres
  {
    name: PermissionAction.VIEW_MEMBERS,
    description: 'Voir la liste des membres',
    category: 'members',
  },
  {
    name: PermissionAction.CREATE_MEMBERS,
    description: 'Créer de nouveaux membres',
    category: 'members',
  },
  {
    name: PermissionAction.EDIT_MEMBERS,
    description: 'Modifier les membres',
    category: 'members',
  },
  {
    name: PermissionAction.DELETE_MEMBERS,
    description: 'Supprimer les membres',
    category: 'members',
  },
  {
    name: PermissionAction.EXPORT_MEMBERS,
    description: 'Exporter les données des membres',
    category: 'members',
  },

  // Enfants
  {
    name: PermissionAction.VIEW_CHILDREN,
    description: 'Voir la liste des enfants',
    category: 'children',
  },
  {
    name: PermissionAction.CREATE_CHILDREN,
    description: 'Créer de nouveaux enfants',
    category: 'children',
  },
  {
    name: PermissionAction.EDIT_CHILDREN,
    description: 'Modifier les enfants',
    category: 'children',
  },
  {
    name: PermissionAction.DELETE_CHILDREN,
    description: 'Supprimer les enfants',
    category: 'children',
  },
  {
    name: PermissionAction.EXPORT_CHILDREN,
    description: 'Exporter les données des enfants',
    category: 'children',
  },

  // Utilisateurs
  {
    name: PermissionAction.VIEW_USERS,
    description: 'Voir la liste des utilisateurs',
    category: 'users',
  },
  {
    name: PermissionAction.CREATE_USERS,
    description: 'Créer de nouveaux utilisateurs',
    category: 'users',
  },
  {
    name: PermissionAction.EDIT_USERS,
    description: 'Modifier les utilisateurs',
    category: 'users',
  },
  {
    name: PermissionAction.DELETE_USERS,
    description: 'Supprimer les utilisateurs',
    category: 'users',
  },

  // Rôles
  {
    name: PermissionAction.VIEW_ROLES,
    description: 'Voir la liste des rôles',
    category: 'roles',
  },
  {
    name: PermissionAction.CREATE_ROLES,
    description: 'Créer de nouveaux rôles',
    category: 'roles',
  },
  {
    name: PermissionAction.EDIT_ROLES,
    description: 'Modifier les rôles',
    category: 'roles',
  },
  {
    name: PermissionAction.DELETE_ROLES,
    description: 'Supprimer les rôles',
    category: 'roles',
  },
  {
    name: PermissionAction.MANAGE_PERMISSIONS,
    description: 'Gérer les permissions des rôles',
    category: 'roles',
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedSuperAdmin();
  }

  private async seedPermissions() {
    for (const perm of ALL_PERMISSIONS) {
      const exists = await this.permissionRepository.findOne({
        where: { name: perm.name },
      });
      if (!exists) {
        await this.permissionRepository.save(
          this.permissionRepository.create(perm),
        );
      }
    }
    console.log('✅ Permissions initialisées');
  }

  private async seedRoles() {
    // Vérifier si le rôle super_admin existe
    let superAdminRole = await this.roleRepository.findOne({
      where: { name: 'super_admin' },
    });

    const allPermissions = await this.permissionRepository.find();

    if (!superAdminRole) {
      superAdminRole = this.roleRepository.create({
        name: 'super_admin',
        description: 'Super Administrateur avec tous les droits',
        isSystemRole: true,
        isActive: true,
        permissions: allPermissions,
      });
      await this.roleRepository.save(superAdminRole);
    } else {
      // Mettre à jour les permissions du super admin
      superAdminRole.permissions = allPermissions;
      await this.roleRepository.save(superAdminRole);
    }

    // Créer un rôle admin standard
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      const adminPermissions = allPermissions.filter(
        (p) =>
          ![
            PermissionAction.VIEW_USERS,
            PermissionAction.CREATE_USERS,
            PermissionAction.EDIT_USERS,
            PermissionAction.DELETE_USERS,
            PermissionAction.VIEW_ROLES,
            PermissionAction.CREATE_ROLES,
            PermissionAction.EDIT_ROLES,
            PermissionAction.DELETE_ROLES,
            PermissionAction.MANAGE_PERMISSIONS,
          ].includes(p.name as PermissionAction),
      );

      adminRole = this.roleRepository.create({
        name: 'admin',
        description: 'Administrateur sans gestion des utilisateurs',
        isSystemRole: false,
        isActive: true,
        permissions: adminPermissions,
      });
      await this.roleRepository.save(adminRole);
    }

    // Créer un rôle viewer
    let viewerRole = await this.roleRepository.findOne({
      where: { name: 'viewer' },
    });

    if (!viewerRole) {
      const viewerPermissions = allPermissions.filter((p) =>
        [
          PermissionAction.VIEW_DASHBOARD,
          PermissionAction.VIEW_STATISTICS,
          PermissionAction.VIEW_MEMBERS,
          PermissionAction.VIEW_CHILDREN,
        ].includes(p.name as PermissionAction),
      );

      viewerRole = this.roleRepository.create({
        name: 'viewer',
        description: 'Consultation uniquement',
        isSystemRole: false,
        isActive: true,
        permissions: viewerPermissions,
      });
      await this.roleRepository.save(viewerRole);
    }

    console.log('✅ Rôles initialisés');
  }

  private async seedSuperAdmin() {
    const existingAdmin = await this.userRepository.findOne({
      where: { username: 'superadmin' },
    });

    if (!existingAdmin) {
      const superAdminRole = await this.roleRepository.findOne({
        where: { name: 'super_admin' },
      });

      if (superAdminRole) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const superAdmin = this.userRepository.create({
          username: 'superadmin',
          email: 'admin@transfiguration.ci',
          password: hashedPassword,
          fullName: 'Super Administrateur',
          isActive: true,
          roleId: superAdminRole.id,
        });

        // Ne pas utiliser save() car BeforeInsert va re-hasher le mot de passe
        await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            username: superAdmin.username,
            email: superAdmin.email,
            password: hashedPassword,
            fullName: superAdmin.fullName,
            isActive: superAdmin.isActive,
            roleId: superAdmin.roleId,
          })
          .execute();

        console.log('✅ Super Admin créé (superadmin / Admin@123)');
      }
    }
  }
}
