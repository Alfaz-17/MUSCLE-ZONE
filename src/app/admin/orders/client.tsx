"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, X, Truck, Package, Clock, ExternalLink, Search, Mail, Phone, ShoppingBag, CreditCard, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

interface OrderClientProps {
  initialOrders: any[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ initialOrders }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredOrders = initialOrders.filter(order => 
    (order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus === "all" || order.status === selectedStatus)
  )

  const onUpdateStatus = async (id: string, updates: any) => {
    try {
      setLoading(id)
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Update failure")

      toast.success("Logistics updated")
      router.refresh()
    } catch (error) {
      toast.error("Protocol Error")
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock className="w-3.5 h-3.5 mr-2" />
      case "Confirmed": return <Package className="w-3.5 h-3.5 mr-2" />
      case "Out for delivery": return <Truck className="w-3.5 h-3.5 mr-2" />
      case "Delivered": return <Check className="w-3.5 h-3.5 mr-2" />
      case "Cancelled": return <X className="w-3.5 h-3.5 mr-2" />
      default: return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-50 text-green-600 border-green-100"
      case "Cancelled": return "bg-red-50 text-red-600 border-red-100"
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-100"
      case "Confirmed": return "bg-blue-50 text-blue-600 border-blue-100"
      case "Out for delivery": return "bg-indigo-50 text-indigo-600 border-indigo-100"
      default: return "bg-zinc-50 text-zinc-400 border-zinc-200"
    }
  }

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
        <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-1">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by mission ID or recipient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-white border-zinc-200 rounded-xl h-12 focus:ring-primary/20 w-full"
            />
          </div>

          <div className="relative w-full sm:w-48 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-11 pr-4 bg-white border border-zinc-200 rounded-xl h-12 text-[11px] font-bold uppercase tracking-widest appearance-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="all">All Missions</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Out for delivery">In Transit</option>
              <option value="Delivered">Completed</option>
              <option value="Cancelled">Aborted</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between px-2 md:px-0">
           <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payload Count: {filteredOrders.length}</span>
        </div>
      </div>

      {/* Mobile view (hidden on lg) */}
      <div className="grid grid-cols-1 gap-6 lg:hidden">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <div className="p-24 text-center text-zinc-300 uppercase tracking-widest text-xs font-bold bg-white border border-zinc-100 rounded-[2.5rem]">
              Mission queue empty
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div key={order.id} layout className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-start border-b border-zinc-50 pb-5">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-zinc-300 uppercase mb-1">#{order.id.slice(-6).toUpperCase()}</p>
                    <h4 className="font-bold text-zinc-900 text-lg leading-none">{order.name}</h4>
                    <div className="flex gap-2 mt-2">
                       <a href={`tel:${order.phone}`} className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase bg-zinc-100 px-2 py-1 rounded-lg border border-zinc-200">
                          <Phone className="w-3 h-3" /> Call
                       </a>
                    </div>
                  </div>
                  <span className={cn("px-4 py-2 rounded-xl text-[9px] font-bold uppercase border flex items-center shadow-sm", getStatusClass(order.status))}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Cargo Pack ({order.orderItems.length})</span>
                    <span className="font-serif text-xl text-zinc-900">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                        <div className="h-10 w-10 bg-white rounded-lg border border-zinc-200 overflow-hidden flex-shrink-0">
                           {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-2 text-zinc-100" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Modify Logistics</label>
                      <select 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-primary/20 appearance-none"
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, { status: e.target.value })}
                        disabled={loading === order.id}
                      >
                        <option value="Pending">Queue: Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for delivery">In Transit</option>
                        <option value="Delivered">Completed</option>
                        <option value="Cancelled">Aborted</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Tracking Protocol</label>
                      <Input 
                        placeholder="TRACKING ID" 
                        defaultValue={order.trackingId || ""} 
                        className="bg-zinc-50 h-11 rounded-xl text-xs font-mono tracking-widest"
                        onBlur={(e) => { if (e.target.value !== order.trackingId) onUpdateStatus(order.id, { trackingId: e.target.value }) }}
                      />
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View (hidden on smaller than lg) */}
      <div className="hidden lg:block bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-900">
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Order ID</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Recipient</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Payload</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Valuation</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Status</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-10 align-middle font-mono text-[10px] font-bold text-zinc-300 group-hover:text-primary transition-colors uppercase">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-10 align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors text-base italic leading-none">{order.name}</span>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{order.phone}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-2 max-w-[150px] leading-relaxed line-clamp-1 italic">{order.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-10 align-middle">
                    <div className="flex -space-x-2 overflow-hidden mb-2">
                      {order.orderItems.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="relative inline-block h-8 w-8 rounded-full border-2 border-white bg-zinc-50 overflow-hidden shadow-sm">
                          {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-2 text-zinc-100" />}
                        </div>
                      ))}
                      {order.orderItems.length > 3 && <div className="relative inline-block h-8 w-8 rounded-full border-2 border-white bg-zinc-900 text-[8px] flex items-center justify-center text-white font-bold">+{order.orderItems.length - 3}</div>}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{order.orderItems.length} Cargo Units</span>
                  </td>
                  <td className="px-6 py-10 align-middle">
                    <div className="flex flex-col">
                      <span className="font-serif text-lg text-zinc-900 whitespace-nowrap">₹{order.totalAmount.toLocaleString()}</span>
                      <span className={cn("text-[9px] font-bold uppercase tracking-tighter mt-1 px-2 py-0.5 rounded bg-zinc-100 w-fit", order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600')}>{order.paymentMethod} / {order.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-10 align-middle">
                    <span className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase border flex items-center w-fit shadow-sm", getStatusClass(order.status))}>{getStatusIcon(order.status)} {order.status}</span>
                  </td>
                  <td className="px-6 py-10 align-middle text-right">
                    <div className="flex flex-col items-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <select className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-[10px] uppercase font-bold tracking-widest outline-none focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer" value={order.status} onChange={(e) => onUpdateStatus(order.id, { status: e.target.value })} disabled={loading === order.id}>
                        <option value="Pending">Queue: Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for delivery">In Transit</option>
                        <option value="Delivered">Completed</option>
                        <option value="Cancelled">Aborted</option>
                      </select>
                      <Input placeholder="TRACKING CODE" defaultValue={order.trackingId || ""} className="w-40 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-[10px] h-10 font-mono tracking-widest" onBlur={(e) => { if (e.target.value !== order.trackingId) onUpdateStatus(order.id, { trackingId: e.target.value }) }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
