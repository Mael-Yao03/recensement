"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { message } from "antd"
import {
  User,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Info,
  ArrowRight,
  FileText,
  Loader2,
  Send
} from "lucide-react"
import { ChildStep1GeneralInfo, ChildStep2Affiliation, ChildStep3SpiritualLife } from "@/components/registration/children-form-steps"
import FormHeader from "@/components/FormHeader"
import Logo from "@/assets/trans.png"
import { useChildFormStore } from "@/stores"
import { useCreateChild } from "@/hooks"
import { validateChildStep, ValidationError } from "@/lib/formValidation"

const steps = [
  { id: 1, title: "Informations générales", icon: User, shortTitle: "Infos" },
  { id: 2, title: "Affiliation", icon: Users, shortTitle: "Affiliation" },
  { id: 3, title: "Vie spirituelle", icon: Heart, shortTitle: "Spirituel" },
]

export default function ChildrenRegistrationForm() {
  const [hasStarted, setHasStarted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const navigate = useNavigate()

  // Utilisation du store Zustand
  const {
    formData,
    currentStep,
    isSubmitted,
    setFormData,
    setCurrentStep,
    nextStep,
    prevStep,
    getFormDataForSubmission,
  } = useChildFormStore()

  // Mutation pour créer un enfant
  const createChildMutation = useCreateChild()

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData({ [field]: value } as Partial<typeof formData>)
    setValidationErrors(prev => prev.filter(e => e.field !== field))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const next = () => {
    const formDataForValidation: Record<string, string | string[] | undefined> = {}
    Object.entries(formData).forEach(([key, value]) => {
      formDataForValidation[key] = value as string | string[] | undefined
    })

    const validation = validateChildStep(currentStep, formDataForValidation)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      message.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setValidationErrors([])
    if (currentStep < steps.length - 1) {
      nextStep()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prev = () => {
    setValidationErrors([])
    if (currentStep > 0) {
      prevStep()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    const formDataForValidation: Record<string, string | string[] | undefined> = {}
    Object.entries(formData).forEach(([key, value]) => {
      formDataForValidation[key] = value as string | string[] | undefined
    })

    const validation = validateChildStep(currentStep, formDataForValidation)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      message.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      const payload = getFormDataForSubmission()
      await createChildMutation.mutateAsync(payload as unknown as Parameters<typeof createChildMutation.mutateAsync>[0])
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
    }
  }

  const startForm = () => {
    setHasStarted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Suivre si la soumission a eu lieu dans cette session
  const wasSubmittedOnMount = useRef(isSubmitted)

  // Rediriger vers la page de remerciement uniquement après une nouvelle soumission
  useEffect(() => {
    if (isSubmitted && !wasSubmittedOnMount.current) {
      navigate("/thank-you")
    }
    if (wasSubmittedOnMount.current) {
      wasSubmittedOnMount.current = false
    }
  }, [isSubmitted, navigate])

  // Convertir formData du store en format compatible avec les composants existants
  const formDataForSteps: Record<string, string | string[] | undefined> = {}
  Object.entries(formData).forEach(([key, value]) => {
    formDataForSteps[key] = value as string | string[] | undefined
  })

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
                Enregistrement ECODIM
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Durée estimée : 3-5 minutes
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
                      {"Ce formulaire permet d'inscrire les enfants fréquentant l'École du Dimanche (ECODIM) du Temple La Transfiguration."}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {"Veuillez renseigner les informations de l'enfant ainsi que celles de ses parents ou tuteurs."}
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

  return (
    <div className="min-h-screen bg-background">
      <FormHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        subtitle="Recensement des enfants"
      />

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
              {/* Validation errors display */}
              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium text-destructive mb-2">
                    Veuillez corriger les erreurs suivantes :
                  </p>
                  <ul className="list-disc list-inside text-sm text-destructive">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentStep === 0 && (
                <ChildStep1GeneralInfo formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 1 && (
                <ChildStep2Affiliation formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 2 && (
                <ChildStep3SpiritualLife formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
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
                    disabled={createChildMutation.isPending}
                    className="h-12 px-8 gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {createChildMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer
                      </>
                    )}
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
                      {"Merci d'avoir pris le temps d'enregistrer cet enfant. Le corps pastoral vous en est reconnaissant."}
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
