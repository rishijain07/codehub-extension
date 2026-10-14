'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ArrowTopRightIcon,
  CheckIcon,
  CopyIcon,
  MagicWandIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { asset, SITE } from '@/lib/content';

const questions = [
  'How does CodeHub work?',
  'Is my GitHub code private?',
  'Which platforms are supported?',
];
const services = [
  {
    name: 'Gemini',
    logo: 'gemini-color',
    url: 'https://gemini.google.com/app',
    paste: true,
  },
  {
    name: 'Perplexity',
    logo: 'perplexity',
    url: 'https://www.perplexity.ai/search/new?q=',
  },
  { name: 'Grok', logo: 'grok', url: 'https://grok.com/?q=' },
  { name: 'ChatGPT', logo: 'openai', url: 'https://chatgpt.com/?q=' },
  { name: 'Claude', logo: 'claude', url: 'https://claude.ai/new?q=' },
];

export default function AskAI() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(questions[0]);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const prompt = `Answer this question about CodeHub, a free browser extension that syncs accepted coding solutions to GitHub. Use the official sources below and distinguish documented facts from assumptions.\nProduct: ${SITE}\nDocumentation: ${SITE}llms.txt\n\nQuestion: ${question.trim()}`;

  useGSAP(
    () => {
      if (
        !open ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.dataset.motion === 'off'
      )
        return;
      if (scope.current)
        gsap.fromTo(
          scope.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.32,
            clearProps: 'opacity,transform',
          },
        );
    },
    { scope, dependencies: [open], revertOnUpdate: true },
  );

  async function copyPrompt() {
    if (!question.trim()) {
      setStatus('Add a question to copy your prompt.');
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const selection = document.createElement('textarea');
        selection.value = prompt;
        selection.style.position = 'fixed';
        selection.style.opacity = '0';
        scope.current?.append(selection);
        selection.select();
        const success = document.execCommand('copy');
        selection.remove();
        if (!success) throw new Error('Copy unavailable');
      }
      setCopied(true);
      setStatus('Full prompt copied, including the official CodeHub sources.');
    } catch {
      setStatus(
        'Clipboard access is unavailable. Use the full prompt below to copy manually.',
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <MagicWandIcon data-icon="inline-start" />
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent ref={scope} className="ai-dialog">
        <DialogHeader>
          <p className="dialog-eyebrow">A little context goes a long way.</p>
          <DialogTitle>Ask about CodeHub.</DialogTitle>
          <DialogDescription>
            Take your question and the official product context to the AI
            service you prefer.
          </DialogDescription>
        </DialogHeader>
        <ToggleGroup
          type="single"
          value={questions.includes(question) ? question : ''}
          onValueChange={(value) => {
            if (value) {
              setQuestion(value);
              setCopied(false);
              setStatus('');
            }
          }}
          className="prompt-options"
          aria-label="Suggested questions"
        >
          {questions.map((q) => (
            <ToggleGroupItem value={q} key={q}>
              {q}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="aiPromptInput">Your question</FieldLabel>
            <Textarea
              id="aiPromptInput"
              rows={3}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setCopied(false);
                setStatus('');
              }}
            />
          </Field>
        </FieldGroup>
        <div className="provider-grid">
          {services.map((service) => (
            <Button variant="outline" asChild key={service.name}>
              <a
                href={
                  service.paste
                    ? service.url
                    : service.url + encodeURIComponent(prompt)
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!question.trim()}
                onClick={(event) => {
                  if (!question.trim()) {
                    event.preventDefault();
                    setStatus('Add a question before opening a service.');
                  } else if (service.paste) void copyPrompt();
                }}
              >
                <img
                  src={asset(`assets/brands/${service.logo}.svg`)}
                  className="provider-logo"
                  alt=""
                  width="20"
                  height="20"
                />
                {service.name}
                <ArrowTopRightIcon data-icon="inline-end" />
              </a>
            </Button>
          ))}
          <Button onClick={() => void copyPrompt()} disabled={!question.trim()}>
            <span aria-hidden="true">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
            {copied ? 'Copied' : 'Copy prompt'}
          </Button>
        </div>
        <p className="copy-status" role="status" aria-live="polite">
          {status}
        </p>
        <details className="full-prompt">
          <summary>View the full prompt</summary>
          <textarea
            aria-label="Full prompt for manual copying"
            readOnly
            value={prompt}
            rows={8}
          />
        </details>
        <p className="dialog-footnote">
          Gemini copies the prompt for you to paste. Other services may prefill
          it. Your conversation takes place with that provider.
        </p>
      </DialogContent>
    </Dialog>
  );
}
