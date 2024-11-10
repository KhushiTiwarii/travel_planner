'use client'

import React from "react"
import { Leaf, Plane, Recycle, TreePine, Wind, Droplets } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const ecoDestinations = [
    {
      name: "Costa Rica",
      quote: "Explore lush rainforests and pristine beaches",
      color: "bg-green-200",
      icon: <TreePine className="h-12 w-12 text-green-600 mb-4" />
    },
    {
      name: "Iceland",
      quote: "Witness the power of renewable geothermal energy",
      color: "bg-blue-200",
      icon: <Wind className="h-12 w-12 text-blue-600 mb-4" />
    },
    {
      name: "Palau",
      quote: "Dive into crystal-clear waters of a marine sanctuary",
      color: "bg-teal-200",
      icon: <Droplets className="h-12 w-12 text-teal-600 mb-4" />
    }
  ]


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900">
      <header className="px-4 lg:px-6 h-20 flex items-center justify-between border-b border-green-200 bg-white/80 backdrop-blur-md fixed w-full z-10 transition-all duration-300 ease-in-out">
        <Link href="/" className="flex items-center justify-center group">
          <Leaf className="h-8 w-8 text-green-600 transition-transform group-hover:rotate-45" />
          <span className="ml-2 text-2xl font-bold text-green-800 group-hover:text-green-600 transition-colors">OneStop</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="#about" className="text-green-700 hover:text-green-900 transition-colors">About</Link>
          <Link href="#destinations" className="text-green-700 hover:text-green-900 transition-colors">Destinations</Link>
          <Link href="#eco-tips" className="text-green-700 hover:text-green-900 transition-colors">Eco Tips</Link>
        </nav>
        <Button asChild>
          <Link href="/login" className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            Join Now
          </Link>
        </Button>
      </header>
      <main className="flex-1 pt-20">
        <section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-green-900 drop-shadow-lg animate-fade-in-down">
                Travel Sustainably, Explore Responsibly
              </h1>
              <p className="mx-auto max-w-[700px] text-green-800 text-xl md:text-2xl lg:text-3xl drop-shadow animate-fade-in-up">
                Plan your eco-friendly adventure with OneStop
              </p>
              <Button asChild className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 relative overflow-hidden group">
                <Link href="/login">
                  <span className="relative z-10">Start Your Green Journey</span>
                  <span className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 animate-gradient-x"></div>
          </div>
        </section>

        <section id="about" className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-green-800">
              About OneStop Eco Travel
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Plane className="h-16 w-16 text-green-600 mb-6" />, title: "Sustainable Transportation", description: "We prioritize eco-friendly transportation options to minimize your carbon footprint while exploring the world." },
                { icon: <Leaf className="h-16 w-16 text-green-600 mb-6" />, title: "Green Accommodations", description: "Stay in eco-lodges and sustainable hotels that are committed to environmental conservation and local community support." },
                { icon: <Recycle className="h-16 w-16 text-green-600 mb-6" />, title: "Responsible Tourism", description: "Learn about and participate in local conservation efforts to make a positive impact on the destinations you visit." }
              ].map((item, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-8 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    {item.icon}
                    <h3 className="text-2xl font-semibold text-green-800 mb-4">{item.title}</h3>
                    <p className="text-green-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="destinations" className="w-full py-16 md:py-24 bg-green-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-green-900">
              Eco-Friendly Destinations
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {ecoDestinations.map((item, index) => (
                <div key={index} className={`${item.color} rounded-lg p-8 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105`}>
                  <div className="flex flex-col items-center text-center">
                    {item.icon}
                    <h3 className="text-2xl font-semibold text-green-800 mb-4">{item.name}</h3>
                    <p className="text-green-700">{item.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="eco-tips" className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-green-900">
              Eco-Travel Tips
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Plane className="h-16 w-16 text-green-600 mb-6" />, title: "Choose Eco-Friendly Transport", description: "Opt for trains, electric vehicles, or bicycles to reduce your carbon footprint while exploring." },
                { icon: <Recycle className="h-16 w-16 text-green-600 mb-6" />, title: "Reduce, Reuse, Recycle", description: "Minimize waste by using reusable items and properly disposing of trash during your travels." },
                { icon: <TreePine className="h-16 w-16 text-green-600 mb-6" />, title: "Support Local Conservation", description: "Engage with and support local organizations working to protect natural habitats and wildlife." }
              ].map((item, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-8 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    {item.icon}
                    <h3 className="text-2xl font-semibold text-green-800 mb-4">{item.title}</h3>
                    <p className="text-green-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 bg-green-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-green-200">OneStop Eco Travel is committed to promoting sustainable and responsible tourism worldwide.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-green-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#about" className="text-green-200 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#destinations" className="text-green-200 hover:text-white transition-colors">Destinations</Link></li>
                <li><Link href="#eco-tips" className="text-green-200 hover:text-white transition-colors">Eco Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-green-200">Email: info@onestop-eco.com</p>
              <p className="text-green-200">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {['facebook', 'instagram', 'twitter'].map((social) => (
                  <a key={social} href="#" className="text-green-200 hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={
                        social === 'facebook' 
                          ? "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" 
                          : social === 'instagram'
                          ? "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          : "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                      } clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-green-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8" />
              <span className="text-2xl font-bold">OneStop</span>
            </div>
            <p className="text-green-200 mt-4 md:mt-0">© 2024 OneStop Eco Travel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}