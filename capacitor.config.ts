import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.greet.app',
  appName: 'greet',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url: "http://your-webview-server:port",
    hostname: "app"
  }
};

export default config;
