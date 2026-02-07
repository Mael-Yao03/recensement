"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Steps, Button, Card, Progress, message, Alert } from "antd"
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, UserOutlined, TeamOutlined, HeartOutlined, LoadingOutlined } from "@ant-design/icons"
import { ChildStep1GeneralInfo, ChildStep2Affiliation, ChildStep3SpiritualLife } from "@/components/registration/children-form-steps"
import { useIsMobile } from "@/hooks/use-mobile"
import FormHeader from "@/components/FormHeader"
import { useChildFormStore } from "@/stores"
import { useCreateChild } from "@/hooks"
import { validateChildStep, ValidationError } from "@/lib/formValidation"

const steps = [
  { title: "Infos générales", icon: <UserOutlined /> },
  { title: "Affiliation", icon: <TeamOutlined /> },
  { title: "Vie spirituelle", icon: <HeartOutlined /> },
]

export default function ChildrenRegistrationForm() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

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
    // Clear validation error for this field when it changes
    setValidationErrors(prev => prev.filter(e => e.field !== field))
  }

  const handleNextStep = () => {
    // Validate current step before proceeding
    const formDataForValidation: Record<string, string | string[] | undefined> = {}
    Object.entries(formData).forEach(([key, value]) => {
      formDataForValidation[key] = value as string | string[] | undefined
    })
    
    const result = validateChildStep(currentStep, formDataForValidation)
    if (!result.isValid) {
      setValidationErrors(result.errors)
      message.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    
    setValidationErrors([])
    if (currentStep < steps.length - 1) {
      nextStep()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevStep = () => {
    setValidationErrors([])
    if (currentStep > 0) {
      prevStep()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    // Validate final step before submission
    const formDataForValidation: Record<string, string | string[] | undefined> = {}
    Object.entries(formData).forEach(([key, value]) => {
      formDataForValidation[key] = value as string | string[] | undefined
    })
    
    const result = validateChildStep(currentStep, formDataForValidation)
    if (!result.isValid) {
      setValidationErrors(result.errors)
      message.error("Veuillez remplir tous les champs obligatoires")
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

  // Rediriger vers la page de remerciement si soumis avec succès
  useEffect(() => {
    if (isSubmitted) {
      navigate("/thank-you")
    }
  }, [isSubmitted, navigate])

  // Convertir formData du store en format compatible avec les composants existants
  const formDataForSteps: Record<string, string | string[] | undefined> = {}
  Object.entries(formData).forEach(([key, value]) => {
    formDataForSteps[key] = value as string | string[] | undefined
  })

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ChildStep1GeneralInfo formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
      case 1:
        return <ChildStep2Affiliation formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
      case 2:
        return <ChildStep3SpiritualLife formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
      default:
        return <ChildStep1GeneralInfo formData={formDataForSteps} updateFormData={updateFormData} errors={validationErrors} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <FormHeader 
        currentStep={currentStep} 
        totalSteps={steps.length} 
        subtitle="Recensement des enfants" 
      />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            {/* Desktop: Ant Design Steps */}
            <div className="hidden md:block">
              <Steps
                current={currentStep}
                items={steps.map((step, index) => ({
                  title: step.title,
                  icon: step.icon,
                  status: index < currentStep ? "finish" : index === currentStep ? "process" : "wait",
                }))}
              />
            </div>

            {/* Mobile: Progress bar */}
            <div className="md:hidden space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{steps[currentStep].title}</span>
                <span className="text-muted-foreground">
                  {currentStep + 1}/{steps.length}
                </span>
              </div>
              <Progress
                percent={Math.round(((currentStep + 1) / steps.length) * 100)}
                showInfo={false}
                strokeColor="#3b82f6"
              />
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg border-0 md:shadow-xl">
            <div className="p-4 md:p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-8 pt-6 border-t">
                <Button
                  size="large"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  icon={<ArrowLeftOutlined />}
                  className={currentStep === 0 ? "invisible" : ""}
                >
                  Précédent
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={createChildMutation.isPending}
                    icon={createChildMutation.isPending ? <LoadingOutlined /> : <CheckOutlined />}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createChildMutation.isPending ? "Envoi en cours..." : "Soumettre le formulaire"}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNextStep}
                  >
                    <span className="flex items-center gap-2">
                      Suivant <ArrowRightOutlined />
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Besoin d'aide ? Contactez l'administration de l'église
          </p>
        </div>
      </div>
    </div>
  )
}
