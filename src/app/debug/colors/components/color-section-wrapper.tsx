'use client';

import React from 'react';

interface ColorSectionWrapperProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export function ColorSectionWrapper({ title, children, description }: ColorSectionWrapperProps) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}
