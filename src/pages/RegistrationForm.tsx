"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  User,
  Home,
  BookOpen,
  Users,
  Building2,
  Heart,
  Activity,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Info,
  ArrowRight,
  Clock,
  FileText,
} from "lucide-react"
import {
  Step1GeneralInfo,
  Step2Family,
  Step3Spiritual,
  Step4ChurchLife,
  Step5Professional,
  Step6SpiritualNeeds,
  Step7Health,
} from "@/components/registration/form-steps"
import Logo from "@/assets/trans.png"

interface FormData {
  [key: string]: string | string[] | undefined
}

const steps = [
  { id: 1, title: "Informations", icon: User, shortTitle: "Infos" },
  { id: 2, title: "Famille", icon: Home, shortTitle: "Famille" },
  { id: 3, title: "Parcours spirituel", icon: BookOpen, shortTitle: "Spirituel" },
  { id: 4, title: "Vie ecclésiale", icon: Users, shortTitle: "Église" },
  { id: 5, title: "Vie professionnelle", icon: Building2, shortTitle: "Pro" },
  { id: 6, title: "Besoins spirituels", icon: Heart, shortTitle: "Besoins" },
  { id: 7, title: "Santé", icon: Activity, shortTitle: "Santé" },
]

export default function RegistrationForm() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const startForm = () => {
    setHasStarted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Welcome page
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground leading-tight">
                    Temple La Transfiguration
                  </h1>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 lg:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Welcome section */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Nouvel enregistrement
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {/* <Clock className="w-4 h-4" /> */}
                  Durée estimée : 10-15 minutes
              </p>
            </div>

            {/* Info card */}
            <Card className="mb-6 border-0 shadow-lg overflow-hidden">
              <div className="bg-primary/5 p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Info className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-foreground">Bienvenue</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {"Cher frère/soeur, conformément aux recommandations du Bureau Exécutif National de l'Église Évangélique des Assemblées de Côte d'Ivoire, le Docteur Évangéliste Célestin ADOU initie le recensement des fidèles du Temple La Transfiguration."}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {"Cette opération vise à renforcer l'accompagnement spirituel, social et administratif des fidèles. Nous vous remercions de nous consacrer quelques minutes de votre précieux temps."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Privacy declaration */}
            <Card className="mb-8 border-0 shadow-lg overflow-hidden">
              <div className="bg-accent/30 p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <Shield className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Déclaration de confidentialité
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {"Les informations recueillies sont strictement confidentielles et réservées à l'appréciation exclusive du corps pastoral. Elles serviront aux besoins d'accompagnement spirituel, social et administratif des fidèles. En remplissant ce questionnaire, vous consentez librement au traitement et à l'utilisation de vos données."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Start button */}
            <div className="text-center">
              <Button
                onClick={startForm}
                size="lg"
                className="h-14 px-10 text-lg gap-3"
              >
                Commencer
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Merci pour votre inscription !
              </h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {"Cher(e) "}
                <span className="font-semibold text-foreground">
                  {formData.nomPrenoms || "bien-aimé(e)"}
                </span>
                {", recevez les sincères remerciements du Docteur Évangéliste Célestin ADOU et son Conseil. Vos avis comptent et nous vous remercions d'avoir apporté votre pierre à l'édifice."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setHasStarted(false)
                    setCurrentStep(0)
                    setFormData({})
                  }}
                  variant="outline"
                  className="h-12 px-8"
                >
                  Nouvelle inscription
                </Button>
                <Link to="/">
                  <Button className="h-12 px-8 w-full sm:w-auto">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-foreground leading-tight">
                  Temple La Transfiguration
                </h1>
                <p className="text-xs text-muted-foreground">Formulaire de recensement</p>
              </div>
            </Link>

            {/* Progress indicator for mobile */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {currentStep + 1}/{steps.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Steps navigation - Desktop */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => index <= currentStep && setCurrentStep(index)}
                      disabled={index > currentStep}
                      className={cn(
                        "flex flex-col items-center gap-2 transition-all",
                        index <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium text-center max-w-[80px]",
                          isCurrent ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {step.shortTitle}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "w-full h-1 mx-2 rounded-full transition-all min-w-[40px] max-w-[80px]",
                          index < currentStep ? "bg-primary" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile progress */}
          <div className="lg:hidden mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Étape {currentStep + 1} sur {steps.length}
              </span>
              <span className="text-muted-foreground">{steps[currentStep].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form card */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 md:p-8 lg:p-10">
              {currentStep === 0 && (
                <Step1GeneralInfo formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 1 && (
                <Step2Family formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 2 && (
                <Step3Spiritual formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 3 && (
                <Step4ChurchLife formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 4 && (
                <Step5Professional formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 5 && (
                <Step6SpiritualNeeds formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 6 && (
                <Step7Health formData={formData} updateFormData={updateFormData} />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prev}
                  disabled={currentStep === 0}
                  className={cn(
                    "h-12 px-6 gap-2",
                    currentStep === 0 && "invisible"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={next} className="h-12 px-8 gap-2">
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="h-12 px-8 gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4" />
                    Envoyer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conclusion - Last Step */}
          {currentStep === steps.length - 1 && (
            <Card className="mt-6 border-0 shadow-lg overflow-hidden">
              <div className="bg-green-50 p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Conclusion</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {"Cher Bien-aimé(e), nous sommes à la fin du questionnaire. Recevez les sincères remerciements du Docteur Évangéliste Célestin ADOU et son Conseil. Vos avis comptent et nous vous remercions d'avoir apporté votre pierre à l'édifice."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
