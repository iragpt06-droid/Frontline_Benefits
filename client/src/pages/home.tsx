import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import {
  Heart,
  Home as HomeIcon,
  Briefcase,
  GraduationCap,
  Hospital,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const categories = [
    {
      icon: Hospital,
      title: "Healthcare",
      description: "VA hospitals, clinics, and medical services for veterans",
      category: "healthcare",
    },
    {
      icon: HomeIcon,
      title: "Housing",
      description: "Housing assistance, shelters, and home loan programs",
      category: "housing",
    },
    {
      icon: Briefcase,
      title: "Employment",
      description: "Job training, placement services, and career counseling",
      category: "employment",
    },
    {
      icon: Heart,
      title: "Mental Health",
      description: "Counseling, PTSD support, and wellness programs",
      category: "mental-health",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "GI Bill benefits, vocational training, and scholarships",
      category: "education",
    },
    {
      icon: AlertCircle,
      title: "Crisis Support",
      description: "24/7 emergency assistance and crisis intervention",
      category: "crisis",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find the Support You've Earned
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              VetConnect helps veterans navigate essential services—from healthcare
              and housing to employment and mental health support. Access your
              benefits in one place, with 24/7 crisis support always available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/questionnaire">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base font-semibold px-8"
                  data-testid="button-get-started-hero"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/resources">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-semibold px-8 bg-background/10 hover:bg-background/20 border-primary-foreground/30 text-primary-foreground backdrop-blur-sm"
                  data-testid="button-browse-resources-hero"
                >
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Resources by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse veteran services organized by your needs. Find healthcare,
              housing, employment opportunities, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.category} href={`/resources?category=${category.category}`}>
                <CategoryCard
                  icon={category.icon}
                  title={category.title}
                  description={category.description}
                  onClick={() => {}}
                  testId={`card-category-${category.category}`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take our quick questionnaire to find resources tailored to your specific
            needs and location.
          </p>
          <Link href="/questionnaire">
            <Button
              size="lg"
              className="text-base font-semibold px-8"
              data-testid="button-start-questionnaire"
            >
              Start Questionnaire
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
