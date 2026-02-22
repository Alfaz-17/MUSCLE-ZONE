"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, X, Check, Search, Filter, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import ImageUpload from "@/components/image-upload"

interface CategoryClientProps {
  initialCategories: any[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  initialCategories,
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editImageUrl, setEditImageUrl] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = initialCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onAdd = async () => {
    if (!newCategoryName.trim()) return

    try {
      setLoading(true)
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCategoryName,
          imageUrl: newCategoryImageUrl 
        }),
      })

      if (!response.ok) throw new Error("Failed to create category")

      toast.success("Category created successfully")
      setNewCategoryName("")
      setNewCategoryImageUrl("")
      router.refresh()
    } catch (error) {
      toast.error("Error creating category")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete category")

      toast.success("Category deleted")
      router.refresh()
    } catch (error) {
      toast.error("Error deleting category")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (category: any) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditImageUrl(category.imageUrl || "")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
    setEditImageUrl("")
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editName,
          imageUrl: editImageUrl 
        }),
      })

      if (!response.ok) throw new Error("Failed to update category")

      toast.success("Category updated")
      setEditingId(null)
      router.refresh()
    } catch (error) {
      toast.error("Error updating category")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 bg-white border-zinc-200 rounded-xl h-11 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex-1 md:flex-none flex flex-col md:flex-row items-start md:items-end gap-4 bg-white p-4 rounded-2xl border border-zinc-100">
          <div className="w-full md:w-64">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1 mb-2 block">Category Name</label>
            <Input
              placeholder="e.g. WHEY PROTEIN"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-zinc-50 border-zinc-200 rounded-xl h-11 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1 mb-2 block">Visual Asset</label>
            <ImageUpload 
              value={newCategoryImageUrl ? [newCategoryImageUrl] : []}
              disabled={loading}
              onChange={(url) => setNewCategoryImageUrl(url)}
              onRemove={() => setNewCategoryImageUrl("")}
            />
          </div>
          <Button 
            onClick={onAdd} 
            disabled={loading || !newCategoryName.trim()}
            className="w-full md:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mb-[2px]"
          >
            {loading ? "Decrypting..." : "Initialize Category"}
          </Button>
        </div>
      </div>

      {/* Mobile Card View (hidden on lg+) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        <AnimatePresence mode="popLayout">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-zinc-300 uppercase tracking-widest text-xs font-bold bg-white border border-zinc-100 rounded-3xl">
              No categories found
            </div>
          ) : (
            filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingId === category.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="space-y-4">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="h-10 bg-white border-zinc-200 rounded-lg text-zinc-900 focus:ring-primary/20"
                            autoFocus
                          />
                          <ImageUpload 
                            value={editImageUrl ? [editImageUrl] : []}
                            disabled={loading}
                            onChange={(url) => setEditImageUrl(url)}
                            onRemove={() => setEditImageUrl("")}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(category.id)} disabled={loading} className="flex-1 bg-primary text-white h-9 rounded-lg">
                            <Check className="h-4 w-4 mr-2" /> Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} disabled={loading} className="flex-1 border-zinc-200 text-zinc-400 h-9 rounded-lg">
                            <X className="h-4 w-4 mr-2" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase text-center p-1 leading-tight">No<br/>Image</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-zinc-900 text-lg tracking-tight">{category.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 uppercase tracking-widest">
                              {category._count?.products || 0} Products
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase font-medium">
                              {new Date(category.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {editingId !== category.id && (
                    <div className="flex gap-2 ml-2">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(category)} className="h-9 w-9 text-zinc-400 bg-zinc-50 rounded-lg">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)} className="h-9 w-9 text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Table View (hidden below lg) */}
      <div className="hidden lg:block bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="h-14 px-8 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400 w-24">Image</th>
                <th className="h-14 px-8 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Category Name</th>
                <th className="h-14 px-8 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Product Count</th>
                <th className="h-14 px-8 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400">Created Date</th>
                <th className="h-14 px-8 align-middle font-bold text-[10px] tracking-widest uppercase text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <AnimatePresence mode="popLayout">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-24 text-center text-zinc-300 uppercase tracking-widest text-xs font-bold">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <motion.tr
                      key={category.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-zinc-50/40 transition-colors"
                    >
                      <td className="px-8 py-5 align-middle">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 group-hover:border-primary/20 transition-colors">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-zinc-300 uppercase">None</div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 align-middle">
                        {editingId === category.id ? (
                          <div className="flex flex-col gap-4 py-4 min-w-[300px]">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Name"
                              className="h-10 bg-white border-zinc-200 rounded-lg text-zinc-900 max-w-[240px] focus:ring-primary/20"
                              autoFocus
                            />
                            <ImageUpload 
                              value={editImageUrl ? [editImageUrl] : []}
                              disabled={loading}
                              onChange={(url) => setEditImageUrl(url)}
                              onRemove={() => setEditImageUrl("")}
                            />
                            <div className="flex gap-1 mt-1">
                              <Button
                                size="icon"
                                onClick={() => saveEdit(category.id)}
                                disabled={loading}
                                className="h-9 w-9 bg-primary text-white hover:bg-primary/90 rounded-lg"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={cancelEdit}
                                disabled={loading}
                                className="h-9 w-9 border-zinc-200 text-zinc-400 rounded-lg"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                            <span className="font-semibold text-zinc-900 group-hover:text-primary transition-colors text-base tracking-tight italic">
                              {category.name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 align-middle">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border border-zinc-200/50 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-all">
                          {category._count?.products || 0} Products
                        </span>
                      </td>
                      <td className="px-8 py-5 align-middle">
                        <span className="text-zinc-400 text-xs font-medium">
                          {new Date(category.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td className="px-8 py-5 align-middle text-right">
                        {editingId !== category.id && (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <Button
                              variant="ghost" size="icon" onClick={() => startEdit(category)} disabled={loading}
                              className="h-9 w-9 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-all"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" onClick={() => onDelete(category.id)} disabled={loading}
                              className="h-9 w-9 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
