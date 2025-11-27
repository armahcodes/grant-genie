'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  InputGroup,
  SimpleGrid,
  Badge,
  Flex,
  Card,
  Icon,
  IconButton,
  List,
} from '@chakra-ui/react'
import { useState } from 'react'
import {
  FiSend,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiSearch,
  FiBarChart2,
  FiCheckSquare,
  FiPlus,
  FiList,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'

export default function ResourcesPage() {
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Grant Assistant. I can help you with:\n\n• Finding grants and opportunities\n• Tracking application deadlines\n• Generating reports and analytics\n• Managing compliance requirements',
    },
  ])

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { role: 'user', content: chatInput }])
      setChatInput('')
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I can help you with that! Let me gather the information you need...',
          },
        ])
      }, 1000)
    }
  }

  const borderColor = 'purple.200'
  const messageBgUser = 'purple.600'
  const messageBgAssistant = 'purple.50'

  const templates = [
    { name: 'Federal Grant Template', icon: FiDownload },
    { name: 'Foundation Grant Template', icon: FiDownload },
    { name: 'Corporate Grant Template', icon: FiDownload },
  ]

  const guides = [
    { name: 'Grant Writing Best Practices', icon: FiExternalLink },
    { name: 'Compliance Management Guide', icon: FiExternalLink },
    { name: 'Budget Planning Handbook', icon: FiExternalLink },
  ]

  const tools = [
    { name: 'Budget Calculator', icon: FiList },
    { name: 'Timeline Planner', icon: FiList },
    { name: 'Compliance Checklist', icon: FiList },
  ]

  const quickActions = [
    { name: 'New Application', icon: FiPlus },
    { name: 'Find Grants', icon: FiSearch },
    { name: 'View Reports', icon: FiBarChart2 },
    { name: 'Check Deadlines', icon: FiCheckSquare },
  ]

  return (
    <MainLayout>
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2} color="purple.900">
              Grant Management Resources
            </Heading>
            <Text color="purple.700">
              Access templates, guides, and tools to streamline your grant management process
            </Text>
          </Box>

          {/* AI Grant Copilot */}
          <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Header>
              <HStack>
                <Icon as={FiFileText} boxSize={6} color="purple.600" />
                <Heading size="md" color="purple.900">AI Grant Copilot</Heading>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                <Text color="purple.700" fontSize="sm">
                  Hello! I'm your AI Grant Assistant. I can help you with:
                </Text>
                <List.Root gap={1} fontSize="sm" color="purple.700">
                  <List.Item>• Finding grants and opportunities</List.Item>
                  <List.Item>• Tracking application deadlines</List.Item>
                  <List.Item>• Generating reports and analytics</List.Item>
                </List.Root>

                {/* Chat Messages */}
                <Box
                  maxH="300px"
                  overflowY="auto"
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={4}
                  bg="purple.50"
                >
                  <VStack gap={3} align="stretch">
                    {messages.map((message, index) => (
                      <Flex
                        key={index}
                        justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                      >
                        <Box
                          maxW="80%"
                          bg={message.role === 'user' ? messageBgUser : messageBgAssistant}
                          color={message.role === 'user' ? 'white' : 'purple.900'}
                          px={4}
                          py={2}
                          borderRadius="lg"
                          whiteSpace="pre-line"
                        >
                          <Text fontSize="sm">{message.content}</Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

                {/* Chat Input */}
                <HStack>
                  <Input
                    placeholder="Ask me anything about grant management..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage()
                      }
                    }}
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    boxShadow="neo.inset.sm"
                    color="purple.900"
                    _placeholder={{ color: 'purple.400' }}
                    _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                  />
                  <IconButton
                    aria-label="Send message to AI assistant"
                    size="sm"
                    colorPalette="purple"
                    onClick={handleSendMessage}
                    borderRadius="2xl"
                    boxShadow="neo.md"
                    _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.95)', boxShadow: 'neo.sm' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px'
                    }}
                  >
                    <Icon as={FiSend} />
                  </IconButton>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Resources Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {/* Application Templates */}
            <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              <Card.Header>
                <HStack>
                  <Icon as={FiFileText} boxSize={5} color="purple.600" />
                  <Heading size="sm" color="purple.900">Application Templates</Heading>
                </HStack>
                <Text fontSize="sm" color="purple.700" mt={2}>
                  Pre-built templates for common grant applications
                </Text>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  {templates.map((template, index) => (
                    <HStack
                      key={index}
                      justify="space-between"
                      p={3}
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                      cursor="pointer"
                      transition="all 0.3s"
                    >
                      <Text fontSize="sm" color="purple.900">{template.name}</Text>
                      <Icon as={template.icon} color="purple.600" />
                    </HStack>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Best Practice Guides */}
            <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              <Card.Header>
                <HStack>
                  <Icon as={FiFileText} boxSize={5} color="purple.600" />
                  <Heading size="sm" color="purple.900">Best Practice Guides</Heading>
                </HStack>
                <Text fontSize="sm" color="purple.700" mt={2}>
                  Comprehensive guides for successful grant management
                </Text>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  {guides.map((guide, index) => (
                    <HStack
                      key={index}
                      justify="space-between"
                      p={3}
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                      cursor="pointer"
                      transition="all 0.3s"
                    >
                      <Text fontSize="sm" color="purple.900">{guide.name}</Text>
                      <Icon as={guide.icon} color="purple.600" />
                    </HStack>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Management Tools */}
            <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              <Card.Header>
                <HStack>
                  <Icon as={FiFileText} boxSize={5} color="purple.600" />
                  <Heading size="sm" color="purple.900">Management Tools</Heading>
                </HStack>
                <Text fontSize="sm" color="purple.700" mt={2}>
                  Tools to streamline your grant management workflow
                </Text>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  {tools.map((tool, index) => (
                    <HStack
                      key={index}
                      justify="space-between"
                      p={3}
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                      cursor="pointer"
                      transition="all 0.3s"
                    >
                      <Text fontSize="sm" color="purple.900">{tool.name}</Text>
                      <Icon as={tool.icon} color="purple.600" />
                    </HStack>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Quick Actions */}
          <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Header>
              <Heading size="md" color="purple.900">Quick Actions</Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    colorPalette="purple"
                    color="purple.900"
                    h="100px"
                    flexDirection="column"
                    gap={2}
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    boxShadow="neo.sm"
                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                    _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                  >
                    <Icon as={action.icon} boxSize={8} />
                    <Text fontSize="sm">{action.name}</Text>
                  </Button>
                ))}
              </SimpleGrid>
            </Card.Body>
          </Card.Root>

          {/* Pagination */}
          <Flex justify="center" align="center" gap={2}>
            <IconButton
              aria-label="Go to previous page of resources"
              variant="outline"
              size="sm"
              color="purple.900"
              bg="neomorphic.background"
              border="none"
              borderRadius="2xl"
              boxShadow="neo.sm"
              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
              _active={{ transform: 'scale(0.95)', boxShadow: 'neo.inset.sm' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px'
              }}
            >
              <Text>&lt;</Text>
            </IconButton>
            <Text fontSize="sm" color="purple.700">
              8 / 12
            </Text>
            <IconButton
              aria-label="Go to next page of resources"
              variant="outline"
              size="sm"
              color="purple.900"
              bg="neomorphic.background"
              border="none"
              borderRadius="2xl"
              boxShadow="neo.sm"
              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
              _active={{ transform: 'scale(0.95)', boxShadow: 'neo.inset.sm' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px'
              }}
            >
              <Text>&gt;</Text>
            </IconButton>
          </Flex>
        </VStack>
      </Container>
    </MainLayout>
  )
}
