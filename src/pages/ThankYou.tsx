import { Link } from "react-router-dom";
import { AlertCircle, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemberFormStore, useChildFormStore } from "@/stores";

const ThankYou = () => {
  // Récupérer les données des stores
  const memberFormData = useMemberFormStore((state) => state.formData);
  const memberIsSubmitted = useMemberFormStore((state) => state.isSubmitted);
  const memberCreatedId = useMemberFormStore((state) => state.createdMemberId);
  const memberCreatedReference = useMemberFormStore((state) => state.createdMemberReference);
  const resetMemberForm = useMemberFormStore((state) => state.resetForm);
  
  const childFormData = useChildFormStore((state) => state.formData);
  const childIsSubmitted = useChildFormStore((state) => state.isSubmitted);
  const childCreatedId = useChildFormStore((state) => state.createdChildId);
  const resetChildForm = useChildFormStore((state) => state.resetForm);

  // Déterminer quel formulaire a été soumis
  const isMemberSubmission = memberIsSubmitted && memberFormData.nomPrenoms;
  const isChildSubmission = childIsSubmitted && childFormData.nomPrenoms;
  
  const hasSubmission = isMemberSubmission || isChildSubmission;
  
  const data = isMemberSubmission ? {
    nomPrenoms: memberFormData.nomPrenoms || "N/A",
    registrationDate: new Date().toLocaleDateString('fr-FR'),
    id: memberCreatedId || "0000",
    reference: memberCreatedReference || null,
    picture: memberFormData.photo || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${memberFormData.nomPrenoms || "Membre"}`,
    type: "membre"
  } : {
    nomPrenoms: childFormData.nomPrenoms || "N/A",
    registrationDate: new Date().toLocaleDateString('fr-FR'),
    id: childCreatedId || "0000",
    reference: null,
    picture: childFormData.photo || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${childFormData.nomPrenoms || "Enfant"}`,
    type: "enfant"
  };

  const handleNewRegistration = () => {
    if (isMemberSubmission) {
      resetMemberForm();
    } else {
      resetChildForm();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-accent/20 relative overflow-hidden">

      <div className="w-full max-w-2xl animate-slide-up relative z-10">
        <Card className="shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm bg-card/95 overflow-hidden">
          <CardContent className="pt-12 pb-8 px-6 sm:px-12">

            {!hasSubmission ? (
              /* ÉTAT ERREUR */
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 animate-scale-in relative">
                  <div className="absolute inset-0 rounded-full bg-destructive/5 animate-ping"></div>
                  <AlertCircle className="w-12 h-12 text-destructive relative z-10" />
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
            ) : (
              /* ÉTAT SUCCÈS */
              <div className="text-center space-y-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary">
                  Merci !
                </h1>

                <p className="text-muted-foreground text-xl">
                  {data.type === "membre" 
                    ? "Votre inscription a bien été enregistrée." 
                    : "L'inscription de l'enfant a bien été enregistrée."}
                </p>

                {/* CARTE MEMBRE */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 mt-8 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center sm:text-left">Récépissé</h2>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Photo */}
                    <div className="w-32 h-40 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {data.picture.startsWith('data:image') ? (
                        <img
                          src={data.picture}
                          alt="Photo"
                          className="w-32 h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src={data.picture}
                          alt="Avatar"
                          className="w-32 h-40 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                      {data.reference && (
                        <p className="text-lg font-bold text-primary"><b>Référence :</b> {data.reference}</p>
                      )}
                      <p><b>Nom et Prénoms :</b> {data.nomPrenoms}</p>
                      <p><b>Type :</b> {data.type === "membre" ? "Membre adulte" : "Enfant"}</p>
                      <p><b>Date d'enregistrement :</b> {data.registrationDate}</p>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/" className="inline-flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Retour à l'accueil
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={handleNewRegistration}
                    asChild
                  >
                    <Link to={data.type === "membre" ? "/registration" : "/registration-children"}>
                      Nouvelle inscription
                    </Link>
                  </Button>
                </div>

              </div>
            )}

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">Besoin d'aide ?</p>
          <a href="mailto:support.transfiguration@gmail.com" className="text-primary flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            support.transfiguration@gmail.com
          </a>
        </div>
      </div>

    </main>
  );
};

export default ThankYou;
