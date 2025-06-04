
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Sample products - in real app, this would come from database
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    image: "/placeholder.svg",
    category: "electronics",
    description: "High-quality wireless headphones with noise cancellation",
    rating: 4.5,
    fullDescription: "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and comfortable over-ear design perfect for long listening sessions.",
    features: ["30-hour battery life", "Active noise cancellation", "Bluetooth 5.0", "Comfortable over-ear design"],
    inStock: true
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 24.99,
    image: "/placeholder.svg",
    category: "clothing",
    description: "Comfortable 100% cotton t-shirt in various colors",
    rating: 4.2,
    fullDescription: "Made from premium 100% cotton, this comfortable t-shirt is perfect for everyday wear. Available in multiple colors and sizes.",
    features: ["100% cotton", "Machine washable", "Available in multiple colors", "Comfortable fit"],
    inStock: true
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("M");

  const product = products.find(p => p.id === parseInt(id || "0"));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">Product Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <div>
            <Badge variant="secondary" className="mb-2 capitalize">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
            </div>

            <p className="text-4xl font-bold text-gray-900 mb-6">${product.price}</p>
            
            <p className="text-gray-600 mb-6">{product.fullDescription}</p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {product.category === "clothing" && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Size:</h3>
                <div className="flex space-x-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline" size="lg">
                ♡ Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
