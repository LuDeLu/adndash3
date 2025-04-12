"use client"

import { ApprovalForm } from "@/components/checklist/approval-form"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ChecklistPage() {
  return (
    <>
      <ApprovalForm />
      <SpeedInsights />
    </>
  )
}
