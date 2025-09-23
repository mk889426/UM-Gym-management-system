"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Pill } from "lucide-react"
import type { Supplement } from "../../types/Gym"
import { toast } from "sonner"

interface SupplementsTabProps {
  supplements: Supplement[]
  onAddSupplement: (supplement: Omit<Supplement, "id">) => void
}

export function SupplementsTab() {
  const [supplementForm, setSupplementForm] = useState({ name: "", price: "", stock: "" })

  const handleAddSupplement = () => {
    if (!supplementForm.name || !supplementForm.price) {
      // toast({ title: "Error", description: "Name and price are required", variant: "destructive" })
      toast.error("Name and price are required");
      return
    }

    // onAddSupplement({
    //   name: supplementForm.name,
    //   price: Number.parseFloat(supplementForm.price),
    //   stock: Number.parseInt(supplementForm.stock) || 0,
    // })

    setSupplementForm({ name: "", price: "", stock: "" })
    // toast({ title: "Success", description: "Supplement added successfully" })
    toast.success("Supplement added successfully");
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Add Supplement</CardTitle>
          <CardDescription className="text-rose-700">Add a new supplement to inventory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplementName" className="text-rose-800">
                Name
              </Label>
              <Input
                id="supplementName"
                value={supplementForm.name}
                onChange={(e) => setSupplementForm({ ...supplementForm, name: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplementPrice" className="text-rose-800">
                Price ($)
              </Label>
              <Input
                id="supplementPrice"
                type="number"
                step="0.01"
                value={supplementForm.price}
                onChange={(e) => setSupplementForm({ ...supplementForm, price: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplementStock" className="text-rose-800">
                Stock
              </Label>
              <Input
                id="supplementStock"
                type="number"
                value={supplementForm.stock}
                onChange={(e) => setSupplementForm({ ...supplementForm, stock: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
          </div>
          <Button onClick={handleAddSupplement} className="bg-rose-600 hover:bg-rose-700">
            <Pill className="w-4 h-4 mr-2" />
            Add Supplement
          </Button>
        </CardContent>
      </Card>

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
                <TableHead className="text-rose-800">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {supplements.map((supplement) => (
                <TableRow key={supplement.id} className="border-rose-100">
                  <TableCell className="text-rose-900">{supplement.name}</TableCell>
                  <TableCell className="text-rose-700">${supplement.price}</TableCell>
                  <TableCell className="text-rose-700">{supplement.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={supplement.stock > 10 ? "default" : supplement.stock > 0 ? "secondary" : "destructive"}
                      className={
                        supplement.stock > 10
                          ? "bg-green-100 text-green-800"
                          : supplement.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {supplement.stock > 10 ? "In Stock" : supplement.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
