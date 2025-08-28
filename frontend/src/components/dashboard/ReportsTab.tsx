"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Download } from "lucide-react"
import type { Member, Bill, Notification, Supplement, DietDetail } from "../../types/Gym"
import { toast } from "sonner"

interface ReportsTabProps {
  members: Member[]
  bills: Bill[]
  notifications: Notification[]
  supplements: Supplement[]
  dietDetails: DietDetail[]
}

export function ReportsTab({ members, bills, notifications, supplements, dietDetails }: ReportsTabProps) {
  

  const handleExportReports = () => {
    const reportData = {
      members,
      bills,
      notifications,
      supplements,
      dietDetails,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `gym-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    toast.success("Report exported successfully" );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Export Reports</CardTitle>
          <CardDescription className="text-rose-700">Download comprehensive gym management reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-900 mb-2">Members Report</h3>
              <p className="text-sm text-rose-700 mb-3">Complete list of all gym members with their details</p>
              <p className="text-lg font-bold text-rose-800">{members.length} Members</p>
            </div>
            <div className="p-4 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-900 mb-2">Financial Report</h3>
              <p className="text-sm text-rose-700 mb-3">Billing information and payment status</p>
              <p className="text-lg font-bold text-rose-800">
                ${bills.reduce((sum, bill) => sum + bill.amount, 0)} Total
              </p>
            </div>
            <div className="p-4 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-900 mb-2">Inventory Report</h3>
              <p className="text-sm text-rose-700 mb-3">Supplements stock and pricing information</p>
              <p className="text-lg font-bold text-rose-800">
                {supplements.reduce((sum, supp) => sum + supp.stock, 0)} Items
              </p>
            </div>
          </div>
          <Button onClick={handleExportReports} className="bg-rose-600 hover:bg-rose-700">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
