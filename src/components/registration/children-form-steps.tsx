"use client"

import { Input, Radio, Select, Row, Col, Upload, message } from "antd"
import { CameraOutlined, UserOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { useState } from "react"

interface FormData {
  [key: string]: string | string[] | undefined
}

interface StepProps {
  formData: FormData
  updateFormData: (field: string, value: string | string[]) => void
}

// Photo Upload Component
function PhotoUpload({ formData, updateFormData }: StepProps) {
  const [imageUrl, setImageUrl] = useState<string>(formData.photo as string || "")

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error("Vous pouvez uniquement télécharger des fichiers JPG/PNG!")
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error("L'image doit être inférieure à 2MB!")
      return false
    }
    return true
  }

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.originFileObj) {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setImageUrl(base64)
        updateFormData("photo", base64)
      }
      reader.readAsDataURL(info.file.originFileObj)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="text-base font-medium block text-center">
        Photo d'identité
      </label>
      <Upload
        name="photo"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        accept="image/png,image/jpeg"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Photo"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
              <UserOutlined className="text-2xl text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-primary">
              <CameraOutlined />
              <span className="text-sm">Ajouter une photo</span>
            </div>
          </div>
        )}
      </Upload>
      <p className="text-xs text-muted-foreground text-center">
        Format JPG ou PNG, max 2MB
      </p>
    </div>
  )
}

// Step 1: General Information for Children
export function ChildStep1GeneralInfo({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">I. Informations générales</h2>
        <p className="text-muted-foreground">Informations de base de l'enfant</p>
      </div>

      <div className="grid gap-6">
        {/* Photo d'identité */}
        <div className="flex justify-center">
          <PhotoUpload formData={formData} updateFormData={updateFormData} />
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            Nom et prénoms <span className="text-destructive">*</span>
          </label>
          <Input
            size="large"
            placeholder="Entrez le nom et prénoms de l'enfant"
            value={formData.nomPrenoms as string || ""}
            onChange={(e) => updateFormData("nomPrenoms", e.target.value)}
          />
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-3">
              <label className="text-base font-medium block">
                Sexe <span className="text-destructive">*</span>
              </label>
              <Radio.Group
                value={formData.sexe as string || ""}
                onChange={(e) => updateFormData("sexe", e.target.value)}
                className="flex flex-wrap gap-4"
              >
                <Radio value="masculin">Masculin</Radio>
                <Radio value="feminin">Féminin</Radio>
              </Radio.Group>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Date de naissance <span className="text-destructive">*</span>
              </label>
              <Input
                size="large"
                type="date"
                value={formData.dateNaissance as string || ""}
                onChange={(e) => updateFormData("dateNaissance", e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Nationalité <span className="text-destructive">*</span>
              </label>
              <Input
                size="large"
                placeholder="Nationalité de l'enfant"
                value={formData.nationalite as string || ""}
                onChange={(e) => updateFormData("nationalite", e.target.value)}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">Ethnie</label>
              <Input
                size="large"
                placeholder="Ethnie de l'enfant (optionnel)"
                value={formData.ethnie as string || ""}
                onChange={(e) => updateFormData("ethnie", e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            Lieu de résidence <span className="text-destructive">*</span>
          </label>
          <Input
            size="large"
            placeholder="Ex: Abidjan, Cocody, Angré"
            value={formData.lieuResidence as string || ""}
            onChange={(e) => updateFormData("lieuResidence", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Ville, commune, quartier</p>
        </div>
      </div>
    </div>
  )
}

// Step 2: Affiliation (Parents/Tuteur)
export function ChildStep2Affiliation({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">II. Affiliation</h2>
        <p className="text-muted-foreground">Informations sur les parents ou tuteur légal</p>
      </div>

      <div className="grid gap-6">
        {/* Informations du père */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Informations du père</h3>
          
          <div className="space-y-2">
            <label className="text-base font-medium block">
              Nom et prénoms du père
            </label>
            <Input
              size="large"
              placeholder="Nom et prénoms du père"
              value={formData.nomPere as string || ""}
              onChange={(e) => updateFormData("nomPere", e.target.value)}
            />
          </div>
        </div>

        {/* Informations de la mère */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Informations de la mère</h3>
          
          <div className="space-y-2">
            <label className="text-base font-medium block">
              Nom et prénoms de la mère
            </label>
            <Input
              size="large"
              placeholder="Nom et prénoms de la mère"
              value={formData.nomMere as string || ""}
              onChange={(e) => updateFormData("nomMere", e.target.value)}
            />
          </div>
        </div>

        {/* Résidence et contact des parents */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Résidence et contact des parents</h3>
          
          <div className="space-y-2">
            <label className="text-base font-medium block">
              Lieu de résidence des parents <span className="text-destructive">*</span>
            </label>
            <Input
              size="large"
              placeholder="Ex: Abidjan, Cocody, Angré"
              value={formData.residenceParents as string || ""}
              onChange={(e) => updateFormData("residenceParents", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Ville, commune, quartier</p>
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium block">
              Contact d'un des parents <span className="text-destructive">*</span>
            </label>
            <Input
              size="large"
              placeholder="+225 XX XX XX XX XX"
              value={formData.contactParents as string || ""}
              onChange={(e) => updateFormData("contactParents", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Téléphone / WhatsApp</p>
          </div>
        </div>

        {/* Tuteur légal */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Tuteur/Tutrice légal(e)</h3>
          <p className="text-sm text-muted-foreground">À remplir si différent des parents</p>
          
          <div className="space-y-2">
            <label className="text-base font-medium block">
              Nom et prénoms du tuteur/tutrice légal(e)
            </label>
            <Input
              size="large"
              placeholder="Nom et prénoms du tuteur"
              value={formData.nomTuteur as string || ""}
              onChange={(e) => updateFormData("nomTuteur", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium block">
              Lieu de résidence du tuteur/tutrice légal(e)
            </label>
            <Input
              size="large"
              placeholder="Ex: Abidjan, Cocody, Angré"
              value={formData.residenceTuteur as string || ""}
              onChange={(e) => updateFormData("residenceTuteur", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Ville, commune, quartier</p>
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium block">
              Contact du tuteur/tutrice légal(e)
            </label>
            <Input
              size="large"
              placeholder="+225 XX XX XX XX XX"
              value={formData.contactTuteur as string || ""}
              onChange={(e) => updateFormData("contactTuteur", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Téléphone / WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 3: Social and Spiritual Life
export function ChildStep3SpiritualLife({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">III. Vie sociale et spirituelle</h2>
        <p className="text-muted-foreground">Parcours spirituel et éducatif de l'enfant</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-base font-medium block">
            Depuis quand venez-vous à l'église ? <span className="text-destructive">*</span>
          </label>
          <Input
            size="large"
            placeholder="Ex: Depuis 2020, Depuis 5 ans..."
            value={formData.depuisQuandEglise as string || ""}
            onChange={(e) => updateFormData("depuisQuandEglise", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium block">
            Vos parents viennent-ils à l'église ? <span className="text-destructive">*</span>
          </label>
          <Radio.Group
            value={formData.parentsEglise as string || ""}
            onChange={(e) => updateFormData("parentsEglise", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.parentsEglise === "non" && (
          <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border">
            <label className="text-base font-medium block">
              Si non, avec qui venez-vous à l'église ?
            </label>
            <Input
              size="large"
              placeholder="Ex: Oncle, Tante, Grand-parents, Voisin..."
              value={formData.accompagnateurEglise as string || ""}
              onChange={(e) => updateFormData("accompagnateurEglise", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-3">
          <label className="text-base font-medium block">
            Êtes-vous baptisé(e) dans le Saint-Esprit ?
          </label>
          <Radio.Group
            value={formData.baptiseSaintEsprit as string || ""}
            onChange={(e) => updateFormData("baptiseSaintEsprit", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            Niveau d'études <span className="text-destructive">*</span>
          </label>
          <Select
            size="large"
            className="w-full"
            placeholder="Sélectionnez le niveau d'études"
            value={formData.niveauEtudes as string || undefined}
            onChange={(value) => updateFormData("niveauEtudes", value)}
            options={[
              { value: "aucun", label: "Aucun" },
              { value: "primaire", label: "Primaire" },
              { value: "secondaire", label: "Secondaire" },
              { value: "superieur", label: "Supérieur" },
              { value: "coranique", label: "École Coranique" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

// Export PhotoUpload for use in adult form
export { PhotoUpload }
