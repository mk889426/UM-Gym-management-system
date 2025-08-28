"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Bell } from "lucide-react"
import type { Member, Notification } from "../../types/Gym"
import { toast } from "sonner"

interface NotificationsTabProps {
  members: Member[]
  notifications: Notification[]
  onAddNotification: (notification: Omit<Notification, "id" | "memberName">) => void
}

export function NotificationsTab({ members, notifications, onAddNotification }: NotificationsTabProps) {
  const [notificationForm, setNotificationForm] = useState({ memberId: "", message: "", date: "" })

  const handleAddNotification = () => {
    if (!notificationForm.memberId || !notificationForm.message || !notificationForm.date) {
      toast.error("All fields are required")
      return
    }

    onAddNotification({
      memberId: notificationForm.memberId,
      message: notificationForm.message,
      date: notificationForm.date,
    })

    setNotificationForm({ memberId: "", message: "", date: "" })
    toast.success("Notification added successfully")
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Send Notification</CardTitle>
          <CardDescription className="text-rose-700">Send a notification to a member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notificationMember" className="text-rose-800">
                Member
              </Label>
              <Select
                value={notificationForm.memberId}
                onValueChange={(value) => setNotificationForm({ ...notificationForm, memberId: value })}
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
              <Label htmlFor="notificationDate" className="text-rose-800">
                Date
              </Label>
              <Input
                id="notificationDate"
                type="date"
                value={notificationForm.date}
                onChange={(e) => setNotificationForm({ ...notificationForm, date: e.target.value })}
                className="border-rose-200 focus:border-rose-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-rose-800">
              Message
            </Label>
            <Textarea
              id="message"
              value={notificationForm.message}
              onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
              className="border-rose-200 focus:border-rose-400"
              rows={3}
            />
          </div>
          <Button onClick={handleAddNotification} className="bg-rose-600 hover:bg-rose-700">
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-900">Notifications List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-rose-800">Member</TableHead>
                <TableHead className="text-rose-800">Message</TableHead>
                <TableHead className="text-rose-800">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id} className="border-rose-100">
                  <TableCell className="text-rose-900">{notification.memberName}</TableCell>
                  <TableCell className="text-rose-700">{notification.message}</TableCell>
                  <TableCell className="text-rose-700">{notification.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
