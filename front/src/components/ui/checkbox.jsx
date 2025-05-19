import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"; // Importar primitivas de Radix
import { Check } from "lucide-react";

const Checkbox = ({ className, ...props }) => {
  return (
    <CheckboxPrimitive.Root // Usar la primitiva Root
      className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator // Usar la primitiva Indicator para el icono
        className="flex items-center justify-center text-current"
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

Checkbox.displayName = "Checkbox";

export { Checkbox };
