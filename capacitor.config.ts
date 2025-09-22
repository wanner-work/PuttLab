import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'work.wanner.puttlab',
  appName: 'PuttLab',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/PuttLabDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'puttlab',
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  }
}

export default config
