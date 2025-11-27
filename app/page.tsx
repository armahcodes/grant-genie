'use client'

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  Icon,
  Badge,
  Flex,
} from '@chakra-ui/react'
import Image from 'next/image'
import { keyframes } from '@emotion/react'
import { useState, useEffect, Suspense } from 'react'
import {
  FiCheck,
  FiZap,
  FiMessageCircle,
  FiFileText,
  FiSettings,
  FiCpu,
  FiClock,
  FiDollarSign,
  FiCompass,
  FiHeart,
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiArrowRight,
  FiMail,
  FiStar,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@stackframe/stack'
import { colors } from '@/theme/tokens'

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

function LandingPageContent() {
  const router = useRouter()
  const user = useUser()
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileCTA, setShowMobileCTA] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      // Show mobile CTA after scrolling 500px
      setShowMobileCTA(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCTAClick = () => {
    setIsLoading(true)
    router.push('/auth/signup')
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  // Use centralized theme tokens
  const { deepIndigo, softTeal, tealVariant, indigoVariant, indigoDark } = colors.brand

  const genies = [
    {
      icon: FiFileText,
      name: 'Grant Genie',
      description: 'Writes, researches, and refines grants in your organization\'s authentic voice.',
      impact: 'Saves 20–30 hours per proposal and aligns tone with funders.',
    },
    {
      icon: FiMessageCircle,
      name: 'Donor Conversation Coach',
      description: 'Role-plays fundraising meetings, refines your asks, and builds donor confidence.',
      impact: 'Elevates connection and storytelling.',
    },
    {
      icon: FiMail,
      name: 'Newsletter & Content Genie',
      description: 'Drafts newsletters, volunteer follow-ups, and social posts in your tone.',
      impact: 'Keeps your community inspired and engaged.',
    },
    {
      icon: FiSettings,
      name: 'Operations & Onboarding Genie',
      description: 'Automates applicant intake, onboarding, and workflow communication — while maintaining a human-centered, affirming tone.',
      impact: 'Saves staff time, ensures applicants and teams feel seen, and gives leadership real-time visibility.',
    },
    {
      icon: FiCpu,
      name: 'Custom Genie Builder',
      description: 'Lets you create your own Genies trained on your documents, tone, and workflows.',
      impact: 'Empowers your team to automate with heart.',
    },
  ]

  const roiItems = [
    { icon: FiClock, title: 'Time', description: 'Automate repetitive writing, onboarding, and prep work.' },
    { icon: FiDollarSign, title: 'Money', description: 'Avoid hiring extra admin or copywriting support.' },
    { icon: FiCompass, title: 'Clarity', description: 'AI that filters noise and surfaces what matters most.' },
    { icon: FiHeart, title: 'Confidence', description: 'Every message, pitch, and process aligns with your values.' },
    { icon: FiTrendingUp, title: 'Imagination', description: 'Headspace to dream, plan, and build the next thing.' },
  ]

  const differentiators = [
    { title: 'Built for Humans', description: 'Our AI isn\'t generic — it learns your nuance, not just your data.' },
    { title: 'Centered in Values', description: 'Designed for empathy, equity, and storytelling — not scale for scale\'s sake.' },
    { title: 'Modular by Design', description: 'Start with one Genie, grow into an ecosystem.' },
    { title: 'Cross-Sector Ready', description: 'Works for nonprofits, funders, staffing agencies, and social enterprises.' },
    { title: 'Powered by OpenAI — Guided by Heart', description: 'Combining world-class models with lived experience in social impact leadership.' },
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      designedFor: 'Small nonprofits or solopreneurs',
      features: [
        '1 Core Genie (Grant, Donor, Content, or Operations)',
        '10 document generations/month',
        'Onboarding support',
        '14-day free trial',
      ],
      price: '$79',
      period: '/month',
    },
    {
      name: 'Growth',
      designedFor: 'Small to mid-sized teams',
      features: [
        '3 Genies',
        'Shared workspace',
        'Tone training',
        'Analytics dashboard',
        'Priority support',
      ],
      price: '$249',
      period: '/month',
      highlighted: true,
    },
    {
      name: 'Pro Builder',
      designedFor: 'Ecosystem builders + consultants',
      features: [
        'Unlimited Genie creation',
        'API access',
        'Training suite',
        'White-label options',
        'Dedicated support',
      ],
      price: '$499',
      period: '/month',
    },
    {
      name: 'Enterprise / Custom',
      designedFor: 'Funders, networks, or multi-site organizations',
      features: [
        'Full custom AI ecosystem',
        'Onboarding & setup included',
        'Internal AI literacy training',
        'Custom integrations',
        'SLA guarantee',
      ],
      price: 'Custom',
      period: '',
    },
  ]

  const faqs = [
    {
      q: 'What makes HeadspaceGenie different from other AI writing tools?',
      a: 'HeadspaceGenie isn\'t just a writing tool—it\'s an AI ecosystem trained on your organization\'s voice, values, and workflows. Unlike generic AI assistants, each Genie learns your nuance and context, ensuring every output sounds authentically you. Plus, we\'re built specifically for mission-driven leaders, not corporate marketing teams.'
    },
    {
      q: 'Do I need technical skills to use HeadspaceGenie?',
      a: 'Not at all. HeadspaceGenie is designed for nonprofit leaders, not developers. If you can use email, you can use our platform. We provide onboarding support, video tutorials, and a simple interface that feels natural from day one.'
    },
    {
      q: 'How does the 14-day free trial work?',
      a: 'Sign up with your email—no credit card required. You\'ll get full access to your chosen Genie for 14 days. Explore all features, train it on your content, and see real results. Cancel anytime, or continue with a paid plan when you\'re ready.'
    },
    {
      q: 'Can I train the Genies on my organization\'s specific content?',
      a: 'Absolutely! Upload your past grants, newsletters, mission statements, or donor communications. Your Genies learn your tone, terminology, and storytelling style—so every output feels like it came from your team.'
    },
    {
      q: 'What if I need help or have questions?',
      a: 'We offer onboarding support for all users, plus priority support for Growth and Pro plans. You can reach us via email at hello@headspacegenie.ai, and we typically respond within 24 hours. Enterprise customers get dedicated support with SLA guarantees.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. We use 256-bit encryption, SOC 2 compliance standards, and never train public AI models on your private data. You own your content—we just help you create more of it. See our Privacy Policy for full details.'
    },
    {
      q: 'Can I switch plans or cancel anytime?',
      a: 'Yes! You can upgrade, downgrade, or cancel your subscription anytime from your account settings. If you cancel, you\'ll retain access until the end of your current billing period. No long-term contracts or cancellation fees.'
    },
    {
      q: 'Which Genie should I start with?',
      a: 'It depends on your biggest need. Most nonprofits start with the Grant Genie (saves 20-30 hours per proposal) or Donor Conversation Coach (builds confidence in fundraising asks). You can always add more Genies as you grow.'
    },
  ]

  return (
    <Box bg="neomorphic.background" overflow="hidden">
      {/* Navigation */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={scrollY > 50 ? "neomorphic.surface" : "neomorphic.background"}
        backdropFilter="blur(20px)"
        borderBottom="none"
        transitionProperty="background, border-color, box-shadow"
        transitionDuration="0.3s"
        transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow={scrollY > 50 ? "neo.sm" : "none"}
      >
        <Container maxW="container.xl" py={4} px={{ base: 4, md: 6 }} mx="auto">
          <Flex justify="space-between" align="center">
            <HStack gap={3} cursor="pointer" _hover={{ transform: 'scale(1.05)' }} transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)">
              <Box
                w={{ base: 8, md: 10 }}
                h={{ base: 8, md: 10 }}
                bgGradient={`linear(135deg, ${deepIndigo}, ${softTeal})`}
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 15px rgba(92, 225, 230, 0.3)"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'xl',
                  padding: '2px',
                  background: `linear-gradient(135deg, ${softTeal}, ${deepIndigo})`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              >
                <Icon as={FiZap} color="white" boxSize={{ base: 4, md: 6 }} />
              </Box>
              <Heading
                size={{ base: 'md', md: 'lg' }}
                color={deepIndigo}
                fontWeight="bold"
              >
                HeadspaceGenie.ai
              </Heading>
            </HStack>
            <HStack gap={{ base: 2, md: 4 }}>
              <Button
                variant="ghost"
                onClick={() => window.location.href = 'mailto:hello@headspacegenie.ai'}
                color={deepIndigo}
                fontWeight="semibold"
                size={{ base: 'sm', md: 'md' }}
                bg="neomorphic.background"
                boxShadow="neo.sm"
                borderRadius="2xl"
                _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                _active={{ boxShadow: 'neo.inset.sm' }}
                transition="all 0.3s"
                display={{ base: 'none', md: 'flex' }}
              >
                Contact
              </Button>
              <Button
                onClick={() => router.push('/auth/signin')}
                color={deepIndigo}
                fontWeight="semibold"
                size={{ base: 'sm', md: 'md' }}
                bg="neomorphic.background"
                boxShadow="neo.sm"
                borderRadius="2xl"
                _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                _active={{ boxShadow: 'neo.inset.sm' }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                Log In
              </Button>
              <Button
                bgGradient={`linear(to-r, ${softTeal}, #4BC5CC)`}
                color="white"
                onClick={() => router.push('/auth/signup')}
                size={{ base: 'sm', md: 'md' }}
                px={{ base: 4, md: 6 }}
                fontWeight="semibold"
                borderRadius="2xl"
                boxShadow="neo.md"
                _hover={{
                  bgGradient: `linear(to-r, #4BC5CC, ${softTeal})`,
                  transform: 'translateY(-2px)',
                  boxShadow: 'neo.lg'
                }}
                _active={{
                  transform: 'translateY(0)',
                  boxShadow: 'neo.sm'
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <Text display={{ base: 'none', sm: 'inline' }}>Join Beta</Text>
                <Text display={{ base: 'inline', sm: 'none' }}>Join</Text>
                <Icon as={FiArrowRight} ml={2} />
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 1. HERO SECTION */}
      <Box
        pt={{ base: 24, md: 32 }}
        pb={{ base: 16, md: 24 }}
        background={`linear-gradient(to bottom right, ${deepIndigo}, ${indigoVariant}, ${indigoDark})`}
        position="relative"
        overflow="hidden"
        color="white"
      >
        <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6 }} mx="auto">
          <VStack
            gap={{ base: 6, md: 8 }}
            textAlign="center"
            maxW="5xl"
            mx="auto"
            animation={`${fadeInUp} 1s ease-out`}
            px={{ base: 4, md: 0 }}
          >
            <Badge
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              color="white"
              fontSize={{ base: 'xs', md: 'sm' }}
              px={{ base: 3, md: 5 }}
              py={2}
              borderRadius="full"
              textTransform="none"
              fontWeight="semibold"
              border="1px solid"
              borderColor="whiteAlpha.300"
              boxShadow="0 4px 20px rgba(0,0,0,0.2)"
            >
              <HStack gap={2}>
                <Icon as={FiZap} color={softTeal} />
                <Text display={{ base: 'none', sm: 'block' }}>Limited Beta Access Now Open</Text>
                <Text display={{ base: 'block', sm: 'none' }}>Beta Now Open</Text>
              </HStack>
            </Badge>

            <Heading
              size={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }}
              lineHeight="1.1"
              fontWeight="bold"
              letterSpacing={{ base: '-0.01em', md: '-0.02em' }}
              maxW="4xl"
            >
              Built to give{' '}
              <Box
                as="span"
                color="white"
                fontWeight="extrabold"
                position="relative"
                textShadow="0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(92, 225, 230, 0.3)"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgGradient: `linear(to-r, ${softTeal}, transparent)`,
                  borderRadius: 'full',
                }}
              >
                mission-driven leaders
              </Box>{' '}
              back their headspace.
            </Heading>

            <Text fontSize={{ base: 'md', md: 'xl' }} lineHeight="relaxed" color="white" maxW="3xl" fontWeight="normal">
              An AI ecosystem that writes, organizes, and thinks with you — so you can focus on what matters most.
            </Text>
            
            <Text fontSize={{ base: 'lg', md: 'xl' }} lineHeight="relaxed" color="white" maxW="3xl" fontWeight="semibold" mt={2}>
              AI-powered grant writing, donor coaching, and fundraising automation for nonprofits.
            </Text>

            <Flex gap={4} pt={6} direction={{ base: 'column', sm: 'row' }} w={{ base: 'full', sm: 'auto' }}>
              <Button
                size={{ base: 'md', md: 'lg' }}
                bgGradient={`linear(to-r, ${softTeal}, ${tealVariant})`}
                color="white"
                px={{ base: 8, md: 10 }}
                py={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="semibold"
                onClick={handleCTAClick}
                loading={isLoading}
                _hover={{
                  bgGradient: `linear(to-r, ${tealVariant}, ${softTeal})`,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 35px rgba(92, 225, 230, 0.5)'
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                boxShadow="0 8px 25px rgba(92, 225, 230, 0.4)"
                borderRadius="xl"
                w={{ base: 'full', sm: 'auto' }}
              >
                Start Free Trial
                <Icon as={FiArrowRight} ml={2} />
              </Button>
              <Button
                size={{ base: 'md', md: 'lg' }}
                variant="outline"
                borderWidth="2px"
                borderColor="whiteAlpha.400"
                color="white"
                px={{ base: 8, md: 10 }}
                py={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="semibold"
                backdropFilter="blur(10px)"
                bg="whiteAlpha.100"
                onClick={() => scrollToSection('genies')}
                _hover={{
                  bg: 'whiteAlpha.200',
                  borderColor: softTeal,
                  transform: 'translateY(-3px)',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                borderRadius="xl"
                w={{ base: 'full', sm: 'auto' }}
              >
                See Features
              </Button>
            </Flex>

            <Flex gap={{ base: 4, md: 8 }} pt={2} color="white" fontSize={{ base: 'sm', md: 'sm' }} wrap="wrap" justify="center">
              <HStack>
                <Icon as={FiCheck} color={softTeal} />
                <Text>14-day free trial</Text>
              </HStack>
              <HStack>
                <Icon as={FiCheck} color={softTeal} />
                <Text display={{ base: 'none', sm: 'block' }}>No credit card required</Text>
                <Text display={{ base: 'block', sm: 'none' }}>No credit card</Text>
              </HStack>
              <HStack>
                <Icon as={FiCheck} color={softTeal} />
                <Text>Cancel anytime</Text>
              </HStack>
            </Flex>
          </VStack>

          {/* Hero Image with Glassmorphism */}
          <Box mt={{ base: 12, md: 20 }} maxW="6xl" mx="auto" px={{ base: 4, md: 0 }}>
            <Box
              position="relative"
              borderRadius={{ base: '2xl', md: '3xl' }}
              overflow="hidden"
              boxShadow="0 25px 60px rgba(0,0,0,0.4)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              bg="whiteAlpha.100"
              backdropFilter="blur(10px)"
              p={{ base: 2, md: 3 }}
              transform={{ base: 'none', md: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
              transition="transform 0.1s"
              css={{ willChange: 'transform' }}
            >
              <Box
                borderRadius={{ base: 'xl', md: '2xl' }}
                overflow="hidden"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  bgGradient: `linear(to-br, ${softTeal}20, transparent)`,
                  zIndex: 1,
                }}
              >
                <Box position="relative" width="100%" height="500px">
                  <Image
                    src="/images/hero-collaboration.jpg"
                    alt="Team collaborating on mission-driven work"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Animated Genie constellation */}
          <Box mt={{ base: 12, md: 20 }} px={{ base: 4, md: 0 }}>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} gap={{ base: 4, md: 6 }} maxW="6xl" mx="auto">
              {genies.map((genie, index) => (
                <VStack
                  key={index}
                  p={{ base: 4, md: 6 }}
                  borderRadius="3xl"
                  bg="neomorphic.surface"
                  border="none"
                  boxShadow="neo.md"
                  _hover={{
                    transform: { base: 'translateY(-6px) scale(1.03)', md: 'translateY(-12px) scale(1.08)' },
                    boxShadow: 'neo.lg',
                  }}
                  _active={{
                    boxShadow: 'neo.inset.md',
                    transform: 'scale(0.98)',
                  }}
                  transitionProperty="transform, box-shadow"
                  transitionDuration="0.4s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  css={{
                    '@media (prefers-reduced-motion: no-preference)': {
                      animation: `${float} ${8 + index}s ease-in-out infinite`,
                    }
                  }}
                >
                  <Icon as={genie.icon} boxSize={{ base: 8, md: 10 }} color={softTeal} mb={2} />
                  <Text fontSize={{ base: 'sm', md: 'sm' }} fontWeight="semibold" textAlign="center" lineHeight="short" color={deepIndigo}>
                    {genie.name}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>
        </Container>

        {/* Animated gradient orbs */}
        <Box
          position="absolute"
          top="10%"
          left="-5%"
          w="600px"
          h="600px"
          bg={softTeal}
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.2}
          animation={`${pulse} 8s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          bottom="20%"
          right="-5%"
          w="500px"
          h="500px"
          bg="#9D7BE8"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.15}
          animation={`${pulse} 10s ease-in-out infinite`}
        />
      </Box>

      {/* 2. THE PROBLEM */}
      <Box py={{ base: 16, md: 24 }} bg="neomorphic.background" position="relative">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }} textAlign="center">
            <VStack gap={{ base: 6, md: 8 }} maxW="4xl" mx="auto">
              <Badge
                colorPalette="red"
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                boxShadow="neo.sm"
              >
                The Problem
              </Badge>
              <Heading
                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                color={deepIndigo}
                lineHeight="1.2"
                letterSpacing="normal"
                px={{ base: 4, md: 0 }}
              >
                Most leaders don't need another tool.
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color={deepIndigo} lineHeight="relaxed" px={{ base: 4, md: 0 }}>
                Mission-driven leaders are drowning in noise: endless grant deadlines, donor emails, unposted newsletters, untracked applicants — and no time to breathe.
              </Text>
              <Box
                p={{ base: 5, md: 6 }}
                bg="neomorphic.surface"
                borderRadius="3xl"
                maxW="3xl"
                mx={{ base: 4, md: 'auto' }}
                boxShadow="neo.inset.md"
              >
                <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color={deepIndigo} fontWeight="semibold" lineHeight="relaxed">
                  You didn't start this work to manage spreadsheets and sentences.
                  <br />
                  You started it to change lives.
                </Text>
              </Box>
            </VStack>

            {/* Stat card */}
            <Box
              bg="neomorphic.surface"
              p={{ base: 6, md: 8 }}
              borderRadius="3xl"
              boxShadow="neo.md"
              maxW="md"
              mx={{ base: 4, md: 'auto' }}
              w="full"
              _hover={{
                boxShadow: 'neo.lg',
                transform: 'translateY(-4px)',
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <VStack gap={3}>
                <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color={deepIndigo}>73%</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} color={deepIndigo} textAlign="center">
                  of nonprofit leaders report burnout from administrative work
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* 3. THE HEADSPACEGENIE SOLUTION */}
      <Box py={{ base: 16, md: 24 }} bg="neomorphic.background" position="relative">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }}>
            <VStack gap={{ base: 4, md: 6 }} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                bg={`${deepIndigo}20`}
                color={deepIndigo}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                fontWeight="semibold"
              >
                The Solution
              </Badge>
              <Heading
                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                color={deepIndigo}
                lineHeight="1.2"
                letterSpacing="normal"
                px={{ base: 2, md: 0 }}
              >
                HeadspaceGenie gives you back what leadership takes away
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color={deepIndigo} maxW="2xl">
                Clarity, creativity, and time.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, md: 8 }} w="full">
              {[
                { icon: FiClock, title: 'Clarity', desc: 'See what matters most. Filter noise, focus your energy, make confident decisions.' },
                { icon: FiMessageCircle, title: 'Consistency', desc: 'Communicate with ease. Every message, pitch, and post sounds like you.' },
                { icon: FiTrendingUp, title: 'Headspace', desc: 'Reclaim your imagination. Let AI handle the workflow so you can lead again.' },
              ].map((item, index) => (
                <Card.Root
                  key={index}
                  bg="neomorphic.surface"
                  border="none"
                  boxShadow="neo.md"
                  _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: 'neo.lg',
                  }}
                  _active={{
                    boxShadow: 'neo.sm',
                    transform: 'translateY(0)',
                  }}
                  transitionProperty="transform, box-shadow"
                  transitionDuration="0.4s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="3xl"
                  overflow="hidden"
                  position="relative"
                >
                  <Card.Body p={{ base: 8, md: 10 }}>
                    <VStack gap={6}>
                      <Flex
                        w={20}
                        h={20}
                        bg="neomorphic.background"
                        borderRadius="3xl"
                        align="center"
                        justify="center"
                        boxShadow="neo.sm"
                      >
                        <Icon as={item.icon} boxSize={10} color={softTeal} />
                      </Flex>
                      <Heading size="xl" color={deepIndigo}>{item.title}</Heading>
                      <Text color={deepIndigo} textAlign="center" fontSize="lg" lineHeight="tall">
                        {item.desc}
                      </Text>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 4. MEET YOUR GENIES */}
      <Box py={{ base: 16, md: 24 }} bg="neomorphic.background" id="genies">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }}>
            <VStack gap={{ base: 4, md: 6 }} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                bg={`${softTeal}20`}
                color={deepIndigo}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                fontWeight="semibold"
              >
                Your AI Ecosystem
              </Badge>
              <Heading
                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                color={deepIndigo}
                lineHeight="1.2"
                letterSpacing="normal"
              >
                Meet Your Genies
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color={deepIndigo} maxW="2xl">
                Each Genie is a living, trainable companion that grows with you.
              </Text>
            </VStack>

            <VStack gap={6} w="full">
              {genies.map((genie, index) => (
                <Card.Root
                  key={index}
                  w="full"
                  bg="neomorphic.surface"
                  border="none"
                  boxShadow="neo.md"
                  _hover={{
                    boxShadow: 'neo.lg',
                    transform: { base: 'none', md: 'translateX(8px)' },
                  }}
                  _active={{
                    boxShadow: 'neo.sm',
                  }}
                  transitionProperty="transform, box-shadow"
                  transitionDuration="0.4s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="3xl"
                >
                  <Card.Body p={{ base: 6, md: 8 }}>
                    <VStack gap={4} align="stretch" display={{ base: 'flex', md: 'none' }}>
                      <HStack gap={4}>
                        <Flex
                          w={16}
                          h={16}
                          bg={`${softTeal}10`}
                          borderRadius="xl"
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Icon as={genie.icon} boxSize={8} color={softTeal} />
                        </Flex>
                        <Heading size="md" color={deepIndigo}>{genie.name}</Heading>
                      </HStack>
                      <Text color={deepIndigo} fontSize="md">
                        {genie.description}
                      </Text>
                      <Badge
                        colorPalette="cyan"
                        p={3}
                        borderRadius="lg"
                        fontSize="sm"
                        textAlign="center"
                      >
                        {genie.impact}
                      </Badge>
                    </VStack>
                    <SimpleGrid columns={12} gap={6} alignItems="center" display={{ base: 'none', md: 'grid' }}>
                      <HStack gap={4} gridColumn="span 3">
                        <Flex
                          w={16}
                          h={16}
                          bg={`${softTeal}10`}
                          borderRadius="xl"
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Icon as={genie.icon} boxSize={8} color={softTeal} />
                        </Flex>
                        <VStack align="start" gap={1}>
                          <Heading size="md" color={deepIndigo}>{genie.name}</Heading>
                        </VStack>
                      </HStack>
                      <Text color={deepIndigo} gridColumn="span 5" fontSize="md">
                        {genie.description}
                      </Text>
                      <Badge
                        colorPalette="cyan"
                        gridColumn="span 4"
                        p={3}
                        borderRadius="lg"
                        fontSize="sm"
                        textAlign="center"
                      >
                        {genie.impact}
                      </Badge>
                    </SimpleGrid>
                  </Card.Body>
                </Card.Root>
              ))}
            </VStack>

            <Box
              mt={{ base: 6, md: 8 }}
              p={{ base: 6, md: 10 }}
              bg="neomorphic.surface"
              borderRadius="3xl"
              textAlign="center"
              boxShadow="neo.inset.md"
              mx={{ base: 4, md: 0 }}
            >
              <Text fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }} color={deepIndigo} fontWeight="semibold" lineHeight="relaxed">
                Together, they form your AI Headquarters — a workspace that reflects your mission, voice, and rhythm.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* 5. THE HEADSPACE ROI */}
      <Box py={{ base: 16, md: 24 }} bg="neomorphic.background">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }}>
            <VStack gap={{ base: 4, md: 6 }} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                bg={`${deepIndigo}20`}
                color={deepIndigo}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                fontWeight="semibold"
              >
                Impact
              </Badge>
              <Heading
                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                color={deepIndigo}
                lineHeight="1.2"
                letterSpacing="normal"
              >
                The Headspace ROI
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color={deepIndigo}>
                We measure success differently.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap={{ base: 6, md: 8 }}>
              {roiItems.map((item, index) => (
                <Card.Root
                  key={index}
                  bg="neomorphic.surface"
                  border="none"
                  boxShadow="neo.md"
                  _hover={{
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: 'neo.lg',
                  }}
                  _active={{
                    boxShadow: 'neo.sm',
                    transform: 'scale(0.98)',
                  }}
                  transitionProperty="transform, box-shadow"
                  transitionDuration="0.4s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="3xl"
                >
                  <Card.Body p={{ base: 6, md: 8 }}>
                    <VStack gap={5}>
                      <Flex
                        w={16}
                        h={16}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        align="center"
                        justify="center"
                        boxShadow="neo.sm"
                      >
                        <Icon as={item.icon} boxSize={8} color={softTeal} />
                      </Flex>
                      <Heading size={{ base: 'md', md: 'lg' }} color={deepIndigo}>{item.title}</Heading>
                      <Text color={deepIndigo} fontSize={{ base: 'sm', md: 'sm' }} textAlign="center" lineHeight="tall">
                        {item.description}
                      </Text>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 6. WHY HEADSPACEGENIE.AI IS DIFFERENT */}
      <Box py={{ base: 16, md: 24 }} bg="neomorphic.background">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }}>
            <VStack gap={{ base: 4, md: 6 }} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                bg={`${deepIndigo}20`}
                color={deepIndigo}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                fontWeight="semibold"
              >
                Why Choose Us
              </Badge>
              <Heading
                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                color={deepIndigo}
                lineHeight="1.2"
                letterSpacing="normal"
              >
                Why HeadspaceGenie.ai is Different
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={{ base: 6, md: 8 }}>
              {differentiators.map((item, index) => (
                <Card.Root
                  key={index}
                  bg="neomorphic.surface"
                  border="none"
                  boxShadow="neo.md"
                  _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: 'neo.lg',
                  }}
                  _active={{
                    boxShadow: 'neo.sm',
                    transform: 'translateY(0)',
                  }}
                  transitionProperty="transform, box-shadow"
                  transitionDuration="0.4s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="3xl"
                >
                  <Card.Body p={8}>
                    <VStack align="start" gap={5}>
                      <Flex
                        w={12}
                        h={12}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        align="center"
                        justify="center"
                        boxShadow="neo.sm"
                      >
                        <Icon as={FiCheck} boxSize={6} color={softTeal} fontWeight="bold" strokeWidth={3} />
                      </Flex>
                      <Heading size="lg" color={deepIndigo}>{item.title}</Heading>
                      <Text color={deepIndigo} lineHeight="tall">{item.description}</Text>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 7. HOW IT WORKS */}
      <Box py={{ base: 16, md: 24 }} background={`linear-gradient(to bottom right, ${deepIndigo}, #2D2C5A)`} color="white" position="relative" overflow="hidden">
        <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }}>
            <VStack gap={{ base: 4, md: 6 }} textAlign="center">
              <Badge
                bg="whiteAlpha.200"
                color="white"
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                fontWeight="semibold"
              >
                Get Started
              </Badge>
              <Heading size={{ base: 'xl', md: '2xl', lg: '3xl' }} color="white" letterSpacing="normal">
                How It Works
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color="gray.200" maxW="2xl">
                Simple steps to transform your workflow
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 6, md: 8 }}>
              {[
                { step: '1', title: 'Start', description: 'Choose your first Genie.' },
                { step: '2', title: 'Train', description: 'Upload writing samples, values, or workflows.' },
                { step: '3', title: 'Collaborate', description: 'Let Genie draft, refine, or organize.' },
                { step: '4', title: 'Expand', description: 'Add new Genies or teammates as you grow.' },
              ].map((item, index) => (
                <VStack
                  key={index}
                  gap={6}
                  position="relative"
                  _after={index < 3 ? {
                    content: '""',
                    position: 'absolute',
                    top: '32px',
                    right: '-32px',
                    width: '64px',
                    height: '2px',
                    bgGradient: `linear(to-r, ${softTeal}, transparent)`,
                    display: { base: 'none', lg: 'block' }
                  } : {}}
                >
                  <Flex
                    w={{ base: 16, md: 20 }}
                    h={{ base: 16, md: 20 }}
                    bgGradient={`linear(135deg, ${softTeal}, ${tealVariant})`}
                    borderRadius="2xl"
                    align="center"
                    justify="center"
                    boxShadow={`0 10px 30px ${softTeal}40`}
                    position="relative"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '2xl',
                      padding: '2px',
                      background: `linear-gradient(135deg, ${softTeal}, transparent)`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      opacity: 0.5,
                    }}
                  >
                    <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="white">{item.step}</Text>
                  </Flex>
                  <Heading size={{ base: 'md', md: 'lg' }} color="white">{item.title}</Heading>
                  <Text color="gray.200" textAlign="center" fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall">
                    {item.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* Decorative elements */}
        <Box
          position="absolute"
          top="20%"
          left="-5%"
          w="400px"
          h="400px"
          bg={softTeal}
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.15}
        />
      </Box>

      {/* 8. PRICING & TIERS */}
      <Box py={{ base: 16, md: 28 }} bg="neomorphic.background" id="pricing">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 12, md: 16 }}>
            <VStack gap={{ base: 4, md: 6 }} textAlign="center">
              <Badge
                bg={`${softTeal}20`}
                color={deepIndigo}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                textTransform="none"
                fontWeight="semibold"
              >
                Pricing
              </Badge>
              <Heading
                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                color={deepIndigo}
                letterSpacing="normal"
              >
                Simple, Transparent Pricing
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color={deepIndigo} maxW="2xl">
                Start your free trial — no credit card required.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 4 }} gap={{ base: 6, md: 8 }} w="full">
              {pricingPlans.map((plan, index) => (
                <Card.Root
                  key={index}
                  bg="neomorphic.surface"
                  border="none"
                  boxShadow={plan.highlighted ? 'neo.lg' : 'neo.md'}
                  transform={{ base: 'scale(1)', md: plan.highlighted ? 'scale(1.05)' : 'scale(1)' }}
                  _hover={{
                    boxShadow: plan.highlighted ? 'neo.xl' : 'neo.lg',
                    transform: { base: 'scale(1)', md: plan.highlighted ? 'scale(1.08)' : 'scale(1.03)' },
                  }}
                  _active={{
                    boxShadow: plan.highlighted ? 'neo.md' : 'neo.sm',
                    transform: 'scale(0.98)',
                  }}
                  transitionProperty="transform, box-shadow"
                  transitionDuration="0.4s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  position="relative"
                  borderRadius="3xl"
                  overflow="visible"
                >
                  {plan.highlighted && (
                    <>
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="6px"
                        bgGradient={`linear(to-r, ${softTeal}, ${deepIndigo})`}
                        borderTopRadius="2xl"
                      />
                      <Badge
                        position="absolute"
                        top={-3}
                        left="50%"
                        transform="translateX(-50%)"
                        bgGradient={`linear(to-r, ${softTeal}, #4BC5CC)`}
                        color="white"
                        fontSize="xs"
                        px={4}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                        boxShadow={`0 4px 15px ${softTeal}50`}
                      >
                        MOST POPULAR
                      </Badge>
                    </>
                  )}
                  <Card.Body p={8}>
                    <VStack align="stretch" gap={6}>
                      <VStack align="start" gap={3}>
                        <Text fontWeight="bold" fontSize="xl" color={deepIndigo}>
                          {plan.name}
                        </Text>
                        <Text fontSize="sm" color={deepIndigo} lineHeight="short" opacity={0.7}>
                          {plan.designedFor}
                        </Text>
                        <HStack align="baseline" gap={1}>
                          <Heading
                            size="3xl"
                            bgGradient={plan.highlighted ? `linear(to-r, ${softTeal}, ${deepIndigo})` : 'none'}
                            bgClip={plan.highlighted ? "text" : "none"}
                            color={!plan.highlighted ? deepIndigo : undefined}
                          >
                            {plan.price}
                          </Heading>
                          <Text color={deepIndigo} fontSize="lg" opacity={0.7}>{plan.period}</Text>
                        </HStack>
                      </VStack>

                      <Button
                        size="lg"
                        bg={plan.highlighted ? `linear-gradient(135deg, ${softTeal}, ${tealVariant})` : 'neomorphic.background'}
                        bgGradient={plan.highlighted ? `linear(135deg, ${softTeal}, ${tealVariant})` : undefined}
                        color={plan.highlighted ? 'white' : deepIndigo}
                        onClick={() => router.push('/auth/signup')}
                        w="full"
                        py={6}
                        fontWeight="semibold"
                        borderRadius="2xl"
                        boxShadow={plan.highlighted ? 'neo.md' : 'neo.sm'}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: plan.highlighted ? 'neo.lg' : 'neo.md',
                        }}
                        _active={{
                          transform: 'translateY(0)',
                          boxShadow: plan.highlighted ? 'neo.sm' : 'neo.inset.sm',
                        }}
                        transition="all 0.3s"
                      >
                        {plan.name === 'Enterprise / Custom' ? 'Contact Sales' : 'Start Free Trial'}
                      </Button>

                      <VStack gap={3} align="start" pt={2}>
                        {plan.features.map((feature, idx) => (
                          <HStack key={idx} gap={3} align="start">
                            <Icon
                              as={FiCheck}
                              color={plan.highlighted ? softTeal : 'gray.400'}
                              boxSize={5}
                              mt={0.5}
                              flexShrink={0}
                              strokeWidth={3}
                            />
                            <Text color={deepIndigo} fontSize="sm" lineHeight="tall">{feature}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 8.5 FAQ SECTION */}
      <Box py={{ base: 16, md: 24 }} bg="neomorphic.background">
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={12}>
            <VStack gap={6} textAlign="center">
              <Heading size={{ base: 'xl', md: '2xl', lg: '3xl' }} color={deepIndigo}>
                Frequently Asked Questions
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color={deepIndigo} maxW="2xl">
                Everything you need to know about HeadspaceGenie.ai
              </Text>
            </VStack>

            <VStack gap={4} w="full" maxW="3xl" mx="auto">
              {faqs.map((faq, index) => (
                <Box
                  key={index}
                  w="full"
                  bg="neomorphic.surface"
                  borderRadius="3xl"
                  border="none"
                  overflow="hidden"
                  transition="all 0.3s"
                  boxShadow="neo.md"
                  _hover={{ boxShadow: 'neo.lg' }}
                >
                  <Flex
                    p={6}
                    cursor="pointer"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    justify="space-between"
                    align="center"
                  >
                    <Heading size="md" color={deepIndigo} pr={4}>
                      {faq.q}
                    </Heading>
                    <Icon
                      as={openFAQ === index ? FiChevronUp : FiChevronDown}
                      color={softTeal}
                      boxSize={6}
                      flexShrink={0}
                    />
                  </Flex>
                  {openFAQ === index && (
                    <Box px={6} pb={6}>
                      <Text color={deepIndigo} lineHeight="tall">
                        {faq.a}
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>

            <Box textAlign="center" pt={8}>
              <Text fontSize="md" color={deepIndigo} mb={4}>
                Still have questions?
              </Text>
              <Button
                bg="neomorphic.background"
                color={deepIndigo}
                boxShadow="neo.md"
                borderRadius="2xl"
                _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                transition="all 0.3s"
                onClick={() => window.location.href = 'mailto:hello@headspacegenie.ai?subject=Question about HeadspaceGenie'}
              >
                Contact Us
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* 9. THE INVITATION / CTA */}
      <Box
        py={{ base: 16, md: 28 }}
        background={`linear-gradient(to bottom right, ${deepIndigo}, ${indigoVariant}, ${indigoDark})`}
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6 }} mx="auto">
          <VStack gap={{ base: 6, md: 10 }} textAlign="center">
            <Heading
              size={{ base: '2xl', sm: '3xl', md: '4xl' }}
              maxW="5xl"
              color="white"
              lineHeight="1.15"
              letterSpacing={{ base: '-0.01em', md: '-0.02em' }}
            >
              You've built a mission worth believing in.
            </Heading>
            <Text fontSize={{ base: 'lg', md: '2xl' }} maxW="3xl" color="whiteAlpha.900" lineHeight="tall">
              Now build a system that gives you the space to sustain it.
            </Text>
            <Text
              fontSize={{ base: 'lg', md: '2xl' }}
              maxW="4xl"
              color="white"
              fontWeight="semibold"
              lineHeight="tall"
              bgGradient={`linear(to-r, white, ${softTeal})`}
              bgClip="text"
            >
              Let HeadspaceGenie.ai handle the noise — so you can lead from a place of imagination again.
            </Text>
            <Flex gap={5} pt={6} direction={{ base: 'column', sm: 'row' }} w={{ base: 'full', sm: 'auto' }}>
              <Button
                size={{ base: 'md', md: 'lg' }}
                bgGradient={`linear(to-r, ${softTeal}, ${tealVariant})`}
                color="white"
                px={{ base: 8, md: 12 }}
                py={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'xl' }}
                fontWeight="semibold"
                onClick={() => router.push('/auth/signup')}
                _hover={{
                  bgGradient: `linear(to-r, ${tealVariant}, ${softTeal})`,
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(92, 225, 230, 0.5)'
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                boxShadow="0 10px 30px rgba(92, 225, 230, 0.4)"
                borderRadius="xl"
                w={{ base: 'full', sm: 'auto' }}
              >
                Join the Beta
                <Icon as={FiArrowRight} ml={3} />
              </Button>
              <Button
                size={{ base: 'md', md: 'lg' }}
                variant="outline"
                borderWidth="2px"
                borderColor="whiteAlpha.400"
                color="white"
                px={{ base: 8, md: 12 }}
                py={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'xl' }}
                fontWeight="semibold"
                backdropFilter="blur(10px)"
                bg="whiteAlpha.100"
                onClick={() => window.location.href = 'mailto:demo@headspacegenie.ai?subject=Demo Request&body=I\'d like to schedule a demo of HeadspaceGenie.ai'}
                _hover={{
                  bg: 'whiteAlpha.200',
                  borderColor: softTeal,
                  transform: 'translateY(-4px)',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                borderRadius="xl"
                w={{ base: 'full', sm: 'auto' }}
              >
                Request a Demo
              </Button>
            </Flex>
            <Flex gap={{ base: 4, md: 10 }} pt={4} fontSize={{ base: 'sm', md: 'md' }} color="gray.200" wrap="wrap" justify="center">
              <HStack>
                <Icon as={FiCheck} color={softTeal} boxSize={5} />
                <Text>14-day free trial</Text>
              </HStack>
              <HStack>
                <Icon as={FiCheck} color={softTeal} boxSize={5} />
                <Text>No credit card</Text>
              </HStack>
              <HStack>
                <Icon as={FiCheck} color={softTeal} boxSize={5} />
                <Text>Cancel anytime</Text>
              </HStack>
            </Flex>
          </VStack>
        </Container>

        {/* Decorative elements */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w="700px"
          h="700px"
          bg={softTeal}
          borderRadius="full"
          filter="blur(150px)"
          opacity={0.2}
          animation={`${pulse} 8s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w="600px"
          h="600px"
          bg="#9D7BE8"
          borderRadius="full"
          filter="blur(150px)"
          opacity={0.15}
          animation={`${pulse} 10s ease-in-out infinite`}
        />
      </Box>

      {/* 10. FOOTER */}
      <Box bg="gray.900" color="gray.400" py={{ base: 12, md: 20 }}>
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mx="auto">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 8, md: 12 }} mb={{ base: 12, md: 16 }} textAlign={{ base: 'center', sm: 'left' }}>
            <VStack align={{ base: 'center', md: 'start' }} gap={6}>
              <HStack gap={3}>
                <Box
                  w={12}
                  h={12}
                  bgGradient={`linear(135deg, ${deepIndigo}, ${softTeal})`}
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(92, 225, 230, 0.3)"
                >
                  <Icon as={FiZap} color="white" boxSize={7} />
                </Box>
                <Heading size="md" color={deepIndigo}>
                  HeadspaceGenie.ai
                </Heading>
              </HStack>
              <Text fontSize="sm" color="gray.400" lineHeight="tall" maxW="250px">
                Headspace for humans who lead. AI with a soul.
              </Text>
              <HStack gap={4}>
                <a href="mailto:hello@headspacegenie.ai" aria-label="Email us" style={{ textDecoration: 'none' }}>
                  <Flex
                    w={10}
                    h={10}
                    bg="whiteAlpha.100"
                    borderRadius="lg"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    _hover={{ bg: 'whiteAlpha.200', color: softTeal }}
                    transition="all 0.2s"
                  >
                    <Icon as={FiMail} boxSize={5} />
                  </Flex>
                </a>
              </HStack>
            </VStack>

            <VStack align={{ base: 'center', md: 'start' }} gap={4}>
              <Text fontWeight="semibold" color="white" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">Product</Text>
              <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s" onClick={() => scrollToSection('genies')}>Features</Text>
              <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s" onClick={() => scrollToSection('pricing')}>Pricing</Text>
            </VStack>

            <VStack align={{ base: 'center', md: 'start' }} gap={4}>
              <Text fontWeight="semibold" color="white" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">Company</Text>
              <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s" onClick={() => window.location.href = 'mailto:hello@headspacegenie.ai'}>Contact</Text>
            </VStack>

            <VStack align={{ base: 'center', md: 'start' }} gap={4}>
              <Text fontWeight="semibold" color="white" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">Legal</Text>
              <Link href="/terms" passHref>
                <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s">Terms</Text>
              </Link>
              <Link href="/privacy" passHref>
                <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s">Privacy</Text>
              </Link>
            </VStack>
          </SimpleGrid>

          <Box pt={8} borderTop="1px" borderColor="gray.800">
            <Flex justify={{ base: 'center', md: 'space-between' }} align="center" direction={{ base: 'column', md: 'row' }} gap={4} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                © {new Date().getFullYear()} HeadspaceGenie.ai — Headspace for humans who lead.
              </Text>
              <HStack gap={6}>
                <Link href="/privacy" passHref>
                  <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s">Privacy Policy</Text>
                </Link>
                <Link href="/terms" passHref>
                  <Text fontSize="sm" cursor="pointer" _hover={{ color: softTeal }} transition="all 0.2s">Terms of Service</Text>
                </Link>
              </HStack>
            </Flex>
          </Box>
        </Container>
      </Box>

      {/* Sticky Mobile CTA */}
      {showMobileCTA && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          p={4}
          bg="neomorphic.surface"
          boxShadow="neo.lg"
          display={{ base: 'block', md: 'none' }}
          zIndex={999}
          borderTop="none"
        >
          <Button
            w="full"
            size="lg"
            bgGradient={`linear(to-r, ${softTeal}, ${tealVariant})`}
            color="white"
            onClick={handleCTAClick}
            loading={isLoading}
            borderRadius="2xl"
            boxShadow="neo.md"
            _hover={{
              bgGradient: `linear(to-r, ${tealVariant}, ${softTeal})`,
              boxShadow: 'neo.lg',
            }}
            _active={{
              boxShadow: 'neo.sm',
            }}
          >
            Start Free Trial
            <Icon as={FiArrowRight} ml={2} />
          </Button>
        </Box>
      )}

    </Box>
  )
}

export default function LandingPage() {
  return (
    <Suspense fallback={<Box minH="100vh" bg="white" />}>
      <LandingPageContent />
    </Suspense>
  )
}
