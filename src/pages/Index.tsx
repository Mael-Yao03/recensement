import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import rocketIcon from "@/assets/rocket-icon.png";
import shieldIcon from "@/assets/shield-icon.png";

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
        </div>
      </div>
    </div>
  );
};

export default Index;
