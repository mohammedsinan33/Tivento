import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import UpcomingEvents from '../components/UpcomingEvents';
import TopCategories from '../components/TopCategories';
import CreateGroupCTA from '../components/CreateGroupCTA';
import Footer from '../components/Footer';

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