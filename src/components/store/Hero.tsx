
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Modern Shopping Experience
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          Discover amazing products at unbeatable prices
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
          Shop Now
        </Button>
      </div>
    </section>
  );
};

export default Hero;
