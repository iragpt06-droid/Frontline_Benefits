import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@shared/schema";
import { Link } from "wouter";

interface ResourceCardProps {
  resource: Resource;
}

const categoryColors: Record<string, string> = {
  healthcare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  housing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  employment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "mental-health": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  education: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  crisis: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full" data-testid={`card-resource-${resource.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{resource.organization}</p>
        </div>
        <Badge
          variant="secondary"
          className={`${categoryColors[resource.category] || ""} shrink-0`}
        >
          {resource.category.replace("-", " ")}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {resource.description}
        </p>

        <div className="space-y-2 text-sm">
          {resource.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                {resource.address}, {resource.city}, {resource.state} {resource.zipCode}
              </span>
            </div>
          )}
          {resource.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={`tel:${resource.phone}`}
                className="text-primary hover:underline"
                data-testid={`link-phone-${resource.id}`}
              >
                {resource.phone}
              </a>
            </div>
          )}
          {resource.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={`mailto:${resource.email}`}
                className="text-primary hover:underline truncate"
                data-testid={`link-email-${resource.id}`}
              >
                {resource.email}
              </a>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <Link href={`/resources/${resource.id}`}>
            <Button variant="default" size="sm" data-testid={`button-view-${resource.id}`}>
              View Details
            </Button>
          </Link>
          {resource.website && (
            <Button
              variant="outline"
              size="sm"
              asChild
              data-testid={`button-website-${resource.id}`}
            >
              <a href={resource.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
