'use client'

import { Tooltip as ChakraTooltip } from '@chakra-ui/react'
import * as RadixTooltip from '@radix-ui/react-tooltip'

// Re-export Radix UI TooltipProvider for Stack Auth compatibility
export const TooltipProvider = RadixTooltip.Provider

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({
  content,
  children,
  openDelay = 200,
  closeDelay = 0,
  placement = 'top',
}: TooltipProps) {
  return (
    <ChakraTooltip.Root openDelay={openDelay} closeDelay={closeDelay} positioning={{ placement }}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <ChakraTooltip.Positioner>
        <ChakraTooltip.Content
          bg="purple.900"
          color="white"
          px={3}
          py={2}
          borderRadius="lg"
          fontSize="sm"
          fontWeight="medium"
          boxShadow="lg"
        >
          {content}
        </ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    </ChakraTooltip.Root>
  )
}
