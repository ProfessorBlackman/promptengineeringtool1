"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff } from "lucide-react"
import { addAPIKey } from "@/lib/db"
import { useAuth } from "@/components/auth-provider"

interface AddAPIKeyModalProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onAPIKeyAddedAction: () => void
}

const providers = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Cohere",
  "Hugging Face",
  "Azure OpenAI",
  "Custom"
]

export default function AddAPIKeyModal({ open, onOpenChangeAction, onAPIKeyAddedAction }: AddAPIKeyModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    keyValue: "",
    description: "",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.name || !formData.provider || !formData.keyValue) return

    setLoading(true)
    try {
      await addAPIKey(user.uid, formData)

      // Reset form
      setFormData({
        name: "",
        provider: "",
        keyValue: "",
        description: "",
        isActive: true,
      })

      onAPIKeyAddedAction()
      onOpenChangeAction(false)
    } catch (error) {
      console.error("Failed to add API key:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
          <DialogDescription>
            Add an API key to authenticate with language model providers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., My OpenAI Key"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Provider *</label>
            <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">API Key *</label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={formData.keyValue}
                onChange={(e) => setFormData({ ...formData, keyValue: e.target.value })}
                placeholder="sk-..."
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description or notes"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <label className="text-sm font-medium">Active</label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.provider || !formData.keyValue}>
              {loading ? "Adding..." : "Add Key"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
