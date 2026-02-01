import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';

// Permissions disponibles dans l'application
export enum PermissionAction {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_STATISTICS = 'view_statistics',

  // Membres
  VIEW_MEMBERS = 'view_members',
  CREATE_MEMBERS = 'create_members',
  EDIT_MEMBERS = 'edit_members',
  DELETE_MEMBERS = 'delete_members',
  EXPORT_MEMBERS = 'export_members',

  // Enfants
  VIEW_CHILDREN = 'view_children',
  CREATE_CHILDREN = 'create_children',
  EDIT_CHILDREN = 'edit_children',
  DELETE_CHILDREN = 'delete_children',
  EXPORT_CHILDREN = 'export_children',

  // Utilisateurs
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',

  // Rôles
  VIEW_ROLES = 'view_roles',
  CREATE_ROLES = 'create_roles',
  EDIT_ROLES = 'edit_roles',
  DELETE_ROLES = 'delete_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: string; // dashboard, members, children, users, roles

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;
}
