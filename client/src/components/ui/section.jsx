import React from 'react';
import { cn } from '../../lib/utils';

export function Section({ className, children }) {
  return (
    <section className={cn('py-8 px-4', className)}>
      {children}
    </section>
  );
}