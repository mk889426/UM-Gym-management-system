"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Bell, Pill } from "lucide-react"
import type { Member, Bill, Notification, Supplement } from "@/types/gym"

interface StatsCardsProps {
  members: Member[]
  bills: Bill[]
  notifications: Notification[]
  supplements: Supplement[]
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function StatsCards({ members, bills, notifications, supplements }: StatsCardsProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Total Members</CardTitle>
          <Users className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">{members.length}</div>
        </CardContent>
      </Card>

      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Pending Bills</CardTitle>
          <CreditCard className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">{bills.filter((b) => b.status === "pending").length}</div>
        </CardContent>
      </Card>

      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Active Notifications</CardTitle>
          <Bell className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">{notifications.length}</div>
        </CardContent>
      </Card>

      <Card className="bg-white border-rose-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Supplements</CardTitle>
          <Pill className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">{supplements.length}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
