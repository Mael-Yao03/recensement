"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Steps, Button, Card, Progress } from "antd"
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, UserOutlined, TeamOutlined, HeartOutlined } from "@ant-design/icons"
import { ChildStep1GeneralInfo, ChildStep2Affiliation, ChildStep3SpiritualLife } from "@/components/registration/children-form-steps"
import { useIsMobile } from "@/hooks/use-mobile"
import FormHeader from "@/components/FormHeader"

interface FormData {
  [key: string]: string | string[] | undefined
}

const steps = [
  { title: "Infos générales", icon: <UserOutlined /> },
  { title: "Affiliation", icon: <TeamOutlined /> },
  { title: "Vie spirituelle", icon: <HeartOutlined /> },
]

export default function ChildrenRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Children Form submitted:", formData)
    navigate("/thankyou")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ChildStep1GeneralInfo formData={formData} updateFormData={updateFormData} />
      case 1:
        return <ChildStep2Affiliation formData={formData} updateFormData={updateFormData} />
      case 2:
        return <ChildStep3SpiritualLife formData={formData} updateFormData={updateFormData} />
      default:
        return <ChildStep1GeneralInfo formData={formData} updateFormData={updateFormData} />
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
                  onClick={prevStep}
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
                    icon={<CheckOutlined />}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Soumettre le formulaire
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={nextStep}
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
