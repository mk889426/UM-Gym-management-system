"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { CreditCard } from "lucide-react"
import type { Member, Bill } from "../../types/Gym"
import { toast } from "sonner"

interface BillingTabProps {
  members: Member[]
  bills: Bill[]
  onCreateBill: (bill: Omit<Bill, "id" | "memberName" | "status">) => void
}

export function BillingTab({ members, bills, onCreateBill }: BillingTabProps) {
  const [billForm, setBillForm] = useState({ memberId: "", amount: "", date: "" })

  const handleCreateBill = () => {
    if (!billForm.memberId || !billForm.amount || !billForm.date) {
      toast.error("All fields are required",)
      return
    }

    onCreateBill({
      memberId: billForm.memberId,
      amount: Number.parseFloat(billForm.amount),
      date: billForm.date,
    })

    setBillForm({ memberId: "", amount: "", date: "" })
    toast.success("Bill created successfully")
  }

  return (
    <div className="space-y-6">
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
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-rose-800">
                Amount ($)
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
                  <TableCell className="text-rose-700">${bill.amount}</TableCell>
                  <TableCell className="text-rose-700">{bill.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={bill.status === "paid" ? "default" : "secondary"}
                      className={bill.status === "paid" ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"}
                    >
                      {bill.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
