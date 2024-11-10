'use client'

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, Home, Map, Gift, CreditCard, Search, Menu, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Carbon Calculator", href: "/FreeTravelCarbonCalculator", icon: Calculator },
  { name: "Eco Accommodation", href: "/EcoAccommodations", icon: Home },
  { name: "Itinerary", href: "/itinerary", icon: Map },
  { name: "Donation", href: "/donation", icon: Gift },
]

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md font-['Montserrat',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="text-2xl font-bold text-green-700">Onestop</div>
            </Link>
            <div className="hidden md:flex ml-10 items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out",
                    pathname === item.href
                      ? "bg-green-100 text-green-800"
                      : "text-green-600 hover:bg-green-50 hover:text-green-800"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-64 border-green-300 focus:border-green-500 focus:ring-green-500"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2 text-green-600 hover:text-green-800 hover:bg-green-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-green-600 hover:text-green-800 hover:bg-green-50"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex items-center bg-green-100 rounded-full px-3 py-1 transition-transform duration-200 ease-in-out transform hover:scale-105">
              <CreditCard className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">1250 pts</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-green-600 hover:text-green-800 hover:bg-green-50">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end">
                <DropdownMenuLabel className="text-green-800">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-green-200" />
                <DropdownMenuItem className="text-green-600 focus:bg-green-50 focus:text-green-800">Profile</DropdownMenuItem>
                <DropdownMenuItem className="text-green-600 focus:bg-green-50 focus:text-green-800">Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-green-600 focus:bg-green-50 focus:text-green-800">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800 hover:bg-green-50">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold text-green-700">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-md text-base font-medium mb-2 transition-colors duration-200 ease-in-out",
                          pathname === item.href
                            ? "bg-green-100 text-green-800"
                            : "text-green-600 hover:bg-green-50 hover:text-green-800"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-center bg-green-100 rounded-full px-4 py-2 transition-transform duration-200 ease-in-out transform hover:scale-105">
                    <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">1250 pts</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}