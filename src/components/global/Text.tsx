import React from "react";
import { cn } from "@/lib/cn";

type TextProps = React.HTMLAttributes<
  HTMLHeadingElement | HTMLParagraphElement
> & {
  children: React.ReactNode;
};

export const H1 = ({ children, className, ...props }: TextProps) => (
  <h1
    className={cn(
      "font-montserrat text-xl font-bold text-[var(--color-text-primary)] md:text-2xl",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className, ...props }: TextProps) => (
  <h2
    className={cn(
      "font-montserrat text-lg font-semibold text-[var(--color-text-primary)] md:text-xl",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
);

export const H3 = ({ children, className, ...props }: TextProps) => (
  <h3
    className={cn(
      "font-montserrat text-base font-medium text-[var(--color-text-primary)] md:text-lg",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

export const H4 = ({ children, className, ...props }: TextProps) => (
  <h4
    className={cn(
      "font-montserrat md:text-bas text-sm font-medium text-[var(--color-text-primary)]",
      className,
    )}
    {...props}
  >
    {children}
  </h4>
);

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  children: React.ReactNode;
};

export const Paragraph = ({
  children,
  className,
  ...props
}: ParagraphProps) => {
  return (
    <p
      className={cn("font-montserrat text-sm leading-5", className)}
      {...props}
    >
      {children}
    </p>
  );
};
