import { StarField } from '@/components/StarField';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { ToastNotification } from '@/components/ToastNotification';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Animated Star Background */}
      <StarField />
      
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating Toast Notifications */}
      <ToastNotification />
    </div>
  );
};

export default Index;
