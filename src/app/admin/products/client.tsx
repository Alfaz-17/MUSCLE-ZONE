"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, X, Search, Image as ImageIcon, Filter, Check, MoreVertical, Package, ShoppingCart } from "lucide-react"
import ImageUpload from "@/components/image-upload"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProductClientProps {
  initialProducts: any[]
  categories: any[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
  initialProducts,
  categories,
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const filteredProducts = initialProducts.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.category.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "all" || p.categoryId === selectedCategory)
  )

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    discount: "",
    tax: "",
    stock: "",
    categoryId: "",
    imageUrls: [] as string[],
    quantity: "",
    flavors: "",
    isBestseller: false,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill required fields")
      return
    }

    try {
      setLoading(true)
      const url = editingId ? `/api/products/${editingId}` : "/api/products"
      const method = editingId ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          mrp: formData.mrp ? parseFloat(formData.mrp) : null,
          discount: formData.discount ? parseFloat(formData.discount) : null,
          tax: formData.tax ? parseFloat(formData.tax) : null,
          stock: parseInt(formData.stock) || 0,
          flavors: formData.flavors ? formData.flavors.split(",").map((f) => f.trim()) : [],
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      toast.success(editingId ? "Product updated" : "Product added")
      
      setFormData({
        name: "", description: "", price: "", mrp: "", discount: "", tax: "", stock: "", categoryId: "", imageUrls: [], quantity: "", flavors: "", isBestseller: false,
      })
      setIsAdding(false)
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (product: any) => {
    const price = product.variants?.[0]?.price ?? product.price ?? 0
    const mrp = product.variants?.[0]?.mrp ?? product.mrp ?? 0
    const stock = product.variants?.[0]?.stock ?? product.stock ?? 0
    const quantity = (product.variants?.[0]?.quantityLabel ?? product.quantity) || ""

    setFormData({
      name: product.name,
      description: product.description || "",
      price: price.toString(),
      mrp: mrp.toString(),
      discount: (product.variants?.[0]?.discount ?? product.discount ?? 0).toString(),
      tax: (product.variants?.[0]?.tax ?? product.tax ?? 0).toString(),
      stock: stock.toString(),
      categoryId: product.categoryId,
      imageUrls: product.imageUrls || [],
      quantity: quantity,
      flavors: (product.variants?.[0]?.flavor) || (product.flavors ? product.flavors.join(", ") : ""),
      isBestseller: product.isBestseller,
    })
    setEditingId(product.id)
    setIsAdding(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const onToggleBestseller = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBestseller: !currentStatus,
          // We need to send other required fields for validation if schema is strict
          // but our updated PATCH handler should handle partials if we refine it
          // For now, let's assume the PATCH needs enough to pass Zod
        }),
      })

      if (!response.ok) throw new Error("Toggle failed")
      toast.success("Elite status updated")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Error updating status")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm("Remove this product?")) return

    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Delete failed")
      toast.success("Product removed")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Error deleting product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-1">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search arsenal..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-zinc-50/50 border-zinc-200 rounded-2xl h-12 focus:bg-white transition-all shadow-sm w-full"
            />
          </div>

          <div className="relative w-full sm:w-48 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl h-12 text-sm appearance-none focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="all">All Divisions</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={() => {
            if (isAdding) {
              setEditingId(null)
              setFormData({
                name: "", description: "", price: "", mrp: "", discount: "", tax: "", stock: "", categoryId: "", imageUrls: [], quantity: "", flavors: "", isBestseller: false,
              })
            }
            setIsAdding(!isAdding)
          }} 
          className={cn(
            "h-12 px-8 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg",
            isAdding ? "bg-zinc-100 text-zinc-900" : "bg-primary text-white shadow-primary/20"
          )}
        >
          {isAdding ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {isAdding ? "Cancel" : "Add Product"}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10">
            <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-10 rounded-[2rem] shadow-xl mb-12">
               <h3 className="text-xl font-serif uppercase tracking-tight mb-8 border-b border-zinc-200 pb-4">
                 {editingId ? "Modify Specimen" : "Register New Asset"}
               </h3>
               <form onSubmit={onSubmit} className="space-y-12">
                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
                       <Package className="h-5 w-5 text-primary" />
                       <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Basic Info</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      <div className="space-y-2 lg:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Product Designation</label>
                        <Input placeholder="WHEY ISOLATE GOLD" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Category Division</label>
                        <select className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl text-sm" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required>
                          <option value="">Select Division</option>
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2 lg:col-span-3">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Nutritional Bio / Description</label>
                        <textarea className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm min-h-[100px]" placeholder="Detailed product specifications..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                      </div>
                      <div className="lg:col-span-3">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1 mb-2 block">Visual Encoding (Images)</label>
                        <ImageUpload value={formData.imageUrls} disabled={loading} onChange={(url) => setFormData({ ...formData, imageUrls: [...formData.imageUrls, url] })} onRemove={(url) => setFormData({ ...formData, imageUrls: formData.imageUrls.filter((u) => u !== url) })} />
                      </div>
                    </div>
                  </div>

                  {/* Variants Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
                       <Filter className="h-5 w-5 text-primary" />
                       <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Variants</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Flavor Profile Matrix</label>
                        <Input placeholder="CHOCOLATE, STRAWBERRY, VANILLA" value={formData.flavors} onChange={(e) => setFormData({ ...formData, flavors: e.target.value })} className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Weight / Size (Quantity)</label>
                        <Input placeholder="1 KG / 2.2 LBS" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Stock Reserve</label>
                        <Input type="number" placeholder="50" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="flex items-center justify-between gap-3 bg-white/50 p-4 border border-zinc-200 rounded-xl h-12 self-end">
                        <label htmlFor="isBestseller" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-zinc-500">Elite Stock (Bestseller)</label>
                        <button
                          type="button"
                          id="isBestseller"
                          onClick={() => setFormData({ ...formData, isBestseller: !formData.isBestseller })}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            formData.isBestseller ? "bg-primary" : "bg-zinc-200"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              formData.isBestseller ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
                       <ShoppingCart className="h-5 w-5 text-primary" />
                       <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Pricing</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">MRP (Gross Price)</label>
                        <Input type="number" placeholder="3999" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Selling Price (Final)</label>
                        <Input type="number" placeholder="2999" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Discount (%)</label>
                        <Input type="number" placeholder="25" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="h-12 bg-white rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Tax (%)</label>
                        <Input type="number" placeholder="18" value={formData.tax} onChange={(e) => setFormData({ ...formData, tax: e.target.value })} className="h-12 bg-white rounded-xl" />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-14 bg-zinc-900 hover:bg-primary text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl">
                    {loading ? "PROCESING..." : editingId ? "AUTHORIZE UPDATE" : "CONFIRM DEPLOYMENT"}
                  </Button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Grid Layout (hidden on lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
        {filteredProducts.length === 0 ? (
          <div className="sm:col-span-2 p-20 text-center text-zinc-300 uppercase tracking-widest text-xs font-bold bg-white border border-zinc-100 rounded-[2.5rem]">
            Zero inventory detected
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div key={product.id} layout className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-5 hover:border-primary/20 transition-all">
              <div className="flex gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                  {product.imageUrls?.[0] ? <img src={product.imageUrls[0]} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-6 text-zinc-200" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-primary/60">{product.category.name}</span>
                    {product.isBestseller && <span className="bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Elite</span>}
                  </div>
                  <h4 className="font-bold text-zinc-900 text-lg leading-tight line-clamp-2 italic">{product.name}</h4>
                  <div className="flex flex-col">
                    <p className="font-serif text-primary text-xl">
                      ₹{(product.variants?.[0]?.price ?? product.price ?? 0).toLocaleString()}
                    </p>
                    {(product.variants?.[0]?.mrp ?? product.mrp) && (product.variants?.[0]?.mrp ?? product.mrp) > (product.variants?.[0]?.price ?? product.price ?? 0) && (
                      <p className="text-[10px] text-zinc-400 line-through tracking-tighter decoration-primary/40">
                        MRP: ₹{(product.variants?.[0]?.mrp ?? product.mrp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-50">
                <div className="bg-zinc-50 p-2 rounded-xl text-center">
                  <p className="text-[8px] uppercase font-bold text-zinc-400 tracking-wider">Reserve</p>
                  <p className={cn("text-xs font-bold", (product.variants?.[0]?.stock ?? product.stock ?? 0) < 10 ? "text-red-500" : "text-zinc-600")}>
                    {product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) ?? product.stock ?? 0} Units
                  </p>
                </div>
                <div className="bg-zinc-50 p-2 rounded-xl text-center">
                  <p className="text-[8px] uppercase font-bold text-zinc-400 tracking-wider">Mass</p>
                  <p className="text-xs font-bold text-zinc-600">
                    {(product.variants?.[0]?.quantityLabel ?? product.quantity) || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" onClick={() => onEdit(product)} className="flex-1 h-10 rounded-xl border-zinc-200 text-zinc-500 font-bold uppercase text-[9px] tracking-widest">
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Modify
                </Button>
                <Button variant="outline" onClick={() => onDelete(product.id)} className="flex-1 h-10 rounded-xl border-zinc-200 text-red-500 hover:bg-red-50 hover:border-red-100 font-bold uppercase text-[9px] tracking-widest">
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table view (hidden on smaller than lg) */}
      <div className="hidden lg:block bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Specimen</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Designation</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Division</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Valuation</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Reserve</th>
                <th className="h-16 px-6 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-6 align-middle">
                    <div className="h-14 w-14 rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm hover:border-primary/50 transition-colors cursor-pointer group/img relative">
                      {p.imageUrls?.[0] ? (
                        <img src={p.imageUrls[0]} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-full h-full p-4 text-zinc-100" />
                      )}
                      {p.imageUrls && p.imageUrls.length > 1 && (
                        <div className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[8px] font-bold px-1 rounded-sm">
                          +{p.imageUrls.length - 1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors text-base italic">{p.name}</span>
                      <span className="text-[10px] font-mono text-zinc-300 uppercase">MZ-{p.id.slice(-6).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">{p.category?.name}</span>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex flex-col">
                      <span className="font-serif text-lg text-zinc-900">
                        ₹{(p.variants?.[0]?.price ?? p.price ?? 0).toLocaleString()}
                      </span>
                      {(p.variants?.[0]?.mrp ?? p.mrp) && (p.variants?.[0]?.mrp ?? p.mrp) > (p.variants?.[0]?.price ?? p.price ?? 0) && (
                        <span className="text-[10px] text-zinc-400 line-through tracking-tighter decoration-primary/40">
                          ₹{(p.variants?.[0]?.mrp ?? p.mrp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex flex-col">
                      <span className={cn("text-xs font-bold", (p.variants?.[0]?.stock ?? p.stock ?? 0) < 10 ? "text-red-500" : "text-zinc-700")}>
                        {p.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) ?? p.stock ?? 0} Units
                      </span>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold">
                        {(p.variants?.[0]?.quantityLabel ?? p.quantity) || "OS"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => onToggleBestseller(p.id, p.isBestseller)}
                        className={cn(
                          "h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
                          p.isBestseller 
                            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" 
                            : "bg-zinc-100 text-zinc-400 border-zinc-200 hover:bg-zinc-200"
                        )}
                        title={p.isBestseller ? "Remove from Elite" : "Mark as Elite"}
                      >
                        {p.isBestseller ? "Elite" : "Standard"}
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(p)} className="h-9 w-9 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-lg border-zinc-200">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)} className="h-9 w-9 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg border-zinc-200">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
