
import DataEntryForm from "@/components/DataEntryForm";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const DataEntry = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full py-4 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-medium tracking-tight">
              <span className="text-primary">Portfolio</span>
              <span className="text-foreground">Generator</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <span>Preview</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        <section className="py-8">
          <div className="container mx-auto mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Create Your Portfolio</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Fill in your information below to generate a beautiful, responsive portfolio website.
            </p>
          </div>
          
          <DataEntryForm />
        </section>
      </main>
    </div>
  );
};

export default DataEntry;
