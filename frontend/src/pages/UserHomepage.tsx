"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Search, User as UserIcon, Shield, Phone, Mail } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchUserDetails } from "../features/user/userSlice"
import type { RootState } from "../app/store"
import api from "../api/axios"

type Role = "admin" | "member" | "user"

interface MemberRecord {
  _id: string
  name: string
  email?: string
  phone?: string
  joinDate?: string
  status?: string
}

export default function UserHomepage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [records, setRecords] = useState<MemberRecord[]>([])

  const { details: userDetails, loading, error } = useAppSelector(
    (state: RootState) => state.user
  )

  const dispatch = useAppDispatch()

  const token = useAppSelector((state: RootState) => state.auth.token)


  // Fetch user details on mount
  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [dispatch])

  // Fetch search results (debounced)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setRecords([])
      return
    }

    const fetchRecords = async () => {
      try {
        const authToken = token || localStorage.getItem("token")
        if (!authToken) throw new Error("No auth token")

        const res = await api.get<MemberRecord[]>(
          `/user/search?q=${encodeURIComponent(searchTerm)}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )

        setRecords(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error("Failed to search members", err)
      }
    }

    const delayDebounce = setTimeout(fetchRecords, 500)
    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const getRoleColor = (role?: Role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "member":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "user":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return "—"
    const d = new Date(date)
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
  }

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
            Welcome, {userDetails?.username || "User"}!
          </h1>
          <p className="text-gray-600">
            Manage your profile and search records
          </p>
        </motion.div>

        {/* User Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <UserIcon className="h-5 w-5" />
                Your Details
              </CardTitle>
              <CardDescription>Your current profile information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : userDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Username */}
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-4 w-4 text-rose-600" />
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium break-all">
                          {userDetails.username}
                        </p>
                      </div>
                    </div>
                    {/* User ID */}
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full border border-rose-200" />
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium break-all">
                          {userDetails._id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Role */}
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-rose-600" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        {userDetails.role ? (
                          <Badge className={getRoleColor(userDetails.role)}>
                            {userDetails.role.charAt(0).toUpperCase() +
                              userDetails.role.slice(1)}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                            Unknown
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">No user details found.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Search className="h-5 w-5" />
                Search Records
              </CardTitle>
              <CardDescription>Search by member name</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-rose-200 focus:border-rose-400"
                  />
                </div>

                <div className="space-y-3">
                  {Array.isArray(records) && records.length > 0 ? (
                    records.map((record, index) => (
                      <motion.div
                        key={record._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium text-gray-900">{record.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5" />
                              {record.email || "—"}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5" />
                              {record.phone || "—"}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status
                                ? record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)
                                : "—"}
                            </Badge>
                            <p className="text-xs text-gray-500">
                              Joined: {formatDate(record.joinDate)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : searchTerm ? (
                    <div className="text-center py-8 text-gray-500">
                      No records found matching your search.
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      Start typing to search members…
                    </div>
                  )}


                  {records.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-gray-500">
                      No records found matching your search.
                    </div>
                  )}
                  {!searchTerm && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      Start typing to search members…
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
