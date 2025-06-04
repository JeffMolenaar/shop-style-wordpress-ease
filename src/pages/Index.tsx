
import { useState } from "react";
import Header from "@/components/store/Header";
import ProductGrid from "@/components/store/ProductGrid";
import Hero from "@/components/store/Hero";
import Footer from "@/components/store/Footer";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-white">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Hero />
      <ProductGrid 
        searchTerm={searchTerm} 
        selectedCategory={selectedCategory}
      />
      <Footer />
    </div>
  );
};

export default Index;
