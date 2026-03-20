import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Sparkles, FileText, Send, CheckIcon } from "lucide-react";
import heroIllustration from "@/assets/3d-form.png";
import Logo from "@/assets/trans.png";
import { FaPlay } from "react-icons/fa6";
import { MdEditDocument } from "react-icons/md";
import { PiEyesBold } from "react-icons/pi";
import { BsFillSendFill } from "react-icons/bs";

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

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight break-words">
                  <span className="text-primary">
                    Récensement Transfiguration
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Bienvenue sur la plateforme de recensement de la Transfiguration. Enregistrez-vous en quelques minutes.
                </p>

                <div className="flex flex-wrap gap-4 pt-4 justify-center">
                  <Button asChild size="sm" className="shadow-lg hover:shadow-xl transition-all group">
                    <Link to="/registration"  className="inline-flex items-center gap-2">
                      Enregistrement Membre
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild size="sm" className="shadow-lg hover:shadow-xl transition-all group">
                    <Link to="/registration-children" className="inline-flex items-center gap-2">
                      Enregistrement ECODIM
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-all">
                    <Link to="/update-member">
                      Modifier vos informations
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
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

            {/* Section "Comment ça marche ?" */}
            <div className="space-y-10 py-12">
              <div className="text-center space-y-4 animate-slide-up">
                <h2 className="text-3xl sm:text-5xl font-bold">
                  <span className="text-primary">Comment ça marche ?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Suivez ces étapes simples pour vous enregistrer et mettre à jour vos informations
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Étape 1 */}
                <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: '0s' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaPlay className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Étape 1</CardTitle>
                    </div>
                    <CardDescription>Commencer l'enregistrement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez le type d'enregistrement : Membre ou ECODIM
                    </p>
                  </CardContent>
                </Card>

                {/* Étape 2 */}
                <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MdEditDocument className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Étape 2</CardTitle>
                    </div>
                    <CardDescription>Remplir le formulaire</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Complétez vos informations personnelles de manière précise et détaillée
                    </p>
                  </CardContent>
                </Card>

                {/* Étape 3 */}
                <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <PiEyesBold className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Étape 3</CardTitle>
                    </div>
                    <CardDescription>Vérifier vos données</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Relisez et vérifiez toutes vos informations avant de soumettre
                    </p>
                  </CardContent>
                </Card>

                {/* Étape 4 */}
                <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: '0.3s' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BsFillSendFill className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Étape 4</CardTitle>
                    </div>
                    <CardDescription>Soumettre</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Envoyez votre enregistrement et recevez une confirmation
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
