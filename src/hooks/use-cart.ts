import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string // Variant ID
  productId: string
  name: string
  price: number
  quantity: number
  imageUrls?: string[]
  quantityLabel?: string
  flavor?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  addItem: (data: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
      addItem: (data: CartItem) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === data.id)

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.id === data.id ? { ...item, quantity: item.quantity + data.quantity } : item
          )
          set({ items: updatedItems })
        } else {
          set({ items: [...get().items, data] })
        }
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] })
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items
        if (quantity <= 0) {
          set({ items: [...currentItems.filter((item) => item.id !== id)] })
          return
        }
        const updatedItems = currentItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
        set({ items: updatedItems })
      },
      clearCart: () => set({ items: [] }),
      get subtotal() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
