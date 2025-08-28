"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { StatsCards } from "../components/dashboard/StatsCards"
import { MembersTab } from "../components/dashboard/MembersTab"
import { BillingTab } from "../components/dashboard/BillingTab"
import { NotificationsTab } from "../components/dashboard/NotificationsTab"
import { SupplementsTab } from "../components/dashboard/SupplementsTab"
import { DietTab } from "../components/dashboard/DietTab"
import { ReportsTab } from "../components/dashboard/ReportsTab"
import type { Member, Bill, Notification, Supplement, DietDetail } from "../types/Gym"

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "John Doe", username: "johndoe", feePackage: "Premium", joinDate: "2024-01-15" },
    { id: "2", name: "Jane Smith", username: "janesmith", feePackage: "Basic", joinDate: "2024-02-20" },
  ])

  const [bills, setBills] = useState<Bill[]>([
    { id: "1", memberId: "1", memberName: "John Doe", amount: 150, date: "2024-03-01", status: "paid" },
    { id: "2", memberId: "2", memberName: "Jane Smith", amount: 100, date: "2024-03-01", status: "pending" },
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      memberId: "1",
      memberName: "John Doe",
      message: "Your membership expires in 7 days",
      date: "2024-03-15",
    },
  ])

  const [supplements, setSupplements] = useState<Supplement[]>([
    { id: "1", name: "Whey Protein", price: 45.99, stock: 25 },
    { id: "2", name: "Creatine", price: 29.99, stock: 15 },
  ])

  const [dietDetails, setDietDetails] = useState<DietDetail[]>([
    {
      id: "1",
      memberId: "1",
      memberName: "John Doe",
      dietPlan: "High protein, low carb diet with 2500 calories",
      createdDate: "2024-03-01",
    },
  ])

  const handleAddMember = (memberData: Omit<Member, "id" | "joinDate">) => {
    const newMember: Member = {
      id: Date.now().toString(),
      ...memberData,
      joinDate: new Date().toISOString().split("T")[0],
    }
    setMembers([...members, newMember])
  }

  const handleCreateBill = (billData: Omit<Bill, "id" | "memberName" | "status">) => {
    const member = members.find((m) => m.id === billData.memberId)
    const newBill: Bill = {
      id: Date.now().toString(),
      ...billData,
      memberName: member?.name || "Unknown",
      status: "pending",
    }
    setBills([...bills, newBill])
  }

  const handleAddNotification = (notificationData: Omit<Notification, "id" | "memberName">) => {
    const member = members.find((m) => m.id === notificationData.memberId)
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...notificationData,
      memberName: member?.name || "Unknown",
    }
    setNotifications([...notifications, newNotification])
  }

  const handleAddSupplement = (supplementData: Omit<Supplement, "id">) => {
    const newSupplement: Supplement = {
      id: Date.now().toString(),
      ...supplementData,
    }
    setSupplements([...supplements, newSupplement])
  }

  const handleAddDietDetail = (dietData: Omit<DietDetail, "id" | "memberName" | "createdDate">) => {
    const member = members.find((m) => m.id === dietData.memberId)
    const newDietDetail: DietDetail = {
      id: Date.now().toString(),
      ...dietData,
      memberName: member?.name || "Unknown",
      createdDate: new Date().toISOString().split("T")[0],
    }
    setDietDetails([...dietDetails, newDietDetail])
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-rose-900">Gym Management Dashboard</h1>
          <p className="text-rose-700 text-lg">Manage members, billing, supplements, and more</p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards members={members} bills={bills} notifications={notifications} supplements={supplements} />

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-rose-100">
              <TabsTrigger value="members" className="data-[state=active]:bg-rose-200">
                Members
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-rose-200">
                Billing
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-rose-200">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="supplements" className="data-[state=active]:bg-rose-200">
                Supplements
              </TabsTrigger>
              <TabsTrigger value="diet" className="data-[state=active]:bg-rose-200">
                Diet Plans
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-rose-200">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <MembersTab members={members} onAddMember={handleAddMember} />
            </TabsContent>

            <TabsContent value="billing">
              <BillingTab members={members} bills={bills} onCreateBill={handleCreateBill} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsTab
                members={members}
                notifications={notifications}
                onAddNotification={handleAddNotification}
              />
            </TabsContent>

            <TabsContent value="supplements">
              <SupplementsTab supplements={supplements} onAddSupplement={handleAddSupplement} />
            </TabsContent>

            <TabsContent value="diet">
              <DietTab members={members} dietDetails={dietDetails} onAddDietDetail={handleAddDietDetail} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab
                members={members}
                bills={bills}
                notifications={notifications}
                supplements={supplements}
                dietDetails={dietDetails}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
