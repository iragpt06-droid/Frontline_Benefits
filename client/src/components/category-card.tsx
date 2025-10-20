import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  testId?: string;
}

export function CategoryCard({
  icon: Icon,
  title,
  description,
  onClick,
  testId,
}: CategoryCardProps) {
  return (
    <Card
      className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
      onClick={onClick}
      data-testid={testId}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
