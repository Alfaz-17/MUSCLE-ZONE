"use client"

import { motion } from "framer-motion"
import { Truck, RotateCcw, ShieldCheck, MapPin } from "lucide-react"

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Customer Care
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-serif italic tracking-tighter text-zinc-900"
          >
            Shipping & Returns
          </motion.h1>
        </div>

        {/* Content */}
        <div className="grid gap-16">
          {/* Shipping Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif italic text-zinc-900">Delivery Policy</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-600 leading-relaxed">
              <div className="space-y-4">
                <p className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Processing Times</p>
                <p>All orders are processed within 24 hours of confirmation. Orders placed before 2 PM are typically dispatched the same day.</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Shipping Rates</p>
                <p>We offer free standard shipping on all orders above ₹999. A flat rate of ₹99 applies to all orders below the threshold.</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Service Locations</p>
                <p>We deliver to over 25,000 pincodes across India through our premium logistics partners including BlueDart, Delhivery, and Ecom Express.</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Tracking</p>
                <p>Once dispatched, you will receive an AWB (Airway Bill) number via SMS and Email to track your shipment in real-time.</p>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif italic text-zinc-900">Exchange & Returns</h2>
            </div>
            
            <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 italic text-zinc-700 mb-8">
              "Due to the nature of health supplements and for the safety of our customers, we strictly adhere to a no-return policy once a product's seal is broken."
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-600 leading-relaxed">
              <div className="space-y-4">
                <p className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Eligible Scenarios</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Damaged product received during transit</li>
                  <li>Incorrect product delivered</li>
                  <li>Product with less than 3 months expiry</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Resolution Process</p>
                <p>In case of any issues, please share an unboxing video within 48 hours of delivery to our support team at care@musclezone.com.</p>
              </div>
            </div>
          </section>

          {/* Verification Section */}
          <section className="p-8 md:p-12 rounded-[3rem] border-2 border-zinc-100 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <ShieldCheck className="w-10 h-10 text-primary mx-auto md:mx-0" />
              <h3 className="text-xl font-bold text-zinc-900">100% Authenticity Guarantee</h3>
              <p className="text-sm text-zinc-500">Every product shipped from our warehouse is verified for authenticity and quality. We source directly from brands to eliminate middlemen and counterfeits.</p>
            </div>
            <div className="w-px h-20 bg-zinc-100 hidden md:block" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <MapPin className="w-10 h-10 text-zinc-900 mx-auto md:mx-0" />
              <h3 className="text-xl font-bold text-zinc-900">In-Store Verification</h3>
              <p className="text-sm text-zinc-500">You can also visit our physical store to verify products and get expert advice on your supplement stack.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
