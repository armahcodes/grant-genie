'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FiSettings, FiArrowLeft, FiBell } from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'

export default function EmailManagementGeniePage() {
  const router = useRouter()

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background">
        <Container maxW="container.xl" py={8}>
          <VStack gap={8} align="stretch">
            {/* Header */}
            <HStack justify="space-between">
              <HStack gap={4}>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/genies')}
                  color="purple.900"
                  bg="neomorphic.background"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                  _active={{ boxShadow: 'neo.inset.sm' }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                >
                  <Icon as={FiArrowLeft} />
                </Button>
                <VStack align="start" gap={1}>
                  <Heading size="xl" color="purple.900">
                    Email Management Genie
                  </Heading>
                  <Text color="purple.700">
                    Smart donor responses and automated follow-ups
                  </Text>
                </VStack>
              </HStack>
              <Badge colorPalette="purple" fontSize="sm" px={3} py={1}>
                Coming Soon
              </Badge>
            </HStack>

            {/* Coming Soon Card */}
            <Card.Root
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              maxW="2xl"
              mx="auto"
              mt={8}
            >
              <Card.Body p={12}>
                <VStack gap={6} textAlign="center">
                  <Box
                    w={24}
                    h={24}
                    bg="neomorphic.background"
                    borderRadius="3xl"
                    boxShadow="neo.inset.md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiSettings} boxSize={12} color="purple.500" />
                  </Box>

                  <Heading size="lg" color="purple.900">
                    Email Management Coming Soon
                  </Heading>

                  <Text color="purple.700" fontSize="lg" maxW="md">
                    We're building an AI-powered email assistant that will help you craft
                    smart donor responses, manage pledges, and automate follow-ups while
                    maintaining your personal touch.
                  </Text>

                  <VStack gap={3} pt={4}>
                    <HStack gap={2}>
                      <Icon as={FiBell} color="purple.500" />
                      <Text color="purple.600" fontSize="sm">
                        Get notified when Email Management launches
                      </Text>
                    </HStack>
                  </VStack>

                  <Button
                    colorPalette="purple"
                    color="white"
                    size="lg"
                    onClick={() => router.push('/genies')}
                    borderRadius="2xl"
                    boxShadow="neo.md"
                    _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px',
                    }}
                    mt={4}
                  >
                    <Icon as={FiArrowLeft} mr={2} />
                    Back to Genies
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  )
}
