"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Faq = { q: string; a: string };

export function TeachPricingFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`q-${i}`}>
          <AccordionTrigger className="py-5 text-[15px] font-semibold tracking-tight text-foreground md:text-[16px]">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[14.5px] leading-relaxed text-ink-2">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
