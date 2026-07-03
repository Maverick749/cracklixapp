import { CapacitorConfig } from '@capacitor/cli';

/**
 * @fileOverview Production Capacitor Configuration for Cracklix Android.
 */

const config: CapacitorConfig = {
  appId: 'com.cracklix.app',
  appName: 'Cracklix',
  webDir: 'out',
  // The web assets bundled in `out/` are served locally so the app opens and
  // renders offline. We intentionally do NOT set `server.url` (which would make
  // the shell a thin wrapper around the live site and fail without a network).
  // Dynamic API calls are routed to the live backend via src/lib/api-base.ts.
  server: {
    androidScheme: 'https',
    allowNavigation: ['cracklix.vercel.app'],
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0B1528",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    StatusBar: {
      backgroundColor: '#0B1528',
      style: 'DARK'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;