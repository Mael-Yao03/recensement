import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Vérifie si l'utilisateur a une permission
  hasPermission(permissionName: string): boolean {
    return this.role?.hasPermission(permissionName) || false;
  }

  // Vérifie si l'utilisateur est super admin
  isSuperAdmin(): boolean {
    return this.role?.name === 'super_admin';
  }
}
