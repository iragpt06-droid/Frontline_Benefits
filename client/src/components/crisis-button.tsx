import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrisisButton() {
  const handleCrisisCall = () => {
    window.location.href = "tel:988";
  };

  return (
    <Button
      onClick={handleCrisisCall}
      size="lg"
      variant="destructive"
      className="fixed bottom-6 right-6 z-50 shadow-2xl px-6 py-6 text-base font-semibold"
      data-testid="button-crisis-call"
    >
      <Phone className="h-5 w-5 mr-2" />
      Crisis Help: 988
    </Button>
  );
}
