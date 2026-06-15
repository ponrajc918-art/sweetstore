import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Products from './components/Products'
import Wholesale from './components/Wholesale'
import WhyChooseUs from './components/WhyChooseUs'
import Reviews from './components/Reviews'
import OrderForm from './components/OrderForm'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminApp from './admin/AdminApp'

// Main public website layout
function PublicSite() {
  return (
    <div className="font-body">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Wholesale />
        <WhyChooseUs />
        <Reviews />
        <OrderForm />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin panel — completely isolated from public site */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public website — all other routes */}
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  )
}
