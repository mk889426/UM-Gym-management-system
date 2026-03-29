"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { StatsCards } from "../components/dashboard/StatsCards"
import { MembersTab } from "../components/dashboard/MembersTab"
import { BillingTab } from "../components/dashboard/BillingTab"
import { NotificationsTab } from "../components/dashboard/NotificationsTab"
import { SupplementsTab } from "../components/dashboard/SupplementsTab"
import { DietTab } from "../components/dashboard/DietTab"
import { ReportsTab } from "../components/dashboard/ReportsTab"
import { Toaster } from "sonner"


export default function DashboardPage() {

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
        <StatsCards />

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="flex flex-col md:flex-row w-full bg-rose-100 p-1 gap-1 rounded-lg">
              <TabsTrigger value="members" className="w-full md:w-auto text-left md:text-center px-3 py-2 md:px-4 md:py-2 rounded-md transition-all data-[state=active]:bg-rose-300">
                Members
              </TabsTrigger>
              <TabsTrigger value="billing" className="w-full md:w-auto text-left md:text-center px-3 py-2 md:px-4 md:py-2 rounded-md transition-all data-[state=active]:bg-rose-300">
                Billing
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full md:w-auto text-left md:text-center px-3 py-2 md:px-4 md:py-2 rounded-md transition-all data-[state=active]:bg-rose-300">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="supplements" className="w-full md:w-auto text-left md:text-center px-3 py-2 md:px-4 md:py-2 rounded-md transition-all data-[state=active]:bg-rose-300">
                Supplements
              </TabsTrigger>
              <TabsTrigger value="diet" className="w-full md:w-auto text-left md:text-center px-3 py-2 md:px-4 md:py-2 rounded-md transition-all data-[state=active]:bg-rose-300">
                Diet Plans
              </TabsTrigger>
              <TabsTrigger value="reports" className="w-full md:w-auto text-left md:text-center px-3 py-2 md:px-4 md:py-2 rounded-md transition-all data-[state=active]:bg-rose-300">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <MembersTab />
            </TabsContent>

            <TabsContent value="billing">
              <BillingTab />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsTab


              />
            </TabsContent>

            <TabsContent value="supplements">
              <SupplementsTab />
            </TabsContent>

            <TabsContent value="diet">
              <DietTab />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
      <Toaster />
    </div>
  )
}
