'use client';

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/Header'
import { CreditCard, HelpCircle, Leaf, DollarSign } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

interface EcoOrganization {
  value: string;
  label: string;
}

export default function DonationPage() {
  const [amount, setAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [selectedOrg, setSelectedOrg] = useState<string>('')

  const handleAmountChange = (value: number) => {
    setAmount(value)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomAmount(value)
    setAmount(parseFloat(value) || 0)
  }

  const handleDonation = () => {
    if (amount > 0 && selectedOrg) {
      toast.success(`Thank you! ₹${amount.toFixed(2)} donated successfully to ${selectedOrg}.`, {
        duration: 5000,
        position: 'top-center',
      })
    } else {
      toast.error('Please select an organization and enter a valid amount.', {
        duration: 5000,
        position: 'top-center',
      })
    }
  }

  const ecoOrganizations: EcoOrganization[] = [
    { value: 'wwf', label: 'World Wildlife Fund' },
    { value: 'greenpeace', label: 'Greenpeace' },
    { value: 'nature_conservancy', label: 'The Nature Conservancy' },
    { value: 'ocean_conservancy', label: 'Ocean Conservancy' },
    { value: 'rainforest_alliance', label: 'Rainforest Alliance' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Toaster />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-green-600 text-white p-6 text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center">
              <Leaf className="mr-2 h-8 w-8" />
              Make a Donation
            </CardTitle>
            <p className="mt-2 text-green-100">Your support helps us protect the environment</p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-800">Choose an amount</h3>
              <div className="flex flex-wrap gap-3">
                {[10, 25, 50, 100].map((value) => (
                  <Button
                    key={value}
                    variant={amount === value ? "default" : "outline"}
                    onClick={() => handleAmountChange(value)}
                    className={`flex-1 ${amount === value ? "bg-green-600 text-white hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                  >
                    ₹ {value}
                  </Button>
                ))}
                <div className="flex-1 min-w-[120px]">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-green-700">Select an organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger id="organization" className="border-green-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Choose an eco-friendly organization" />
                </SelectTrigger>
                <SelectContent>
                  {ecoOrganizations.map((org) => (
                    <SelectItem key={org.value} value={org.value}>{org.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-green-100 rounded-lg p-1">
                <TabsTrigger value="card" className="data-[state=active]:bg-white data-[state=active]:text-green-600 rounded-md transition-all">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="paypal" className="data-[state=active]:bg-white data-[state=active]:text-green-600 rounded-md transition-all">
                  ₹ PayPal
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-green-700">Card number</Label>
                    <div className="relative">
                      <Input id="cardNumber" placeholder="1234 1234 1234 1234" className="pr-12 border-green-300 focus:border-green-500 focus:ring-green-500" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                        {/* Card icons can be added here */}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate" className="text-green-700">Expiration date</Label>
                      <Input id="expirationDate" placeholder="MM / YY" className="border-green-300 focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="securityCode" className="text-green-700">Security code</Label>
                      <div className="relative">
                        <Input id="securityCode" placeholder="CVC" className="border-green-300 focus:border-green-500 focus:ring-green-500" />
                        <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-green-700">Country</Label>
                    <Select defaultValue="india">
                      <SelectTrigger id="country" className="border-green-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="paypal" className="mt-4">
                <div className="text-center py-8 bg-blue-50 rounded-lg">
                  <DollarSign className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                  <p className="text-gray-600">You will be redirected to PayPal to complete your donation.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-green-50 p-6">
            <Button 
              onClick={handleDonation}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Donate ₹{amount.toFixed(2)}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}