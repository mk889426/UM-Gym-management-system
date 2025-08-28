export interface Member {
  id: string
  name: string
  username: string
  feePackage: string
  joinDate: string
}

export interface Bill {
  id: string
  memberId: string
  memberName: string
  amount: number
  date: string
  status: "paid" | "pending"
}

export interface Notification {
  id: string
  memberId: string
  memberName: string
  message: string
  date: string
}

export interface Supplement {
  id: string
  name: string
  price: number
  stock: number
}

export interface DietDetail {
  id: string
  memberId: string
  memberName: string
  dietPlan: string
  createdDate: string
}
