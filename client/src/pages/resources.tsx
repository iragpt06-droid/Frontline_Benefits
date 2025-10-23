import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Search, Filter, MapPin as MapPinIcon } from "lucide-react";
import type { Resource } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

export default function Resources() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = params.get("category") || "";
  const responseId = params.get("responseId");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [showMap, setShowMap] = useState(false);

  // Build query URL based on available parameters
  let queryUrl = "/api/resources";
  if (responseId) {
    queryUrl = `/api/resources?responseId=${responseId}`;
  } else if (selectedCategory !== "all") {
    queryUrl = `/api/resources?category=${selectedCategory}`;
  }
    
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["resources", responseId, selectedCategory],
    queryFn: async () => {
      const response = await fetch(queryUrl, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return await response.json();
    },
  });

  const filteredResources = resources?.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...CATEGORIES.map((cat) => ({
      value: cat,
      label: cat
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {responseId ? "Resources Matched to Your Needs" : "Veteran Resources"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {responseId
              ? "Based on your responses, we've identified these resources that may help you."
              : "Explore services and support programs available to veterans."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search-resources"
              type="search"
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger data-testid="select-category" className="w-full md:w-[240px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  data-testid={`option-category-${option.value}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            data-testid="button-toggle-map"
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="w-full md:w-auto"
          >
            <MapPinIcon className="h-4 w-4 mr-2" />
            {showMap ? "Hide" : "Show"} Map
          </Button>
        </div>

        {showMap && (
          <Card className="mb-8" data-testid="card-map-container">
            <CardContent className="p-6">
              <div className="bg-muted rounded-lg flex items-center justify-center h-96">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Map integration coming soon
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will display nearby resources on an interactive map
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} data-testid={`skeleton-card-${i}`}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResources && filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                data-testid={`card-resource-${resource.id}`}
                className="hover-elevate flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      data-testid={`badge-category-${resource.id}`}
                    >
                      {resource.category
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Badge>
                    {resource.isNational && (
                      <Badge variant="outline" data-testid={`badge-national-${resource.id}`}>
                        National
                      </Badge>
                    )}
                    {resource.isCrisis && (
                      <Badge variant="destructive" data-testid={`badge-crisis-${resource.id}`}>
                        Crisis
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl" data-testid={`text-title-${resource.id}`}>
                    {resource.title}
                  </CardTitle>
                  <CardDescription data-testid={`text-organization-${resource.id}`}>
                    {resource.organization}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-description-${resource.id}`}>
                    {resource.description}
                  </p>
                  {resource.city && resource.state && (
                    <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span data-testid={`text-location-${resource.id}`}>
                        {resource.city}, {resource.state}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/resources/${resource.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid={`button-view-details-${resource.id}`}
                    >
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card data-testid="card-no-results">
            <CardContent className="py-16 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                No resources found matching your criteria.
              </p>
              <Button
                data-testid="button-clear-search"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
