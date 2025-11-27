'use client'

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { colors } from '@/theme/tokens'

// Create a custom system with HeadspaceGenie branding
// Using purple/indigo palette from theme/tokens.ts with neomorphic design
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: colors.purple[50] },
          100: { value: colors.purple[100] },
          200: { value: colors.purple[200] },
          300: { value: colors.purple[300] },
          400: { value: colors.purple[400] },
          500: { value: colors.purple[500] },
          600: { value: colors.purple[600] },
          700: { value: colors.purple[700] },
          800: { value: colors.purple[800] },
          900: { value: colors.brand.deepIndigo }, // Matches brand.deepIndigo
        },
        neomorphic: {
          background: { value: colors.neomorphic.background },
          surface: { value: colors.neomorphic.surface },
          subtle: { value: colors.neomorphic.subtle },
          darker: { value: colors.neomorphic.darker },
          accent: { value: colors.neomorphic.accent },
        },
      },
      shadows: {
        'neo.sm': { value: '6px 6px 12px rgba(60, 59, 110, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.7)' },
        'neo.md': { value: '10px 10px 20px rgba(60, 59, 110, 0.15), -10px -10px 20px rgba(255, 255, 255, 0.7)' },
        'neo.lg': { value: '15px 15px 30px rgba(60, 59, 110, 0.15), -15px -15px 30px rgba(255, 255, 255, 0.7)' },
        'neo.xl': { value: '20px 20px 40px rgba(60, 59, 110, 0.15), -20px -20px 40px rgba(255, 255, 255, 0.7)' },
        'neo.inset.sm': { value: 'inset 6px 6px 12px rgba(60, 59, 110, 0.15), inset -6px -6px 12px rgba(255, 255, 255, 0.7)' },
        'neo.inset.md': { value: 'inset 10px 10px 20px rgba(60, 59, 110, 0.15), inset -10px -10px 20px rgba(255, 255, 255, 0.7)' },
        'neo.inset.lg': { value: 'inset 15px 15px 30px rgba(60, 59, 110, 0.15), inset -15px -15px 30px rgba(255, 255, 255, 0.7)' },
      },
    },
    semanticTokens: {
      colors: {
        'bg.brand': {
          value: {
            _light: colors.brand.deepIndigo,
            _dark: '#5D5B9E', // Lighter indigo for dark mode
          },
        },
        'bg.brand.subtle': {
          value: {
            _light: colors.purple[50],
            _dark: '#1A1F2E',
          },
        },
        'bg.subtle': {
          value: {
            _light: colors.purple[50],
            _dark: '#1A1F2E',
          },
        },
        'bg.neomorphic': {
          value: {
            _light: colors.neomorphic.background,
            _dark: '#1A1F2E',
          },
        },
        'bg.neomorphic.surface': {
          value: {
            _light: colors.neomorphic.surface,
            _dark: '#252D3D',
          },
        },
        'fg.brand': {
          value: {
            _light: colors.brand.deepIndigo,
            _dark: colors.brand.softTeal,
          },
        },
      },
    },
  },
})

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ChakraProvider>
  )
}
