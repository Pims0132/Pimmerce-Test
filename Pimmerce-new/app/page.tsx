import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import ThreeBackground from '@/components/ThreeBackground'
import Hero from '@/components/Hero'
import RevealText from '@/components/RevealText'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Services from '@/components/Services'
import ChatWidget from '@/components/ChatWidget'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Cursor />
      <ThreeBackground />
      <Nav />
      <main>
        <Hero />
        <RevealText />
        <About />
        <Projects />
        <Services />
      </main>
      <ChatWidget />
      <Footer />
    </>
  )
}
