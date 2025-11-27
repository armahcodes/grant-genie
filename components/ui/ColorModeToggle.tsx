'use client'

import { IconButton, Icon } from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'
import { FiMoon, FiSun } from 'react-icons/fi'

/**
 * ColorModeToggle Component
 *
 * Toggles between light and dark mode themes.
 * Uses Chakra UI's color mode system for theme management.
 * Uses Feather icons for consistency with rest of app.
 */
export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      onClick={toggleColorMode}
      variant="ghost"
      colorPalette="purple"
      size="sm"
      color="purple.700"
      _hover={{ color: 'purple.900', bg: 'purple.50' }}
      _focusVisible={{
        outline: '3px solid',
        outlineColor: 'purple.500',
        outlineOffset: '2px',
      }}
    >
      <Icon as={colorMode === 'light' ? FiMoon : FiSun} boxSize={5} />
    </IconButton>
  )
}