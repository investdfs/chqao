"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingProps {
  title: string;
  description: string;
  plans: Array<{
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    features: string[];
    description: string;
    buttonText: string;
    href: string;
    isPopular?: boolean;
  }>;
}

export function Pricing({ title, description, plans }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="container py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="text-gray-500 whitespace-pre-line">{description}</p>
        
        <div className="flex items-center justify-center gap-4">
          <span className={cn("text-sm", !isYearly && "font-semibold text-primary")}>Mensal</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isYearly ? "bg-primary" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isYearly ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-sm", isYearly && "font-semibold text-primary")}>Anual</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative rounded-2xl border p-8",
              plan.isPopular && "border-primary bg-primary/5 shadow-lg"
            )}
          >
            {plan.isPopular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                Mais Popular
              </span>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">R$</span>
                <span className="text-4xl font-bold">
                  {isYearly ? plan.yearlyPrice : plan.price}
                </span>
                <span className="text-sm text-gray-500 ml-2">{plan.period}</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.isPopular ? "default" : "outline"}
                asChild
              >
                <a href={plan.href}>{plan.buttonText}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}