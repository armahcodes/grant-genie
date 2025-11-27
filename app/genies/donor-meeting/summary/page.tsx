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
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FiArrowRight, FiEdit, FiRefreshCw, FiDownload } from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'

export default function DonorMeetingSummaryPage() {
  const router = useRouter()

  const setupDetails = [
    { label: 'Donor', value: 'Robert Chen' },
    { label: 'Type', value: 'Major Individual' },
    { label: 'Format', value: '1-on-1 in-person' },
    { label: 'Prep time', value: '15 mins' },
    { label: 'Anticipated Objections', value: '7 already given to you' },
  ]

  const practiceConversation = [
    {
      speaker: 'Robert Chen',
      role: 'Donor',
      message: "I'd love to know more about your ask. I think it may be a bit vague so I'm curious if you are looking at us as a strategic or more transactional donor. We need to know this before we can give you any meaningful response to today's ask.",
    },
    {
      speaker: 'Sarah Johnson',
      role: 'You',
      message: "I really appreciate you being so upfront, Robert. Let me clarify: we're asking you to be a strategic partner, not just a one-off contributor. Your support would make a transformative impact on the way we...",
    },
    {
      speaker: 'Robert Chen',
      role: 'Donor',
      message: "Can you share a little more about the ask? I know there's a lot of content in this program email, but I'm still struggling to see what the grant is specifically for and how you'll use the funds we give.",
    },
    {
      speaker: 'Sarah Johnson',
      role: 'You',
      message: "Absolutely. Let me break this down specifically: our current grant ask, which I think our email didn't do a great job of getting across the key point (Thanks for checking in!), is to...",
    },
  ]

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background">
        <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" gap={1}>
              <Heading size="xl" color="purple.900">
                Donor Meeting Genie
              </Heading>
              <Text color="purple.700">
                Practice conversations and analyze your pitch
              </Text>
            </VStack>
            <Badge colorPalette="purple" fontSize="sm" px={3} py={1}>
              Step 2 of 3
            </Badge>
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
            {/* Left Column - Setup Summary */}
            <VStack gap={6} align="stretch">
              <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <Card.Header>
                  <Heading size="md" color="purple.900">
                    Setup Summary
                  </Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={4} align="stretch">
                    {setupDetails.map((detail, index) => (
                      <HStack key={index} justify="space-between">
                        <Text fontSize="sm" color="purple.700" fontWeight="medium">
                          {detail.label}
                        </Text>
                        <Text fontSize="sm" color="purple.900" fontWeight="semibold">
                          {detail.value}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <Card.Header>
                  <Heading size="md" color="purple.900">
                    Talk to the Genie
                  </Heading>
                  <Text fontSize="sm" color="purple.700" mt={2}>
                    Before you practice or start your real talk, Add approachable questions, such as one like the "why" you check Reflection prompts. You can ask any questions you like whether it's to your funders or to yourself.
                  </Text>
                </Card.Header>
                <Card.Body>
                  <VStack gap={3} align="stretch">
                    <Box
                      p={4}
                      bg="neomorphic.background"
                      borderRadius="2xl"
                      boxShadow="neo.inset.sm"
                      borderLeft="4px solid"
                      borderColor="purple.400"
                    >
                      <Text fontSize="sm" color="purple.900" fontStyle="italic">
                        "e.g., I want to practice being more specific about my track record. Help me think through what strong evidence looks like and what ways of articulating my proof could be most impactful."
                      </Text>
                    </Box>
                    <Button
                      colorPalette="purple"
                      variant="outline"
                      color="purple.900"
                      size="sm"
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                      _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                      _focusVisible={{
                        outline: '3px solid',
                        outlineColor: 'purple.500',
                        outlineOffset: '2px',
                      }}
                    >
                      Ask the Knowledge Base
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>

            {/* Right Column - Practice Session Preview */}
            <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              <Card.Header>
                <Heading size="md" color="purple.900">
                  Practice Session Preview
                </Heading>
                <Text fontSize="sm" color="purple.700" mt={2}>
                  Your Practice is using all the context to bring the donor to life in the conversation below.
                </Text>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  {practiceConversation.map((exchange, index) => (
                    <Box
                      key={index}
                      p={4}
                      bg={exchange.role === 'Donor' ? 'neomorphic.surface' : 'neomorphic.background'}
                      borderRadius="2xl"
                      boxShadow={exchange.role === 'Donor' ? 'neo.sm' : 'neo.inset.sm'}
                      border="none"
                    >
                      <HStack mb={2} gap={2}>
                        <Badge
                          colorPalette={exchange.role === 'Donor' ? 'purple' : 'purple'}
                          fontSize="xs"
                        >
                          {exchange.speaker} ({exchange.role})
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="purple.900" lineHeight="tall">
                        {exchange.message}
                      </Text>
                    </Box>
                  ))}

                  <Box p={4} bg="neomorphic.background" borderRadius="2xl" boxShadow="neo.inset.sm">
                    <HStack gap={2}>
                      <Icon as={FiRefreshCw} color="purple.600" />
                      <Text fontSize="sm" color="purple.700" fontWeight="medium">
                        Coaching Tip
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="purple.900" mt={2}>
                      Notice how each response acknowledges the donor's concern before pivoting? Practice this technique for more natural conversation flow.
                    </Text>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Action Buttons */}
          <HStack gap={4} justify="center" pt={4}>
            <Button
              colorPalette="purple"
              variant="outline"
              color="purple.900"
              bg="neomorphic.background"
              border="none"
              borderRadius="2xl"
              boxShadow="neo.sm"
              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
              _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px',
              }}
            >
              <Icon as={FiEdit} mr={2} />
              Edit Session
            </Button>
            <Button
              colorPalette="purple"
              variant="outline"
              color="purple.900"
              bg="neomorphic.background"
              border="none"
              borderRadius="2xl"
              boxShadow="neo.sm"
              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
              _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px',
              }}
            >
              <Icon as={FiRefreshCw} mr={2} />
              Regenerate
            </Button>
            <Button
              colorPalette="purple"
              variant="outline"
              color="purple.900"
              bg="neomorphic.background"
              border="none"
              borderRadius="2xl"
              boxShadow="neo.sm"
              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
              _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px',
              }}
            >
              <Icon as={FiDownload} mr={2} />
              Export
            </Button>
          </HStack>

          {/* Continue Button */}
          <Flex justify="center">
            <Button
              size="lg"
              colorPalette="purple"
              color="white"
              px={12}
              onClick={() => router.push('/genies/donor-meeting/practice')}
              borderRadius="2xl"
              boxShadow="neo.md"
              _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
              _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px',
              }}
            >
              Continue to Genie
              <Icon as={FiArrowRight} ml={2} />
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
    </MainLayout>
  )
}
