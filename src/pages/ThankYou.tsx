import { useRef } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home, Mail, Download, Edit, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemberFormStore, useChildFormStore } from "@/stores";
import { jsPDF } from "jspdf";
import LogoImg from "@/assets/trans.png";

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

  const handleDownloadPDF = async () => {
    if (!submittedData) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Marges
      const marginLeft = 15;
      const marginRight = 15;
      const marginTop = 10;
      const marginBottom = 15;
      const headerHeight = 16;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const contentStartY = marginTop + headerHeight;
      const maxY = pageHeight - marginBottom;

      let currentY = contentStartY;

      // Charger le logo en base64
      let logoBase64: string | null = null;
      try {
        logoBase64 = await loadImageAsBase64(LogoImg);
      } catch {
        console.warn("Impossible de charger le logo");
      }

      // Dessiner l'en-tête sur la page courante
      const drawHeader = () => {
        const logoSize = 10;
        const logoX = marginLeft;
        const logoY = marginTop;

        if (logoBase64) {
          pdf.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);
        }

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(60, 60, 60);
        const churchName = "ÉGLISE ÉVANGELIQUE DES ASSEMBLÉES DE DIEU DES DEUX PLATEAUX AGBAN TEMPLE LA TRANSFIGURATION";
        const textX = logoX + logoSize + 3;
        const textMaxWidth = pageWidth - textX - marginRight;
        const textY = logoY + logoSize / 2 + 1.5;
        pdf.text(churchName, textX, textY, { maxWidth: textMaxWidth });

        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(marginLeft, contentStartY - 2, pageWidth - marginRight, contentStartY - 2);
      };

      // Vérifier si on a besoin d'une nouvelle page
      const ensureSpace = (neededHeight: number) => {
        if (currentY + neededHeight > maxY) {
          pdf.addPage();
          drawHeader();
          currentY = contentStartY;
        }
      };

      // === Page 1 : en-tête ===
      drawHeader();

      // Charger la photo du membre en base64
      let photoBase64: string | null = null;
      if (photoUrl) {
        try {
          photoBase64 = await loadImageAsBase64(photoUrl);
        } catch {
          console.warn("Impossible de charger la photo");
        }
      }

      // --- Bloc d'en-tête avec fond coloré ---
      const headerBlockHeight = 40;
      ensureSpace(headerBlockHeight + 10);

      // Fond bleu clair
      pdf.setFillColor(230, 240, 255);
      pdf.roundedRect(marginLeft, currentY, contentWidth, headerBlockHeight, 3, 3, "F");

      // Photo à gauche
      const photoX = marginLeft + 4;
      const photoY = currentY + 4;
      const photoW = 24;
      const photoH = 32;

      if (photoBase64) {
        // Fond blanc pour la photo
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(photoX - 0.5, photoY - 0.5, photoW + 1, photoH + 1, 1, 1, "F");
        pdf.addImage(photoBase64, "JPEG", photoX, photoY, photoW, photoH);
      } else {
        // Placeholder gris
        pdf.setFillColor(220, 220, 220);
        pdf.roundedRect(photoX, photoY, photoW, photoH, 1, 1, "F");
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(150, 150, 150);
        pdf.text("Pas de photo", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
      }

      // Texte à droite de la photo
      const infoX = photoX + photoW + 6;
      let infoY = currentY + 9;

      // Titre "Récépissé d'inscription"
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 60, 130);
      pdf.text("Récapitulatif des réponses", infoX, infoY);
      infoY += 7;

      // Référence en badge coloré
      if (reference) {
        pdf.setFillColor(30, 100, 180);
        const refText = `Réf : ${reference}`;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        const refWidth = pdf.getTextWidth(refText) + 6;
        pdf.roundedRect(infoX, infoY - 3.5, refWidth, 5.5, 1.5, 1.5, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.text(refText, infoX + 3, infoY);
        infoY += 7;
      }

      // Nom complet
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 30, 30);
      pdf.text(submittedData?.nomPrenoms || "", infoX, infoY);
      infoY += 5;

      // Type + date
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      pdf.text(`${type === "membre" ? "MEMBRE" : "ECODIM"} — Enregistré le ${dateStr}`, infoX, infoY);

      currentY += headerBlockHeight + 8;

      // === Sections ===
      for (const section of sections) {
        const filledFields = section.fields.filter((field) => {
          const value = (submittedData as unknown as Record<string, string | string[]>)?.[field];
          if (!value) return false;
          if (Array.isArray(value) && value.length === 0) return false;
          if (typeof value === "string" && value.trim() === "") return false;
          return true;
        });

        if (filledFields.length === 0) continue;

        // Titre de section avec fond coloré
        ensureSpace(14);
        pdf.setFillColor(240, 245, 255);
        pdf.roundedRect(marginLeft, currentY - 4, contentWidth, 8, 1.5, 1.5, "F");
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 60, 130);
        pdf.text(section.title, marginLeft + 3, currentY);
        currentY += 7;

        // Champs
        let fieldIndex = 0;
        for (const field of filledFields) {
          const rawValue = (submittedData as unknown as Record<string, string | string[]>)?.[field];
          const value = formatValue(rawValue);
          const label = fieldLabels[field] || field;

          // Calculer la hauteur nécessaire pour ce champ
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          const valueLines = pdf.splitTextToSize(value, contentWidth - 6);
          const fieldHeight = 4 + valueLines.length * 4.5 + 3;

          ensureSpace(fieldHeight);

          // Fond alterné léger
          if (fieldIndex % 2 === 0) {
            pdf.setFillColor(248, 249, 252);
            pdf.rect(marginLeft, currentY - 3, contentWidth, fieldHeight, "F");
          }

          // Label (normal, bleu-gris)
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(80, 100, 130);
          pdf.setFontSize(8);
          pdf.text(label, marginLeft + 3, currentY);
          currentY += 4;

          // Valeur (gras, noir)
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 30, 30);
          pdf.setFontSize(10);
          const wrappedValue = pdf.splitTextToSize(value, contentWidth - 6);
          pdf.text(wrappedValue, marginLeft + 3, currentY);
          currentY += wrappedValue.length * 4.5 + 3;

          fieldIndex++;
        }

        currentY += 4;
      }

      const nom = submittedData?.nomPrenoms?.replace(/\s+/g, "_") || "membre";
      pdf.save(`recepisse_${nom}.pdf`);
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

            {/* RÉCAP - zone capturée en PDF */}
            <div ref={recapRef} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* En-tête du récépissé */}
              <div className="bg-primary/10 px-6 sm:px-8 py-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Photo */}
                  <div className="w-28 h-32 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-white shadow">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Photo" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
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
              <Button
                // variant="outline"
                size="lg"
                onClick={handleDownloadPDF}
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger en PDF
              </Button>

              {/* {type === "membre" && createdId && ( */}
                <Button asChild variant="outline" size="lg">
                  <Link to={type === "membre" ? "/update-member" : "/update-child"} className="inline-flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Modifier mes informations
                  </Link>
                </Button>
              {/* )} */}

              {/* <Button
                size="lg"
                onClick={handleNewRegistration}
                asChild
              >
                <Link to={type === "membre" ? "/registration" : "/registration-children"} className="inline-flex items-center gap-2">
                  Nouvelle inscription
                </Link>
              </Button> */}

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
                href="mailto:support.transfiguration@gmail.com"
                className="text-primary flex items-center justify-center gap-2 text-sm"
              >
                <Mail className="w-4 h-4" />
                support.transfiguration@gmail.com
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ThankYou;
