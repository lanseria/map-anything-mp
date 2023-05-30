import { defineConfig } from "unocss";
import presetWeapp from 'unocss-preset-weapp'
export default defineConfig(
  {
    shortcuts: {
      'mobile-btn': 'shadow-md transition-all duration-200 transform active:bg-opacity-80 active:shadow-lg active:opacity-80 hover:opacity-80 focus:opacity-80',
    },
    include: [/\.wxml$/],
    presets: [
      presetWeapp(),
    ],
  }
)