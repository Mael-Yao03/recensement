import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, UpdateUserDto, ChangePasswordDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    // Vérifier si le username ou email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (existingUser) {
      throw new ConflictException(
        "Nom d'utilisateur ou email déjà utilisé",
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Utiliser queryBuilder pour éviter le double hashage
    const result = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        fullName: user.fullName,
        roleId: user.roleId,
        isActive: true,
      })
      .execute();

    return this.findOne(result.identifiers[0].id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Vérifier si le nouveau username ou email existe déjà
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [
          updateUserDto.username
            ? { username: updateUserDto.username, id: Not(id) }
            : {},
          updateUserDto.email
            ? { email: updateUserDto.email, id: Not(id) }
            : {},
        ].filter((w) => Object.keys(w).length > 0),
      });

      if (existingUser) {
        throw new ConflictException(
          "Nom d'utilisateur ou email déjà utilisé",
        );
      }
    }

    // Si le mot de passe est fourni, le hasher
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    await this.userRepository.update(userId, { password: hashedNewPassword });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    // Empêcher la suppression du dernier super admin
    if (user.role.name === 'super_admin') {
      const superAdminCount = await this.userRepository.count({
        where: { role: { name: 'super_admin' } },
      });

      if (superAdminCount <= 1) {
        throw new BadRequestException(
          'Impossible de supprimer le dernier super administrateur',
        );
      }
    }

    await this.userRepository.remove(user);
  }

  async toggleActive(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
