"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Receipt, Bell, Download, Calendar, DollarSign, User, CreditCard } from "lucide-react"

interface BillReceipt {
  id: string
  amount: number
  date: string
  description: string
  status: "paid" | "pending" | "overdue"
  dueDate: string
}

interface Notification {
  id: string
  title: string
  message: string
  date: string
  type: "bill" | "general" | "reminder"
  read: boolean
}

export default function MemberHomepage() {
  const [memberDetails] = useState({
    name: "John Doe",
    membershipType: "Premium",
    memberSince: "2024-01-15",
    nextBillDate: "2024-02-15",
    totalPaid: 1250,
  })

  const [billReceipts] = useState<BillReceipt[]>([
    {
      id: "1",
      amount: 150,
      date: "2024-01-15",
      description: "Monthly Membership Fee",
      status: "paid",
      dueDate: "2024-01-15",
    },
    {
      id: "2",
      amount: 75,
      date: "2024-01-10",
      description: "Personal Training Session",
      status: "paid",
      dueDate: "2024-01-10",
    },
    {
      id: "3",
      amount: 150,
      date: "2024-02-15",
      description: "Monthly Membership Fee",
      status: "pending",
      dueDate: "2024-02-15",
    },
  ])

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Payment Due Soon",
      message: "Your monthly membership fee of $150 is due on February 15th.",
      date: "2024-02-10",
      type: "bill",
      read: false,
    },
    {
      id: "2",
      title: "New Class Available",
      message: "Check out our new HIIT class starting next Monday!",
      date: "2024-02-08",
      type: "general",
      read: true,
    },
    {
      id: "3",
      title: "Membership Renewal",
      message: "Your membership will auto-renew on March 15th.",
      date: "2024-02-05",
      type: "reminder",
      read: false,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bill":
        return <DollarSign className="h-4 w-4" />
      case "general":
        return <Bell className="h-4 w-4" />
      case "reminder":
        return <Calendar className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, Member!</h1>
          <p className="text-gray-600">Manage your membership and view your bills</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-rose-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Membership</p>
                  <p className="text-2xl font-bold text-rose-600">{memberDetails.membershipType}</p>
                </div>
                <User className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">${memberDetails.totalPaid}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Bill</p>
                  <p className="text-2xl font-bold text-yellow-600">{memberDetails.nextBillDate}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bill Receipts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Receipt className="h-5 w-5" />
                Bill Receipts
              </CardTitle>
              <CardDescription>View and download your payment receipts</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {billReceipts.map((receipt, index) => (
                  <motion.div
                    key={receipt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">{receipt.description}</h3>
                        <p className="text-sm text-gray-600">Date: {receipt.date}</p>
                        <p className="text-sm text-gray-600">Due: {receipt.dueDate}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-xl font-bold text-gray-900">${receipt.amount}</p>
                        <Badge className={getStatusColor(receipt.status)}>
                          {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                        </Badge>
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Bell className="h-5 w-5" />
                Bill Notifications
                {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
              </CardTitle>
              <CardDescription>Stay updated with your billing and membership</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read ? "border-gray-200 bg-gray-50" : "border-rose-200 bg-rose-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${notification.read ? "bg-gray-200" : "bg-rose-200"}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">{notification.date}</span>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? "text-gray-600" : "text-gray-700"}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
