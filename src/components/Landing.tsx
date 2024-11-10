'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Home, Map, Gift, ArrowRight } from "lucide-react"
import Header from "@/components/Header"

export default function Landing() {
  const router = useRouter()

  const handleCardClick = (route: string) => {
    router.push(route)
  }

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Travel Sustainably, Explore Responsibly
          </h2>
          <p className="text-xl text-green-600 mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for eco-friendly travel planning and carbon footprint management.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-full transition-colors duration-300">
            Start Your Eco Journey
          </Button>
        </section>

        <section id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { title: "Carbon Calculator", icon: Calculator, route: "/FreeTravelCarbonCalculator", description: "Track and offset your travel emissions with our easy-to-use carbon calculator." },
            { title: "Eco Accommodations", icon: Home, route: "/EcoAccommodations", description: "Discover and book sustainable lodging options that minimize your environmental impact." },
            { title: "Green Itineraries", icon: Map, route: "/itinerary", description: "Plan your trips with eco-friendly activities and transportation options." },
            { title: "Eco Donations", icon: Gift, route: "/donation", description: "Support environmental causes and offset your carbon footprint through donations." }
          ].map((feature, index) => (
            <Card key={index} onClick={() => handleCardClick(feature.route)} className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-green-100 border-2">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-green-600 mb-2" />
                <CardTitle className="text-green-800 text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="about" className="text-center mb-16 bg-green-50 py-12 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold text-green-800 mb-4">About TravEco Eco Travel</h2>
          <p className="text-lg text-green-600 mb-8 max-w-3xl mx-auto">
            We&apos;re passionate about making sustainable travel accessible to everyone. Our platform 
            combines cutting-edge technology with eco-conscious practices to help you explore the 
            world while minimizing your environmental impact.
          </p>
          <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-100 rounded-full transition-colors duration-300">
            Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-green-800 mb-8">Join the Eco-Travel Movement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semib

old text-green-800 mb-2">Reduce Your Footprint</h3>
              <p className="text-green-600">Make informed choices to minimize your environmental impact while traveling.</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Support Local Communities</h3>
              <p className="text-green-600">Contribute to sustainable tourism that benefits local economies and cultures.</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Discover Eco-Destinations</h3>
              <p className="text-green-600">Explore beautiful, environmentally conscious locations around the world.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 TravEco Eco Travel. All rights reserved.</p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-green-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
    </>
    
  )
}