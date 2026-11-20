import { useState } from 'react'

import Header from '../components/layout/header'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'

import HeroSection from '../components/home/HeroSection'
import CategorySection from '../components/home/CategorySection'
import FeaturesSection from '../components/home/FeaturesSection'
import FeaturedEvents from '../components/home/FeaturedEvents'
import WhyEllevents from '../components/home/WhyEllevents'
import CallToAction from '../components/home/CallToAction'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handleSearch = () => {
    setSubmittedSearch(searchTerm)

    document.getElementById('featured-events')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <Sidebar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header />
        <Navbar />

        <main>
          <HeroSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
          />

          <CategorySection
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <FeaturesSection />

          <FeaturedEvents
            searchTerm={submittedSearch}
            selectedCategory={selectedCategory}
          />

          <WhyEllevents />
          <CallToAction />
        </main>

        <Footer />
      </div>

      <BottomNav />
    </div>
  )
}

export default Home
