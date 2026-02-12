// Entité MemberDetails - Champs spécifiques aux membres adultes
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Person } from './person.entity';

@Entity('member_details')
export class MemberDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Clé étrangère vers Person
  @Column({ type: 'uuid' })
  personId: string;

  @OneToOne(() => Person, (person) => person.memberDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'personId' })
  person: Person;

  // === Informations générales spécifiques aux membres ===
  @Column({ type: 'varchar', length: 4, nullable: true })
  anneeNaissance: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telephone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  // === Situation familiale ===
  @Column({ type: 'varchar', length: 50, nullable: true })
  situationMatrimoniale: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  typeFoyer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nomConjoint: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  conjointChretien: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  conjointTransfiguration: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assembleesConjoint: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  nombreEnfants: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  autresPersonnesCharge: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  nombrePersonnesCharge: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailsPersonnesCharge: string;

  // === Parcours spirituel ===
  @Column({ type: 'varchar', length: 50, nullable: true })
  religionOrigine: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  egliseOrigine: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  autreReligion: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  responsabilitesAnterieures: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailsResponsabilites: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dateConversion: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  baptemeEau: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  anneeBaptemeEau: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lieuBaptemeEau: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  anneeBaptemeSaintEsprit: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lieuBaptemeSaintEsprit: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  autreEgliseEvangelique: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nomAutreEglise: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  responsabilitesAutreEglise: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailsResponsabilitesAutreEglise: string;

  @Column({ type: 'text', nullable: true })
  motifsDepart: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  anneeTransfiguration: string;

  @Column({ type: 'text', nullable: true })
  raisonsChoixTransfiguration: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  satisfactionTransfiguration: string;

  @Column({ type: 'text', nullable: true })
  raisonsSatisfaction: string;

  // === Vie dans l'église ===
  @Column({ type: 'varchar', length: 10, nullable: true })
  membreGroupe: string;

  @Column({ type: 'text', nullable: true })
  groupesActuels: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  autreGroupeActuel: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  responsabilitesGroupe: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailsResponsabilitesGroupe: string;

  @Column({ type: 'text', nullable: true })
  raisonNonMembre: string;

  @Column({ type: 'text', nullable: true })
  groupesSouhaites: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  autreGroupeSouhaite: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  frequenceCultesDimanche: string;

  @Column({ type: 'text', nullable: true })
  raisonsAbsenceDimanche: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  participationCultesSoir: string;

  @Column({ type: 'text', nullable: true })
  raisonsAbsenceSoir: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  participationActionsSociales: string;

  @Column({ type: 'text', nullable: true })
  detailsActionsSociales: string;

  @Column({ type: 'text', nullable: true })
  raisonsNonParticipation: string;

  // === Vie professionnelle ===
  @Column({ type: 'varchar', length: 255, nullable: true })
  domaineFormation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profession: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  secteurActivite: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  situationProfessionnelle: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lieuTravail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  precisionLieuTravail: string;

  @Column({ type: 'text', nullable: true })
  disponibiliteActivites: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  autreDisponibilite: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  heureDepartTravail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  heureRetourTravail: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  activitesExtraPro: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailsActivitesExtraPro: string;

  @Column({ type: 'text', nullable: true })
  competences: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  autresCompetences: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  revenuMensuel: string;

  // === Besoins spirituels ===
  @Column({ type: 'varchar', length: 10, nullable: true })
  besoinAccompagnement: string;

  @Column({ type: 'text', nullable: true })
  domainesAppui: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  autreDomaineAppui: string;

  @Column({ type: 'text', nullable: true })
  typeFormation: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  espritFamille: string;

  @Column({ type: 'text', nullable: true })
  commentEspritFamille: string;

  @Column({ type: 'text', nullable: true })
  suggestionsFamille: string;

  // === Santé ===
  @Column({ type: 'varchar', length: 50, nullable: true })
  dernierBilan: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  etatSanteGeneral: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  maladiesChroniques: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  corpsPastoralInforme: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  souhaiteInformerCorpsPastoral: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  soutienPsychosocial: string;

  @Column({ type: 'text', nullable: true })
  descriptionSoutienPsychosocial: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  soutienMaterielFinancier: string;

  @Column({ type: 'text', nullable: true })
  suggestionsAssistanceSociale: string;
}
