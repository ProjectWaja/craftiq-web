const SOUNDS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  perfect: '/sounds/perfect.mp3',
  levelUp: '/sounds/level-up.mp3',
  click: '/sounds/click.mp3',
  submit: '/sounds/submit.mp3',
} as const;

let muted = false;

export function playSound(name: keyof typeof SOUNDS) {
  if (muted || typeof window === 'undefined') return;
  try {
    const audio = new Audio(SOUNDS[name]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // Graceful degradation — no sound files yet
  }
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}
