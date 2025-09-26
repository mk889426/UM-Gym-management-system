"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useAppDispatch } from "../../hooks";
import type { RootState } from "../../app/store";
import { fetchMembers, promoteToMember, updateMember, deleteMember } from "../../features/admin/adminSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import type { Member } from "../../types/Gym";



export function MembersTab() {
  const dispatch = useAppDispatch();
  const { members, member, loading } = useSelector((state: RootState) => state.admin);

  const [memberForm, setMemberForm] = useState({
    name: "",
    username: "",
    contact: "",
    address: "",
    feePackage: "",
    joinDate: "",   // ✅ added
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Member | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);




  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  console.log("members : :", members)

  const handleAddMember = async () => {
    const { name, username, contact, address, feePackage } = memberForm;

    if (!name || !username || !contact || !address || !feePackage) {
      toast.error("All fields are required");
      return;
    }

    try {
      await dispatch(promoteToMember({
        username,
        name,
        contact,
        address,
        feePackage,
        joinDate: memberForm.joinDate || new Date().toISOString(), // ✅ send if provided
      })).unwrap();


      toast.success("Member promoted successfully");
      setMemberForm({
        name: "",
        username: "",
        contact: "",
        address: "",
        feePackage: "",
        joinDate: "", // ✅ reset
      });

    } catch (err: any) {
      toast.error(err.message || "Failed to promote member");
    }
  };


  const handleUpdateMember = async () => {
    if (!editForm) return;

    try {
      await dispatch(updateMember({ id: editForm._id, updates: editForm })).unwrap();
      toast.success("Member updated successfully");
      setEditOpen(false);
      setEditForm(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update member");
    }
  };


  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    try {
      await dispatch(deleteMember(selectedMember._id)).unwrap();
      toast.success("Member deleted successfully");
      setDeleteOpen(false);
      setSelectedMember(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete member");
    }
  };



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
              <Label htmlFor="name" className="text-rose-800">Full Name</Label>
              <Input id="name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} className="border-rose-200 focus:border-rose-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-rose-800">Username</Label>
              <Input id="username" value={memberForm.username} onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })} className="border-rose-200 focus:border-rose-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-rose-800">Contact Number</Label>
              <Input id="contact" value={memberForm.contact} onChange={(e) => setMemberForm({ ...memberForm, contact: e.target.value })} className="border-rose-200 focus:border-rose-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-rose-800">Address</Label>
              <Input id="address" value={memberForm.address} onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })} className="border-rose-200 focus:border-rose-400" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="feePackage" className="text-rose-800">Fee Package</Label>
              <Select value={memberForm.feePackage} onValueChange={(value) => setMemberForm({ ...memberForm, feePackage: value })}>
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
            <div className="space-y-2">
              <Label htmlFor="joinDate" className="text-rose-800">Joining Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={memberForm.joinDate}
                onChange={(e) => setMemberForm({ ...memberForm, joinDate: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
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
                <TableHead className="text-rose-800">Joining Date</TableHead>
                <TableHead className="text-rose-800">Package</TableHead>
                <TableHead className="text-rose-800">Contact</TableHead>
                <TableHead className="text-rose-800">Address</TableHead>
                <TableHead className="text-rose-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-rose-700">
                      Loading members...
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-rose-700">
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <motion.tr
                      key={member._id} // ✅ use _id
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border-rose-100"
                    >
                      <TableCell className="text-rose-900">{member.name}</TableCell>
                      <TableCell className="text-rose-700">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                          {member.feePackage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-rose-700">{member.contact}</TableCell>
                      <TableCell className="text-rose-700">{member.address}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
                            onClick={() => {
                              setEditForm(member);
                              setEditOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
                            onClick={() => {
                              setSelectedMember(member);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}

              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white border-rose-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Edit Member</DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName" className="text-rose-800">Full Name</Label>
                  <Input
                    id="editName"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editContact" className="text-rose-800">Contact</Label>
                  <Input
                    id="editContact"
                    value={editForm.contact}
                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAddress" className="text-rose-800">Address</Label>
                  <Input
                    id="editAddress"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editFeePackage" className="text-rose-800">Fee Package</Label>
                  <Select
                    value={editForm.feePackage}
                    onValueChange={(value) => setEditForm({ ...editForm, feePackage: value })}
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
                <div className="space-y-2">
                  <Label htmlFor="editJoinDate" className="text-rose-800">Joining Date</Label>
                  <Input
                    id="editJoinDate"
                    type="date"
                    value={editForm.joinDate.split("T")[0]}
                    onChange={(e) => setEditForm({ ...editForm, joinDate: e.target.value })}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} className="bg-rose-600 hover:bg-rose-700">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white border-rose-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Delete Member</DialogTitle>
          </DialogHeader>

          <p className="text-rose-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedMember?.name}</span>?
            This action cannot be undone.
          </p>

          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

          <Toaster />
    </div>
  );
}
