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
  Input,
  Textarea,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FiDownload,
  FiBookmark,
  FiShare2,
  FiSend,
  FiCheckCircle,
  FiMessageCircle,
} from 'react-icons/fi'
import { Checkbox } from '@/components/ui/checkbox'
import { useDonorGenieStore } from '@/lib/stores'
import { useDonorMeetingAgent } from '@/lib/agents'
import MainLayout from '@/components/layout/MainLayout'

export default function DonorMeetingPracticePage() {
  const router = useRouter()
  const [userMessage, setUserMessage] = useState('')
  const [captureNotes, setCaptureNotes] = useState(false)

  const { sessionConfig, conversationHistory, coachingTips, score } = useDonorGenieStore()
  const { sendMessage, endSession, isProcessing } = useDonorMeetingAgent()

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return

    try {
      await sendMessage(userMessage)
      setUserMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const donorContext = {
    name: sessionConfig.donorProfile || 'Donor',
    type: sessionConfig.donorType || 'Individual',
    relationship: 'Practice Session',
    priorGifts: 'N/A',
    focus: sessionConfig.objections || 'General',
  }

  const practiceInsights = [
    'Save the donor\'s profile and validate how to say "yes" without over-promising',
    'Record the conversation for later reference',
    'Capture next steps in real-time',
  ]

  const reflectiveQuestions = [
    'Why would you want to run this?',
    'Are you reflecting or asking the Genie for knowledge on this?',
  ]

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background">
        <Container maxW="container.xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" gap={1}>
              <Heading size="xl" color="purple.900">
                Donor Meeting Genie
              </Heading>
              <Text color="purple.700">
                Prepare conversations and capture next steps
              </Text>
            </VStack>
            <Badge colorPalette="purple" fontSize="sm" px={3} py={1}>
              Step 3 of 3
            </Badge>
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
            {/* Left Column - Practice Info */}
            <VStack gap={6} align="stretch">
              {/* Reduction Section */}
              <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <Card.Header>
                  <Heading size="sm" color="purple.900">
                    Reduction
                  </Heading>
                </Card.Header>
                <Card.Body>
                  <Text fontSize="sm" color="purple.700" lineHeight="tall">
                    Research has validated good fundraising hinges on listening more than asking. Reduce "I" statements and focus on "You" during your conversation.
                  </Text>
                  <Box mt={4} p={3} bg="neomorphic.background" borderRadius="2xl" boxShadow="neo.inset.sm">
                    <Text fontSize="xs" color="purple.900" fontStyle="italic">
                      "e.g., Now I'm excited to spend this time hearing more about what aspects of the work resonate with you."
                    </Text>
                  </Box>
                  <Text fontSize="xs" color="purple.600" mt={3}>
                    What would you like to start with?
                  </Text>
                </Card.Body>
              </Card.Root>

              {/* Knowledge Capture */}
              <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <Card.Header>
                  <HStack>
                    <Checkbox
                      checked={captureNotes}
                      onCheckedChange={(checked) => setCaptureNotes(!!checked.checked)}
                    />
                    <Heading size="sm" color="purple.900">
                      Knowledge Capture
                    </Heading>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <VStack gap={3} align="start">
                    {practiceInsights.map((insight, index) => (
                      <HStack key={index} align="start" gap={2}>
                        <Icon as={FiCheckCircle} color="purple.600" mt={0.5} />
                        <Text fontSize="sm" color="purple.700">
                          {insight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Talk to the Genie */}
              <Card.Root bg="neomorphic.background" borderRadius="3xl" boxShadow="neo.inset.md" border="none">
                <Card.Header>
                  <Heading size="sm" color="purple.900">
                    Talk to the Genie
                  </Heading>
                </Card.Header>
                <Card.Body>
                  <Text fontSize="sm" color="purple.700" mb={3}>
                    Ask one reflective or question to the Genie. Take time to role practice your ask or knowledge:
                  </Text>
                  <VStack gap={2} align="stretch">
                    {reflectiveQuestions.map((question, index) => (
                      <Box
                        key={index}
                        p={3}
                        bg="neomorphic.surface"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        border="none"
                      >
                        <Text fontSize="xs" color="purple.900">
                          {question}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                  <Button
                    size="sm"
                    colorPalette="purple"
                    variant="outline"
                    color="purple.900"
                    w="full"
                    mt={4}
                    bg="neomorphic.surface"
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
                </Card.Body>
              </Card.Root>
            </VStack>

            {/* Middle Column - Donor Profile & Conversation */}
            <Box gridColumn={{ base: '1', lg: 'span 2' }}>
              <VStack gap={6} align="stretch">
                {/* Donor Profile */}
                <Card.Root bg="purple.700" color="white" borderRadius="3xl" border="none" boxShadow="neo.md">
                  <Card.Header>
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Heading size="md">Your Practice Session is Ready</Heading>
                        <Text fontSize="sm" opacity={0.9}>
                          Based on all the inputs you provided, this is what the Genie is now trained for your practice run.</Text>
                      </VStack>
                    </HStack>
                  </Card.Header>
                  <Card.Body>
                    <SimpleGrid columns={2} gap={4}>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" opacity={0.8}>Donor Name</Text>
                        <Text fontWeight="semibold">{donorContext.name}</Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" opacity={0.8}>Type</Text>
                        <Text fontWeight="semibold">{donorContext.type}</Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" opacity={0.8}>Prior Gifts</Text>
                        <Text fontWeight="semibold">{donorContext.priorGifts}</Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" opacity={0.8}>Focus Area</Text>
                        <Text fontWeight="semibold">{donorContext.focus}</Text>
                      </VStack>
                    </SimpleGrid>
                  </Card.Body>
                </Card.Root>

                {/* Search Summary */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Search Summary
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={3} align="stretch">
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>Donor Based Date</Text>
                        <Text fontSize="sm" color="purple.900">Recent philanthropic interest in youth mentorship programs</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>Prior Gifts</Text>
                        <Text fontSize="sm" color="purple.900">$25,000 annual gifts for the past 3 years</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>Key Practice Points</Text>
                        <Text fontSize="sm" color="purple.900">Focus on measurable outcomes, emphasize leadership development aspects</Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Conversation */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <HStack justify="space-between">
                      <Heading size="sm" color="purple.900">
                        Practice Conversation
                      </Heading>
                      <Badge colorPalette="green">Live</Badge>
                    </HStack>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={4} align="stretch" maxH="400px" overflowY="auto">
                      {conversationHistory.length === 0 ? (
                        <Box p={8} textAlign="center">
                          <Text color="purple.600" fontSize="sm">
                            Start the conversation by typing your message below
                          </Text>
                        </Box>
                      ) : (
                        conversationHistory.map((msg, index) => (
                          <Box
                            key={index}
                            p={4}
                            bg={msg.role === 'assistant' ? 'neomorphic.surface' : 'neomorphic.background'}
                            borderRadius="2xl"
                            boxShadow={msg.role === 'assistant' ? 'neo.sm' : 'neo.inset.sm'}
                            border="none"
                          >
                            <HStack mb={2} justify="space-between">
                              <Badge
                                colorPalette={msg.role === 'assistant' ? 'purple' : 'purple'}
                                fontSize="xs"
                              >
                                {msg.role === 'assistant' ? 'Donor' : 'You'}
                              </Badge>
                              <Text fontSize="xs" color="purple.600">{new Date().toLocaleTimeString()}</Text>
                            </HStack>
                            <Text fontSize="sm" color="purple.900" lineHeight="tall">
                              {msg.content}
                            </Text>
                          </Box>
                        ))
                      )}
                    </VStack>

                    {/* Message Input */}
                    <Box mt={4}>
                      <HStack gap={2}>
                        <Input
                          placeholder="Type your response..."
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isProcessing) {
                              handleSendMessage()
                            }
                          }}
                          disabled={isProcessing}
                          color="purple.900"
                          _placeholder={{ color: 'purple.400' }}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                          _focusVisible={{
                            outline: '3px solid',
                            outlineColor: 'purple.500',
                            outlineOffset: '2px',
                          }}
                        />
                        <Button
                          colorPalette="purple"
                          color="white"
                          onClick={handleSendMessage}
                          disabled={isProcessing || !userMessage.trim()}
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
                          <Icon as={FiSend} mr={2} />
                          {isProcessing ? 'Sending...' : 'Send'}
                        </Button>
                      </HStack>
                    </Box>
                  </Card.Body>
                </Card.Root>

                {/* Action Buttons */}
                <HStack gap={4} justify="center">
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
                    Download Transcript
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
                    <Icon as={FiBookmark} mr={2} />
                    Save to Workbook
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
                    <Icon as={FiShare2} mr={2} />
                    Share with Colleague
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
    </MainLayout>
  )
}
