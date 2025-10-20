import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { insertQuestionnaireSchema, NEEDS, BRANCHES } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertQuestionnaireSchema.extend({
  needs: z.array(z.string()).min(1, "Please select at least one need"),
});

type FormData = z.infer<typeof formSchema>;

const needOptions = [
  { value: "healthcare", label: "Healthcare Services" },
  { value: "housing", label: "Housing Assistance" },
  { value: "employment", label: "Employment & Career" },
  { value: "mental-health", label: "Mental Health Support" },
  { value: "education", label: "Education & Training" },
  { value: "legal-assistance", label: "Legal Assistance" },
  { value: "financial-assistance", label: "Financial Assistance" },
  { value: "family-support", label: "Family Support" },
];

export default function Questionnaire() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      serviceYears: 0,
      location: "",
      zipCode: "",
      needs: [],
      branchOfService: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/questionnaire", data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Questionnaire Submitted",
        description: "Finding resources matched to your needs...",
      });
      setLocation(`/resources?responseId=${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["age", "serviceYears", "branchOfService"];
    } else if (step === 2) {
      fieldsToValidate = ["location", "zipCode"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Resources</h1>
          <p className="text-muted-foreground">
            Answer a few questions to get personalized veteran resource recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Service Information"}
              {step === 2 && "Location Details"}
              {step === 3 && "Your Needs"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your military service"}
              {step === 2 && "Where are you currently located?"}
              {step === 3 && "What services are you looking for?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter your age"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              data-testid="input-age"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Service</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="How many years did you serve?"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              data-testid="input-service-years"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branchOfService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch of Service</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-branch">
                                <SelectValue placeholder="Select your branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BRANCHES.map((branch) => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City or State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Los Angeles or California"
                              {...field}
                              data-testid="input-location"
                            />
                          </FormControl>
                          <FormDescription>
                            This helps us find resources near you
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your ZIP code"
                              {...field}
                              data-testid="input-zipcode"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 3 && (
                  <FormField
                    control={form.control}
                    name="needs"
                    render={() => (
                      <FormItem>
                        <FormLabel>What services do you need? (Select all that apply)</FormLabel>
                        <div className="space-y-3 mt-3">
                          {needOptions.map((option) => (
                            <FormField
                              key={option.value}
                              control={form.control}
                              name="needs"
                              render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.value)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), option.value]
                                          : (field.value || []).filter(
                                              (value) => value !== option.value
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                      data-testid={`checkbox-need-${option.value}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {step < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Find Resources"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
