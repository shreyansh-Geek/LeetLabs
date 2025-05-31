import { cva } from "class-variance-authority";
import { CircleCheckBig } from "lucide-react";
import {Link} from "react-router-dom";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const pricingColumnVariants = cva(
  "max-w-container relative flex flex-col gap-6 overflow-hidden rounded-2xl p-8 shadow-xl",
  {
    variants: {
      variant: {
        default: "glass-1 to-transparent dark:glass-3",
        glow: "glass-2 to-trasparent dark:glass-3 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-[#f5b210]/30 after:blur-[72px] ",
        "glow-brand":
          "glass-3 from-card/100 to-card/100 dark:glass-4 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-[#f5b210]/70 after:bg-[#f5b210] after:blur-[72px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function PricingColumn({
  name,
  icon,
  description,
  price,
  priceNote,
  cta,
  features,
  variant,
  className,
  onCtaClick,
  ...props
}) {
  return (
    <div className={cn(pricingColumnVariants({ variant, className }))} {...props}>
      <hr
        className={cn(
          "via-[#f5b210]/60 absolute top-0 left-[10%] h-[1px] w-[80%] border-0 bg-linear-to-r from-transparent to-transparent",
          variant === "glow-brand" && "via-brand"
        )} />
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-bold">
            {icon && (
              <div className="text-muted-foreground flex items-center gap-2">
                {icon}
              </div>
            )}
            {name}
          </h2>
          <p className="text-muted-foreground max-w-[220px] text-sm">
            {description}
          </p>
        </div>
        <div
          className="flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-muted-foreground text-3xl font-bold">₹</span>
            <span className="text-6xl font-bold">{price}</span>
          </div>
          <div className="flex min-h-[40px] flex-col">
            {price > 0 && (
              <>
                <span className="text-sm">one-time payment</span>
                <span className="text-muted-foreground text-sm">
                  plus GST
                </span>
              </>
            )}
          </div>
        </div>
        <Button
          variant={cta.variant}
          size="lg"
          className={cn(
            "hover:bg-[#f5b210] hover:text-[#000000] bg-[#000000] text-white font-bold transition-all duration-300 cursor-pointer",
            variant === "glow-brand" && "bg-[#f5b210]/85 text-[#000000] hover:bg-[#f5b010] "
          )}
          onClick={() => onCtaClick(cta.action, name)} // Use onCtaClick prop
        >
          {cta.label}
        </Button>
        <p className="text-muted-foreground min-h-[40px] max-w-[220px] text-sm">
          {priceNote}
        </p>
        <hr className="border-input" />
      </div>
      <div>
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <CircleCheckBig className="text-muted-foreground size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { pricingColumnVariants };
