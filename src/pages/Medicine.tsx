import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Leaf, 
  Sparkles, 
  Activity,
  Clock,
  Truck,
  Shield,
  Star,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: 'modern' | 'ayurvedic' | 'siddha';
  price: number;
  discountPrice?: number;
  inStock: boolean;
  requiresPrescription: boolean;
  rating: number;
  reviews: number;
  image?: string;
  description: string;
}

const medicines: Medicine[] = [
  {
    id: '1',
    name: 'Dolo 650',
    genericName: 'Paracetamol 650mg',
    brand: 'Micro Labs',
    category: 'modern',
    price: 35,
    discountPrice: 28,
    inStock: true,
    requiresPrescription: false,
    rating: 4.8,
    reviews: 2450,
    description: 'Pain relief and fever reducer'
  },
  {
    id: '2',
    name: 'Chyawanprash',
    genericName: 'Immunity Booster',
    brand: 'Dabur',
    category: 'ayurvedic',
    price: 425,
    discountPrice: 380,
    inStock: true,
    requiresPrescription: false,
    rating: 4.7,
    reviews: 3200,
    description: 'Ayurvedic immunity enhancer with 40+ herbs'
  },
  {
    id: '3',
    name: 'Nilavembu Kudineer',
    genericName: 'Fever & Immunity',
    brand: 'Impcops',
    category: 'siddha',
    price: 120,
    inStock: true,
    requiresPrescription: false,
    rating: 4.6,
    reviews: 890,
    description: 'Traditional Siddha medicine for fever and viral infections'
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    brand: 'USV',
    category: 'modern',
    price: 85,
    discountPrice: 72,
    inStock: true,
    requiresPrescription: true,
    rating: 4.5,
    reviews: 1560,
    description: 'Diabetes management medication'
  },
  {
    id: '5',
    name: 'Ashwagandha Capsules',
    genericName: 'Withania Somnifera',
    brand: 'Himalaya',
    category: 'ayurvedic',
    price: 280,
    discountPrice: 245,
    inStock: true,
    requiresPrescription: false,
    rating: 4.9,
    reviews: 4500,
    description: 'Stress relief and energy booster'
  },
  {
    id: '6',
    name: 'Kabasura Kudineer',
    genericName: 'Respiratory Health',
    brand: 'SKM',
    category: 'siddha',
    price: 95,
    inStock: true,
    requiresPrescription: false,
    rating: 4.7,
    reviews: 2100,
    description: 'Siddha formulation for respiratory wellness'
  },
  {
    id: '7',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate',
    brand: 'Cipla',
    category: 'modern',
    price: 65,
    discountPrice: 55,
    inStock: true,
    requiresPrescription: true,
    rating: 4.6,
    reviews: 980,
    description: 'Blood pressure management'
  },
  {
    id: '8',
    name: 'Triphala Churna',
    genericName: 'Digestive Health',
    brand: 'Patanjali',
    category: 'ayurvedic',
    price: 95,
    inStock: true,
    requiresPrescription: false,
    rating: 4.5,
    reviews: 3800,
    description: 'Ayurvedic digestive and detox formula'
  }
];

export default function Medicine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ medicine: Medicine; quantity: number }[]>([]);
  const { toast } = useToast();

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.medicine.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
    toast({
      title: 'Added to cart',
      description: `${medicine.name} added to your cart`,
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicineId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.medicine.id === medicineId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.medicine.id !== medicineId);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.medicine.discountPrice || item.medicine.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const categoryIcons = {
    modern: Activity,
    ayurvedic: Leaf,
    siddha: Sparkles,
  };

  return (
    <AppLayout>
      <div className="space-y-4 pb-24 md:pb-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold font-display flex items-center gap-3"
            >
              <Pill className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Medicine Store
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-muted-foreground mt-1"
            >
              Order medicines online • Modern, Ayurvedic & Siddha
            </motion.p>
          </div>
          
          {/* Cart Button */}
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => {
              toast({
                title: 'Cart',
                description: `You have ${getCartCount()} items worth ₹${getCartTotal()} in your cart`,
              });
            }}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {getCartCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {getCartCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[
            { icon: Truck, text: 'Free Delivery', subtext: 'Orders above ₹299' },
            { icon: Shield, text: '100% Genuine', subtext: 'Verified medicines' },
            { icon: Clock, text: 'Quick Delivery', subtext: '2-4 hours in AP' },
            { icon: Upload, text: 'Upload Rx', subtext: 'Prescription orders' },
          ].map((feature, i) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 p-2 md:p-3 rounded-lg bg-secondary/50"
            >
              <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">{feature.text}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">{feature.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines, brands, generics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
            <TabsTrigger value="modern" className="text-xs md:text-sm">
              <Activity className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Modern
            </TabsTrigger>
            <TabsTrigger value="ayurvedic" className="text-xs md:text-sm">
              <Leaf className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Ayurvedic
            </TabsTrigger>
            <TabsTrigger value="siddha" className="text-xs md:text-sm">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Siddha
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {filteredMedicines.map((medicine, index) => {
            const CategoryIcon = categoryIcons[medicine.category];
            const cartItem = cart.find(item => item.medicine.id === medicine.id);
            
            return (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-3 md:p-4">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-[10px] md:text-xs capitalize',
                          medicine.category === 'modern' && 'border-modern text-modern',
                          medicine.category === 'ayurvedic' && 'border-ayurvedic text-ayurvedic',
                          medicine.category === 'siddha' && 'border-siddha text-siddha'
                        )}
                      >
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {medicine.category}
                      </Badge>
                      {medicine.requiresPrescription && (
                        <Badge variant="destructive" className="text-[10px]">Rx</Badge>
                      )}
                    </div>

                    {/* Medicine Info */}
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1">{medicine.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{medicine.genericName}</p>
                    <p className="text-xs text-muted-foreground">{medicine.brand}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-warning text-warning" />
                      <span className="text-xs font-medium">{medicine.rating}</span>
                      <span className="text-xs text-muted-foreground">({medicine.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-base md:text-lg">
                        ₹{medicine.discountPrice || medicine.price}
                      </span>
                      {medicine.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{medicine.price}
                        </span>
                      )}
                      {medicine.discountPrice && (
                        <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">
                          {Math.round((1 - medicine.discountPrice / medicine.price) * 100)}% off
                        </Badge>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-3">
                      {cartItem ? (
                        <div className="flex items-center justify-between bg-secondary rounded-lg p-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => removeFromCart(medicine.id)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium">{cartItem.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => addToCart(medicine)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => addToCart(medicine)}
                          disabled={!medicine.inStock}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No medicines found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
