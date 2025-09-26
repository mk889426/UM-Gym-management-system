"use client"

import api from "../../api/axios"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { useAppSelector } from "../../hooks"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


export function ReportsTab() {
  const token = useAppSelector((s) => s.auth.token) || localStorage.getItem("token")

  const fetchReports = async () => {
    if (!token) {
      toast.error("No auth token found")
      return null
    }

    try {
      const res = await api.get("/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "json",
      })
      return res.data
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.msg || "Failed to fetch reports")
      return null
    }
  }

  const handleExportJSON = async () => {
    const data = await fetchReports()
    if (!data) return

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `gym-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    toast.success("Report exported as JSON")
  }

  const handleExportPDF = async () => {
  const data = await fetchReports()
  if (!data) return

  const { members, bills, notifications } = data

  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text("Gym Management Report", 14, 20)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Export Date: ${new Date().toLocaleString()}`, 14, 28)

  // Members table
  if (members?.length) {
    autoTable(doc, {
      head: [["Name", "Username", "Role"]],
      body: members.map((m: any) => [m.name, m.user?.username, m.user?.role]),
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [233, 30, 99] },
    })
  }

  // Bills table
  if (bills?.length) {
    autoTable(doc, {
      head: [["Amount", "Status", "Date"]],
      body: bills.map((b: any) => [
        `$${b.amount}`,
        b.status,
        new Date(b.date).toLocaleDateString(),
      ]),
      startY: (doc as any).lastAutoTable.finalY + 10,
      theme: "grid",
      headStyles: { fillColor: [244, 67, 54] },
    })
  }

  // Notifications table
  if (notifications?.length) {
    autoTable(doc, {
      head: [["Message", "Date"]],
      body: notifications.map((n: any) => [
        n.message,
        new Date(n.date).toLocaleDateString(),
      ]),
      startY: (doc as any).lastAutoTable.finalY + 10,
      theme: "grid",
      headStyles: { fillColor: [33, 150, 243] },
    })
  }

  doc.save(`gym-report-${new Date().toISOString().split("T")[0]}.pdf`)
  toast.success("Report exported as PDF")
}


  return (
    <div className="space-y-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Export Reports</CardTitle>
          <CardDescription className="text-rose-700">
            Download comprehensive gym management reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-900 mb-2">Members Report</h3>
              <p className="text-sm text-rose-700 mb-3">
                Complete list of all gym members with their details
              </p>
            </div>
            <div className="p-4 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-900 mb-2">Financial Report</h3>
              <p className="text-sm text-rose-700 mb-3">
                Billing information and payment status
              </p>
            </div>
            <div className="p-4 border border-rose-200 rounded-lg">
              <h3 className="font-semibold text-rose-900 mb-2">Notifications Report</h3>
              <p className="text-sm text-rose-700 mb-3">
                Member and system notifications overview
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportJSON} className="bg-rose-600 hover:bg-rose-700">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
