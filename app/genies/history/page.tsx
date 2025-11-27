'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  VStack,
  HStack,
  Icon,
  Button,
  Badge,
  Spinner,
  Tabs,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  FiFileText,
  FiUsers,
  FiMail,
  FiSettings,
  FiClock,
  FiTrash2,
  FiPlay,
  FiArchive,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useAppToast } from '@/lib/utils/toast'
import { useGrantGenieStore, useDonorGenieStore } from '@/lib/stores'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface GenieSession {
  id: number
  name: string
  genieType: string
  status: string
  config: Record<string, unknown>
  inputData: Record<string, unknown> | null
  outputContent: string | null
  executionCount: number
  lastExecutedAt: string | null
  createdAt: string
  updatedAt: string
}

const genieTypeConfig: Record<string, { icon: typeof FiFileText; label: string; color: string; href: string }> = {
  grant_writing: { icon: FiFileText, label: 'Grant Writing', color: 'purple', href: '/grant-application' },
  donor_meeting: { icon: FiUsers, label: 'Donor Meeting', color: 'blue', href: '/genies/donor-meeting' },
  newsletter: { icon: FiMail, label: 'Newsletter', color: 'green', href: '/genies/newsletter' },
  email_management: { icon: FiSettings, label: 'Email Management', color: 'orange', href: '/genies/email-management' },
}

const statusColors: Record<string, string> = {
  draft: 'gray',
  in_progress: 'yellow',
  completed: 'green',
  archived: 'red',
}

export default function GenieHistoryPage() {
  const router = useRouter()
  const toast = useAppToast()
  const [sessions, setSessions] = useState<GenieSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const { loadSessionFromDb: loadGrantSession, resetGrantGenie } = useGrantGenieStore()
  const { loadSessionFromDb: loadDonorSession, resetDonorGenie } = useDonorGenieStore()

  useEffect(() => {
    fetchSessions()
  }, [activeTab])

  const fetchSessions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'all') {
        params.set('genieType', activeTab)
      }
      params.set('limit', '50')

      const response = await fetch(`/api/genie-sessions?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }

      const result = await response.json()
      setSessions(result.data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Failed to load sessions', 'Error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadSession = async (session: GenieSession) => {
    try {
      if (session.genieType === 'grant_writing') {
        await loadGrantSession(session.id)
        router.push('/grant-application/proposal')
      } else if (session.genieType === 'donor_meeting') {
        await loadDonorSession(session.id)
        router.push('/genies/donor-meeting')
      } else {
        toast.info('This genie type is coming soon', 'Coming Soon')
      }
    } catch (error) {
      toast.error('Failed to load session', 'Error')
    }
  }

  const handleArchiveSession = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/genie-sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to archive session')
      }

      toast.success('Session archived', 'Archived')
      fetchSessions()
    } catch (error) {
      toast.error('Failed to archive session', 'Error')
    }
  }

  const handleStartNew = (genieType: string) => {
    if (genieType === 'grant_writing') {
      resetGrantGenie()
      router.push('/grant-application')
    } else if (genieType === 'donor_meeting') {
      resetDonorGenie()
      router.push('/genies/donor-meeting')
    } else {
      const config = genieTypeConfig[genieType]
      if (config) {
        router.push(config.href)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background" py={8}>
        <Container maxW="container.xl">
          <VStack gap={8} align="stretch">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: 'Genies', href: '/genies' },
                { label: 'History', isCurrentPage: true },
              ]}
            />

            {/* Header */}
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={1}>
                <Heading size="xl" color="purple.900">
                  Session History
                </Heading>
                <Text color="purple.700">
                  View and continue your previous genie sessions
                </Text>
              </VStack>
              <Button
                colorPalette="purple"
                color="white"
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
              >
                Start New Session
              </Button>
            </HStack>

            {/* Tabs */}
            <Tabs.Root
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value)}
              fitted
              variant="enclosed"
            >
              <Tabs.List
                bg="neomorphic.surface"
                borderRadius="2xl"
                boxShadow="neo.sm"
                p={1}
              >
                <Tabs.Trigger
                  value="all"
                  color="purple.700"
                  _selected={{ bg: 'purple.600', color: 'white', borderRadius: 'xl' }}
                >
                  All
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="grant_writing"
                  color="purple.700"
                  _selected={{ bg: 'purple.600', color: 'white', borderRadius: 'xl' }}
                >
                  <Icon as={FiFileText} mr={2} />
                  Grant Writing
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="donor_meeting"
                  color="purple.700"
                  _selected={{ bg: 'purple.600', color: 'white', borderRadius: 'xl' }}
                >
                  <Icon as={FiUsers} mr={2} />
                  Donor Meeting
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="newsletter"
                  color="purple.700"
                  _selected={{ bg: 'purple.600', color: 'white', borderRadius: 'xl' }}
                >
                  <Icon as={FiMail} mr={2} />
                  Newsletter
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="email_management"
                  color="purple.700"
                  _selected={{ bg: 'purple.600', color: 'white', borderRadius: 'xl' }}
                >
                  <Icon as={FiSettings} mr={2} />
                  Email
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            {/* Content */}
            {isLoading ? (
              <VStack py={12}>
                <Spinner size="xl" color="purple.600" />
                <Text color="purple.700">Loading sessions...</Text>
              </VStack>
            ) : sessions.length === 0 ? (
              <Card.Root
                bg="neomorphic.surface"
                borderRadius="3xl"
                boxShadow="neo.inset.md"
                border="none"
              >
                <Card.Body py={12}>
                  <VStack gap={4}>
                    <Icon as={FiClock} boxSize={12} color="purple.400" />
                    <Heading size="md" color="purple.900">
                      No sessions yet
                    </Heading>
                    <Text color="purple.700" textAlign="center">
                      Start a new genie session to see your history here
                    </Text>
                    <Button
                      colorPalette="purple"
                      color="white"
                      onClick={() => router.push('/genies')}
                      mt={4}
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
                      Start New Session
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {sessions.map((session) => {
                  const config = genieTypeConfig[session.genieType] || genieTypeConfig.grant_writing
                  return (
                    <Card.Root
                      key={session.id}
                      bg="neomorphic.surface"
                      borderRadius="3xl"
                      boxShadow="neo.md"
                      border="none"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: 'neo.lg',
                      }}
                      transition="all 0.3s"
                    >
                      <Card.Body p={6}>
                        <VStack gap={4} align="stretch">
                          {/* Header */}
                          <HStack justify="space-between">
                            <HStack gap={2}>
                              <Box
                                p={2}
                                bg="neomorphic.background"
                                borderRadius="xl"
                                boxShadow="neo.inset.sm"
                              >
                                <Icon as={config.icon} boxSize={5} color={`${config.color}.600`} />
                              </Box>
                              <Badge colorPalette={statusColors[session.status]} fontSize="xs">
                                {session.status}
                              </Badge>
                            </HStack>
                            {session.executionCount > 0 && (
                              <Badge colorPalette="purple" fontSize="xs">
                                {session.executionCount} run{session.executionCount > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </HStack>

                          {/* Title */}
                          <VStack align="start" gap={1}>
                            <Heading size="sm" color="purple.900" lineClamp={1}>
                              {session.name}
                            </Heading>
                            <Text fontSize="xs" color="purple.600">
                              {config.label}
                            </Text>
                          </VStack>

                          {/* Date */}
                          <HStack gap={1} color="purple.600" fontSize="xs">
                            <Icon as={FiClock} />
                            <Text>
                              {session.lastExecutedAt
                                ? formatDate(session.lastExecutedAt)
                                : formatDate(session.createdAt)}
                            </Text>
                          </HStack>

                          {/* Actions */}
                          <HStack gap={2} pt={2}>
                            <Button
                              flex={1}
                              size="sm"
                              colorPalette="purple"
                              color="white"
                              onClick={() => handleLoadSession(session)}
                              borderRadius="xl"
                              boxShadow="neo.sm"
                              _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                              _active={{ transform: 'scale(0.98)' }}
                              _focusVisible={{
                                outline: '3px solid',
                                outlineColor: 'purple.500',
                                outlineOffset: '2px',
                              }}
                            >
                              <Icon as={FiPlay} mr={1} />
                              Continue
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              colorPalette="gray"
                              color="purple.900"
                              onClick={() => handleArchiveSession(session.id)}
                              borderRadius="xl"
                              bg="neomorphic.background"
                              border="none"
                              boxShadow="neo.sm"
                              _hover={{ boxShadow: 'neo.md', color: 'red.600' }}
                              _active={{ boxShadow: 'neo.inset.sm' }}
                              _focusVisible={{
                                outline: '3px solid',
                                outlineColor: 'purple.500',
                                outlineOffset: '2px',
                              }}
                            >
                              <Icon as={FiArchive} />
                            </Button>
                          </HStack>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  )
                })}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  )
}
