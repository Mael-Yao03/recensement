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
import { ChildService } from '../services/child.service';
import { CreateChildDto } from '../dto/create-child.dto';

@Controller('api/children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createChildDto: CreateChildDto) {
    try {
      const child = await this.childService.create(createChildDto);
      return {
        success: true,
        message: 'Enfant enregistré avec succès',
        data: child,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: "Erreur lors de l'enregistrement de l'enfant",
        error: error.message,
      });
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() body: { reference: string; contactParents: string },
  ) {
    if (!body.reference || !body.contactParents) {
      throw new BadRequestException({
        success: false,
        message: 'La référence et le contact des parents sont requis',
      });
    }

    const child = await this.childService.findByReferenceAndContact(
      body.reference.trim().toUpperCase(),
      body.contactParents.trim(),
    );

    if (!child) {
      throw new NotFoundException({
        success: false,
        message:
          'Aucun enfant trouvé avec cette référence et ce contact parental',
      });
    }

    return {
      success: true,
      message: 'Vérification réussie',
      data: child,
    };
  }

  @Get()
  async findAll() {
    const children = await this.childService.findAll();
    return {
      success: true,
      data: children,
      count: children.length,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.childService.getStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const child = await this.childService.findOne(id);
    if (!child) {
      throw new NotFoundException({
        success: false,
        message: 'Enfant non trouvé',
      });
    }
    return {
      success: true,
      data: child,
    };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const child = await this.childService.findBySlug(slug);
    if (!child) {
      throw new NotFoundException({
        success: false,
        message: 'Enfant non trouvé',
      });
    }
    return {
      success: true,
      data: child,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChildDto: Partial<CreateChildDto>,
  ) {
    const child = await this.childService.update(id, updateChildDto);
    if (!child) {
      throw new NotFoundException({
        success: false,
        message: 'Enfant non trouvé',
      });
    }
    return {
      success: true,
      message: 'Enfant mis à jour avec succès',
      data: child,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const deleted = await this.childService.remove(id);
    if (!deleted) {
      throw new NotFoundException({
        success: false,
        message: 'Enfant non trouvé',
      });
    }
    return {
      success: true,
      message: 'Enfant supprimé avec succès',
    };
  }
}
