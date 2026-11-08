import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import AboutUs from './components/AboutUs.jsx'
import Features from './components/Features.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="cc-page">
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
