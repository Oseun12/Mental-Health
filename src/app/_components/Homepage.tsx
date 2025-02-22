import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Introduction from './Introduction'
import Introduction2 from './Introduction2'
import Popup from './Popup'
import TestimonialSlider from './TestimonialSlider'
import Faq from './Faq'
import Footer from './Footer'

function Homepage() {
  return (
    <div>
        <Header/>
        <Hero/>
        <Introduction/>
        <Introduction2/>
        <Popup/>
        <TestimonialSlider/>
        <Faq/>
        <Footer/>
    </div>
  )
}

export default Homepage