import { prisma } from "@/lib/prisma"
import { 
  ArrowRight,
  AlertCircle,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCards } from "@/components/dashboard-cards"
import { AdminBadge } from "@/components/ui/admin-badge"
import Link from "next/link"

async function getDashboardData() {
  const [orderCount, productCount, userCount, totalRevenue, recentOrders, lowStockProducts] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        orderItems: {
          include: { product: true }
        }
      }
    }),
    prisma.product.findMany({
      where: {
        variants: {
          some: {
            stock: { lt: 10 }
          }
        }
      },
      include: { 
        category: true,
        variants: true
      },
      take: 5
    })
  ])

  return {
    orderCount,
    productCount,
    userCount,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentOrders,
    lowStockProducts
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  const stats = [
    {
      label: "Total Revenue",
      value: `INR ${data.totalRevenue.toLocaleString()}`,
      icon: "dollar-sign",
      href: "/admin/orders",
      trend: { value: "12%", positive: true }
    },
    {
      label: "Orders",
      value: `${data.orderCount}`,
      icon: "shopping-bag",
      href: "/admin/orders",
      trend: { value: "8.1%", positive: true }
    },
    {
      label: "Inventory",
      value: `${data.productCount}`,
      icon: "package",
      href: "/admin/products",
      trend: { value: "2", positive: true }
    },
    {
      label: "Total Users",
      value: `${data.userCount}`,
      icon: "users",
      href: "/admin/dashboard",
      trend: { value: "4%", positive: true }
    },
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Section */}
      <DashboardCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Performance & Recent Orders Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mock Sales Chart Area */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">Revenue Forecast</h3>
                <p className="text-xs text-zinc-500 font-medium">Monthly performance overview</p>
              </div>
              <select className="text-xs font-bold border-zinc-200 rounded-lg p-2 bg-zinc-50 outline-none hover:bg-zinc-100 transition-colors">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            
            <div className="h-[240px] w-full relative flex items-end gap-2 px-2">
              {/* Simple CSS-based bar chart for visualization */}
              {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((height, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-zinc-100 group-hover:bg-primary/20 transition-all rounded-t-sm" 
                    style={{ height: `${height}%` }}
                  />
                  {height > 90 && (
                    <div 
                      className="absolute bottom-0 w-full bg-primary rounded-t-sm" 
                      style={{ height: `${height/2}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>Jan</span>
              <span>Mar</span>
              <span>Jun</span>
              <span>Sep</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden text-sm">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-950">Recent Transactions</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-xs">
                            {order.user?.name?.[0] || 'U'}
                          </div>
                          <span className="font-bold text-zinc-900">{order.user?.name || 'Guest'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AdminBadge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'info'}>
                          {order.status}
                        </AdminBadge>
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory & Quick Actions */}
        <div className="space-y-8">
          {/* Inventory Alerts */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-950">Stock Alerts</h3>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            
            <div className="space-y-4">
              {data.lowStockProducts.length > 0 ? (
                data.lowStockProducts.map((product: any) => {
                  const totalStock = product.variants.reduce((acc: number, v: any) => acc + v.stock, 0)
                  return (
                    <div key={product.id} className="p-4 bg-red-50/50 border border-red-100 rounded-lg group hover:bg-red-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-zinc-900 truncate pr-2">{product.name}</span>
                        <span className="text-[10px] font-bold text-red-600 bg-white border border-red-200 px-1.5 py-0.5 rounded">
                          {totalStock} Total
                        </span>
                      </div>
                      <div className="w-full bg-red-200/50 h-1 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${Math.min((totalStock / 10) * 100, 100)}%` }} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.variants.filter((v: any) => v.stock < 10).map((v: any, idx: number) => (
                          <span key={idx} className="text-[8px] font-black uppercase text-zinc-400">
                            {v.quantityLabel}: {v.stock}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-10 text-center">
                  <Package className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-400">Inventory is healthy</p>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="w-full mt-6 text-xs font-bold uppercase tracking-widest h-11 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950">
              Manage Inventory
            </Button>
          </div>

          {/* Business Insights Card */}
          <div className="bg-zinc-950 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
            <h3 className="text-lg font-bold mb-2 relative z-10">Intelligence Report</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-6 relative z-10">Your store conversion rate is <span className="text-primary font-bold">up 4.2%</span> compared to last month. Peak shopping time is between 6 PM - 9 PM.</p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white border-none text-[10px] font-bold uppercase tracking-[0.2em] relative z-10 h-11">
              View Detailed Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
