"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  useSelector } from "react-redux"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch } from "../../hooks"
import type { RootState } from "../../app/store"
import { promoteToMember } from "../../features/admin/adminSlice"


interface Member {
  id: string
  name: string
  username: string
  feePackage: string
  joinDate: string
}

interface MembersTabProps {
  members: Member[]
  onAddMember: (member: Member) => void
}

export function MembersTab({ members, onAddMember }: MembersTabProps) {
  const dispatch = useAppDispatch();
  const { member, loading, error } = useSelector((state: RootState) => state.admin)
  
  // ✅ Updated form fields
  const [memberForm, setMemberForm] = useState({
    name: "",
    username: "",
    contact: "",
    address: "",
    feePackage: "",
  })

  const handleAddMember = async () => {
    const { name, username, contact, address, feePackage } = memberForm

    if (!name || !username || !contact || !address || !feePackage) {
      toast.error("All fields are required")
      return
    }

    try {
      await dispatch(promoteToMember({
        username,
        name,
        contact,
        address,
        feePackage,
      })).unwrap()

      toast.success("Member promoted successfully")

      if (member) {
        onAddMember({
          id: member._id,
          name: member.name,
          username: member.user, // adjust if needed based on response structure
          feePackage: member.feePackage,
          joinDate: new Date().toLocaleDateString(),
        })
      }

      setMemberForm({
        name: "",
        username: "",
        contact: "",
        address: "",
        feePackage: "",
      })
    } catch (err: any) {
      toast.error(err || "Failed to promote member")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Add New Member</CardTitle>
          <CardDescription className="text-rose-700">Create a new gym member profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-rose-800">
                Full Name
              </Label>
              <Input
                id="name"
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-rose-800">
                Username
              </Label>
              <Input
                id="username"
                value={memberForm.username}
                onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-rose-800">
                Contact Number
              </Label>
              <Input
                id="contact"
                value={memberForm.contact}
                onChange={(e) => setMemberForm({ ...memberForm, contact: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-rose-800">
                Address
              </Label>
              <Input
                id="address"
                value={memberForm.address}
                onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="feePackage" className="text-rose-800">
                Fee Package
              </Label>
              <Select
                value={memberForm.feePackage}
                onValueChange={(value) => setMemberForm({ ...memberForm, feePackage: value })}
              >
                <SelectTrigger className="border-rose-200 focus:border-rose-400">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic - $50/month</SelectItem>
                  <SelectItem value="Premium">Premium - $100/month</SelectItem>
                  <SelectItem value="VIP">VIP - $150/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddMember} className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-rose-800">Name</TableHead>
                <TableHead className="text-rose-800">Username</TableHead>
                <TableHead className="text-rose-800">Package</TableHead>
                <TableHead className="text-rose-800">Join Date</TableHead>
                <TableHead className="text-rose-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {members.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-rose-100"
                  >
                    <TableCell className="text-rose-900">{member.name}</TableCell>
                    <TableCell className="text-rose-700">{member.username}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                        {member.feePackage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-rose-700">{member.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
