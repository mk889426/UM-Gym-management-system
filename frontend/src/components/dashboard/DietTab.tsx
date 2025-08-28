"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Apple } from "lucide-react"
import type { Member, DietDetail } from "../../types/Gym"
import { toast } from "sonner"

interface DietTabProps {
  members: Member[]
  dietDetails: DietDetail[]
  onAddDietDetail: (dietDetail: Omit<DietDetail, "id" | "memberName" | "createdDate">) => void
}

export function DietTab({ members, dietDetails, onAddDietDetail }: DietTabProps) {
  const [dietForm, setDietForm] = useState({ memberId: "", dietPlan: "" })

  const handleAddDietDetail = () => {
    if (!dietForm.memberId || !dietForm.dietPlan) {
      toast.error("Member and diet plan are required")
      return
    }

    onAddDietDetail({
      memberId: dietForm.memberId,
      dietPlan: dietForm.dietPlan,
    })

    setDietForm({ memberId: "", dietPlan: "" })
    toast.success("Diet plan added successfully" )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Create Diet Plan</CardTitle>
          <CardDescription className="text-rose-700">Assign a diet plan to a member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietMember" className="text-rose-800">
              Member
            </Label>
            <Select value={dietForm.memberId} onValueChange={(value) => setDietForm({ ...dietForm, memberId: value })}>
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
            <Label htmlFor="dietPlan" className="text-rose-800">
              Diet Plan
            </Label>
            <Textarea
              id="dietPlan"
              value={dietForm.dietPlan}
              onChange={(e) => setDietForm({ ...dietForm, dietPlan: e.target.value })}
              className="border-rose-200 focus:border-rose-400"
              rows={4}
              placeholder="Enter detailed diet plan including meals, calories, and nutritional guidelines..."
            />
          </div>
          <Button onClick={handleAddDietDetail} className="bg-rose-600 hover:bg-rose-700">
            <Apple className="w-4 h-4 mr-2" />
            Create Diet Plan
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Diet Plans List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-rose-800">Member</TableHead>
                <TableHead className="text-rose-800">Diet Plan</TableHead>
                <TableHead className="text-rose-800">Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dietDetails.map((diet) => (
                <TableRow key={diet.id} className="border-rose-100">
                  <TableCell className="text-rose-900">{diet.memberName}</TableCell>
                  <TableCell className="text-rose-700 max-w-md truncate">{diet.dietPlan}</TableCell>
                  <TableCell className="text-rose-700">{diet.createdDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
