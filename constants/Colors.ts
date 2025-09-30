/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2563eb'; // Azul vibrante
const tintColorDark = '#fff';
const accentColor = '#f59e42'; // Laranja suave
const backgroundLight = '#f3f4f6'; // Cinza muito claro
const backgroundDark = '#151718';
const textLight = '#1f2937'; // Cinza escuro
const textDark = '#ECEDEE';

export const Colors = {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: tintColorLight,
    accent: accentColor,
    icon: '#687076',
    card: '#fff',
    cardShadow: 'rgba(37, 99, 235, 0.08)',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    button: tintColorLight,
    buttonText: '#fff',
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: tintColorDark,
    accent: accentColor,
    icon: '#9BA1A6',
    card: '#23272f',
    cardShadow: 'rgba(0,0,0,0.25)',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    button: tintColorDark,
    buttonText: '#2563eb',
  },
};
