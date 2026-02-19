"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { message, Input } from "antd"
import {
  User,
  Home,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Search,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import {
  ChildStep1GeneralInfo,
  ChildStep2Affiliation,
  ChildStep3SpiritualLife,
} from "@/components/registration/children-form-steps"
import FormHeader from "@/components/FormHeader"
import Logo from "@/assets/trans.png"
import { useVerifyChild, useUpdateChild } from "@/hooks"
import { validateChildStep, ValidationError } from "@/lib/formValidation"
import type { Child } from "@/services"

const steps = [
  { id: 1, title: "Informations générales", icon: User, shortTitle: "Infos" },
  { id: 2, title: "Affiliation", icon: Home, shortTitle: "Parents" },
  { id: 3, title: "Vie spirituelle", icon: BookOpen, shortTitle: "Spirituel" },
]

/**
 * Convertit les données d'un enfant retourné par l'API en format formulaire
 */
function childToFormData(child: Child): Record<string, string | string[]> {
  const formData: Record<string, string | string[]> = {}

  // Champs Person
  if (child.nomPrenoms) formData.nomPrenoms = child.nomPrenoms
  if (child.sexe) formData.sexe = child.sexe
  if (child.nationalite) formData.nationalite = child.nationalite
  if (child.ethnie) formData.ethnie = child.ethnie
  if (child.lieuResidence) formData.lieuResidence = child.lieuResidence
  if (child.baptiseSaintEsprit) formData.baptiseSaintEsprit = child.baptiseSaintEsprit
  if (child.niveauEtudes) formData.niveauEtudes = child.niveauEtudes

  // Photo depuis images
  if (child.images && child.images.length > 0) {
    const photoImage = child.images.find(img => img.imageType === 'photo_identite')
    if (photoImage) {
      formData.photo = photoImage.filePath
    }
  }

  // Champs ChildDetails
  if (child.childDetails) {
    const details = child.childDetails
    Object.entries(details).forEach(([key, value]) => {
      if (key === 'id' || key === 'personId' || value === null || value === undefined) return
      formData[key] = value as string
    })
  }

  return formData
}

export default function UpdateChild() {
  // Phase de vérification
  const [reference, setReference] = useState("")
  const [contactParents, setContactParents] = useState("")
  const { mutate: verify, isPending: isVerifying, verifiedChild, resetVerification } = useVerifyChild()

  // Phase d'édition
  const [formData, setFormDataState] = useState<Record<string, string | string[]>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)

  const updateChildMutation = useUpdateChild()

  // Pré-remplir le formulaire quand l'enfant est vérifié
  useEffect(() => {
    if (verifiedChild) {
      const data = childToFormData(verifiedChild)
      setFormDataState(data)
      setCurrentStep(0)
    }
  }, [verifiedChild])

  const updateFormData = (field: string, value: string | string[]) => {
    setFormDataState(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => prev.filter(err => err.field !== field))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleVerify = () => {
    if (!reference.trim()) {
      message.warning("Veuillez entrer la référence")
      return
    }
    if (!contactParents.trim()) {
      message.warning("Veuillez entrer le contact des parents")
      return
    }
    verify({ reference: reference.trim(), contactParents: contactParents.trim() })
  }

  const next = () => {
    const formDataForValidation: Record<string, string | string[] | undefined> = { ...formData }
    const validation = validateChildStep(currentStep, formDataForValidation)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      message.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setValidationErrors([])
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prev = () => {
    setValidationErrors([])
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    const formDataForValidation: Record<string, string | string[] | undefined> = { ...formData }
    const validation = validateChildStep(currentStep, formDataForValidation)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      message.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!verifiedChild) return

    try {
      // Préparer les données pour l'envoi
      const payload: Record<string, string | undefined> = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'id' || key === 'personId') return

        if (typeof value === 'string' && value.trim() !== '') {
          // Ne pas envoyer la photo si elle n'a pas été modifiée
          if (key === 'photo' && !value.startsWith('data:image')) {
            return
          }
          payload[key] = value
        }
      })

      await updateChildMutation.mutateAsync({
        id: verifiedChild.id,
        data: payload,
      })
      setIsUpdateSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleBackToVerification = () => {
    resetVerification()
    setFormDataState({})
    setCurrentStep(0)
    setValidationErrors([])
    setReference("")
    setContactParents("")
    setIsUpdateSuccess(false)
  }

  // ===== PAGE DE SUCCÈS =====
  if (isUpdateSuccess) {
    return (
      <div className="min-h-screen bg-background">
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
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Informations mises à jour !
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Les informations de l'enfant ont été modifiées avec succès. Merci pour votre mise à jour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button onClick={handleBackToVerification}>
                Modifier un autre enfant
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ===== PAGE DE VÉRIFICATION =====
  if (!verifiedChild) {
    return (
      <div className="min-h-screen bg-background">
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
          <div className="max-w-md mx-auto">
            {/* En-tête */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Modifier les informations d'un enfant
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Entrez la référence de l'enfant et le contact des parents pour vérifier l'identité.
              </p>
            </div>

            {/* Formulaire de vérification */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Référence <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: AB-123456"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    size="large"
                    onPressEnter={handleVerify}
                  />
                  <p className="text-xs text-muted-foreground">
                    La référence se trouve sur le récépissé d'inscription.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Contact des parents <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: 0701020304"
                    value={contactParents}
                    onChange={(e) => setContactParents(e.target.value)}
                    size="large"
                    onPressEnter={handleVerify}
                  />
                  <p className="text-xs text-muted-foreground">
                    Le numéro de contact fourni lors de l'enregistrement de l'enfant.
                  </p>
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full h-12 text-base"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification en cours...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Vérifier l'identité
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Lien retour */}
            <div className="text-center mt-6">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ===== FORMULAIRE D'ÉDITION =====
  const formDataForSteps: Record<string, string | string[] | undefined> = { ...formData }

  return (
    <div className="min-h-screen bg-background">
      <FormHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        subtitle="Modification des informations de l'enfant"
      />

      <main className="container mx-auto px-4 py-6 lg:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Bandeau info enfant */}
          <Card className="mb-6 border-0 shadow-lg overflow-hidden">
            <div className="bg-primary/5 p-4 md:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {verifiedChild.nomPrenoms}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Réf: {verifiedChild.reference}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleBackToVerification}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Changer d'enfant
                </Button>
              </div>
            </div>
          </Card>

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
                      onClick={() => setCurrentStep(index)}
                      className="flex flex-col items-center gap-2 transition-all cursor-pointer"
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
                    disabled={updateChildMutation.isPending}
                    className="h-12 px-8 gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updateChildMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Mettre à jour
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
