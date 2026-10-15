'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowTopRightIcon, FileTextIcon } from '@radix-ui/react-icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { asset, platforms } from '@/lib/content';

export default function Platforms() {
  const [selected, setSelected] = useState('leetcode');
  const scope = useRef<HTMLDivElement>(null);
  const platform = platforms.find((p) => p.slug === selected)!;
  useGSAP(
    () => {
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.dataset.motion === 'off'
      )
        return;
      gsap.from('.platform-detail > *', {
        opacity: 0,
        y: 10,
        stagger: 0.055,
        duration: 0.35,
      });
    },
    { scope, dependencies: [selected], revertOnUpdate: true },
  );
  return (
    <div ref={scope} className="platform-explorer">
      <ToggleGroup
        type="single"
        value={selected}
        onValueChange={(value) => {
          if (value) setSelected(value);
        }}
        aria-label="Supported coding platforms"
        className="platform-options"
      >
        {platforms.map((p) => (
          <ToggleGroupItem key={p.slug} value={p.slug}>
            {['neetcode', 'codingninjas'].includes(p.slug) ? (
              <span className="platform-letter" aria-hidden="true">
                {p.mark}
              </span>
            ) : (
              <img
                src={asset(`assets/brands/${p.slug}.svg`)}
                alt=""
                width="22"
                height="22"
              />
            )}
            {p.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="platform-detail" aria-live="polite" aria-atomic="true">
        <Badge variant="secondary">
          {platform.name === 'Codeforces'
            ? 'Background sync'
            : 'Accepted solution sync'}
        </Badge>
        <h3>{platform.note}</h3>
        <p>{platform.detail}</p>
        <div className="folder-label">
          <FileTextIcon aria-hidden="true" />
          <code>{platform.folder}</code>
          <span>in your repository</span>
        </div>
        <a href={platform.url} target="_blank" rel="noopener noreferrer">
          Visit {platform.name}
          <ArrowTopRightIcon aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
