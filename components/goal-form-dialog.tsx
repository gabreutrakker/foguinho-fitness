"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Goal } from "@/lib/goals"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GoalFormDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: {
    titulo: string
    descricao: string
    tipo: Goal["tipo"]
    metaDiaria: number
    unidade: string
  }) => void
  goal?: Goal | null
}

export function GoalFormDialog({ open, onClose, onSave, goal }: GoalFormDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState<Goal["tipo"]>("agua")
  const [metaDiaria, setMetaDiaria] = useState("")
  const [unidade, setUnidade] = useState("")

  useEffect(() => {
    if (goal) {
      setTitulo(goal.titulo)
      setDescricao(goal.descricao)
      setTipo(goal.tipo)
      setMetaDiaria(goal.metaDiaria.toString())
      setUnidade(goal.unidade)
    } else {
      setTitulo("")
      setDescricao("")
      setTipo("agua")
      setMetaDiaria("")
      setUnidade("")
    }
  }, [goal, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      titulo,
      descricao,
      tipo,
      metaDiaria: Number.parseInt(metaDiaria),
      unidade,
    })

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? "Editar Meta" : "Nova Meta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Ex: Beber água"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva sua meta..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(value) => setTipo(value as Goal["tipo"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agua">💧 Água</SelectItem>
                  <SelectItem value="exercicio">💪 Exercício</SelectItem>
                  <SelectItem value="estudo">📚 Estudo</SelectItem>
                  <SelectItem value="sono">😴 Sono</SelectItem>
                  <SelectItem value="outro">⭐ Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaDiaria">Meta Diária</Label>
                <Input
                  id="metaDiaria"
                  type="number"
                  min="1"
                  placeholder="8"
                  value={metaDiaria}
                  onChange={(e) => setMetaDiaria(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  placeholder="copos, minutos..."
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {goal ? "Salvar" : "Criar Meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
