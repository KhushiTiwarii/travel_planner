import Header from '@/components/Header'
import Hero from '@/components/hero'
import React from 'react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
    <Header />
  <main className="flex-grow">
    
    <Hero/>
  </main>
  
</div>
  )
}
