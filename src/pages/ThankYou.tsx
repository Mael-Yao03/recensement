import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Home, AlertCircle, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import successIllustration from "@/assets/undraw_confirmed_c5lo.png";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  
  // Récupération des paramètres URL
  const name = searchParams.get("name") || "Utilisateur";
  const id = searchParams.get("id") || "Inconnu";

  // Vérification de la présence des paramètres requis
  const hasError = !name || !id;
  
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-accent/20 relative overflow-hidden">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-2xl animate-slide-up relative z-10">
        <Card className="shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm bg-card/95 overflow-hidden">
          <CardContent className="pt-12 pb-8 px-6 sm:px-12">
            {hasError ? (
              // État d'erreur - Paramètres manquants
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 animate-scale-in relative">
                  <div className="absolute inset-0 rounded-full bg-destructive/5 animate-ping"></div>
                  <AlertCircle className="w-12 h-12 text-destructive relative z-10" />
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    Oups ! Paramètres manquants
                  </h1>
                  <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Les paramètres <span className="font-semibold text-foreground px-2 py-0.5 bg-muted rounded">name</span> et{" "}
                    <span className="font-semibold text-foreground px-2 py-0.5 bg-muted rounded">id</span> sont requis dans l'URL.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Exemple d'URL valide :</p>
                  <code className="text-xs text-foreground bg-background px-3 py-2 rounded border border-border inline-block break-all">
                    /thankyou?name=Mael&id=42
                  </code>
                </div>
                
                <Button asChild variant="default" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  <Link to="/" className="inline-flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Retour à l'accueil
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-block">
                    <h1 className="text-4xl sm:text-5xl font-bold text-primary">
                      Merci, {name} !
                    </h1>
                    <div className="h-1 w-full bg-primary rounded-full mt-2"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xl text-muted-foreground">
                      Vos informations ont bien été enregistrées.
                    </p>
                    
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border-2 border-primary/20">
                      <span className="text-sm text-muted-foreground font-medium">Identifiant :</span>
                      <span className="font-bold text-xl text-primary">
                        {id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Illustration de succès */}
                <div className="relative animate-scale-in">
                  <img 
                    src={successIllustration} 
                    alt="Confirmation réussie"
                    className="w-25 h-auto max-w-md mx-auto rounded-2xl"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer avec contact */}
        <div className="text-center mt-8 space-y-2 opacity-0 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <p className="text-sm text-muted-foreground">
            Besoin d'aide ? Notre équipe est là pour vous
          </p>
          <a 
            href="mailto:support@example.com" 
            className="text-primary hover:text-accent transition-colors font-medium inline-flex items-center gap-2 hover:gap-3 group"
          >
            <Mail className="w-4 h-4" />
            support.transfiguration@gmail.com
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
