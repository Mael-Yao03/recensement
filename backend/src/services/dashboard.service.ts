import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { MemberDetails } from '../entities/member.entity';
import { ChildDetails } from '../entities/child.entity';
import { User } from '../entities/user.entity';

export interface DashboardStats {
  totalMembers: number;
  totalChildren: number;
  totalUsers: number;
  membersByGender: { homme: number; femme: number };
  childrenByGender: { homme: number; femme: number };
  membersByMaritalStatus: Record<string, number>;
  membersByAge: Record<string, number>;
  newMembersThisMonth: number;
  newChildrenThisMonth: number;
  membersByNationality: Record<string, number>;
  membersByResidence: Record<string, number>;
  membersBySatisfaction: Record<string, number>;
  recentRegistrations: {
    id: string;
    nomPrenoms: string;
    type: string;
    createdAt: Date;
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    @InjectRepository(MemberDetails)
    private memberDetailsRepository: Repository<MemberDetails>,
    @InjectRepository(ChildDetails)
    private childDetailsRepository: Repository<ChildDetails>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    // Comptes généraux
    const totalMembers = await this.personRepository.count({
      where: { type: 'member' },
    });
    const totalChildren = await this.personRepository.count({
      where: { type: 'child' },
    });
    const totalUsers = await this.userRepository.count();

    // Membres par genre
    const members = await this.personRepository.find({
      where: { type: 'member' },
      relations: ['memberDetails'],
    });

    const membersByGender = {
      homme: members.filter((m) => m.sexe === 'homme').length,
      femme: members.filter((m) => m.sexe === 'femme').length,
    };

    // Enfants par genre
    const children = await this.personRepository.find({
      where: { type: 'child' },
    });

    const childrenByGender = {
      homme: children.filter((c) => c.sexe === 'masculin').length,
      femme: children.filter((c) => c.sexe === 'feminin').length,
    };

    // Membres par situation matrimoniale
    const membersByMaritalStatus: Record<string, number> = {};
    members.forEach((m) => {
      const status = m.memberDetails?.situationMatrimoniale || 'non_specifie';
      membersByMaritalStatus[status] =
        (membersByMaritalStatus[status] || 0) + 1;
    });

    // Membres par tranche d'âge
    const currentYear = new Date().getFullYear();
    const membersByAge: Record<string, number> = {
      '0-17': 0,
      '18-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0,
      non_specifie: 0,
    };

    members.forEach((m) => {
      const birthYear = parseInt(m.memberDetails?.anneeNaissance || '0', 10);
      if (birthYear > 0) {
        const age = currentYear - birthYear;
        if (age < 18) membersByAge['0-17']++;
        else if (age <= 30) membersByAge['18-30']++;
        else if (age <= 45) membersByAge['31-45']++;
        else if (age <= 60) membersByAge['46-60']++;
        else membersByAge['60+']++;
      } else {
        membersByAge['non_specifie']++;
      }
    });

    // Nouveaux membres ce mois
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newMembersThisMonth = await this.personRepository.count({
      where: {
        type: 'member',
        createdAt: startOfMonth,
      },
    });

    const newChildrenThisMonth = await this.personRepository.count({
      where: {
        type: 'child',
        createdAt: startOfMonth,
      },
    });

    // Membres par nationalité
    const membersByNationality: Record<string, number> = {};
    members.forEach((m) => {
      const nationality = m.nationalite || 'non_specifie';
      membersByNationality[nationality] =
        (membersByNationality[nationality] || 0) + 1;
    });

    // Membres par lieu de résidence
    const membersByResidence: Record<string, number> = {};
    members.forEach((m) => {
      const residence = m.lieuResidence || 'non_specifie';
      membersByResidence[residence] =
        (membersByResidence[residence] || 0) + 1;
    });

    // Satisfaction à La Transfiguration
    const membersBySatisfaction: Record<string, number> = {};
    members.forEach((m) => {
      const satisfaction =
        m.memberDetails?.satisfactionTransfiguration || 'non_specifie';
      membersBySatisfaction[satisfaction] =
        (membersBySatisfaction[satisfaction] || 0) + 1;
    });

    // Dernières inscriptions
    const recentRegistrations = await this.personRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalMembers,
      totalChildren,
      totalUsers,
      membersByGender,
      childrenByGender,
      membersByMaritalStatus,
      membersByAge,
      newMembersThisMonth,
      newChildrenThisMonth,
      membersByNationality,
      membersByResidence,
      membersBySatisfaction,
      recentRegistrations: recentRegistrations.map((r) => ({
        id: r.id,
        nomPrenoms: r.nomPrenoms,
        type: r.type,
        createdAt: r.createdAt,
      })),
    };
  }

  async getMembersList(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: Person[]; total: number; pages: number }> {
    const query = this.personRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.memberDetails', 'memberDetails')
      .leftJoinAndSelect('person.images', 'images')
      .where('person.type = :type', { type: 'member' });

    if (search) {
      query.andWhere('person.nomPrenoms LIKE :search', {
        search: `%${search}%`,
      });
    }

    const total = await query.getCount();
    const data = await query
      .orderBy('person.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getChildrenList(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: Person[]; total: number; pages: number }> {
    const query = this.personRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.childDetails', 'childDetails')
      .leftJoinAndSelect('person.images', 'images')
      .where('person.type = :type', { type: 'child' });

    if (search) {
      query.andWhere('person.nomPrenoms LIKE :search', {
        search: `%${search}%`,
      });
    }

    const total = await query.getCount();
    const data = await query
      .orderBy('person.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
