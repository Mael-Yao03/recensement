import { useRef } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home, Mail, Download, Edit, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemberFormStore, useChildFormStore } from "@/stores";
import { jsPDF } from "jspdf";
import LogoImg from "@/assets/trans.png";
import { FaWhatsapp } from "react-icons/fa";

// Convertir le logo en base64 pour l'intégrer dans le PDF
function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Charge une image et la recadre (object-fit: cover) aux dimensions cibles.
 * Retourne un dataURL PNG prêt à être inséré dans jsPDF sans déformation.
 */
function loadImageCropped(src: string, targetW: number, targetH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }

      // Calculer le crop "cover"
      const srcAspect = img.width / img.height;
      const dstAspect = targetW / targetH;

      let sx = 0, sy = 0, sw = img.width, sh = img.height;

      if (srcAspect > dstAspect) {
        // Image plus large → couper les côtés
        sw = img.height * dstAspect;
        sx = (img.width - sw) / 2;
      } else {
        // Image plus haute → couper haut/bas
        sh = img.width / dstAspect;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Labels lisibles pour les champs membre
const memberFieldLabels: Record<string, string> = {
  nomPrenoms: "Nom et Prénoms",
  sexe: "Sexe",
  anneeNaissance: "Année de naissance",
  nationalite: "Nationalité",
  ethnie: "Ethnie",
  lieuResidence: "Lieu de résidence",
  telephone: "Téléphone",
  email: "Email",
  situationMatrimoniale: "Situation matrimoniale",
  typeFoyer: "Type de foyer",
  nomConjoint: "Nom du conjoint",
  conjointChretien: "Conjoint chrétien",
  conjointTransfiguration: "Conjoint à La Transfiguration",
  assembleesConjoint: "Assemblée du conjoint",
  nombreEnfants: "Nombre d'enfants",
  autresPersonnesCharge: "Autres personnes à charge",
  nombrePersonnesCharge: "Nombre de personnes à charge",
  detailsPersonnesCharge: "Détails personnes à charge",
  religionOrigine: "Religion d'origine",
  egliseOrigine: "Église d'origine",
  autreReligion: "Autre religion",
  responsabilitesAnterieures: "Responsabilités antérieures",
  detailsResponsabilites: "Détails des responsabilités",
  dateConversion: "Date de conversion",
  baptemeEau: "Baptême d'eau",
  anneeBaptemeEau: "Année baptême d'eau",
  lieuBaptemeEau: "Lieu baptême d'eau",
  baptiseSaintEsprit: "Baptisé du Saint-Esprit",
  anneeBaptemeSaintEsprit: "Année baptême Saint-Esprit",
  lieuBaptemeSaintEsprit: "Lieu baptême Saint-Esprit",
  autreEgliseEvangelique: "Autre église évangélique",
  nomAutreEglise: "Nom autre église",
  responsabilitesAutreEglise: "Responsabilités autre église",
  detailsResponsabilitesAutreEglise: "Détails responsabilités autre église",
  motifsDepart: "Motifs de départ",
  anneeTransfiguration: "Année arrivée Transfiguration",
  raisonsChoixTransfiguration: "Raisons du choix Transfiguration",
  satisfactionTransfiguration: "Satisfaction Transfiguration",
  raisonsSatisfaction: "Raisons satisfaction",
  membreGroupe: "Membre d'un groupe",
  groupesActuels: "Groupes actuels",
  autreGroupeActuel: "Autre groupe actuel",
  responsabilitesGroupe: "Responsabilités dans le groupe",
  detailsResponsabilitesGroupe: "Détails responsabilités groupe",
  raisonNonMembre: "Raison non-membre",
  groupesSouhaites: "Groupes souhaités",
  autreGroupeSouhaite: "Autre groupe souhaité",
  frequenceCultesDimanche: "Fréquence cultes dimanche",
  raisonsAbsenceDimanche: "Raisons absence dimanche",
  participationCultesSoir: "Participation cultes du soir",
  raisonsAbsenceSoir: "Raisons absence soir",
  participationActionsSociales: "Participation actions sociales",
  detailsActionsSociales: "Détails actions sociales",
  raisonsNonParticipation: "Raisons non-participation",
  niveauEtudes: "Niveau d'études",
  domaineFormation: "Domaine de formation",
  profession: "Profession",
  secteurActivite: "Secteur d'activité",
  situationProfessionnelle: "Situation professionnelle",
  lieuTravail: "Lieu de travail",
  precisionLieuTravail: "Précision lieu de travail",
  disponibiliteActivites: "Disponibilité activités",
  autreDisponibilite: "Autre disponibilité",
  heureDepartTravail: "Heure départ travail",
  heureRetourTravail: "Heure retour travail",
  activitesExtraPro: "Activités extra-professionnelles",
  detailsActivitesExtraPro: "Détails activités extra-pro",
  competences: "Compétences",
  autresCompetences: "Autres compétences",
  revenuMensuel: "Revenu mensuel",
  besoinAccompagnement: "Besoin d'accompagnement",
  domainesAppui: "Domaines d'appui",
  autreDomaineAppui: "Autre domaine d'appui",
  typeFormation: "Type de formation souhaitée",
  espritFamille: "Esprit de famille",
  commentEspritFamille: "Commentaire esprit de famille",
  suggestionsFamille: "Suggestions famille",
  dernierBilan: "Dernier bilan de santé",
  etatSanteGeneral: "État de santé général",
  maladiesChroniques: "Maladies chroniques",
  corpsPastoralInforme: "Corps pastoral informé",
  souhaiteInformerCorpsPastoral: "Souhaite informer le corps pastoral",
  soutienPsychosocial: "Soutien psychosocial",
  descriptionSoutienPsychosocial: "Description soutien psychosocial",
  soutienMaterielFinancier: "Soutien matériel/financier",
  suggestionsAssistanceSociale: "Suggestions assistance sociale",
};

// Labels pour les champs enfant
const childFieldLabels: Record<string, string> = {
  nomPrenoms: "Nom et Prénoms",
  sexe: "Sexe",
  dateNaissance: "Date de naissance",
  nationalite: "Nationalité",
  ethnie: "Ethnie",
  lieuResidence: "Lieu de résidence",
  baptiseSaintEsprit: "Baptisé du Saint-Esprit",
  niveauEtudes: "Niveau d'études",
  nomPere: "Nom du père",
  nomMere: "Nom de la mère",
  residenceParents: "Résidence des parents",
  contactParents: "Contact des parents",
  nomTuteur: "Nom du tuteur",
  residenceTuteur: "Résidence du tuteur",
  contactTuteur: "Contact du tuteur",
  depuisQuandEglise: "Depuis quand à l'église",
  parentsEglise: "Parents à l'église",
  accompagnateurEglise: "Accompagnateur à l'église",
};

// Sections pour le récap membre
const memberSections = [
  {
    title: "I. Informations générales",
    fields: ["nomPrenoms", "sexe", "anneeNaissance", "nationalite", "ethnie", "lieuResidence", "telephone", "email"],
  },
  {
    title: "II. Situation familiale",
    fields: ["situationMatrimoniale", "typeFoyer", "nomConjoint", "conjointChretien", "conjointTransfiguration", "assembleesConjoint", "nombreEnfants", "autresPersonnesCharge", "nombrePersonnesCharge", "detailsPersonnesCharge"],
  },
  {
    title: "III. Parcours spirituel",
    fields: ["religionOrigine", "egliseOrigine", "autreReligion", "responsabilitesAnterieures", "detailsResponsabilites", "dateConversion", "baptemeEau", "anneeBaptemeEau", "lieuBaptemeEau", "baptiseSaintEsprit", "anneeBaptemeSaintEsprit", "lieuBaptemeSaintEsprit", "autreEgliseEvangelique", "nomAutreEglise", "responsabilitesAutreEglise", "detailsResponsabilitesAutreEglise", "motifsDepart"],
  },
  {
    title: "IV. Vie ecclésiale",
    fields: ["anneeTransfiguration", "raisonsChoixTransfiguration", "satisfactionTransfiguration", "raisonsSatisfaction", "membreGroupe", "groupesActuels", "autreGroupeActuel", "responsabilitesGroupe", "detailsResponsabilitesGroupe", "raisonNonMembre", "groupesSouhaites", "autreGroupeSouhaite", "frequenceCultesDimanche", "raisonsAbsenceDimanche", "participationCultesSoir", "raisonsAbsenceSoir", "participationActionsSociales", "detailsActionsSociales", "raisonsNonParticipation"],
  },
  {
    title: "V. Vie professionnelle",
    fields: ["niveauEtudes", "domaineFormation", "profession", "secteurActivite", "situationProfessionnelle", "lieuTravail", "precisionLieuTravail", "disponibiliteActivites", "autreDisponibilite", "heureDepartTravail", "heureRetourTravail", "activitesExtraPro", "detailsActivitesExtraPro", "competences", "autresCompetences", "revenuMensuel"],
  },
  {
    title: "VI. Besoins et suggestions",
    fields: ["besoinAccompagnement", "domainesAppui", "autreDomaineAppui", "typeFormation", "espritFamille", "commentEspritFamille", "suggestionsFamille"],
  },
  {
    title: "VII. Santé",
    fields: ["dernierBilan", "etatSanteGeneral", "maladiesChroniques", "corpsPastoralInforme", "souhaiteInformerCorpsPastoral", "soutienPsychosocial", "descriptionSoutienPsychosocial", "soutienMaterielFinancier", "suggestionsAssistanceSociale"],
  },
];

const childSections = [
  {
    title: "I. Informations de l'enfant",
    fields: ["nomPrenoms", "sexe", "dateNaissance", "nationalite", "ethnie", "lieuResidence", "baptiseSaintEsprit", "niveauEtudes"],
  },
  {
    title: "II. Informations des parents",
    fields: ["nomPere", "nomMere", "residenceParents", "contactParents"],
  },
  {
    title: "III. Tuteur et église",
    fields: ["nomTuteur", "residenceTuteur", "contactTuteur", "depuisQuandEglise", "parentsEglise", "accompagnateurEglise"],
  },
];

function formatValue(value: string | string[] | undefined): string {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

const ThankYou = () => {
  const recapRef = useRef<HTMLDivElement>(null);

  // Stores membres
  const memberIsSubmitted = useMemberFormStore((state) => state.isSubmitted);
  const memberCreatedId = useMemberFormStore((state) => state.createdMemberId);
  const memberCreatedReference = useMemberFormStore((state) => state.createdMemberReference);
  const memberSubmittedData = useMemberFormStore((state) => state.submittedData);
  const memberSubmittedPhoto = useMemberFormStore((state) => state.submittedPhoto);
  const clearMemberSubmission = useMemberFormStore((state) => state.clearSubmission);

  // Stores enfants
  const childIsSubmitted = useChildFormStore((state) => state.isSubmitted);
  const childCreatedId = useChildFormStore((state) => state.createdChildId);
  const childCreatedReference = useChildFormStore((state) => state.createdChildReference);
  const childSubmittedData = useChildFormStore((state) => state.submittedData);
  const childSubmittedPhoto = useChildFormStore((state) => state.submittedPhoto);
  const clearChildSubmission = useChildFormStore((state) => state.clearSubmission);

  // Déterminer quel formulaire a été soumis
  const isMemberSubmission = memberIsSubmitted && memberSubmittedData;
  const isChildSubmission = childIsSubmitted && childSubmittedData;
  const hasSubmission = isMemberSubmission || isChildSubmission;

  const submittedData = isMemberSubmission ? memberSubmittedData : childSubmittedData;
  const photoUrl = isMemberSubmission ? memberSubmittedPhoto : childSubmittedPhoto;
  const reference = isMemberSubmission ? memberCreatedReference : childCreatedReference;
  const createdId = isMemberSubmission ? memberCreatedId : childCreatedId;
  const type = isMemberSubmission ? "membre" : "enfant";
  const sections = isMemberSubmission ? memberSections : childSections;
  const fieldLabels = isMemberSubmission ? memberFieldLabels : childFieldLabels;

  const handleNewRegistration = () => {
    if (isMemberSubmission) {
      clearMemberSubmission();
    } else {
      clearChildSubmission();
    }
  };

  // ─── Palette de couleurs du PDF ───────────────────────────────────────────
  const COLORS = {
    primary:    [30, 60, 130]   as [number, number, number],
    primaryLight:[230, 237, 255] as [number, number, number],
    accent:     [245, 180, 0]   as [number, number, number],
    white:      [255, 255, 255] as [number, number, number],
    gray100:    [248, 249, 252] as [number, number, number],
    gray200:    [235, 238, 245] as [number, number, number],
    gray400:    [160, 165, 180] as [number, number, number],
    gray600:    [80,  90, 110]  as [number, number, number],
    dark:       [25,  30,  45]  as [number, number, number],
  };

  const handleDownloadPDF = async () => {
    if (!submittedData) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Mise en page
      const marginLeft   = 14;
      const marginRight  = 14;
      const marginTop    = 0;         // géré par le bandeau
      const marginBottom = 16;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const HEADER_H     = 22;        // hauteur du bandeau supérieur
      const FOOTER_H     = 10;
      const contentStartY = HEADER_H + 4;
      const maxY          = pageHeight - marginBottom - FOOTER_H;

      let currentY    = contentStartY;
      let pageNumber  = 1;

      // ── Chargement des images ──────────────────────────────────────────────
      let logoBase64: string | null = null;
      try { logoBase64 = await loadImageAsBase64(LogoImg); } catch { /* ignore */ }

      // Photo avec recadrage "cover" (3×4) — résolution canvas suffisante pour rendu net
      const PHOTO_W_PX = 525;  // 35mm × 15 dpi-factor → rendu haute résolution
      const PHOTO_H_PX = 700;  // ratio exact 3:4
      let photoBase64: string | null = null;
      if (photoUrl) {
        try {
          photoBase64 = await loadImageCropped(photoUrl, PHOTO_W_PX, PHOTO_H_PX);
        } catch { /* ignore */ }
      }

      // ── Bandeau supérieur ──────────────────────────────────────────────────
      const drawHeader = () => {
        // Fond bleu foncé
        pdf.setFillColor(...COLORS.primary);
        pdf.rect(0, marginTop, pageWidth, HEADER_H, "F");

        // Bande accent (trait doré en bas du bandeau)
        pdf.setFillColor(...COLORS.accent);
        pdf.rect(0, marginTop + HEADER_H - 1.2, pageWidth, 1.2, "F");

        // Logo
        const logoSize = 13;
        const logoX = marginLeft;
        const logoY = marginTop + (HEADER_H - 1.2 - logoSize) / 2;
        if (logoBase64) {
          pdf.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);
        }

        // Nom de l'église
        const churchLines = [
          "ÉGLISE ÉVANGÉLIQUE DES ASSEMBLÉES DE DIEU",
          "DES DEUX PLATEAUX AGBAN — TEMPLE LA TRANSFIGURATION",
        ];
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.white);
        const textX = marginLeft + logoSize + 4;
        pdf.text(churchLines[0], textX, marginTop + 7);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6.5);
        pdf.text(churchLines[1], textX, marginTop + 12);

        // Numéro de page à droite
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(200, 210, 240);
        pdf.text(`Page ${pageNumber}`, pageWidth - marginRight, marginTop + 9, { align: "right" });
      };

      // ── Pied de page ───────────────────────────────────────────────────────
      const drawFooter = () => {
        const footerY = pageHeight - FOOTER_H;
        pdf.setDrawColor(...COLORS.gray200);
        pdf.setLineWidth(0.3);
        pdf.line(marginLeft, footerY, pageWidth - marginRight, footerY);

        pdf.setFontSize(6.5);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(...COLORS.gray400);
        pdf.text(
          "Document confidentiel — Usage exclusif du corps pastoral",
          pageWidth / 2,
          footerY + 4,
          { align: "center" }
        );
        pdf.text(
          `Généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
          pageWidth - marginRight,
          footerY + 4,
          { align: "right" }
        );
      };

      // ── Gestion des sauts de page ──────────────────────────────────────────
      const ensureSpace = (neededHeight: number) => {
        if (currentY + neededHeight > maxY) {
          drawFooter();
          pdf.addPage();
          pageNumber++;
          drawHeader();
          currentY = contentStartY;
        }
      };

      // ═══════════════════════════════════════════════════════════════════════
      // PAGE 1 — En-tête
      // ═══════════════════════════════════════════════════════════════════════
      drawHeader();

      // ── Bloc identité ──────────────────────────────────────────────────────
      const PHOTO_W  = 35;   // mm dans le PDF — moyenne
      const PHOTO_H  = 47;   // ratio exact 3:4 (35 × 4/3 ≈ 46.7 → 47)
      const BLOCK_H  = PHOTO_H + 10;

      ensureSpace(BLOCK_H + 6);

      // Fond carte
      pdf.setFillColor(...COLORS.primaryLight);
      pdf.roundedRect(marginLeft, currentY, contentWidth, BLOCK_H, 3, 3, "F");

      // Cadre blanc photo avec coins arrondis
      const photoX = marginLeft + 5;
      const photoY = currentY + 5;
      pdf.setFillColor(...COLORS.white);
      pdf.roundedRect(photoX - 1.5, photoY - 1.5, PHOTO_W + 3, PHOTO_H + 3, 3, 3, "F");
      pdf.setDrawColor(...COLORS.gray200);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(photoX - 1.5, photoY - 1.5, PHOTO_W + 3, PHOTO_H + 3, 3, 3, "S");

      if (photoBase64) {
        // Photo déjà recadrée "cover", on l'insère directement sans déformation
        pdf.addImage(photoBase64, "PNG", photoX, photoY, PHOTO_W, PHOTO_H);
      } else {
        // Placeholder
        pdf.setFillColor(220, 225, 235);
        pdf.roundedRect(photoX, photoY, PHOTO_W, PHOTO_H, 1.5, 1.5, "F");
        pdf.setFontSize(6);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.gray400);
        pdf.text("Pas de\nphoto", photoX + PHOTO_W / 2, photoY + PHOTO_H / 2 - 2, { align: "center" });
      }

      // Infos à droite de la photo
      const infoX = photoX + PHOTO_W + 9;
      let infoY   = photoY + 6;

      // Titre du document
      pdf.setFontSize(15);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...COLORS.primary);
      pdf.text("Récapitulatif des réponses", infoX, infoY);
      infoY += 8;

      // Badge type
      const typeLabel = type === "membre" ? "MEMBRE" : "ECODIM";
      pdf.setFillColor(...COLORS.accent);
      const badgeW = pdf.getStringUnitWidth(typeLabel) * 8 / pdf.internal.scaleFactor + 6;
      pdf.roundedRect(infoX, infoY - 4, badgeW, 6, 1.5, 1.5, "F");
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...COLORS.dark);
      pdf.text(typeLabel, infoX + 3, infoY);
      infoY += 8;

      // Référence
      if (reference) {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.primary);
        pdf.text(`Réf : ${reference}`, infoX, infoY);
        infoY += 6;
      }

      // Nom complet
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...COLORS.dark);
      pdf.text(submittedData?.nomPrenoms || "—", infoX, infoY);
      infoY += 6;

      // Date
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLORS.gray600);
      const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      pdf.text(`Enregistré le ${dateStr}`, infoX, infoY);

      currentY += BLOCK_H + 10;

      // ═══════════════════════════════════════════════════════════════════════
      // SECTIONS
      // ═══════════════════════════════════════════════════════════════════════
      for (const section of sections) {
        const filledFields = section.fields.filter((field) => {
          const value = (submittedData as unknown as Record<string, string | string[]>)?.[field];
          if (!value) return false;
          if (Array.isArray(value) && value.length === 0) return false;
          if (typeof value === "string" && value.trim() === "") return false;
          return true;
        });

        if (filledFields.length === 0) continue;

        // ── Titre de section ───────────────────────────────────────────────
        ensureSpace(12);

        // Barre colorée à gauche
        pdf.setFillColor(...COLORS.primary);
        pdf.rect(marginLeft, currentY - 4.5, 2.5, 8.5, "F");

        // Fond de titre
        pdf.setFillColor(...COLORS.primaryLight);
        pdf.rect(marginLeft + 2.5, currentY - 4.5, contentWidth - 2.5, 8.5, "F");

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.primary);
        pdf.text(section.title, marginLeft + 7, currentY);
        currentY += 7;

        // ── Champs en grille 2 colonnes ────────────────────────────────────
        const colGap   = 6;
        const colW     = (contentWidth - colGap) / 2;

        // let colIndex = 0;
        // let rowStartY = currentY;
        // let leftH = 0;
        // let rightH = 0;

        // Pré-calcul : grouper par paires
        const pairs: Array<[string, string | undefined]> = [];
        for (let i = 0; i < filledFields.length; i += 2) {
          pairs.push([filledFields[i], filledFields[i + 1]]);
        }

        for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
          const [leftField, rightField] = pairs[pairIdx];

          // Calculer hauteur max de la paire
          const calcFieldH = (field: string) => {
            const raw = (submittedData as unknown as Record<string, string | string[]>)?.[field];
            const val = formatValue(raw);
            pdf.setFontSize(9);
            const lines = pdf.splitTextToSize(val, colW - 4);
            return 4.5 + lines.length * 4.5 + 2;
          };

          const lH = calcFieldH(leftField);
          const rH = rightField ? calcFieldH(rightField) : 0;
          const pairH = Math.max(lH, rH) + 2;

          ensureSpace(pairH);

          // Fond alterné
          if (pairIdx % 2 === 0) {
            pdf.setFillColor(...COLORS.gray100);
            pdf.rect(marginLeft, currentY - 1, contentWidth, pairH, "F");
          }

          // Séparateur vertical entre colonnes
          pdf.setDrawColor(...COLORS.gray200);
          pdf.setLineWidth(0.2);
          pdf.line(marginLeft + colW + colGap / 2, currentY - 1, marginLeft + colW + colGap / 2, currentY + pairH - 1);

          // Dessin des deux cellules
          const drawCell = (field: string, x: number) => {
            const raw = (submittedData as unknown as Record<string, string | string[]>)?.[field];
            const val = formatValue(raw);
            const label = fieldLabels[field] || field;

            // Label
            pdf.setFontSize(6.5);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(...COLORS.gray400);
            pdf.text(label.toUpperCase(), x + 2, currentY + 3);

            // Valeur
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(...COLORS.dark);
            const wrapped = pdf.splitTextToSize(val, colW - 4);
            pdf.text(wrapped, x + 2, currentY + 8);
          };

          drawCell(leftField, marginLeft);
          if (rightField) {
            drawCell(rightField, marginLeft + colW + colGap);
          }

          currentY += pairH;
        }

        currentY += 5;
      }

      // ── Pied de page final ─────────────────────────────────────────────────
      drawFooter();

      // ── Sauvegarde ─────────────────────────────────────────────────────────
      const nom = submittedData?.nomPrenoms?.replace(/\s+/g, "_") || "membre";
      pdf.save(`recapitulatif_${nom}.pdf`);

    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 py-8 px-4">
      <div className="w-full max-w-3xl mx-auto">

        {!hasSubmission ? (
          /* ÉTAT ERREUR */
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-8 px-6 sm:px-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Aucune soumission détectée</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Aucun formulaire n'a été soumis. Veuillez remplir le formulaire d'inscription.
                </p>
                <Button asChild size="lg">
                  <Link to="/" className="inline-flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Retour à l'accueil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* SUCCÈS - En-tête */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                Inscription réussie !
              </h1>
              <p className="text-muted-foreground text-lg">
                {type === "membre"
                  ? "Votre inscription a bien été enregistrée."
                  : "L'inscription de l'enfant a bien été enregistrée."}
              </p>
            </div>

            {/* RÉCAP */}
            <div ref={recapRef} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* En-tête du récépissé */}
              <div className="bg-primary/10 px-6 sm:px-8 py-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Photo — cadre 3:4 avec object-cover pour éviter l'étirement */}
                  <div className="w-28 h-[148px] bg-gray-100 rounded-xl shrink-0 overflow-hidden border-2 border-white shadow">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Photo"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Infos principales */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Récapitulatif des réponses
                    </h2>
                    {reference && (
                      <p className="text-lg font-bold text-primary mb-2">
                        Référence : {reference}
                      </p>
                    )}
                    <p className="text-gray-700 font-medium text-lg">{submittedData?.nomPrenoms}</p>
                    <div className="flex flex-wrap gap-4 mt-2 justify-center sm:justify-start">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {type === "membre" ? "MEMBRE" : "ECODIM"}
                      </span>
                      <span className="text-sm text-gray-500">
                        Enregistré le {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections du récap */}
              <div className="px-6 sm:px-8 py-6 space-y-6">
                {sections.map((section) => {
                  const filledFields = section.fields.filter((field) => {
                    const value = (submittedData as unknown as Record<string, string | string[]>)?.[field];
                    if (!value) return false;
                    if (Array.isArray(value) && value.length === 0) return false;
                    if (typeof value === "string" && value.trim() === "") return false;
                    return true;
                  });

                  if (filledFields.length === 0) return null;

                  return (
                    <div key={section.title}>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {filledFields.map((field) => {
                          const value = (submittedData as unknown as Record<string, string | string[]>)?.[field];
                          return (
                            <div key={field} className="flex flex-col">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {fieldLabels[field] || field}
                              </span>
                              <span className="text-sm text-gray-900 mt-0.5">
                                {formatValue(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" onClick={handleDownloadPDF} className="gap-2">
                <Download className="w-5 h-5" />
                Télécharger en PDF
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link to={type === "membre" ? "/update-member" : "/update-child"} className="inline-flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Modifier mes informations
                </Link>
              </Button>

              <Button asChild variant="ghost" size="lg">
                <Link to="/" className="inline-flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Accueil
                </Link>
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-2">
              <p className="text-sm text-muted-foreground">Besoin d'aide ?</p>
              <a
                href="https://wa.me/22509545893" target="_blank"
                className="text-primary flex items-center justify-center gap-2 text-sm"
              >
                <FaWhatsapp className="w-4 h-4" />
                Ecrivez nous au 0709545893
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ThankYou;