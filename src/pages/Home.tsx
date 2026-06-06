import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection
        onGetStarted={() => navigate('/products')}
      />
    </div>
  );
};

export default Home;
