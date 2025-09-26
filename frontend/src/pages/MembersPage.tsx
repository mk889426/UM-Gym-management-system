"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "../hooks"
import { getMemberDashboard } from "../features/member/memberSlice"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Bell,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Apple,
} from "lucide-react"

export default function MemberHomepage() {
  const dispatch = useAppDispatch()
  const {
    dashboardMember,
    notifications,
    dashboardBills,
    dashboardDiets,
    dashboardStatus,
  } = useAppSelector((s) => s.member)

  useEffect(() => {
    dispatch(getMemberDashboard()).then()
  }, [dispatch])

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

  const unreadCount = notifications.filter((n) => !(n as any).read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back, {dashboardMember?.name || "Member"}!
          </h1>
          <p className="text-gray-600">
            Manage your membership, bills, notifications and diet plan
          </p>
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
                  <p className="text-2xl font-bold text-rose-600">
                    {dashboardMember?.feePackage || "N/A"}
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    $
                    {dashboardBills
                      .filter((b) => b.status === "paid")
                      .reduce((sum, b) => sum + b.amount, 0)}
                  </p>
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {dashboardBills.length > 0
                      ? new Date(
                          dashboardBills[dashboardBills.length - 1].date
                        ).toLocaleDateString()
                      : "-"}
                  </p>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {unreadCount}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with your billing and membership
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {dashboardStatus === "loading" ? (
                <p className="text-gray-500">Loading notifications...</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n, index) => (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg transition-colors bg-rose-50 border-rose-200`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-rose-200">
                          {getNotificationIcon("general")}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">
                              Notification
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(n.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1 text-gray-700">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-gray-500">No notifications yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Bills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="text-rose-800">My Bills</CardTitle>
              <CardDescription>All your membership bills</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {dashboardStatus === "loading" ? (
                <p className="text-gray-500">Loading bills...</p>
              ) : dashboardBills.length === 0 ? (
                <p className="text-gray-500">No bills yet.</p>
              ) : (
                <div className="space-y-4">
                  {dashboardBills.map((bill) => (
                    <div
                      key={bill.id}
                      className={`p-4 border rounded-lg flex justify-between items-center ${
                        bill.status === "paid"
                          ? "bg-green-50 border-green-200"
                          : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          Amount: ${bill.amount}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(bill.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          bill.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {bill.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Diet Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Apple className="h-5 w-5 text-rose-600" />
                My Diet Plans
              </CardTitle>
              <CardDescription>
                Your personalized diet plans created by the professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {dashboardStatus === "loading" ? (
                <p className="text-gray-500">Loading diet plans...</p>
              ) : dashboardDiets.length === 0 ? (
                <p className="text-gray-500">No diet plan assigned yet.</p>
              ) : (
                <div className="space-y-6">
                  {dashboardDiets.map((diet, index) => (
                    <motion.div
                      key={diet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-5 border rounded-lg bg-gradient-to-r from-rose-50 to-white shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-rose-800">
                          Plan #{dashboardDiets.length - index}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(diet.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {diet.dietPlan}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
