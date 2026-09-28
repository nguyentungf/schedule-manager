import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vn.edu.hust.student',
  appName: 'HUST Portal',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#b91c1c',
      style: 'DARK',
      overlaysWebView: false
    }
  }
};

export default config;
