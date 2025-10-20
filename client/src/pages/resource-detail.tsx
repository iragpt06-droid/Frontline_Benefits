import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ArrowLeft,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { Resource } from "@shared/schema";

const categoryColors: Record<string, string> = {
  healthcare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  housing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  employment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "mental-health": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  education: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  crisis: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ResourceDetail() {
  const [, params] = useRoute("/resources/:id");
  const resourceId = params?.id;

  const { data: resource, isLoading } = useQuery<Resource>({
    queryKey: ["/api/resources", resourceId],
    enabled: !!resourceId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="animate-pulse">
            <div className="h-96 bg-muted" />
          </Card>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="p-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Resource Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The resource you're looking for doesn't exist.
              </p>
              <Link href="/resources">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Resources
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/resources">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl md:text-3xl mb-2">
                  {resource.title}
                </CardTitle>
                <p className="text-lg text-muted-foreground">{resource.organization}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className={`${categoryColors[resource.category] || ""}`}
                >
                  {resource.category.replace("-", " ")}
                </Badge>
                {resource.isNational && (
                  <Badge variant="outline">National</Badge>
                )}
                {resource.isCrisis && (
                  <Badge variant="destructive">Crisis Support</Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">About This Resource</h3>
              <p className="text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <div className="space-y-4">
                {resource.phone && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${resource.phone}`}
                        className="text-primary hover:underline font-medium"
                        data-testid="link-phone"
                      >
                        {resource.phone}
                      </a>
                    </div>
                  </div>
                )}

                {resource.email && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${resource.email}`}
                        className="text-primary hover:underline font-medium truncate block"
                        data-testid="link-email"
                      >
                        {resource.email}
                      </a>
                    </div>
                  </div>
                )}

                {resource.website && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium truncate block"
                        data-testid="link-website"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {resource.address && (
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {resource.address}
                        <br />
                        {resource.city}, {resource.state} {resource.zipCode}
                      </p>
                      {resource.latitude && resource.longitude && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-1 inline-block"
                          data-testid="link-directions"
                        >
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Eligibility */}
            {resource.eligibility && resource.eligibility.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Eligibility Requirements</h3>
                <div className="space-y-2">
                  {resource.eligibility.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{req}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Related Services</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                {resource.phone && (
                  <Button size="lg" asChild data-testid="button-call">
                    <a href={`tel:${resource.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}
                {resource.website && (
                  <Button size="lg" variant="outline" asChild data-testid="button-visit-website">
                    <a href={resource.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
