import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api } from "@/lib/api"

function App() {
  const [totalSpent,setTotalSpent] = useState(0);


  useEffect(() => {
    async function fetchTotal(){
      const res = await api.expenses["total-spent"].$get()
      const data = await res.json()
      setTotalSpent(data.total)
    }
    fetchTotal()
  },[])

  return (
    <>
<Card className="[w-350px] m-auto">
  <CardHeader>
    <CardTitle>Total Spent</CardTitle>
    <CardDescription>The tottal amount you've spent</CardDescription>
  </CardHeader>
  <CardContent>{totalSpent}</CardContent>
</Card>
    </>
  )
}

export default App
