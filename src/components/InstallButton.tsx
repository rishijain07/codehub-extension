import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { asset, STORE } from '@/lib/content';

// Keep Slot composition inside React so Astro's HTML children don't drop the button attributes.
export default function InstallButton({
  size = 'lg',
  showChrome = false,
}: {
  size?: 'lg' | 'sm';
  showChrome?: boolean;
}) {
  return (
    <Button asChild size={size}>
      <a href={STORE} target="_blank" rel="noopener noreferrer">
        {showChrome && (
          <img
            src={asset('assets/chrome-logo.svg')}
            alt=""
            width="19"
            height="19"
          />
        )}
        Add to Chrome
        <ArrowTopRightIcon data-icon="inline-end" />
      </a>
    </Button>
  );
}
