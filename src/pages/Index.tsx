import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import heroIllustration from "@/assets/forms.png";
import Logo from "@/assets/trans.png";

const Index = () => {
  return (
    <div className="container mx-auto px-1 py-1 sm:py-4 relative z-10">
      <div className="flex flex-col items-center gap-6 pt-4 animate-slide-up">
        <div className="relative group">
          <div className="absolute inset-0"></div>
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 p-4">
            <img src={Logo} alt="Logo de l'église" className="w-full h-full object-contain" />
          </div>

          <div className="absolute top-0 left-0 w-full h-full  pointer-events-none"></div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 relative overflow-hidden">

        <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Hero Section avec illustration */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-up text-center">

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-primary">
                    Récensement Transfiguration
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Bienvenue sur le portail de recensement de la Transfiguration !
                </p>

                <div className="flex flex-wrap gap-4 pt-4 justify-center">
                  <Button asChild size="sm" className="shadow-lg hover:shadow-xl transition-all group">
                    <Link to="https://tally.so/r/D42A1l" target="_blank" className="inline-flex items-center gap-2">
                      Enregistrement Membre
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild size="sm" className="shadow-lg hover:shadow-xl transition-all group">
                    <Link to="https://tally.so/r/obbj6O" target="_blank" className="inline-flex items-center gap-2">
                      Enregistrement Enfant
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-all">
                    <a href="#examples">
                      Modifier vos informations
                    </a>
                  </Button>
                </div>
              </div>

              <div className="relative animate-scale-in lg:animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                <img
                  src={heroIllustration}
                  alt="Illustration moderne de confirmation"
                  className="relative z-10 w-full rounded-3xl "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
