"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Apple, Pencil, Trash2 } from "lucide-react"
import type { Member, DietDetail } from "../../types/Gym"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import type { AppDispatch, RootState } from "../../app/store"
import { createDietDetail, deleteDietDetail, updateDietDetail } from "../../features/admin/adminSlice"

export function DietTab() {
  const dispatch = useDispatch<AppDispatch>()
  const members = useSelector((state: RootState) => state.admin.members)
  const dietDetails = useSelector((state: RootState) => state.admin.dietDetails)

  const [dietForm, setDietForm] = useState({ memberId: "", dietPlan: "" })
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState<DietDetail | null>(null)

  // ✅ Add Diet Plan
  const handleAddDietDetail = () => {
    if (!dietForm.memberId || !dietForm.dietPlan) {
      toast.error("Member and diet plan are required")
      return
    }

    dispatch(createDietDetail(dietForm))
      .unwrap()
      .then(() => {
        toast.success("Diet plan added successfully")
        setDietForm({ memberId: "", dietPlan: "" })
      })
      .catch((err) => toast.error(err))
  }

  // ✅ Open edit dialog
  const handleEditOpen = (diet: DietDetail) => {
    setSelectedDiet(diet)
    setDietForm({ memberId: diet.memberId, dietPlan: diet.dietPlan })
    setEditOpen(true)
  }

  // ✅ Confirm edit
  const handleEditConfirm = () => {
    if (!selectedDiet) return
    dispatch(updateDietDetail({ id: selectedDiet.id, dietPlan: dietForm.dietPlan }))
      .unwrap()
      .then(() => {
        toast.success("Diet plan updated successfully")
        setEditOpen(false)
        setSelectedDiet(null)
        setDietForm({ memberId: "", dietPlan: "" })
      })
      .catch((err) => toast.error(err))
  }

  // ✅ Open delete dialog
  const handleDeleteOpen = (diet: DietDetail) => {
    setSelectedDiet(diet)
    setDeleteOpen(true)
  }

  // ✅ Confirm delete
  const handleDeleteConfirm = () => {
    if (!selectedDiet) return
    dispatch(deleteDietDetail(selectedDiet.id))
      .unwrap()
      .then(() => {
        toast.success("Diet plan deleted successfully")
        setDeleteOpen(false)
        setSelectedDiet(null)
      })
      .catch((err) => toast.error(err))
  }

  return (
    <div className="space-y-6">
      {/* Create Diet Plan */}
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
                {members.map((member: Member) => (
                  <SelectItem key={member._id} value={member._id}>
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

      {/* Diet Plan List */}
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
                <TableHead className="text-rose-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dietDetails.map((diet: DietDetail) => (
                <TableRow key={diet.id} className="border-rose-100">
                  <TableCell className="text-rose-900">{diet.memberName}</TableCell>
                  <TableCell className="text-rose-700 max-w-md truncate">{diet.dietPlan}</TableCell>
                  <TableCell className="text-rose-700">{diet.createdDate}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditOpen(diet)}>
                      <Pencil className="w-4 h-4 text-rose-700" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteOpen(diet)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Diet Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white border-rose-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Edit Diet Plan</DialogTitle>
          </DialogHeader>
          <Textarea
            value={dietForm.dietPlan}
            onChange={(e) => setDietForm({ ...dietForm, dietPlan: e.target.value })}
            className="border-rose-200 focus:border-rose-400"
            rows={4}
          />
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-rose-300 text-rose-700">
              Cancel
            </Button>
            <Button onClick={handleEditConfirm} className="bg-rose-600 hover:bg-rose-700">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Diet Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white border-rose-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Delete Diet Plan</DialogTitle>
          </DialogHeader>
          <p className="text-rose-700">
            Are you sure you want to delete this diet plan? This action cannot be undone.
          </p>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-rose-300 text-rose-700">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
