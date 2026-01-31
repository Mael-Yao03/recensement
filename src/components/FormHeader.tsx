import { Link } from "react-router-dom"
import Logo from "@/assets/trans.png"

interface FormHeaderProps {
  currentStep: number
  totalSteps: number
  subtitle?: string
}

export default function FormHeader({ currentStep, totalSteps, subtitle = "Formulaire de recensement" }: FormHeaderProps) {
  return (
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
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </Link>

          {/* Progress indicator for mobile */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
