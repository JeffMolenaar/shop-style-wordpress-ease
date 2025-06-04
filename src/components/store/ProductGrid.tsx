
import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

interface ProductGridProps {
  searchTerm: string;
  selectedCategory: string;
}

const ProductGrid = ({ searchTerm, selectedCategory }: ProductGridProps) => {
  // Sample products - in a real app, this would come from your database
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "/placeholder.svg",
      category: "electronics",
      description: "High-quality wireless headphones with noise cancellation",
      rating: 4.5
    },
    {
      id: 2,
      name: "Cotton T-Shirt",
      price: 24.99,
      image: "/placeholder.svg",
      category: "clothing",
      description: "Comfortable 100% cotton t-shirt in various colors",
      rating: 4.2
    },
    {
      id: 3,
      name: "Coffee Mug",
      price: 12.99,
      image: "/placeholder.svg",
      category: "home",
      description: "Ceramic coffee mug with modern design",
      rating: 4.8
    },
    {
      id: 4,
      name: "JavaScript Book",
      price: 39.99,
      image: "/placeholder.svg",
      category: "books",
      description: "Learn modern JavaScript development",
      rating: 4.6
    },
    {
      id: 5,
      name: "Smartphone",
      price: 699.99,
      image: "/placeholder.svg",
      category: "electronics",
      description: "Latest smartphone with advanced features",
      rating: 4.7
    },
    {
      id: 6,
      name: "Designer Jeans",
      price: 89.99,
      image: "/placeholder.svg",
      category: "clothing",
      description: "Premium denim jeans with perfect fit",
      rating: 4.3
    }
  ]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of high-quality products
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
