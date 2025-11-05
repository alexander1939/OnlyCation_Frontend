// Extiende la interfaz Window para incluir beforeinstallprompt
declare interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
}

declare interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export {};
