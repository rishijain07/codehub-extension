import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
const motionButton =
  document.querySelector<HTMLButtonElement>('.motion-toggle');
let media: gsap.MatchMedia | undefined;

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences still work without storage. */
  }
}
function syncTheme() {
  const dark = root.dataset.theme === 'dark';
  themeButton?.setAttribute(
    'aria-label',
    `Switch to ${dark ? 'light' : 'dark'} theme`,
  );
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#101827' : '#f2f4f8');
}
function toggleTheme() {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  save('codehub-theme', root.dataset.theme);
  syncTheme();
}
themeButton?.addEventListener('click', toggleTheme);
syncTheme();

function initMotion() {
  media?.revert();
  motionButton?.setAttribute(
    'aria-pressed',
    String(root.dataset.motion === 'off'),
  );
  const label = motionButton?.querySelector('span');
  if (label)
    label.textContent =
      root.dataset.motion === 'off' ? 'Resume motion' : 'Pause motion';
  if (root.dataset.motion === 'off') return;
  media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('[data-hero-word]', {
        yPercent: 110,
        rotation: 2,
        stagger: 0.13,
        duration: 0.95,
      })
      .from(
        '[data-hero-reveal]',
        { opacity: 0, y: 16, stagger: 0.09, duration: 0.65 },
        '-=.55',
      )
      .from(
        '.commit-tile',
        {
          opacity: 0,
          scale: 0.2,
          stagger: { amount: 0.65, from: 'center' },
          duration: 0.7,
        },
        0.15,
      );
    gsap.to('.contribution-field', {
      y: 75,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      });
    });
    gsap.from('.closing-tile', {
      scale: 0.1,
      opacity: 0,
      duration: 0.6,
      stagger: { amount: 0.8, from: 'end' },
      scrollTrigger: {
        trigger: '.closing-section',
        start: 'top 85%',
        once: true,
      },
    });
    const route = document.querySelector<HTMLElement>('.route-line');
    if (route)
      gsap.to('.route-packet', {
        x: () => route.clientWidth - 8,
        duration: 2.2,
        repeat: -1,
        repeatDelay: 0.6,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.privacy-visual',
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause resume pause',
        },
      });
  });
  media.add(
    '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    () => {
      // Keep the mobile LCP image still. Desktop gets the dimensional entrance and drift.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.hero-art',
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause resume pause',
          },
        })
        .from('.hero-image-wrap', {
          y: 50,
          rotationY: -35,
          rotationZ: 12,
          duration: 1.2,
          ease: 'power3.out',
        })
        .to('.hero-image-wrap', {
          y: -12,
          rotationZ: 4,
          ease: 'sine.inOut',
          duration: 3,
          repeat: -1,
          yoyo: true,
        });
      const viewport = document.querySelector<HTMLElement>('.journey-viewport');
      const track = document.querySelector<HTMLElement>('.journey-track');
      if (!viewport || !track) return;
      root.classList.add('has-horizontal-motion');
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: viewport,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.7,
          refreshPriority: 1,
          invalidateOnRefresh: true,
        },
      });
      const art = document.querySelector<HTMLElement>('.hero-art');
      const image = document.querySelector<HTMLElement>('.hero-image-wrap');
      if (art && image) {
        const rotate = gsap.quickTo(image, 'rotationY', {
          duration: 0.7,
          ease: 'power3.out',
        });
        const move = (event: PointerEvent) => {
          const box = art.getBoundingClientRect();
          rotate(-15 + ((event.clientX - box.left) / box.width - 0.5) * 12);
        };
        const reset = () => rotate(-15);
        art.addEventListener('pointermove', move);
        art.addEventListener('pointerleave', reset);
        return () => {
          root.classList.remove('has-horizontal-motion');
          art.removeEventListener('pointermove', move);
          art.removeEventListener('pointerleave', reset);
        };
      }
      return () => root.classList.remove('has-horizontal-motion');
    },
  );
  ScrollTrigger.sort();
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
}
function toggleMotion() {
  root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off';
  save('codehub-motion', root.dataset.motion);
  initMotion();
}
motionButton?.addEventListener('click', toggleMotion);
initMotion();
window.addEventListener('pagehide', () => media?.revert());
window.addEventListener('pageshow', (event) => {
  if (event.persisted) initMotion();
});
