"use client"

import { Input, Radio, Checkbox, Select, Row, Col, Upload, message } from "antd"
import { CameraOutlined, UserOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { useState } from "react"

const { TextArea } = Input

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

const groupesDepartements = [
  "Conseil de l'église",
  "Musique",
  "Jeunesse",
  "Intercession",
  "Évangélisation",
  "Accueil",
  "AOC",
  "ECODIM",
  "HAC",
  "MIFA",
]

// Step 1: General Information
export function Step1GeneralInfo({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">I. Informations générales</h2>
        <p className="text-muted-foreground">Commençons par vos informations de base</p>
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
            placeholder="Entrez votre nom et prénoms"
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
                <Radio value="homme">Homme</Radio>
                <Radio value="femme">Femme</Radio>
              </Radio.Group>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Année de naissance <span className="text-destructive">*</span>
              </label>
              <Input
                size="large"
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                placeholder="Ex: 1990"
                value={formData.anneeNaissance as string || ""}
                onChange={(e) => updateFormData("anneeNaissance", e.target.value)}
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
                placeholder="Votre nationalité"
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
                placeholder="Votre ethnie (optionnel)"
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

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Téléphone / WhatsApp <span className="text-destructive">*</span>
              </label>
              <Input
                size="large"
                placeholder="+225 XX XX XX XX XX"
                value={formData.telephone as string || ""}
                onChange={(e) => updateFormData("telephone", e.target.value)}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">Email</label>
              <Input
                size="large"
                type="email"
                placeholder="votre@email.com"
                value={formData.email as string || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

// Step 2: Family Situation
export function Step2Family({ formData, updateFormData }: StepProps) {
  const situationMatrimoniale = formData.situationMatrimoniale as string

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">II. Situation familiale</h2>
        <p className="text-muted-foreground">Parlez-nous de votre famille</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-base font-medium block">
            Situation matrimoniale <span className="text-destructive">*</span>
          </label>
          <Radio.Group
            value={situationMatrimoniale || ""}
            onChange={(e) => updateFormData("situationMatrimoniale", e.target.value)}
            className="w-full"
          >
            <div className="grid gap-3">
              {[
                { value: "celibataire", label: "Célibataire" },
                { value: "concubin", label: "Concubin(e)" },
                { value: "marie", label: "Marié(e)" },
                { value: "veuf", label: "Veuf(veuve)" },
                { value: "divorce", label: "Divorcé(e)" },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                    situationMatrimoniale === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => updateFormData("situationMatrimoniale", option.value)}
                >
                  <Radio value={option.value}>{option.label}</Radio>
                </div>
              ))}
            </div>
          </Radio.Group>
        </div>

        {["marie", "concubin"].includes(situationMatrimoniale) && (
          <div className="space-y-6 p-4 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-3">
              <label className="text-base font-medium block">Type de foyer</label>
              <Radio.Group
                value={formData.typeFoyer as string || ""}
                onChange={(e) => updateFormData("typeFoyer", e.target.value)}
                className="flex gap-4"
              >
                <Radio value="monogame">Monogame</Radio>
                <Radio value="polygame">Polygame</Radio>
              </Radio.Group>
            </div>

            <div className="space-y-2">
              <label className="text-base font-medium block">
                Nom du ou des conjoint(s)
              </label>
              <Input
                size="large"
                placeholder="Nom du conjoint"
                value={formData.nomConjoint as string || ""}
                onChange={(e) => updateFormData("nomConjoint", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-base font-medium block">
                {"Votre conjoint(e) est-il(elle) chrétien(ne) ?"}
              </label>
              <Radio.Group
                value={formData.conjointChretien as string || ""}
                onChange={(e) => updateFormData("conjointChretien", e.target.value)}
                className="flex gap-4"
              >
                <Radio value="oui">Oui</Radio>
                <Radio value="non">Non</Radio>
              </Radio.Group>
            </div>

            {formData.conjointChretien === "oui" && (
              <>
                <div className="space-y-3">
                  <label className="text-base font-medium block">
                    {"Votre conjoint(e) fréquente-t-il(elle) La Transfiguration ?"}
                  </label>
                  <Radio.Group
                    value={formData.conjointTransfiguration as string || ""}
                    onChange={(e) => updateFormData("conjointTransfiguration", e.target.value)}
                    className="flex gap-4"
                  >
                    <Radio value="oui">Oui</Radio>
                    <Radio value="non">Non</Radio>
                  </Radio.Group>
                </div>

                {formData.conjointTransfiguration === "non" && (
                  <div className="space-y-2">
                    <label className="text-base font-medium block">
                      {"Nom de l'assemblée fréquentée par le conjoint"}
                    </label>
                    <Input
                      size="large"
                      placeholder="Nom de l'assemblée"
                      value={formData.assembleesConjoint as string || ""}
                      onChange={(e) => updateFormData("assembleesConjoint", e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                {"Nombre d'enfants"} <span className="text-destructive">*</span>
              </label>
              <Select
                size="large"
                className="w-full"
                placeholder="Sélectionnez"
                value={formData.nombreEnfants as string || undefined}
                onChange={(value) => updateFormData("nombreEnfants", value)}
                options={[
                  { value: "0", label: "Aucun" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "plus3", label: "Plus de 3" },
                ]}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-3">
              <label className="text-base font-medium block">Autres personnes à charge</label>
              <Radio.Group
                value={formData.autresPersonnesCharge as string || ""}
                onChange={(e) => updateFormData("autresPersonnesCharge", e.target.value)}
                className="flex gap-4 pt-2"
              >
                <Radio value="oui">Oui</Radio>
                <Radio value="non">Non</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        {formData.autresPersonnesCharge === "oui" && (
          <Row gutter={[24, 24]} className="p-4 rounded-lg bg-muted/30 border border-border">
            <Col xs={24} md={12}>
              <div className="space-y-2">
                <label className="text-base font-medium block">Nombre</label>
                <Input
                  size="large"
                  type="number"
                  min={1}
                  value={formData.nombrePersonnesCharge as string || ""}
                  onChange={(e) => updateFormData("nombrePersonnesCharge", e.target.value)}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="space-y-2">
                <label className="text-base font-medium block">Lesquelles ?</label>
                <Input
                  size="large"
                  placeholder="Ex: Parents, cousins..."
                  value={formData.detailsPersonnesCharge as string || ""}
                  onChange={(e) => updateFormData("detailsPersonnesCharge", e.target.value)}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  )
}

// Step 3: Spiritual Journey
export function Step3Spiritual({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">III. Parcours spirituel</h2>
        <p className="text-muted-foreground">Partagez votre cheminement de foi</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-base font-medium block">
            {"Quelle est votre religion d'origine ?"} <span className="text-destructive">*</span>
          </label>
          <Radio.Group
            value={formData.religionOrigine as string || ""}
            onChange={(e) => updateFormData("religionOrigine", e.target.value)}
            className="w-full"
          >
            <Row gutter={[12, 12]}>
              {[
                { value: "chretien", label: "Chrétien" },
                { value: "animiste", label: "Animiste" },
                { value: "musulman", label: "Musulman" },
                { value: "bouddhiste", label: "Bouddhiste" },
                { value: "autre", label: "Autre" },
              ].map((option) => (
                <Col xs={24} sm={12} key={option.value}>
                  <div
                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      formData.religionOrigine === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => updateFormData("religionOrigine", option.value)}
                  >
                    <Radio value={option.value}>{option.label}</Radio>
                  </div>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </div>

        {formData.religionOrigine === "chretien" && (
          <div className="space-y-2">
            <label className="text-base font-medium block">{"Précisez l'église"}</label>
            <Input
              size="large"
              placeholder="Nom de l'église"
              value={formData.egliseOrigine as string || ""}
              onChange={(e) => updateFormData("egliseOrigine", e.target.value)}
            />
          </div>
        )}

        {formData.religionOrigine === "autre" && (
          <div className="space-y-2">
            <label className="text-base font-medium block">Précisez</label>
            <Input
              size="large"
              placeholder="Précisez la religion"
              value={formData.autreReligion as string || ""}
              onChange={(e) => updateFormData("autreReligion", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-3">
          <label className="text-base font-medium block">
            Aviez-vous des responsabilités dans la religion antérieure ?
          </label>
          <Radio.Group
            value={formData.responsabilitesAnterieures as string || ""}
            onChange={(e) => updateFormData("responsabilitesAnterieures", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.responsabilitesAnterieures === "oui" && (
          <div className="space-y-2">
            <label className="text-base font-medium block">Préciser</label>
            <Input
              size="large"
              placeholder="Détails des responsabilités"
              value={formData.detailsResponsabilites as string || ""}
              onChange={(e) => updateFormData("detailsResponsabilites", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-base font-medium block">Date de conversion</label>
          <Input
            size="large"
            type="date"
            value={formData.dateConversion as string || ""}
            onChange={(e) => updateFormData("dateConversion", e.target.value)}
          />
        </div>

        {/* Baptême d'eau */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">{"Baptême d'eau"}</h3>
          <div className="space-y-3">
            <Radio.Group
              value={formData.baptemeEau as string || ""}
              onChange={(e) => updateFormData("baptemeEau", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.baptemeEau === "oui" && (
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="text-base font-medium block">Année</label>
                  <Input
                    size="large"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()}
                    value={formData.anneeBaptemeEau as string || ""}
                    onChange={(e) => updateFormData("anneeBaptemeEau", e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="text-base font-medium block">Lieu</label>
                  <Input
                    size="large"
                    placeholder="Lieu du baptême"
                    value={formData.lieuBaptemeEau as string || ""}
                    onChange={(e) => updateFormData("lieuBaptemeEau", e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          )}
        </div>

        {/* Baptême Saint-Esprit */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Baptême dans le Saint-Esprit</h3>
          <div className="space-y-3">
            <Radio.Group
              value={formData.baptemeSaintEsprit as string || ""}
              onChange={(e) => updateFormData("baptemeSaintEsprit", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.baptemeSaintEsprit === "oui" && (
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="text-base font-medium block">Année</label>
                  <Input
                    size="large"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()}
                    value={formData.anneeBaptemeSaintEsprit as string || ""}
                    onChange={(e) => updateFormData("anneeBaptemeSaintEsprit", e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <label className="text-base font-medium block">Lieu</label>
                  <Input
                    size="large"
                    placeholder="Lieu du baptême"
                    value={formData.lieuBaptemeSaintEsprit as string || ""}
                    onChange={(e) => updateFormData("lieuBaptemeSaintEsprit", e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          )}
        </div>

        {/* Parcours ecclésial */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Parcours ecclésial</h3>

          <div className="space-y-3">
            <label className="text-base font-medium block">
              Avez-vous fréquenté une autre église évangélique avant les Assemblées de Dieu ?
            </label>
            <Radio.Group
              value={formData.autreEgliseEvangelique as string || ""}
              onChange={(e) => updateFormData("autreEgliseEvangelique", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.autreEgliseEvangelique === "oui" && (
            <>
              <div className="space-y-2">
                <label className="text-base font-medium block">Laquelle ?</label>
                <Input
                  size="large"
                  placeholder="Nom de l'église"
                  value={formData.nomAutreEglise as string || ""}
                  onChange={(e) => updateFormData("nomAutreEglise", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-base font-medium block">Y aviez-vous des responsabilités ?</label>
                <Radio.Group
                  value={formData.responsabilitesAutreEglise as string || ""}
                  onChange={(e) => updateFormData("responsabilitesAutreEglise", e.target.value)}
                  className="flex gap-4"
                >
                  <Radio value="oui">Oui</Radio>
                  <Radio value="non">Non</Radio>
                </Radio.Group>
              </div>

              {formData.responsabilitesAutreEglise === "oui" && (
                <div className="space-y-2">
                  <label className="text-base font-medium block">
                    Précisez lesquelles
                  </label>
                  <Input
                    size="large"
                    placeholder="Détails"
                    value={formData.detailsResponsabilitesAutreEglise as string || ""}
                    onChange={(e) => updateFormData("detailsResponsabilitesAutreEglise", e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-base font-medium block">
                  Motifs du départ de l'église évangélique d'origine
                </label>
                <TextArea
                  placeholder="Expliquez les raisons"
                  value={formData.motifsDepart as string || ""}
                  onChange={(e) => updateFormData("motifsDepart", e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            Depuis quelle année fréquentez-vous le Temple La Transfiguration ?
          </label>
          <Input
            size="large"
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            value={formData.anneeTransfiguration as string || ""}
            onChange={(e) => updateFormData("anneeTransfiguration", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            Raisons du choix du Temple La Transfiguration
          </label>
          <TextArea
            placeholder="Expliquez vos raisons"
            value={formData.raisonsChoixTransfiguration as string || ""}
            onChange={(e) => updateFormData("raisonsChoixTransfiguration", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium block">
            Êtes-vous satisfait d'appartenir au Temple La Transfiguration ?
          </label>
          <Radio.Group
            value={formData.satisfactionTransfiguration as string || ""}
            onChange={(e) => updateFormData("satisfactionTransfiguration", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.satisfactionTransfiguration && (
          <div className="space-y-2">
            <label className="text-base font-medium block">
              {formData.satisfactionTransfiguration === "oui"
                ? "Indiquez les raisons de votre satisfaction"
                : "Indiquez les raisons de votre insatisfaction"}
            </label>
            <TextArea
              placeholder="Expliquez"
              value={formData.raisonsSatisfaction as string || ""}
              onChange={(e) => updateFormData("raisonsSatisfaction", e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Step 4: Church Life
export function Step4ChurchLife({ formData, updateFormData }: StepProps) {
  const groupesActuels = (formData.groupesActuels as string[]) || []
  const groupesSouhaites = (formData.groupesSouhaites as string[]) || []

  const toggleGroupe = (groupe: string, field: "groupesActuels" | "groupesSouhaites") => {
    const current = (formData[field] as string[]) || []
    if (current.includes(groupe)) {
      updateFormData(field, current.filter((g) => g !== groupe))
    } else {
      updateFormData(field, [...current, groupe])
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{"IV. Vie dans l'église"}</h2>
        <p className="text-muted-foreground">Votre implication au Temple La Transfiguration</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-base font-medium block">
            {"Êtes-vous membre d'un groupe, comité ou département de l'église ?"}
          </label>
          <Radio.Group
            value={formData.membreGroupe as string || ""}
            onChange={(e) => updateFormData("membreGroupe", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.membreGroupe === "oui" && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
            <label className="text-base font-medium block">Lequel(s) ?</label>
            <Row gutter={[12, 12]}>
              {groupesDepartements.map((groupe) => (
                <Col xs={24} sm={12} lg={8} key={groupe}>
                  <div
                    className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      groupesActuels.includes(groupe)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => toggleGroupe(groupe, "groupesActuels")}
                  >
                    <Checkbox checked={groupesActuels.includes(groupe)} />
                    <span className="font-normal cursor-pointer flex-1 text-sm">{groupe}</span>
                  </div>
                </Col>
              ))}
            </Row>

            <div className="space-y-2">
              <label className="text-base font-medium block">
                Autre groupe (précisez)
              </label>
              <Input
                size="large"
                placeholder="Autre groupe"
                value={formData.autreGroupeActuel as string || ""}
                onChange={(e) => updateFormData("autreGroupeActuel", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-base font-medium block">
                Avez-vous des responsabilités au sein de ce groupe ?
              </label>
              <Radio.Group
                value={formData.responsabilitesGroupe as string || ""}
                onChange={(e) => updateFormData("responsabilitesGroupe", e.target.value)}
                className="flex gap-4"
              >
                <Radio value="oui">Oui</Radio>
                <Radio value="non">Non</Radio>
              </Radio.Group>
            </div>

            {formData.responsabilitesGroupe === "oui" && (
              <div className="space-y-2">
                <label className="text-base font-medium block">
                  Précisez
                </label>
                <Input
                  size="large"
                  placeholder="Vos responsabilités"
                  value={formData.detailsResponsabilitesGroupe as string || ""}
                  onChange={(e) => updateFormData("detailsResponsabilitesGroupe", e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {formData.membreGroupe === "non" && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-2">
              <label className="text-base font-medium block">Pourquoi ?</label>
              <TextArea
                placeholder="Expliquez"
                value={formData.raisonNonMembre as string || ""}
                onChange={(e) => updateFormData("raisonNonMembre", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <label className="text-base font-medium block">Lequel(s) souhaitez-vous intégrer ?</label>
              <Row gutter={[12, 12]}>
                {[...groupesDepartements, "Aucun"].map((groupe) => (
                  <Col xs={24} sm={12} lg={8} key={groupe}>
                    <div
                      className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        groupesSouhaites.includes(groupe)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => toggleGroupe(groupe, "groupesSouhaites")}
                    >
                      <Checkbox checked={groupesSouhaites.includes(groupe)} />
                      <span className="font-normal cursor-pointer flex-1 text-sm">{groupe}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="space-y-2">
              <label className="text-base font-medium block">
                Autre groupe (précisez)
              </label>
              <Input
                size="large"
                placeholder="Autre groupe"
                value={formData.autreGroupeSouhaite as string || ""}
                onChange={(e) => updateFormData("autreGroupeSouhaite", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Participation aux cultes */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Participation aux cultes</h3>

          <div className="space-y-3">
            <label className="text-base font-medium block">
              Fréquence de participation aux cultes du dimanche <span className="text-destructive">*</span>
            </label>
            <Radio.Group
              value={formData.frequenceCultesDimanche as string || ""}
              onChange={(e) => updateFormData("frequenceCultesDimanche", e.target.value)}
              className="w-full"
            >
              <div className="grid gap-3">
                {[
                  { value: "regulierement", label: "Régulièrement" },
                  { value: "occasionnellement", label: "Occasionnellement" },
                  { value: "rarement", label: "Rarement" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      formData.frequenceCultesDimanche === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => updateFormData("frequenceCultesDimanche", option.value)}
                  >
                    <Radio value={option.value}>{option.label}</Radio>
                  </div>
                ))}
              </div>
            </Radio.Group>
          </div>

          {["occasionnellement", "rarement"].includes(formData.frequenceCultesDimanche as string) && (
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Quelles sont les raisons ?
              </label>
              <TextArea
                placeholder="Expliquez"
                value={formData.raisonsAbsenceDimanche as string || ""}
                onChange={(e) => updateFormData("raisonsAbsenceDimanche", e.target.value)}
                rows={2}
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-base font-medium block">
              Participation aux cultes du soir (prière et études bibliques)
            </label>
            <Radio.Group
              value={formData.participationCultesSoir as string || ""}
              onChange={(e) => updateFormData("participationCultesSoir", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.participationCultesSoir === "non" && (
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Précisez les raisons
              </label>
              <TextArea
                placeholder="Expliquez"
                value={formData.raisonsAbsenceSoir as string || ""}
                onChange={(e) => updateFormData("raisonsAbsenceSoir", e.target.value)}
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Actions sociales */}
        <div className="space-y-3">
          <label className="text-base font-medium block">
            {"Participez-vous aux actions sociales de l'église ?"}
          </label>
          <Radio.Group
            value={formData.participationActionsSociales as string || ""}
            onChange={(e) => updateFormData("participationActionsSociales", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.participationActionsSociales === "oui" && (
          <div className="space-y-2">
            <label className="text-base font-medium block">
              Lesquelles ?
            </label>
            <TextArea
              placeholder="Détaillez"
              value={formData.detailsActionsSociales as string || ""}
              onChange={(e) => updateFormData("detailsActionsSociales", e.target.value)}
              rows={2}
            />
          </div>
        )}

        {formData.participationActionsSociales === "non" && (
          <div className="space-y-2">
            <label className="text-base font-medium block">
              Précisez les raisons
            </label>
            <TextArea
              placeholder="Expliquez"
              value={formData.raisonsNonParticipation as string || ""}
              onChange={(e) => updateFormData("raisonsNonParticipation", e.target.value)}
              rows={2}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Step 5: Professional Life
export function Step5Professional({ formData, updateFormData }: StepProps) {
  const competences = (formData.competences as string[]) || []
  const disponibilite = (formData.disponibiliteActivites as string[]) || []

  const toggleCompetence = (comp: string) => {
    const current = competences
    if (current.includes(comp)) {
      updateFormData("competences", current.filter((c) => c !== comp))
    } else {
      updateFormData("competences", [...current, comp])
    }
  }

  const toggleDisponibilite = (disp: string) => {
    const current = disponibilite
    if (current.includes(disp)) {
      updateFormData("disponibiliteActivites", current.filter((d) => d !== disp))
    } else {
      updateFormData("disponibiliteActivites", [...current, disp])
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">V. Vie professionnelle et sociale</h2>
        <p className="text-muted-foreground">Votre parcours et activités professionnelles</p>
      </div>

      <div className="grid gap-6">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                {"Niveau d'études"} <span className="text-destructive">*</span>
              </label>
              <Select
                size="large"
                className="w-full"
                placeholder="Sélectionnez"
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
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Domaine de formation principale
              </label>
              <Input
                size="large"
                placeholder="Ex: Informatique, Gestion..."
                value={formData.domaineFormation as string || ""}
                onChange={(e) => updateFormData("domaineFormation", e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Profession ou activité principale
              </label>
              <Input
                size="large"
                placeholder="Votre profession"
                value={formData.profession as string || ""}
                onChange={(e) => updateFormData("profession", e.target.value)}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">{"Secteur d'activité"}</label>
              <Select
                size="large"
                className="w-full"
                placeholder="Sélectionnez"
                value={formData.secteurActivite as string || undefined}
                onChange={(value) => updateFormData("secteurActivite", value)}
                options={[
                  { value: "public", label: "Administration publique" },
                  { value: "prive", label: "Secteur Privé" },
                  { value: "informel", label: "Secteur Informel" },
                  { value: "societe-civile", label: "Société civile (Association, ONG, Syndicat)" },
                  { value: "aucun", label: "Aucun" },
                ]}
              />
            </div>
          </Col>
        </Row>

        <div className="space-y-2">
          <label className="text-base font-medium block">Situation professionnelle</label>
          <Select
            size="large"
            className="w-full"
            placeholder="Sélectionnez"
            value={formData.situationProfessionnelle as string || undefined}
            onChange={(value) => updateFormData("situationProfessionnelle", value)}
            options={[
              { value: "employe-ouvrier", label: "Employé (ouvrier ou agent)" },
              { value: "employe-cadre-moyen", label: "Employé (cadre moyen)" },
              { value: "employe-cadre", label: "Employé (cadre)" },
              { value: "employe-cadre-superieur", label: "Employé (cadre supérieur)" },
              { value: "chef-entreprise", label: "Chef d'entreprise" },
              { value: "entrepreneur", label: "Entrepreneur" },
              { value: "consultant", label: "Consultant(e)" },
              { value: "etudiant", label: "Étudiant" },
              { value: "retraite", label: "Retraité" },
              { value: "sans-emploi", label: "Sans emploi" },
              { value: "menagere", label: "Ménagère" },
            ]}
          />
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Lieu de travail</h3>

          <Radio.Group
            value={formData.lieuTravail as string || ""}
            onChange={(e) => updateFormData("lieuTravail", e.target.value)}
            className="flex flex-wrap gap-4"
          >
            <Radio value="abidjan">Abidjan</Radio>
            <Radio value="interieur">Intérieur du pays</Radio>
          </Radio.Group>

          {formData.lieuTravail && (
            <div className="space-y-2">
              <label className="text-base font-medium block">Précisez</label>
              <Input
                size="large"
                placeholder={
                  formData.lieuTravail === "abidjan"
                    ? "Ex: Plateau, Cocody..."
                    : "Ex: Bouaké, Yamoussoukro..."
                }
                value={formData.precisionLieuTravail as string || ""}
                onChange={(e) => updateFormData("precisionLieuTravail", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">{"Disponibilité pour les activités de l'église"}</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "semaine", label: "Semaine" },
              { value: "weekend", label: "Week-end" },
              { value: "soiree", label: "Soirée" },
              { value: "autre", label: "Autre" },
            ].map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                  disponibilite.includes(option.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => toggleDisponibilite(option.value)}
              >
                <Checkbox checked={disponibilite.includes(option.value)} />
                <span className="font-normal cursor-pointer">{option.label}</span>
              </div>
            ))}
          </div>

          {disponibilite.includes("autre") && (
            <div className="space-y-2">
              <label className="text-base font-medium block">Précisez</label>
              <Input
                size="large"
                placeholder="Autre disponibilité"
                value={formData.autreDisponibilite as string || ""}
                onChange={(e) => updateFormData("autreDisponibilite", e.target.value)}
              />
            </div>
          )}
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Heure de départ pour le travail
              </label>
              <Input
                size="large"
                placeholder="Ex: 07h00"
                value={formData.heureDepartTravail as string || ""}
                onChange={(e) => updateFormData("heureDepartTravail", e.target.value)}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Heure de retour du travail
              </label>
              <Input
                size="large"
                placeholder="Ex: 18h00"
                value={formData.heureRetourTravail as string || ""}
                onChange={(e) => updateFormData("heureRetourTravail", e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <div className="space-y-3">
          <label className="text-base font-medium block">
            Exercez-vous des activités extra-professionnelles ?
          </label>
          <Radio.Group
            value={formData.activitesExtraPro as string || ""}
            onChange={(e) => updateFormData("activitesExtraPro", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.activitesExtraPro === "oui" && (
          <div className="space-y-2">
            <label className="text-base font-medium block">Précisez</label>
            <Input
              size="large"
              placeholder="Détails"
              value={formData.detailsActivitesExtraPro as string || ""}
              onChange={(e) => updateFormData("detailsActivitesExtraPro", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Compétences particulières</h3>
          <div className="flex flex-wrap gap-3">
            {[
              "Informatique",
              "Artisanat",
              "Musique",
              "Communication",
              "Santé",
              "BTP",
              "Autre",
            ].map((comp) => (
              <div
                key={comp}
                className={`flex items-center space-x-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                  competences.includes(comp.toLowerCase())
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => toggleCompetence(comp.toLowerCase())}
              >
                <Checkbox checked={competences.includes(comp.toLowerCase())} />
                <span className="font-normal cursor-pointer">{comp}</span>
              </div>
            ))}
          </div>

          {competences.includes("autre") && (
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Autres compétences
              </label>
              <Input
                size="large"
                placeholder="Précisez"
                value={formData.autresCompetences as string || ""}
                onChange={(e) => updateFormData("autresCompetences", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">Revenu mensuel moyen (en FCFA)</label>
          <Select
            size="large"
            className="w-full"
            placeholder="Sélectionnez une tranche"
            value={formData.revenuMensuel as string || undefined}
            onChange={(value) => updateFormData("revenuMensuel", value)}
            options={[
              { value: "moins-50000", label: "Moins de 50 000" },
              { value: "50000-100000", label: "50 000 - 100 000" },
              { value: "101000-150000", label: "101 000 - 150 000" },
              { value: "151000-200000", label: "151 000 - 200 000" },
              { value: "201000-250000", label: "201 000 - 250 000" },
              { value: "251000-300000", label: "251 000 - 300 000" },
              { value: "301000-350000", label: "301 000 - 350 000" },
              { value: "351000-400000", label: "351 000 - 400 000" },
              { value: "401000-450000", label: "401 000 - 450 000" },
              { value: "451000-500000", label: "451 000 - 500 000" },
              { value: "plus-500000", label: "500 000 et plus" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

// Step 6: Spiritual Needs
export function Step6SpiritualNeeds({ formData, updateFormData }: StepProps) {
  const domainesAppui = (formData.domainesAppui as string[]) || []

  const toggleDomaine = (domaine: string) => {
    if (domainesAppui.includes(domaine)) {
      updateFormData("domainesAppui", domainesAppui.filter((d) => d !== domaine))
    } else {
      updateFormData("domainesAppui", [...domainesAppui, domaine])
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">VI. Besoins et attentes spirituelles</h2>
        <p className="text-muted-foreground">Comment pouvons-nous vous accompagner ?</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-base font-medium block">
            {"Avez-vous besoin d'un accompagnement ou d'un appui spécifique ?"}
          </label>
          <Radio.Group
            value={formData.besoinAccompagnement as string || ""}
            onChange={(e) => updateFormData("besoinAccompagnement", e.target.value)}
            className="flex gap-4"
          >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </div>

        {formData.besoinAccompagnement === "oui" && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
            <label className="text-base font-medium block">
              {"Dans lequel de ces domaines avez-vous besoin d'appui ?"}
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "spirituel", label: "Spirituel" },
                { value: "familial", label: "Familial" },
                { value: "formation", label: "Formation qualifiante" },
                { value: "aide-sociale", label: "Aide sociale" },
                { value: "autre", label: "Autre" },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                    domainesAppui.includes(option.value)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => toggleDomaine(option.value)}
                >
                  <Checkbox checked={domainesAppui.includes(option.value)} />
                  <span className="font-normal cursor-pointer">{option.label}</span>
                </div>
              ))}
            </div>

            {domainesAppui.includes("autre") && (
              <div className="space-y-2">
                <label className="text-base font-medium block">
                  Autre (précisez)
                </label>
                <Input
                  size="large"
                  placeholder="Précisez"
                  value={formData.autreDomaineAppui as string || ""}
                  onChange={(e) => updateFormData("autreDomaineAppui", e.target.value)}
                />
              </div>
            )}

            {domainesAppui.includes("formation") && (
              <div className="space-y-2">
                <label className="text-base font-medium block">
                  Précisez le type de formation dont vous avez besoin
                </label>
                <TextArea
                  placeholder="Type de formation"
                  value={formData.typeFormation as string || ""}
                  onChange={(e) => updateFormData("typeFormation", e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Esprit de famille</h3>

          <div className="space-y-3">
            <label className="text-base font-medium block">
              {"Pensez-vous que l'esprit de famille est une réalité au Temple La Transfiguration ?"}
            </label>
            <Radio.Group
              value={formData.espritFamille as string || ""}
              onChange={(e) => updateFormData("espritFamille", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.espritFamille && (
            <div className="space-y-2">
              <label className="text-base font-medium block">
                {formData.espritFamille === "oui" ? "Précisez comment" : "Précisez pourquoi"}
              </label>
              <TextArea
                placeholder="Expliquez"
                value={formData.commentEspritFamille as string || ""}
                onChange={(e) => updateFormData("commentEspritFamille", e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            {"Suggestions pour améliorer la vie de famille de l'église"}
          </label>
          <TextArea
            placeholder="Vos suggestions..."
            value={formData.suggestionsFamille as string || ""}
            onChange={(e) => updateFormData("suggestionsFamille", e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

// Step 7: Health
export function Step7Health({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">VII. Santé</h2>
        <p className="text-muted-foreground">Informations confidentielles sur votre santé</p>
      </div>

      <div className="grid gap-6">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">
                À quand remonte votre dernier bilan de santé ?
              </label>
              <Select
                size="large"
                className="w-full"
                placeholder="Sélectionnez"
                value={formData.dernierBilan as string || undefined}
                onChange={(value) => updateFormData("dernierBilan", value)}
                options={[
                  { value: "moins-1an", label: "Moins d'un an" },
                  { value: "1an", label: "Un an" },
                  { value: "plus-1an", label: "Plus d'un an" },
                ]}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-2">
              <label className="text-base font-medium block">État de santé général</label>
              <Select
                size="large"
                className="w-full"
                placeholder="Sélectionnez"
                value={formData.etatSanteGeneral as string || undefined}
                onChange={(value) => updateFormData("etatSanteGeneral", value)}
                options={[
                  { value: "bon", label: "Bon" },
                  { value: "moyen", label: "Moyen" },
                  { value: "fragile", label: "Fragile" },
                ]}
              />
            </div>
          </Col>
        </Row>

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <div className="space-y-3">
            <label className="text-base font-medium block">Maladies chroniques à signaler</label>
            <Radio.Group
              value={formData.maladiesChroniques as string || ""}
              onChange={(e) => updateFormData("maladiesChroniques", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.maladiesChroniques === "oui" && (
            <>
              <div className="space-y-3">
                <label className="text-base font-medium block">Le corps pastoral est-il informé ?</label>
                <Radio.Group
                  value={formData.corpsPastoralInforme as string || ""}
                  onChange={(e) => updateFormData("corpsPastoralInforme", e.target.value)}
                  className="flex gap-4"
                >
                  <Radio value="oui">Oui</Radio>
                  <Radio value="non">Non</Radio>
                </Radio.Group>
              </div>

              {formData.corpsPastoralInforme === "non" && (
                <div className="space-y-3">
                  <label className="text-base font-medium block">
                    Souhaitez-vous informer le corps pastoral ?
                  </label>
                  <Radio.Group
                    value={formData.souhaiteInformerCorpsPastoral as string || ""}
                    onChange={(e) => updateFormData("souhaiteInformerCorpsPastoral", e.target.value)}
                    className="flex gap-4"
                  >
                    <Radio value="oui">Oui</Radio>
                    <Radio value="non">Non</Radio>
                  </Radio.Group>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="font-semibold text-lg">Soutien reçu</h3>

          <div className="space-y-3">
            <label className="text-base font-medium block">
              {"Avez-vous bénéficié d'un soutien psychosocial de l'Église pour votre état de santé ?"}
            </label>
            <Radio.Group
              value={formData.soutienPsychosocial as string || ""}
              onChange={(e) => updateFormData("soutienPsychosocial", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>

          {formData.soutienPsychosocial === "oui" && (
            <div className="space-y-2">
              <label className="text-base font-medium block">
                Décrivez
              </label>
              <TextArea
                placeholder="Décrivez le soutien reçu"
                value={formData.descriptionSoutienPsychosocial as string || ""}
                onChange={(e) => updateFormData("descriptionSoutienPsychosocial", e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-base font-medium block">
              {"Avez-vous bénéficié d'un soutien matériel et financier de l'Église pour votre état de santé ?"}
            </label>
            <Radio.Group
              value={formData.soutienMaterielFinancier as string || ""}
              onChange={(e) => updateFormData("soutienMaterielFinancier", e.target.value)}
              className="flex gap-4"
            >
              <Radio value="oui">Oui</Radio>
              <Radio value="non">Non</Radio>
            </Radio.Group>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium block">
            {"Suggestions pour l'amélioration de l'assistance sociale dans l'Église"}
          </label>
          <TextArea
            placeholder="Vos suggestions..."
            value={formData.suggestionsAssistanceSociale as string || ""}
            onChange={(e) => updateFormData("suggestionsAssistanceSociale", e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
