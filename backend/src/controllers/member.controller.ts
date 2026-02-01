import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MemberService } from '../services/member.service';
import { CreateMemberDto } from '../dto/create-member.dto';

@Controller('api/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMemberDto: CreateMemberDto) {
    try {
      const member = await this.memberService.create(createMemberDto);
      return {
        success: true,
        message: 'Membre enregistré avec succès',
        data: member,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: "Erreur lors de l'enregistrement du membre",
        error: error.message,
      });
    }
  }

  @Get()
  async findAll() {
    const members = await this.memberService.findAll();
    return {
      success: true,
      data: members,
      count: members.length,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.memberService.getStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new NotFoundException({
        success: false,
        message: 'Membre non trouvé',
      });
    }
    return {
      success: true,
      data: member,
    };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const member = await this.memberService.findBySlug(slug);
    if (!member) {
      throw new NotFoundException({
        success: false,
        message: 'Membre non trouvé',
      });
    }
    return {
      success: true,
      data: member,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: Partial<CreateMemberDto>,
  ) {
    const member = await this.memberService.update(id, updateMemberDto);
    if (!member) {
      throw new NotFoundException({
        success: false,
        message: 'Membre non trouvé',
      });
    }
    return {
      success: true,
      message: 'Membre mis à jour avec succès',
      data: member,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const deleted = await this.memberService.remove(id);
    if (!deleted) {
      throw new NotFoundException({
        success: false,
        message: 'Membre non trouvé',
      });
    }
    return {
      success: true,
      message: 'Membre supprimé avec succès',
    };
  }
}
