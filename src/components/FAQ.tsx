'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/content';

export default function FAQ() {
  return (
    <Accordion type="single" collapsible className="faq-list">
      {faqs.map((faq, index) => (
        <AccordionItem value={`question-${index}`} key={faq.question}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent forceMount>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
