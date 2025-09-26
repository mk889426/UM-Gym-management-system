"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Pill, Edit2, Trash2, Edit } from "lucide-react"
import type { Supplement } from "../../types/Gym"
import { toast } from "sonner"
import {
  createSupplement,
  listSupplements,
  updateSupplement,
  deleteSupplement,
} from "../../features/admin/adminSlice"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog"



export function SupplementsTab() {
  const dispatch = useAppDispatch()
  const { supplements, loading, error } = useAppSelector((s) => s.admin)

  // ✅ Add form state
  const [addForm, setAddForm] = useState({ name: "", price: "", stock: "" })
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // ✅ Edit form state
  const [editForm, setEditForm] = useState({ id: "", name: "", price: "", stock: "" })
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null)

  useEffect(() => {
    dispatch(listSupplements())
  }, [dispatch])

  // ✅ Add supplement
  const handleAdd = () => {
    if (!addForm.name || !addForm.price) {
      toast.error("Name and Price are required")
      return
    }

    dispatch(
      createSupplement({
        name: addForm.name,
        price: parseFloat(addForm.price),
        stock: addForm.stock ? parseInt(addForm.stock, 10) : 0,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Supplement added successfully")
        setAddForm({ name: "", price: "", stock: "" })
        setAddDialogOpen(false)
      })
      .catch((err) => toast.error(err || "Failed to add supplement"))
  }

  // ✅ Open edit dialog with prefilled values
  const handleEditOpen = (supplement: Supplement) => {
    console.log("handle edit open clicked")
    setEditForm({
      id: supplement._id,
      name: supplement.name,
      price: supplement.price.toString(),
      stock: supplement.stock?.toString() || "",
    })
    setEditDialogOpen(true)
  }

  // ✅ Update supplement
  const handleUpdate = () => {
    if (!editForm.id || !editForm.name || !editForm.price) {
      toast.error("Name and Price are required")
      return
    }

    dispatch(
      updateSupplement({
        id: editForm.id,
        name: editForm.name,
        price: parseFloat(editForm.price),
        stock: editForm.stock ? parseInt(editForm.stock, 10) : 0,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Supplement updated successfully")
        setEditDialogOpen(false)
      })
      .catch((err) => toast.error(err || "Failed to update supplement"))
  }

  const handleDeleteOpen = (supplement: Supplement) => {
    console.log("handle delete open clicked")
    setSelectedSupplement(supplement)
    setDeleteOpen(true)

  }

  const handleDeleteConfirm = () => {
    console.log("handle delete confirm clicked")
    if (!selectedSupplement) return

    console.log("selected supplement :: ", selectedSupplement)

    dispatch(deleteSupplement(selectedSupplement._id))
      .unwrap()
      .then(() => {
        toast.success("Supplement deleted successfully")
        setDeleteOpen(false)
        setSelectedSupplement(null)
      })
      .catch((err) => toast.error(err || "Failed to delete supplement"))
  }

  return (
    <div className="space-y-6">
      {/* Add Supplement Card */}
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Supplements</CardTitle>
          <CardDescription className="text-rose-700">
            Manage your supplement inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <Pill className="w-4 h-4 mr-2" />
            Add Supplement
          </Button>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Supplements Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-rose-800">Name</TableHead>
                <TableHead className="text-rose-800">Price</TableHead>
                <TableHead className="text-rose-800">Stock</TableHead>
                <TableHead className="text-rose-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplements.map((supplement: Supplement) => (
                <TableRow key={supplement._id} className="border-rose-100">
                  <TableCell className="text-rose-900 max-w-[200px] truncate" title={supplement.name}>
                    {supplement.name}
                  </TableCell>
                  <TableCell className="text-rose-700">₹{supplement.price}</TableCell>
                  <TableCell className="text-rose-700">{supplement.stock}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOpen(supplement)}
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteOpen(supplement)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {supplements.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-rose-700">
                    No supplements found
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-rose-700">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Supplement</DialogTitle>
            <DialogDescription>Fill in the details to add a new supplement.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={addForm.price}
                onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                value={addForm.stock}
                onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplement</DialogTitle>
            <DialogDescription>Update supplement details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                value={editForm.stock}
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white border-rose-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Delete Supplement</DialogTitle>
          </DialogHeader>

          <p className="text-rose-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedSupplement?.name}</span>? This action cannot be undone.
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
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
