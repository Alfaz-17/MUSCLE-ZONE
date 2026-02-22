"use client"

import { motion } from "framer-motion"
import { PremiumFooter } from "@/components/premium-footer"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@musclezone.com",
    href: "mailto:info@musclezone.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Muscle Zone, Near Nilambag Circle, Bhavnagar, Gujarat - 364001",
    href: "https://maps.google.com?q=Muscle+Zone+Bhavnagar",
  },
]

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">

      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
                Get in Touch
              </span>
              <h1 className="font-serif text-4xl md:text-6xl mb-8">
                We&apos;re here to help you grow.
              </h1>
              <p className="text-muted-foreground text-lg mb-12 max-w-lg">
                Have questions about our products or need supplement advice?
                Reach out to us and our team will get back to you shortly.
              </p>

              <div className="space-y-8 mb-12">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 border border-primary/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        target={item.label === "Address" ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="text-lg hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                  Follow Us
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                      aria-label={link.label}
                    >
                      <link.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card p-8 lg:p-12 border border-border"
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs tracking-widest uppercase">Name</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-widest uppercase">Email</label>
                    <input
                      type="email"
                      className="w-full bg-transparent border-0 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-transparent border-0 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors mt-4"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] grayscale brightness-75 bg-muted flex items-center justify-center">
        <div className="text-center p-6">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground tracking-widest uppercase text-sm">Interactive Map coming soon</p>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
