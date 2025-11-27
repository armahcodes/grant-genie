'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  SimpleGrid,
  Icon,
  Flex,
  VStack,
  HStack,
  Badge,
  Button,
  Progress,
  Separator,
  Image,
} from '@chakra-ui/react'
// Icon Library Standardization - Using Feather Icons (fi) exclusively
import { FiFileText, FiTrendingUp, FiCheckCircle, FiClock, FiCalendar, FiSearch, FiPlus, FiBell, FiArrowRight, FiAlertCircle, FiZap, FiTarget, FiDollarSign, FiAward, FiUsers, FiMail, FiMessageCircle } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { DashboardStatsSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { NoApplicationsEmptyState, NoDeadlinesEmptyState } from '@/components/ui/EmptyState'
import { useAppToast } from '@/lib/utils/toast'
import { formatDate } from '@/lib/utils/dates'
import { useAuth } from '@/contexts/AuthContext'
import { colors } from '@/theme/tokens'
import { useDashboardStats, useRecentActivity } from '@/lib/api/dashboard'
import { useGrantApplications } from '@/lib/api/grants'
import { useCompliance } from '@/lib/api/compliance'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const toast = useAppToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [animatedStats, setAnimatedStats] = useState({
    activeGrants: 0,
    complianceRate: 0,
  })

  // Fetch data from APIs
  const { data: statsData, isLoading: statsLoading } = useDashboardStats(user?.id)
  const { data: grants, isLoading: grantsLoading } = useGrantApplications()
  const { data: complianceData, isLoading: complianceLoading } = useCompliance(user?.id)
  const { data: activityData, isLoading: activitiesLoading } = useRecentActivity(user?.id)

  const stats = statsData?.stats
  const activities = activityData?.activities

  // Extract items from compliance data
  const complianceItems = complianceData?.items || []

  const isLoading = statsLoading || grantsLoading || complianceLoading

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Animate stats when data loads
  useEffect(() => {
    if (!stats) return

    const duration = 1500
    const steps = 60
    const interval = duration / steps
    let currentStep = 0

    const animate = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedStats({
        activeGrants: Math.round(stats.activeGrants * easeOutQuart),
        complianceRate: Math.round(stats.complianceRate * easeOutQuart),
      })

      if (currentStep >= steps) {
        clearInterval(animate)
        setAnimatedStats({
          activeGrants: stats.activeGrants,
          complianceRate: stats.complianceRate,
        })
      }
    }, interval)

    return () => clearInterval(animate)
  }, [stats])

  // Use centralized theme tokens
  const { deepIndigo, softTeal, tealVariant, indigoVariant } = colors.brand

  // Get recent applications (top 5) - use real data or fallback to empty
  const recentApplications = grants?.slice(0, 5) || []

  // Get upcoming compliance deadlines
  const upcomingDeadlines = complianceItems
    ?.filter(item => item.status === 'Upcoming' || item.status === 'Overdue')
    .slice(0, 5) || []

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <MainLayout>
      {/* Premium Header Background */}
      <Box
        position="relative"
        bgGradient={`linear(to-br, ${deepIndigo}, #2D2C5A, #1a1a3e)`}
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          w: '600px',
          h: '600px',
          bg: softTeal,
          borderRadius: 'full',
          filter: 'blur(120px)',
          opacity: 0.15,
        }}
      >
        <Container maxW="container.xl" py={{ base: 8, md: 12 }} position="relative" zIndex={1}>
          <VStack align="stretch" gap={6}>
            {/* Welcome Header */}
            <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={2}>
                <HStack gap={3}>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.900" fontWeight="medium">
                    {getGreeting()}, {user?.name || 'there'}
                  </Text>
                  <Text fontSize={{ base: '2xl', md: '3xl' }}>👋</Text>
                </HStack>
                <Heading
                  size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                  color="white"
                  letterSpacing={{ base: 'normal', md: '-0.01em', lg: '-0.02em' }}
                  lineHeight={{ base: '1.2', md: '1.1' }}
                >
                  Your Headspace Command Center
                </Heading>
                <Text
                  color="whiteAlpha.800"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  maxW="2xl"
                  lineHeight="1.5"
                >
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </VStack>

              <HStack gap={3} flexWrap="wrap">
                <Button
                  size="md"
                  variant="outline"
                  borderWidth="2px"
                  borderColor="whiteAlpha.400"
                  color="white"
                  bg="whiteAlpha.100"
                  backdropFilter="blur(10px)"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    borderColor: softTeal,
                    transform: 'translateY(-2px)',
                  }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: softTeal,
                    outlineOffset: '2px'
                  }}
                  transition="all 0.3s"
                  onClick={() => router.push('/grant-search')}
                  aria-label="Navigate to grant search to discover funding opportunities"
                >
                  <Icon as={FiSearch} mr={2} />
                  <Text display={{ base: 'none', sm: 'inline' }}>Discover Grants</Text>
                  <Text display={{ base: 'inline', sm: 'none' }}>Discover</Text>
                </Button>
                <Button
                  size="lg"
                  bgGradient={`linear(to-r, ${softTeal}, #4BC5CC)`}
                  color="white"
                  _hover={{
                    bgGradient: `linear(to-r, #4BC5CC, ${softTeal})`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(92, 225, 230, 0.4)'
                  }}
                  _focusVisible={{
                    outline: '3px solid white',
                    outlineOffset: '2px'
                  }}
                  transition="all 0.3s"
                  boxShadow="0 4px 15px rgba(92, 225, 230, 0.3)"
                  onClick={() => router.push('/grant-application')}
                  aria-label="Start writing a new grant application"
                >
                  <Icon as={FiZap} mr={2} />
                  Start Writing
                </Button>
              </HStack>
            </Flex>

            {/* Urgent Alert Banner */}
            {upcomingDeadlines.some(item => item.status === 'Overdue') && (
              <Card.Root
                bg="whiteAlpha.100"
                backdropFilter="blur(20px)"
                border="2px solid"
                borderColor="red.400"
                borderRadius="2xl"
                >

                <Card.Body p={{ base: 4, md: 5 }}>
                  <HStack gap={4} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <Flex
                      w={12}
                      h={12}
                      bg="red.500"
                      borderRadius="xl"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={FiAlertCircle} boxSize={6} color="white" />
                    </Flex>
                    <Box flex={1}>
                      <Text fontWeight="bold" color="white" mb={1} fontSize={{ base: 'md', md: 'lg' }}>
                        Action Required: Overdue Tasks
                      </Text>
                      <Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.900">
                        You have {upcomingDeadlines.filter(item => item.status === 'Overdue').length} overdue compliance task(s) that need immediate attention.
                      </Text>
                    </Box>
                    <Button
                      size="md"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: 'red.600', transform: 'scale(1.05)' }}
                      _focusVisible={{
                        outline: '3px solid white',
                        outlineOffset: '2px'
                      }}
                      onClick={() => router.push('/compliance-tracker')}
                      flexShrink={0}
                      aria-label="View overdue compliance tasks"
                    >
                      View Tasks
                    </Button>
                  </HStack>
                </Card.Body>
              </Card.Root>
            )}
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8} bg="neomorphic.background" borderRadius="3xl">
        {/* Premium Stats Grid */}
        {isLoading ? (
          <Box mt={{ base: 0, md: -12 }} mb={8}>
            <DashboardStatsSkeleton />
          </Box>
        ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} mb={8} mt={{ base: 0, md: -12 }} position="relative" zIndex={2}>
          {/* Active Grants Card */}
          <Card.Root
            bg="neomorphic.surface"
            cursor="pointer"
            tabIndex={0}
            role="button"
            aria-label="View active grants and applications"
            border="none"
            boxShadow="neo.md"
            _hover={{
              transform: 'translateY(-8px)',
              boxShadow: 'neo.lg',
            }}
            _focusVisible={{
              outline: '3px solid',
              outlineColor: 'purple.500',
              outlineOffset: '2px',
              transform: 'translateY(-8px)'
            }}
            _active={{
              boxShadow: 'neo.sm',
              transform: 'translateY(-2px)',
            }}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            onClick={() => router.push('/grant-application')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push('/grant-application')
              }
            }}
            borderRadius="3xl"
            overflow="hidden"
            position="relative"
          >

            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bgGradient={`linear(to-r, ${deepIndigo}, ${softTeal})`}
            />
            <Card.Body p={{ base: 5, md: 6 }}>
              <VStack gap={4} align="stretch">
                <HStack justify="space-between">
                  <Flex
                    w={{ base: 12, md: 14 }}
                    h={{ base: 12, md: 14 }}
                    bgGradient={`linear(135deg, ${softTeal}20, ${deepIndigo}10)`}
                    borderRadius="xl"
                    align="center"
                    justify="center"
                    boxShadow={`0 4px 15px ${softTeal}30`}
                  >
                    <Icon as={FiFileText} boxSize={{ base: 6, md: 7 }} color={softTeal} />
                  </Flex>
                  <Icon as={FiArrowRight} color={deepIndigo} boxSize={5} />
                </HStack>
                <Box>
                  <Text fontSize="sm" color="purple.700" mb={2} fontWeight="medium">Active Grants</Text>
                  <Heading
                    size={{ base: '2xl', md: '3xl' }}
                    color={deepIndigo}
                    mb={1}
                    transition="all 0.3s"
                    letterSpacing="normal"
                    fontWeight="bold"
                  >
                    {animatedStats.activeGrants}
                  </Heading>
                  <Text fontSize="sm" color="purple.600">Currently managing</Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Total Funding Card */}
          <Card.Root
            bgGradient={`linear(135deg, ${softTeal}, #4BC5CC)`}
            cursor="pointer"
            tabIndex={0}
            role="button"
            aria-label="View total funding and financial reports"
            _hover={{
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 25px 50px ${softTeal}40`,
            }}
            _focusVisible={{
              outline: '3px solid white',
              outlineOffset: '2px',
              transform: 'translateY(-8px) scale(1.02)'
            }}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            onClick={() => router.push('/reporting')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push('/reporting')
              }
            }}
            borderRadius="2xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-30%',
              w: '300px',
              h: '300px',
              bg: 'whiteAlpha.300',
              borderRadius: 'full',
              filter: 'blur(60px)',
            }}
          >
            <Card.Body p={{ base: 5, md: 6 }} position="relative" zIndex={1}>
              <VStack gap={4} align="stretch">
                <HStack justify="space-between">
                  <Flex
                    w={{ base: 12, md: 14 }}
                    h={{ base: 12, md: 14 }}
                    bg="whiteAlpha.300"
                    backdropFilter="blur(10px)"
                    borderRadius="xl"
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiDollarSign} boxSize={{ base: 6, md: 7 }} color="white" />
                  </Flex>
                  <Badge
                    bg="whiteAlpha.300"
                    backdropFilter="blur(10px)"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    <Icon as={FiTrendingUp} mr={1} />
                    +23%
                  </Badge>
                </HStack>
                <Box>
                  <Text fontSize="sm" color="whiteAlpha.900" mb={2} fontWeight="semibold">Total Funding</Text>
                  <Heading
                    size={{ base: 'xl', md: '2xl' }}
                    color="white"
                    mb={1}
                    letterSpacing="normal"
                  >
                    {stats?.totalFunding || '$0'}
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.800">Secured to date</Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Upcoming Deadlines Card */}
          <Card.Root
            bg="neomorphic.surface"
            cursor="pointer"
            tabIndex={0}
            role="button"
            aria-label="View upcoming compliance deadlines"
            border="none"
            boxShadow={(stats?.upcomingDeadlines || 0) > 5 ? 'neo.lg' : 'neo.md'}
            _hover={{
              transform: 'translateY(-8px)',
              boxShadow: 'neo.xl',
            }}
            _focusVisible={{
              outline: '3px solid',
              outlineColor: 'orange.500',
              outlineOffset: '2px',
              transform: 'translateY(-8px)'
            }}
            _active={{
              boxShadow: 'neo.sm',
              transform: 'translateY(-2px)',
            }}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            onClick={() => router.push('/compliance-tracker')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push('/compliance-tracker')
              }
            }}
            borderRadius="3xl"
            position="relative"
            overflow="hidden"
          >

            {(stats?.upcomingDeadlines || 0) > 5 && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="4px"
                bg="orange.400"
              />
            )}
            <Card.Body p={{ base: 5, md: 6 }}>
              <VStack gap={4} align="stretch">
                <HStack justify="space-between">
                  <Flex
                    w={{ base: 12, md: 14 }}
                    h={{ base: 12, md: 14 }}
                    bg="orange.100"
                    borderRadius="xl"
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiClock} boxSize={{ base: 6, md: 7 }} color="orange.500" />
                  </Flex>
                  {(stats?.upcomingDeadlines || 0) > 5 && (
                    <Badge colorPalette="orange" fontSize="sm" px={3} py={1}>Urgent</Badge>
                  )}
                </HStack>
                <Box>
                  <Text fontSize="sm" color="purple.700" mb={2} fontWeight="medium">Upcoming Deadlines</Text>
                  <Heading
                    size={{ base: '2xl', md: '3xl' }}
                    color={deepIndigo}
                    mb={1}
                    letterSpacing="normal"
                    fontWeight="bold"
                  >
                    {stats?.upcomingDeadlines || 0}
                  </Heading>
                  <Text fontSize="sm" color="purple.600">This month</Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Compliance Rate Card */}
          <Card.Root
            bgGradient={`linear(135deg, ${deepIndigo}, #2D2C5A)`}
            cursor="pointer"
            tabIndex={0}
            role="button"
            aria-label="View compliance rate and tracking details"
            _hover={{
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 25px 50px ${deepIndigo}60`,
            }}
            _focusVisible={{
              outline: '3px solid',
              outlineColor: softTeal,
              outlineOffset: '2px',
              transform: 'translateY(-8px) scale(1.02)'
            }}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            onClick={() => router.push('/compliance-tracker')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push('/compliance-tracker')
              }
            }}
            borderRadius="2xl"
            position="relative"
            overflow="hidden"
          >

            <Card.Body p={{ base: 5, md: 6 }} position="relative" zIndex={1}>
              <VStack gap={4} align="stretch">
                <HStack justify="space-between">
                  <Flex
                    w={{ base: 12, md: 14 }}
                    h={{ base: 12, md: 14 }}
                    bg="whiteAlpha.200"
                    backdropFilter="blur(10px)"
                    borderRadius="xl"
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiTarget} boxSize={{ base: 6, md: 7 }} color={softTeal} />
                  </Flex>
                  <Icon as={FiAward} boxSize={6} color={softTeal} />
                </HStack>
                <Box>
                  <Text fontSize="sm" color="whiteAlpha.900" mb={2} fontWeight="semibold">Compliance Rate</Text>
                  <Heading
                    size={{ base: '2xl', md: '3xl' }}
                    color="white"
                    mb={3}
                    transition="all 0.3s"
                    letterSpacing="normal"
                    fontWeight="bold"
                  >
                    {animatedStats.complianceRate}%
                  </Heading>
                  <Progress.Root value={animatedStats.complianceRate} h={2} borderRadius="full">
                    <Progress.Track bg="whiteAlpha.300">
                      <Progress.Range
                        bg={softTeal}
                        boxShadow={`0 0 10px ${softTeal}`}
                        transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                      />
                    </Progress.Track>
                  </Progress.Root>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
        )}

        {/* Main Content Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={8}>
          {/* Recent Applications - Premium Card */}
          <Card.Root
            bg="neomorphic.surface"
            border="none"
            borderRadius="3xl"
            boxShadow="neo.md"
          >

            <Card.Header p={{ base: 5, md: 6 }} pb={4}>
              <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
                <HStack gap={3}>
                  <Flex
                    w={10}
                    h={10}
                    bgGradient={`linear(135deg, ${softTeal}20, ${deepIndigo}10)`}
                    borderRadius="lg"
                    align="center"
                    justify="center"
                    display={{ base: 'none', sm: 'flex' }}
                  >
                    <Icon as={FiFileText} boxSize={5} color={softTeal} />
                  </Flex>
                  <Heading size={{ base: 'md', md: 'lg' }} color={deepIndigo}>Recent Applications</Heading>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  color={deepIndigo}
                  _hover={{ bg: `${softTeal}10` }}
                  onClick={() => router.push('/grant-application')}
                >
                  <Text display={{ base: 'none', sm: 'inline' }}>View All</Text>
                  <Icon as={FiArrowRight} ml={{ base: 0, sm: 2 }} />
                </Button>
              </Flex>
            </Card.Header>
            <Card.Body p={{ base: 4, md: 6 }} pt={2}>
              {isLoading ? (
                <LoadingSkeleton variant="list" count={5} />
              ) : recentApplications.length === 0 ? (
                <NoApplicationsEmptyState onCreateNew={() => router.push('/grant-application')} />
              ) : (
              <VStack gap={3} align="stretch">
                {recentApplications.map((app) => (
                  <Box
                    key={app.id}
                    p={{ base: 4, md: 5 }}
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    tabIndex={0}
                    role="button"
                    aria-label={`View application: ${app.grantTitle}, status: ${app.status}`}
                    boxShadow="neo.sm"
                    _hover={{
                      transform: 'translateX(6px)',
                      boxShadow: 'neo.md',
                    }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px',
                    }}
                    _active={{
                      boxShadow: 'neo.inset.sm',
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    cursor="pointer"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        router.push('/grant-application')
                      }
                    }}
                  >
                    <Flex justify="space-between" align="start" mb={3} gap={3} flexDirection={{ base: 'column', sm: 'row' }}>
                      <Box flex={1} minW={0}>
                        <Text
                          fontWeight="bold"
                          color={deepIndigo}
                          mb={1}
                          fontSize={{ base: 'sm', md: 'md' }}
                          lineClamp={2}
                          lineHeight="1.4"
                          title={app.grantTitle}
                        >
                          {app.grantTitle}
                        </Text>
                        <Text fontSize="sm" color="purple.900" >
                          {app.organization}
                        </Text>
                      </Box>
                      <Badge
                        colorPalette={
                          app.status === 'Approved' ? 'green' :
                          app.status === 'Under Review' ? 'cyan' :
                          app.status === 'Submitted' ? 'blue' :
                          app.status === 'Rejected' ? 'red' : 'gray'
                        }
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="semibold"
                      >
                        {app.status}
                      </Badge>
                    </Flex>
                    <Separator my={3} />
                    <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
                      <HStack gap={2}>
                        <Icon as={FiDollarSign} boxSize={4} color="green.600" />
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="green.600">
                          {app.amount}
                        </Text>
                      </HStack>
                      <HStack gap={2}>
                        <Icon as={FiClock} boxSize={4} color={deepIndigo} />
                        <Text fontSize="sm" color="purple.900" fontWeight="medium">
                          {formatDate(app.deadline)}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
              )}
            </Card.Body>
          </Card.Root>

          {/* Upcoming Deadlines - Premium Card */}
          <Card.Root
            bg="neomorphic.surface"
            border="none"
            borderRadius="3xl"
            boxShadow="neo.md"
          >

            <Card.Header p={{ base: 5, md: 6 }} pb={4}>
              <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
                <HStack gap={3}>
                  <Flex
                    w={10}
                    h={10}
                    bg="orange.100"
                    borderRadius="lg"
                    align="center"
                    justify="center"
                    display={{ base: 'none', sm: 'flex' }}
                  >
                    <Icon as={FiClock} boxSize={5} color="orange.500" />
                  </Flex>
                  <Heading size={{ base: 'md', md: 'lg' }} color={deepIndigo}>Upcoming Deadlines</Heading>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  color={deepIndigo}
                  _hover={{ bg: `${softTeal}10` }}
                  onClick={() => router.push('/compliance-tracker')}
                >
                  <Text display={{ base: 'none', sm: 'inline' }}>View All</Text>
                  <Icon as={FiArrowRight} ml={{ base: 0, sm: 2 }} />
                </Button>
              </Flex>
            </Card.Header>
            <Card.Body p={{ base: 4, md: 6 }} pt={2}>
              {isLoading ? (
                <LoadingSkeleton variant="list" count={5} />
              ) : upcomingDeadlines.length === 0 ? (
                <NoDeadlinesEmptyState />
              ) : (
              <VStack gap={3} align="stretch">
                {upcomingDeadlines.map((item) => (
                  <Box
                    key={item.id}
                    p={{ base: 4, md: 5 }}
                    bg={item.status === 'Overdue' ? 'red.50' : 'neomorphic.background'}
                    border="none"
                    borderRadius="2xl"
                    position="relative"
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.status === 'Overdue' ? 'Overdue task' : 'Upcoming task'}: ${item.requirement} for ${item.grantName}, due ${formatDate(item.dueDate)}`}
                    boxShadow={item.status === 'Overdue' ? '0 4px 15px rgba(239, 68, 68, 0.3)' : 'neo.sm'}
                    _hover={{
                      transform: 'translateX(6px)',
                      boxShadow: item.status === 'Overdue' ? '0 8px 25px rgba(239, 68, 68, 0.4)' : 'neo.md',
                    }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: item.status === 'Overdue' ? 'red.500' : 'purple.500',
                      outlineOffset: '2px',
                      transform: 'translateX(6px)'
                    }}
                    _active={{
                      boxShadow: item.status === 'Overdue' ? '0 2px 8px rgba(239, 68, 68, 0.2)' : 'neo.inset.sm',
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    cursor="pointer"
                    onClick={() => router.push('/compliance-tracker')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        router.push('/compliance-tracker')
                      }
                    }}
                  >
                    {item.status === 'Overdue' && (
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        bottom={0}
                        w="4px"
                        bg="red.500"
                        borderLeftRadius="xl"
                      />
                    )}
                    <Flex justify="space-between" align="start" mb={3} gap={3} flexDirection={{ base: 'column', sm: 'row' }}>
                      <HStack gap={2} flex={1} minW={0}>
                        {item.status === 'Overdue' && (
                          <Icon as={FiAlertCircle} boxSize={5} color="red.500" flexShrink={0} />
                        )}
                        <Box flex={1} minW={0}>
                          <Text
                            fontWeight="bold"
                            fontSize={{ base: 'sm', md: 'md' }}
                            color={item.status === 'Overdue' ? 'red.900' : deepIndigo}
                            mb={1}
                            lineClamp={2}
                            lineHeight="1.4"
                            title={item.requirement}
                          >
                            {item.requirement}
                          </Text>
                          <Text fontSize="sm" color="purple.900" >
                            {item.grantName}
                          </Text>
                        </Box>
                      </HStack>
                      <Badge
                        colorPalette={
                          item.status === 'Overdue' ? 'red' :
                          item.priority === 'High' ? 'orange' :
                          item.priority === 'Medium' ? 'yellow' : 'gray'
                        }
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="semibold"
                      >
                        {item.priority}
                      </Badge>
                    </Flex>
                    <Separator my={3} />
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                      <HStack gap={2}>
                        <Icon as={FiCalendar} boxSize={4} color={item.status === 'Overdue' ? 'red.600' : deepIndigo} />
                        <Text fontSize="sm" color={item.status === 'Overdue' ? 'red.700' : 'purple.900'} fontWeight="semibold">
                          {formatDate(item.dueDate)}
                        </Text>
                      </HStack>
                      {item.status === 'Overdue' && (
                        <Badge colorPalette="red" fontSize="xs" px={2} py={0.5} fontWeight="bold">
                          OVERDUE
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                ))}
              </VStack>
              )}
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Quick Actions - Premium Grid */}
        <Card.Root
          mb={8}
          bg="neomorphic.surface"
          border="none"
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="neo.md"
        >

          <Card.Header p={{ base: 5, md: 6 }}>
            <HStack gap={3}>
              <Flex
                w={10}
                h={10}
                bgGradient={`linear(135deg, ${softTeal}, #4BC5CC)`}
                borderRadius="lg"
                align="center"
                justify="center"
              >
                <Icon as={FiZap} boxSize={5} color="white" />
              </Flex>
              <Heading size={{ base: 'md', md: 'lg' }} color={deepIndigo}>Your Genies - Quick Actions</Heading>
            </HStack>
          </Card.Header>
          <Card.Body p={{ base: 4, md: 6 }} pt={2}>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              <Button
                h={{ base: '90px', md: '100px' }}
                flexDirection="column"
                gap={3}
                bg="neomorphic.background"
                border="none"
                borderRadius="2xl"
                boxShadow="neo.sm"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: 'neo.md',
                }}
                _active={{
                  transform: 'translateY(-2px) scale(0.98)',
                  boxShadow: 'neo.inset.sm',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                onClick={() => router.push('/grant-application')}
                position="relative"
                overflow="hidden"
              >
                <Flex
                  w={{ base: 10, md: 12 }}
                  h={{ base: 10, md: 12 }}
                  bgGradient={`linear(135deg, ${softTeal}20, ${deepIndigo}10)`}
                  borderRadius="xl"
                  align="center"
                  justify="center"
                  position="relative"
                  zIndex={1}
                >
                  <Icon as={FiPlus} boxSize={{ base: 5, md: 6 }} color={softTeal} />
                </Flex>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={deepIndigo} fontWeight="semibold" textAlign="center" position="relative" zIndex={1}>
                  Grant Genie
                </Text>
              </Button>

              <Button
                h={{ base: '90px', md: '100px' }}
                flexDirection="column"
                gap={3}
                bg="neomorphic.background"
                border="none"
                borderRadius="2xl"
                boxShadow="neo.sm"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: 'neo.md',
                }}
                _active={{
                  transform: 'translateY(-2px) scale(0.98)',
                  boxShadow: 'neo.inset.sm',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                onClick={() => router.push('/genies/donor-meeting')}
                position="relative"
                overflow="hidden"
              >
                <Flex
                  w={{ base: 10, md: 12 }}
                  h={{ base: 10, md: 12 }}
                  bg={`${softTeal}10`}
                  borderRadius="xl"
                  align="center"
                  justify="center"
                  position="relative"
                  zIndex={1}
                >
                  <Icon as={FiUsers} boxSize={{ base: 5, md: 6 }} color={softTeal} />
                </Flex>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={deepIndigo} fontWeight="semibold" textAlign="center" position="relative" zIndex={1}>
                  Donor Genie
                </Text>
              </Button>

              <Button
                h={{ base: '90px', md: '100px' }}
                flexDirection="column"
                gap={3}
                bg="neomorphic.background"
                border="none"
                borderRadius="2xl"
                boxShadow="neo.sm"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: 'neo.md',
                }}
                _active={{
                  transform: 'translateY(-2px) scale(0.98)',
                  boxShadow: 'neo.inset.sm',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                onClick={() => router.push('/genies')}
                position="relative"
                overflow="hidden"
              >
                <Flex
                  w={{ base: 10, md: 12 }}
                  h={{ base: 10, md: 12 }}
                  bg="purple.100"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                  position="relative"
                  zIndex={1}
                >
                  <Icon as={FiMail} boxSize={{ base: 5, md: 6 }} color="purple.600" />
                </Flex>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={deepIndigo} fontWeight="semibold" textAlign="center" position="relative" zIndex={1}>
                  Newsletter Genie
                </Text>
              </Button>

              <Button
                h={{ base: '90px', md: '100px' }}
                flexDirection="column"
                gap={3}
                bg="neomorphic.background"
                border="none"
                borderRadius="2xl"
                boxShadow="neo.sm"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: 'neo.md',
                }}
                _active={{
                  transform: 'translateY(-2px) scale(0.98)',
                  boxShadow: 'neo.inset.sm',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                onClick={() => router.push('/genies')}
                position="relative"
                overflow="hidden"
              >
                <Flex
                  w={{ base: 10, md: 12 }}
                  h={{ base: 10, md: 12 }}
                  bg={`${deepIndigo}10`}
                  borderRadius="xl"
                  align="center"
                  justify="center"
                  position="relative"
                  zIndex={1}
                >
                  <Icon as={FiMessageCircle} boxSize={{ base: 5, md: 6 }} color={deepIndigo} />
                </Flex>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={deepIndigo} fontWeight="semibold" textAlign="center" position="relative" zIndex={1}>
                  All Genies
                </Text>
              </Button>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Recent Activity - Premium Timeline */}
        <Card.Root
          bg="neomorphic.surface"
          border="none"
          borderRadius="3xl"
          boxShadow="neo.md"
        >

          <Card.Header p={{ base: 5, md: 6 }}>
            <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
              <HStack gap={3}>
                <Flex
                  w={10}
                  h={10}
                  bg={`${deepIndigo}10`}
                  borderRadius="lg"
                  align="center"
                  justify="center"
                  display={{ base: 'none', sm: 'flex' }}
                >
                  <Icon as={FiBell} boxSize={5} color={deepIndigo} />
                </Flex>
                <Heading size={{ base: 'md', md: 'lg' }} color={deepIndigo}>Recent Activity</Heading>
              </HStack>
              <Button
                size="sm"
                variant="ghost"
                color={deepIndigo}
                _hover={{ bg: `${softTeal}10` }}
                onClick={() => router.push('/notifications')}
              >
                <Icon as={FiBell} mr={{ base: 0, sm: 2 }} />
                <Text display={{ base: 'none', sm: 'inline' }}>View All</Text>
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body p={{ base: 4, md: 6 }} pt={2}>
            {activitiesLoading ? (
              <LoadingSkeleton variant="list" count={5} />
            ) : (
            <VStack gap={0} align="stretch">
              {(activities || []).map((activity, index) => (
                <Box key={activity.id}>
                  <Flex
                    p={4}
                    borderRadius="lg"
                    gap={4}
                    _hover={{ bg: `${softTeal}05` }}
                    transition="all 0.2s"
                    position="relative"
                  >
                    <Flex
                      w={10}
                      h={10}
                      borderRadius="full"
                      bg={
                        activity.action.includes('Approved') ? 'green.100' :
                        activity.action.includes('Submitted') ? `${softTeal}20` :
                        activity.action.includes('Completed') ? `${deepIndigo}10` : 'purple.100'
                      }
                      align="center"
                      justify="center"
                      flexShrink={0}
                      border="3px solid"
                      borderColor="white"
                      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                    >
                      <Box
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={
                          activity.action.includes('Approved') ? 'green.500' :
                          activity.action.includes('Submitted') ? softTeal :
                          activity.action.includes('Completed') ? deepIndigo : 'purple.400'
                        }
                      />
                    </Flex>
                    <Flex flex={1} justify="space-between" align="start" gap={4} direction={{ base: 'column', sm: 'row' }}>
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize={{ base: 'sm', md: 'md' }}
                          fontWeight="semibold"
                          color={deepIndigo}
                          mb={1}
                          
                        >
                          {activity.action}
                        </Text>
                        <Text fontSize="sm" color="purple.700" >
                          {activity.grant}
                        </Text>
                      </Box>
                      <VStack gap={0} align={{ base: 'start', sm: 'end' }} flexShrink={0}>
                        <Text fontSize="sm" color={deepIndigo} fontWeight="semibold">{activity.user}</Text>
                        <Text fontSize="xs" color="purple.600">{activity.timestamp}</Text>
                      </VStack>
                    </Flex>
                  </Flex>
                  {index < (activities || []).length - 1 && (
                    <Box pl={9}>
                      <Separator />
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
            )}
          </Card.Body>
        </Card.Root>
      </Container>
    </MainLayout>
  )
}
