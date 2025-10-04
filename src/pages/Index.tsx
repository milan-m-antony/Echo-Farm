import { Button } from "@/components/ui/button";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { Leaf, Globe, Sprout, TrendingUp, Users, Shield } from "lucide-react";

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background Globe */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-auto">
        <div className="w-full h-full flex items-center justify-center">
          <RotatingEarth 
            width={typeof window !== 'undefined' ? window.innerWidth : 1920} 
            height={typeof window !== 'undefined' ? window.innerHeight : 1080} 
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 pointer-events-none">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl px-6 py-3 shadow-lg">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Leaf className="w-6 h-6 text-primary" />
                  <span className="text-xl font-bold text-gradient">EchoFarm</span>
                </button>
                <div className="hidden md:flex items-center gap-8">
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('mission')} 
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Mission
                  </button>
                  <button 
                    onClick={() => scrollToSection('impact')} 
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Impact
                  </button>
                </div>
                <Button variant="default" size="sm" className="rounded-xl">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 pointer-events-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-full px-6 py-3">
              <span className="text-sm font-medium text-primary">🌱 Sustainable Agriculture</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Growing a <span className="text-gradient">Sustainable</span> Future
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-2xl mx-auto bg-glass-heavy backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
              EchoFarm connects farmers worldwide with cutting-edge sustainable practices, 
              data-driven insights, and a community committed to regenerative agriculture.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="rounded-xl bg-gradient-eco text-white hover:opacity-90 transition-opacity">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl backdrop-blur-xl bg-glass-heavy border-glass-border hover:bg-glass transition-all">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-foreground/80">Farmers</div>
              </div>
              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-foreground/80">Countries</div>
              </div>
              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">2M</div>
                <div className="text-sm text-foreground/80">Hectares</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-8 inline-block">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Powered by <span className="text-gradient">Innovation</span>
                </h2>
                <p className="text-lg text-foreground/90 max-w-2xl">
                  Technology meets tradition to create farming solutions for the modern age
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: "Global Network",
                  description: "Connect with farmers worldwide and share knowledge across borders"
                },
                {
                  icon: Sprout,
                  title: "Regenerative Practices",
                  description: "Learn and implement sustainable farming methods that restore ecosystems"
                },
                {
                  icon: TrendingUp,
                  title: "Data Insights",
                  description: "Make informed decisions with real-time analytics and forecasting"
                },
                {
                  icon: Users,
                  title: "Community Support",
                  description: "Access expert advice and peer support from our farming community"
                },
                {
                  icon: Shield,
                  title: "Certification Programs",
                  description: "Get certified in sustainable practices and increase market value"
                },
                {
                  icon: Leaf,
                  title: "Carbon Credits",
                  description: "Earn carbon credits through verified sustainable farming practices"
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-8 hover:bg-glass transition-all hover:scale-105 hover:shadow-2xl"
                >
                  <div className="w-14 h-14 bg-gradient-eco rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-foreground/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-24 px-6 pointer-events-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-eco opacity-5" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Our <span className="text-gradient">Mission</span>
                </h2>
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  We believe in empowering farmers with the tools, knowledge, and community they need 
                  to transition to sustainable practices. By combining traditional wisdom with modern 
                  technology, we're creating a future where agriculture works in harmony with nature.
                </p>
                <Button size="lg" className="rounded-xl bg-gradient-eco text-white hover:opacity-90 transition-opacity">
                  Join the Movement
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-24 px-6 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-8 inline-block">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Making an <span className="text-gradient">Impact</span>
                </h2>
                <p className="text-lg text-foreground/90 max-w-2xl">
                  Real results from farmers who've joined the EchoFarm community
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">35%</div>
                    <p className="text-foreground/80">Average increase in crop yield using regenerative methods</p>
                  </div>
                </div>
              </div>

              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">50K</div>
                    <p className="text-foreground/80">Tons of CO₂ sequestered through our farming network</p>
                  </div>
                </div>
              </div>

              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                    <p className="text-foreground/80">Farmers trained in sustainable agriculture practices</p>
                  </div>
                </div>
              </div>

              <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <p className="text-foreground/80">Countries participating in our global network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 pointer-events-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-eco opacity-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your Farm?
                </h2>
                <p className="text-xl text-foreground/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of farmers worldwide who are building a sustainable future.
                </p>
                <Button size="lg" className="rounded-xl bg-gradient-eco text-white hover:opacity-90 transition-opacity">
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-glass-border backdrop-blur-xl pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-primary" />
                  <span className="text-xl font-bold text-gradient">EchoFarm</span>
                </div>
                <p className="text-sm text-foreground/80">
                  © 2025 EchoFarm. Growing a sustainable future together.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
