import React from 'react';
import Header from '@/components/LandingPage/Header';
import Hero from '../components/LandingPage/Hero';
import HowItWorks from '../components/LandingPage/HowItWorks';
import UpcomingEvents from '../components/LandingPage/UpcomingEvents';
import TopCategories from '../components/LandingPage/TopCategories';
import CreateGroupCTA from '../components/LandingPage/CreateGroupCTA';
import Footer from '../components/LandingPage/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <UpcomingEvents />
      <TopCategories />
      <CreateGroupCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;