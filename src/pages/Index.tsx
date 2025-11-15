import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import rocketIcon from "@/assets/rocket-icon.png";
import shieldIcon from "@/assets/shield-icon.png";

/**
 * Page d'accueil avec exemples de liens vers la page de remerciement
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 relative overflow-hidden">
      {/* Décorations de fond animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section avec illustration */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Solution moderne de confirmation</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-success">
                  Page de
                </span>
                <br />
                <span className="text-foreground">Remerciement</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Une solution élégante et moderne pour afficher des messages de confirmation personnalisés avec style
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all group">
                  <Link to="/thankyou?name=Mael&id=42" className="inline-flex items-center gap-2">
                    Voir la démo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all">
                  <a href="#examples">
                    Exemples d'utilisation
                  </a>
                </Button>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">100% Responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Design Moderne</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Facile à personnaliser</span>
                </div>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative animate-scale-in lg:animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <img 
                src={heroIllustration} 
                alt="Illustration moderne de confirmation"
                className="relative z-10 w-full rounded-3xl shadow-2xl border border-border/50"
              />
              {/* Badges flottants */}
              <div className="absolute -bottom-4 -left-4 bg-card border-2 border-success/50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                <CheckCircle2 className="w-6 h-6 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Taux de satisfaction</p>
                  <p className="font-bold text-foreground">99.9%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features avec icônes illustrées */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Card className="shadow-[var(--shadow-card)] border-primary/20 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 mb-4 relative">
                  <img src={rocketIcon} alt="Rocket" className="w-full h-full object-contain" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Rapide & Dynamique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Paramètres URL dynamiques pour une personnalisation instantanée et automatique
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)] border-success/20 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/10 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 mb-4 relative">
                  <img src={shieldIcon} alt="Shield" className="w-full h-full object-contain" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Sécurisé & Fiable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestion d'erreurs élégante avec validation des paramètres et messages clairs
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)] border-accent/20 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-accent" />
                  Design Moderne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Animations fluides, effets visuels et design responsive pour tous les écrans
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Examples Section */}
          <div id="examples" className="space-y-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center space-y-4">
              <Badge variant="outline" className="px-4 py-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Exemples interactifs
              </Badge>
              <h2 className="text-4xl font-bold text-foreground">Testez en direct</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cliquez sur les exemples ci-dessous pour voir la page en action avec différents paramètres
              </p>
            </div>

            <Card className="shadow-[var(--shadow-card)] backdrop-blur-sm bg-card/95">
              <CardContent className="p-8 space-y-4">
                {/* Exemple valide 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all group">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success text-success-foreground">Valide</Badge>
                      <p className="font-semibold text-foreground">Exemple avec Mael</p>
                    </div>
                    <code className="text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded border border-border inline-block break-all">
                      /thankyou?name=Mael&id=42
                    </code>
                  </div>
                  <Button asChild className="sm:w-auto shadow-md group-hover:shadow-lg transition-all">
                    <Link to="/thankyou?name=Mael&id=42" className="inline-flex items-center gap-2">
                      Tester maintenant
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Exemple valide 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-success/5 to-primary/5 rounded-2xl border-2 border-success/20 hover:border-success/40 transition-all group">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success text-success-foreground">Valide</Badge>
                      <p className="font-semibold text-foreground">Exemple avec Sophie</p>
                    </div>
                    <code className="text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded border border-border inline-block break-all">
                      /thankyou?name=Sophie&id=123
                    </code>
                  </div>
                  <Button asChild className="sm:w-auto shadow-md group-hover:shadow-lg transition-all">
                    <Link to="/thankyou?name=Sophie&id=123" className="inline-flex items-center gap-2">
                      Tester maintenant
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Exemple avec erreur */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-2xl border-2 border-destructive/30 hover:border-destructive/50 transition-all group">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Erreur</Badge>
                      <p className="font-semibold text-foreground">Sans paramètres</p>
                    </div>
                    <code className="text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded border border-border inline-block">
                      /thankyou
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Voir comment la page gère les paramètres manquants
                    </p>
                  </div>
                  <Button asChild variant="outline" className="sm:w-auto shadow-md group-hover:shadow-lg transition-all">
                    <Link to="/thankyou" className="inline-flex items-center gap-2">
                      Voir l'erreur
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Stack */}
          <Card className="shadow-[var(--shadow-card)] backdrop-blur-sm bg-card/95 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-2xl">Stack technologique</CardTitle>
              <CardDescription>Technologies modernes et performantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "React 18", color: "from-blue-500 to-cyan-500" },
                  { name: "TypeScript", color: "from-blue-600 to-blue-400" },
                  { name: "Tailwind CSS", color: "from-cyan-500 to-teal-500" },
                  { name: "React Router", color: "from-red-500 to-pink-500" }
                ].map((tech) => (
                  <div 
                    key={tech.name}
                    className="relative overflow-hidden rounded-xl p-4 bg-muted/50 border border-border/50 hover:border-primary/50 transition-all group cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <p className="font-semibold text-foreground relative z-10">{tech.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Code propre et documenté</strong> - Le code source est entièrement commenté 
                  avec des explications claires pour faciliter la maintenance et la réutilisation dans vos projets.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
