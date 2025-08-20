// src/screens/Home.tsx
import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import MenuPreview from '../components/MenuPreview'
import Testimonials from '../components/Testimonials'
import ReservationCTA from '../components/ReservationCTA'

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Hero />
      <Features />
      <MenuPreview />
      <Testimonials />
      <ReservationCTA />
    </div>
  )
}
