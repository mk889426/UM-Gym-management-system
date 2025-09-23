
export interface Member {
  _id: string;               // ✅ use _id to match backend
  user: {
    _id: string;
    username: string;
  };
  name: string;
  contact: string;
  address: string;
  feePackage: string;
  joinDate: string;          // ✅ date as string
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
