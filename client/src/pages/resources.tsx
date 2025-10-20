import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/resource-card";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MapPin } from "lucide-react";
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

    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Veteran Resources</h1>
          <p className="text-muted-foreground">
            Browse available services and support programs for veterans
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64" data-testid="select-category">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="w-full md:w-auto"
              data-testid="button-toggle-map"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <Card className="mb-8 p-6">
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Map integration will be added in the backend phase
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredResources && filteredResources.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredResources.length} resource
                {filteredResources.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Filter className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
