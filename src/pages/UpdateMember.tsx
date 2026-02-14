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
  Building2,
  Heart,
  Activity,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Search,
  Loader2,
  ArrowLeft,
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
import FormHeader from "@/components/FormHeader"
import Logo from "@/assets/trans.png"
import { useVerifyMember, useUpdateMember } from "@/hooks"
import { validateMemberStep, ValidationError } from "@/lib/formValidation"
import type { Member } from "@/services"

const steps = [
  { id: 1, title: "Informations", icon: User, shortTitle: "Infos" },
  { id: 2, title: "Famille", icon: Home, shortTitle: "Famille" },
  { id: 3, title: "Parcours spirituel", icon: BookOpen, shortTitle: "Spirituel" },
  { id: 4, title: "Vie ecclésiale", icon: Users, shortTitle: "Église" },
  { id: 5, title: "Vie professionnelle", icon: Building2, shortTitle: "Pro" },
  { id: 6, title: "Besoins spirituels", icon: Heart, shortTitle: "Besoins" },
  { id: 7, title: "Santé", icon: Activity, shortTitle: "Santé" },
]

// Champs tableau qui doivent être parsés depuis la DB
const ARRAY_FIELDS = [
  'groupesActuels',
  'groupesSouhaites',
  'disponibiliteActivites',
  'competences',
  'domainesAppui',
  'typeFormation',
]

/**
 * Convertit les données d'un membre retourné par l'API en format formulaire
 */
function memberToFormData(member: Member): Record<string, string | string[]> {
  const formData: Record<string, string | string[]> = {}

  // Champs Person
  if (member.nomPrenoms) formData.nomPrenoms = member.nomPrenoms
  if (member.sexe) formData.sexe = member.sexe
  if (member.nationalite) formData.nationalite = member.nationalite
  if (member.ethnie) formData.ethnie = member.ethnie
  if (member.lieuResidence) formData.lieuResidence = member.lieuResidence
  if (member.baptiseSaintEsprit) formData.baptiseSaintEsprit = member.baptiseSaintEsprit
  if (member.niveauEtudes) formData.niveauEtudes = member.niveauEtudes

  // Photo depuis images
  if (member.images && member.images.length > 0) {
    const photoImage = member.images.find(img => img.imageType === 'photo_identite')
    if (photoImage) {
      formData.photo = photoImage.filePath
    }
  }

  // Champs MemberDetails
  if (member.memberDetails) {
    const details = member.memberDetails
    Object.entries(details).forEach(([key, value]) => {
      if (key === 'id' || key === 'personId' || value === null || value === undefined) return
      
      if (ARRAY_FIELDS.includes(key)) {
        // Essayer de parser comme JSON array, sinon comme CSV
        if (typeof value === 'string' && value.trim()) {
          try {
            const parsed = JSON.parse(value)
            formData[key] = Array.isArray(parsed) ? parsed : [value]
          } catch {
            // Tenter CSV
            formData[key] = value.split(',').map((s: string) => s.trim()).filter(Boolean)
          }
        } else {
          formData[key] = []
        }
      } else {
        formData[key] = value as string
      }
    })
  }

  return formData
}

export default function UpdateMember() {
  // Phase de vérification
  const [reference, setReference] = useState("")
  const [telephone, setTelephone] = useState("")
  const { mutate: verify, isPending: isVerifying, verifiedMember, resetVerification } = useVerifyMember()

  // Phase d'édition
  const [formData, setFormDataState] = useState<Record<string, string | string[]>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)

  const updateMemberMutation = useUpdateMember()

  // Pré-remplir le formulaire quand le membre est vérifié
  useEffect(() => {
    if (verifiedMember) {
      const data = memberToFormData(verifiedMember)
      setFormDataState(data)
      setCurrentStep(0)
    }
  }, [verifiedMember])

  const updateFormData = (field: string, value: string | string[]) => {
    setFormDataState(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => prev.filter(err => err.field !== field))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleVerify = () => {
    if (!reference.trim()) {
      message.warning("Veuillez entrer votre référence")
      return
    }
    if (!telephone.trim()) {
      message.warning("Veuillez entrer votre numéro de téléphone")
      return
    }
    verify({ reference: reference.trim(), telephone: telephone.trim() })
  }

  const next = () => {
    const formDataForValidation: Record<string, string | string[] | undefined> = { ...formData }
    const validation = validateMemberStep(currentStep, formDataForValidation)

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
    const validation = validateMemberStep(currentStep, formDataForValidation)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      message.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!verifiedMember) return

    try {
      // Préparer les données pour l'envoi
      const payload: Record<string, string | undefined> = {}
      Object.entries(formData).forEach(([key, value]) => {
        // Exclure les champs techniques
        if (key === 'id' || key === 'personId') return
        
        if (Array.isArray(value)) {
          payload[key] = value.length > 0 ? JSON.stringify(value) : undefined
        } else if (typeof value === 'string' && value.trim() !== '') {
          // Ne pas envoyer la photo si elle n'a pas été modifiée (c'est un chemin, pas du base64)
          if (key === 'photo' && !value.startsWith('data:image')) {
            return
          }
          payload[key] = value
        }
      })

      await updateMemberMutation.mutateAsync({
        id: verifiedMember.id,
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
    setTelephone("")
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
              Vos informations ont été modifiées avec succès. Merci pour votre mise à jour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button onClick={handleBackToVerification}>
                Modifier un autre membre
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ===== PAGE DE VÉRIFICATION =====
  if (!verifiedMember) {
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
                Modifier vos informations
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Entrez votre référence et votre numéro de téléphone pour vérifier votre identité.
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
                    placeholder="Ex: MEM-20250101-ABCD"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    size="large"
                    onPressEnter={handleVerify}
                  />
                  <p className="text-xs text-muted-foreground">
                    La référence se trouve sur votre carte de membre.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Numéro de téléphone <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: 0701020304"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    size="large"
                    onPressEnter={handleVerify}
                  />
                  <p className="text-xs text-muted-foreground">
                    Le numéro que vous avez fourni lors de votre enregistrement.
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
                      Vérifier mon identité
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
        subtitle="Modification des informations"
      />

      <main className="container mx-auto px-4 py-6 lg:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Bandeau info membre */}
          <Card className="mb-6 border-0 shadow-lg overflow-hidden">
            <div className="bg-primary/5 p-4 md:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {verifiedMember.nomPrenoms}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Réf: {verifiedMember.reference}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleBackToVerification}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Changer de membre
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
                <Step1GeneralInfo formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 1 && (
                <Step2Family formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 2 && (
                <Step3Spiritual formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 3 && (
                <Step4ChurchLife formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 4 && (
                <Step5Professional formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 5 && (
                <Step6SpiritualNeeds formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
              )}
              {currentStep === 6 && (
                <Step7Health formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
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
                    disabled={updateMemberMutation.isPending}
                    className="h-12 px-8 gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updateMemberMutation.isPending ? (
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
