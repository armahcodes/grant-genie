'use client'

import {
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  Kbd,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
} from '@chakra-ui/react'
import { KeyboardShortcut, formatShortcut } from '@/lib/utils/keyboard-shortcuts'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: KeyboardShortcut[]
}

/**
 * KeyboardShortcutsModal Component
 * 
 * Displays available keyboard shortcuts in a modal dialog.
 * Organizes shortcuts by category for easy reference.
 */
export function KeyboardShortcutsModal({ isOpen, onClose, shortcuts }: KeyboardShortcutsModalProps) {
  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <DialogBackdrop />
      <DialogContent maxW="lg">
        <DialogHeader>
          <Text fontSize="2xl" fontWeight="bold">
            Keyboard Shortcuts
          </Text>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          <VStack gap={6} align="stretch">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <Box key={category}>
                <Text fontSize="lg" fontWeight="semibold" mb={3} color="purple.600">
                  {category}
                </Text>
                <VStack gap={2} align="stretch">
                  {categoryShortcuts.map((shortcut, index) => (
                    <HStack
                      key={index}
                      justify="space-between"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Text fontSize="sm">{shortcut.description}</Text>
                      <HStack gap={1}>
                        {formatShortcut(shortcut).split(' + ').map((key, i) => (
                          <Kbd key={i} fontSize="xs" px={2} py={1}>
                            {key}
                          </Kbd>
                        ))}
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}