"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({ title, value, description, icon: Icon, iconColor = "text-orange-600" }: StatsCardProps) {
  return (
    <Card className="border-2 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
