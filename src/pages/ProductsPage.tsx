import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductSelector from '@/components/ProductSelector';
import { usePackaging } from '@/context/PackagingContext';
import { ProductType } from '@/lib/designRules';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { state, update } = usePackaging();

  const handleProductSelect = (product: ProductType) => {
    update({
      selectedProduct: product,
      dimensions: { ...product.defaultDimensions },
    });
    navigate('/studio');
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
      <ProductSelector
        selectedProduct={state.selectedProduct}
        onSelect={handleProductSelect}
      />
    </div>
  );
};

export default ProductsPage;
