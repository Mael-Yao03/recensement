import { useSearchParams, Link } from "react-router-dom";
import { AlertCircle, Home, Mail, Church, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import successIllustration from "@/assets/undraw_confirmed_c5lo.png";

const ThankYou = () => {
  const [searchParams] = useSearchParams();

  const hasError = false;

  const data = {
    lastName: searchParams.get("name") || "N/A",
    firstName: searchParams.get("firstName") || "N/A",
    registrationDate: new Date().toLocaleDateString(),
    id: searchParams.get("id") || "0000",
    picture: searchParams.get("picture") || "https://static.vecteezy.com/system/resources/thumbnails/027/842/188/small/user-ecommerce-icon-fill-style-png.png",
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-accent/20 relative overflow-hidden">

      <div className="w-full max-w-2xl animate-slide-up relative z-10">
        <Card className="shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm bg-card/95 overflow-hidden">
          <CardContent className="pt-12 pb-8 px-6 sm:px-12">

            {hasError ? (
              /* ÉTAT ERREUR */
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 animate-scale-in relative">
                  <div className="absolute inset-0 rounded-full bg-destructive/5 animate-ping"></div>
                  <AlertCircle className="w-12 h-12 text-destructive relative z-10" />
                </div>

                <h1 className="text-3xl font-bold text-foreground">Oups ! Paramètres manquants</h1>

                <p className="text-muted-foreground max-w-md mx-auto">
                  Les paramètres <b>name</b> et <b>id</b> doivent être fournis dans l’URL.
                </p>

                <code className="text-xs text-foreground bg-background px-3 py-2 rounded border">
                  /thankyou?name=Mael&id=42
                </code>

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
                  Vos informations ont bien été enregistrées.
                </p>

                {/* Identifiant */}
                {/* <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border-2 border-primary/20">
                  <span className="font-medium text-muted-foreground">Identifiant :</span>
                  <span className="font-bold text-xl text-primary">{id}</span>
                </div> */}

                {/* Illustration */}
                {/* <img
                  src={successIllustration}
                  alt="Validation"
                  className="w-40 h-auto mx-auto"
                /> */}

                {/* CARTE MEMBRE */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 mt-8 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center sm:text-left">Récépissé</h2>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Photo */}
                    <div className="w-32 h-40 bg-gray-200 rounded-xl flex items-center justify-center shrink-0">
                      <img
                        src={data.picture}
                        alt="Photo du membre"
                        className="w-32 h-40 object-cover rounded-lg"
                      />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                      <p><b>Nom :</b> {data.lastName}</p>
                      <p><b>Prénoms :</b> {data.firstName}</p>
                      <p><b>Identifiant :</b> {data.id}</p>
                      <p><b>Date d’enregistrement :</b> {data.registrationDate}</p>
                    </div>
                  </div>
                </div>


              </div>
            )}

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">Besoin d’aide ?</p>
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
