"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function PremiumFooter() {
  const footerLinks = {
    shop: [
      { label: "Protein", href: "/shop?category=Protein" },
      { label: "Pre-Workout", href: "/shop?category=Pre-Workout" },
      { label: "Creatine", href: "/shop?category=Performance" },
      { label: "Recovery", href: "/shop?category=Recovery" },
      { label: "Vitamins", href: "/shop?category=Vitamins" },
    ],
    about: [
      { label: "Our Story", href: "/about" },
      { label: "Why Choose Us", href: "/about" },
      { label: "Blog", href: "#" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping-returns" },
      { label: "Returns", href: "/shipping-returns" },
      { label: "FAQs", href: "/faqs" },
    ],
  }

  return (
    <footer className="bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="font-serif text-xl mb-4">Stay Connected</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Subscribe for exclusive offers, new product drops, and fitness tips.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border-0 border-b border-border py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-xs tracking-[0.15em] uppercase text-primary hover:text-primary/80 transition-opacity">
                Subscribe
              </button>
            </div>
          </motion.div>

          {/* Shop links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-primary">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-primary">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-primary">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <Link href="/">
              <Image src="/logo.png" alt="Muscle Zone" width={120} height={36} className="h-40 w-auto object-contain " />
            </Link>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5 stroke-[1.5]" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span>© 2026 Muscle Zone. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
