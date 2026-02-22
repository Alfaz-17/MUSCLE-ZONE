"use client"

import { motion } from "framer-motion"
import { Plus, Minus, HelpCircle, Package, Truck, CreditCard, RotateCcw } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    category: "General",
    icon: HelpCircle,
    questions: [
      {
        q: "Are your supplements 100% authentic?",
        a: "Absolutely. We are authorized distributors for all brands listed on MuscleZone. Every product comes with a verifiable scratch-and-scan code to ensure 100% authenticity."
      },
      {
        q: "What is the shelf life of your products?",
        a: "Incline typically have a shelf life of 18-24 months from the date of manufacture. We ensure that our inventory follows a strict first-in-first-out policy so you always receive fresh stock."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    icon: Truck,
    questions: [
      {
        q: "How long does delivery take?",
        a: "Orders in metro cities are typically delivered within 2-4 business days. For other regions, it may take 5-7 business days. You will receive a tracking link via SMS and Email once your order is dispatched."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes, we offer free shipping on all orders above ₹999. For orders below that, a nominal shipping fee is applied at checkout."
      }
    ]
  },
  {
    category: "Orders & Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking. Cash on Delivery (COD) is also available for most pincodes."
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 4 hours of placement or until they are dispatched (whichever is earlier). You can cancel directly from your 'My Orders' section."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    icon: RotateCcw,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy for damaged or incorrect items. Due to health and safety reasons, we cannot accept returns for opened supplements or if the seal is broken."
      },
      {
        q: "How long do refunds take?",
        a: "Once a refund is processed, it typically takes 5-7 business days to reflect in your original payment method."
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("General-0")

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif italic tracking-tighter text-zinc-900 mb-6"
          >
            How Can We Assist You?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-xl mx-auto"
          >
            Find answers to common questions about our products, shipping, and services. If you still need help, feel free to reach out to our team.
          </motion.p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {faqs.map((cat, catIndex) => (
            <div key={cat.category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
                <cat.icon className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">
                  {cat.category}
                </h2>
              </div>

              <div className="grid gap-4">
                {cat.questions.map((item, qIndex) => {
                  const id = `${cat.category}-${qIndex}`
                  const isOpen = openIndex === id

                  return (
                    <motion.div
                      key={id}
                      initial={false}
                      className={cn(
                        "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                        isOpen ? "border-primary/20 shadow-xl shadow-primary/5" : "border-zinc-200 shadow-sm"
                      )}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                      >
                        <span className={cn(
                          "text-sm font-bold transition-colors",
                          isOpen ? "text-primary" : "text-zinc-700"
                        )}>
                          {item.q}
                        </span>
                        <div className={cn(
                          "flex-none w-8 h-8 rounded-full flex items-center justify-center transition-all",
                          isOpen ? "bg-primary text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                        )}>
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </button>

                      <div className={cn(
                        "transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <div className="px-6 pb-6 pt-0 text-zinc-500 text-sm leading-relaxed">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-[2.5rem] bg-zinc-900 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-serif text-white italic mb-4">Still have questions?</h3>
            <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
              Our support specialists are standing by to help you with anything you need.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-105"
              >
                Contact Us
              </a>
              <a 
                href="tel:+919876543210" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/10"
              >
                Call +91 9876543210
              </a>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>
    </div>
  )
}
