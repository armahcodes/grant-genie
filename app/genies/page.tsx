'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  VStack,
  Icon,
  Button,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import {
  FiFileText,
  FiUsers,
  FiMail,
  FiSettings,
  FiPlus,
  FiClock,
} from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from '@/components/layout/MainLayout'

export default function GeniesPage() {
  const router = useRouter()
  const { user } = useAuth()

  const genies = [
    {
      id: 'grant-writing',
      icon: FiFileText,
      title: 'Start Writing',
      description: 'Create compelling, impact-aligned grant proposals tailored to your funders',
      href: '/grant-application',
    },
    {
      id: 'donor-meetings',
      icon: FiUsers,
      title: 'Donor Meetings',
      description: 'An easy way to donor prep, storytelling, and pitch practice',
      href: '/genies/donor-meeting',
    },
    {
      id: 'newsletter',
      icon: FiMail,
      title: 'Newsletter Creation',
      description: 'Engage your community with inspiring, personalized newsletters',
      href: '/genies/newsletter',
    },
    {
      id: 'email-management',
      icon: FiSettings,
      title: 'Email Management',
      description: 'Smart donor responses, pledges, and automated follow-ups',
      href: '/genies/email-management',
    },
  ]

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background" py={12}>
        <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={2}>
              <Heading size="2xl" color="purple.900">
                Welcome back, {user?.name || 'there'}!
              </Heading>
              <Text fontSize="lg" color="purple.700">
                Ready to make an impact today?
              </Text>
            </VStack>
            <Button
              variant="outline"
              colorPalette="purple"
              onClick={() => router.push('/genies/history')}
              color="purple.900"
              bg="neomorphic.background"
              border="none"
              borderRadius="2xl"
              boxShadow="neo.sm"
              px={6}
              py={5}
              fontSize="sm"
              fontWeight="semibold"
              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
              _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px',
              }}
            >
              <Icon as={FiClock} mr={2} />
              Session History
            </Button>
          </HStack>

          {/* What would you help with today? */}
          <VStack align="start" gap={6}>
            <Heading size="lg" color="purple.900">
              What would you like help with today?
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
              {genies.map((genie) => (
                <Card.Root
                  key={genie.id}
                  cursor="pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`${genie.title}: ${genie.description}`}
                  onClick={() => router.push(genie.href)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(genie.href)
                    }
                  }}
                  bg="neomorphic.surface"
                  borderRadius="3xl"
                  boxShadow="neo.md"
                  border="none"
                  _hover={{
                    transform: 'translateY(-6px)',
                    boxShadow: 'neo.xl',
                  }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                    transform: 'translateY(-4px)'
                  }}
                  transition="all 0.3s"
                >
                  <Card.Body p={8}>
                    <HStack gap={4} align="start">
                      <Flex
                        w={14}
                        h={14}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        boxShadow="neo.inset.sm"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Icon as={genie.icon} boxSize={7} color="purple.600" />
                      </Flex>
                      <VStack align="start" gap={2} flex={1}>
                        <Heading size="md" color="purple.900">
                          {genie.title}
                        </Heading>
                        <Text color="purple.700" fontSize="sm" lineHeight="tall">
                          {genie.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Create New Genie */}
          <Box mt={8}>
            <Card.Root
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.inset.md"
              border="none"
              cursor="pointer"
              tabIndex={0}
              role="button"
              aria-label="Create new custom genie assistant for your unique workflow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Add navigation when feature is implemented
                }
              }}
              _hover={{
                boxShadow: 'neo.md',
              }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px'
              }}
              transition="all 0.3s"
            >
              <Card.Body p={8}>
                <VStack gap={3}>
                  <Icon as={FiPlus} boxSize={8} color="purple.600" />
                  <Heading size="md" color="purple.900">
                    Create New Genie
                  </Heading>
                  <Text color="purple.700" fontSize="sm" textAlign="center">
                    Build a custom assistant for your unique workflow
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </Box>
        </VStack>
      </Container>
    </Box>
    </MainLayout>
  )
}
