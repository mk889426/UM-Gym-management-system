"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { CreditCard, Edit } from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { AppDispatch, RootState } from "../../app/store"
import { createBill, fetchBills, fetchMembers, updateBillStatus } from "../../features/admin/adminSlice"
import type { Bill } from "../../types/Gym"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

export function BillingTab() {
  const dispatch = useDispatch<AppDispatch>()
  const { members, bills, loading } = useSelector((state: RootState) => state.admin)

  const [billForm, setBillForm] = useState({ memberId: "", amount: "", date: "" })
  const [editOpen, setEditOpen] = useState(false)
  const [editBill, setEditBill] = useState<Bill | null>(null)
  const [editStatus, setEditStatus] = useState<"paid" | "pending">("pending")

  useEffect(() => {
    dispatch(fetchMembers())
    dispatch(fetchBills())
  }, [dispatch])

  const handleCreateBill = async () => {
    if (!billForm.memberId || !billForm.amount || !billForm.date) {
      toast.error("All fields are required")
      return
    }

    try {
      const action = await dispatch(
        createBill({
          memberId: billForm.memberId,
          amount: Number(billForm.amount),
          date: billForm.date,
        })
      )

      if (createBill.fulfilled.match(action)) {
        const newBill = action.payload
        setBillForm({ memberId: "", amount: "", date: "" })
        toast.success("Bill created successfully")
        generateBillPDF(newBill)
      } else {
        toast.error(action.payload as string)
      }
    } catch {
      toast.error("Failed to create bill")
    }
  }

  const generateBillPDF = (bill: any) => {
    const member = members.find((m) => m._id === bill.memberId)
    if (!member) return

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Fitness Gym", 105, 20, { align: "center" })
    autoTable(doc, {
      startY: 40,
      head: [["Bill ID", "Member", "Amount", "Date", "Status"]],
      body: [[bill.id, bill.memberName, `₹${bill.amount}`, new Date(bill.date).toLocaleDateString(), bill.status]],
    })
    doc.save(`Bill_${bill.id}.pdf`)
  }

  const handleUpdateStatus = async (billId: string, newStatus: "paid" | "pending") => {
    try {
      const action = await dispatch(updateBillStatus({ id: billId, status: newStatus }))

      if (updateBillStatus.fulfilled.match(action)) {
        toast.success(`Bill marked as ${newStatus}`)
      } else {
        toast.error(action.payload as string)
      }
    } catch {
      toast.error("Failed to update bill status")
    }
  }


  return (
    <div className="space-y-6">
      {/* Create Bill Form */}
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Create Bill</CardTitle>
          <CardDescription className="text-rose-700">Generate a new bill for a member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billMember" className="text-rose-800">
                Member
              </Label>
              <Select
                value={billForm.memberId}
                onValueChange={(value) => setBillForm({ ...billForm, memberId: value })}
              >
                <SelectTrigger className="border-rose-200 focus:border-rose-400">
                  <SelectValue placeholder={loading ? "Loading members..." : "Select member"} />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-rose-800">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billDate" className="text-rose-800">
                Date
              </Label>
              <Input
                id="billDate"
                type="date"
                value={billForm.date}
                onChange={(e) => setBillForm({ ...billForm, date: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
          </div>

          <Button onClick={handleCreateBill} className="bg-rose-600 hover:bg-rose-700">
            <CreditCard className="w-4 h-4 mr-2" />
            Create Bill
          </Button>
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Bills List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-rose-800">Member</TableHead>
                <TableHead className="text-rose-800">Amount</TableHead>
                <TableHead className="text-rose-800">Date</TableHead>
                <TableHead className="text-rose-800">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} className="border-rose-100">
                  <TableCell className="text-rose-900">{bill.memberName}</TableCell>
                  <TableCell className="text-rose-700">₹{bill.amount}</TableCell>
                  <TableCell className="text-rose-700">{new Date(bill.date).toLocaleDateString()}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Badge
                      variant={bill.status === "paid" ? "default" : "secondary"}
                      className={
                        bill.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-rose-100 text-rose-800"
                      }
                    >
                      {bill.status}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
                      onClick={() => {
                        setEditBill(bill)
                        setEditStatus(bill.status as "paid" | "pending")
                        setEditOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white border-rose-200">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Update Bill Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-rose-700">
              Update status for <strong>{editBill?.memberName}</strong> (₹{editBill?.amount})
            </p>

            <Select
              value={editStatus}
              onValueChange={(val) => setEditStatus(val as "paid" | "pending")}
            >
              <SelectTrigger className="border-rose-200 focus:border-rose-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="border-rose-300 text-rose-700"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!editBill) return
                const action = await dispatch(
                  updateBillStatus({ id: editBill.id, status: editStatus })
                )
                if (updateBillStatus.fulfilled.match(action)) {
                  toast.success("Bill status updated")
                  setEditOpen(false)
                } else {
                  toast.error(action.payload as string)
                }
              }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}
