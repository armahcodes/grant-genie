'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Accordion,
  Card,
  Icon,
  Link,
  Separator,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import {
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiBook,
  FiVideo,
  FiUsers,
  FiCalendar,
  FiAward,
  FiAlertCircle,
  FiStar,
  FiCreditCard,
  FiHelpCircle,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'

export default function SupportPage() {
  const borderColor = 'purple.200'
  const accordionBg = 'white'

  const faqs = [
    {
      value: 'q1',
      question: 'How do I search for relevant grants?',
      answer:
        'Use the Grant Search feature to filter by category, funding amount, deadline, and eligibility criteria. Our AI will suggest grants that match your organization profile.',
    },
    {
      value: 'q2',
      question: 'What documents do I need for grant applications?',
      answer:
        'Typically you\'ll need your organization\'s tax-exempt status, financial statements, project/budget, and organizational information. Each grant may have specific requirements.',
    },
    {
      value: 'q3',
      question: 'How does the compliance tracker work?',
      answer:
        'The compliance tracker monitors deadlines, required reports, and documentation. It sends automated reminders and helps ensure you meet all grant compliance requirements.',
    },
    {
      value: 'q4',
      question: 'Can I collaborate with team members on applications?',
      answer:
        'Yes! You can invite team members to your organization account, assign roles and permissions, and collaborate on grant applications in real-time.',
    },
    {
      value: 'q5',
      question: 'How do I generate reports for funders?',
      answer:
        'Navigate to the Reporting section and select the type of report you need. You can customize reports with specific metrics, timelines, and export them in various formats.',
    },
    {
      value: 'q6',
      question: 'What if I need help with my application?',
      answer:
        'Our support team is available 24/7 via email, phone, or live chat. You can also access our video tutorials, community forum, and schedule a consultation with our grant experts.',
    },
  ]

  const communityResources = [
    { name: 'User Guide', icon: FiBook },
    { name: 'Video Tutorials', icon: FiVideo },
    { name: 'Community Forum', icon: FiUsers },
    { name: 'Webinars', icon: FiCalendar },
    { name: 'Best Practices', icon: FiAward },
  ]

  const quickActions = [
    { name: 'Report a Bug', icon: FiAlertCircle },
    { name: 'Request Feature', icon: FiStar },
    { name: 'Account Issues', icon: FiHelpCircle },
    { name: 'Billing Questions', icon: FiCreditCard },
  ]

  return (
    <MainLayout>
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2} color="purple.900">
              Support Center
            </Heading>
            <Text color="purple.700">
              Find answers to your questions and get help with Headspace Genie
            </Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Left Column - FAQs */}
            <GridItem>
              <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <Card.Header>
                  <Heading size="md" color="purple.900">Frequently Asked Questions</Heading>
                </Card.Header>
                <Card.Body>
                  <Accordion.Root collapsible>
                    {faqs.map((faq) => (
                      <Accordion.Item key={faq.value} value={faq.value} border="none" mb={2}>
                        <Accordion.ItemTrigger
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.sm"
                          _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                          _expanded={{ boxShadow: 'neo.inset.sm' }}
                          py={4}
                          cursor="pointer"
                          transition="all 0.3s"
                        >
                          <Box flex="1" textAlign="left" fontWeight="medium" color="purple.900">
                            {faq.question}
                          </Box>
                          <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent pb={4} pt={4} color="purple.700">
                          {faq.answer}
                        </Accordion.ItemContent>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </Card.Body>
              </Card.Root>
            </GridItem>

            {/* Right Column - Contact & Resources */}
            <GridItem>
              <VStack gap={6} align="stretch">
                {/* Contact Support */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="md" color="purple.900">Contact Support</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      {/* Email Support */}
                      <HStack gap={3} align="start">
                        <Icon as={FiMail} boxSize={5} color="purple.600" mt={1} />
                        <Box flex={1}>
                          <Text fontWeight="semibold" mb={1} color="purple.900">
                            Email Support
                          </Text>
                          <Link
                            href="mailto:support@headspacegenie.ai"
                            color="purple.600"
                            fontSize="sm"
                          >
                            support@headspacegenie.ai
                          </Link>
                        </Box>
                      </HStack>

                      <Separator />

                      {/* Phone Support */}
                      <HStack gap={3} align="start">
                        <Icon as={FiPhone} boxSize={5} color="purple.600" mt={1} />
                        <Box flex={1}>
                          <Text fontWeight="semibold" mb={1} color="purple.900">
                            Phone Support
                          </Text>
                          <Text fontSize="sm" color="purple.700">
                            1-800-XXX-XXXX
                          </Text>
                          <Text fontSize="sm" color="purple.600">
                            Available 24/7
                          </Text>
                        </Box>
                      </HStack>

                      <Separator />

                      {/* Live Chat */}
                      <HStack gap={3} align="start">
                        <Icon as={FiMessageCircle} boxSize={5} color="purple.600" mt={1} />
                        <Box flex={1}>
                          <Text fontWeight="semibold" mb={1} color="purple.900">
                            Live Chat
                          </Text>
                          <Text fontSize="sm" color="purple.700" mb={3}>
                            Available M-F
                          </Text>
                          <Text fontSize="sm" color="purple.600" mb={3}>
                            9am-5pm EST
                          </Text>
                          <Button
                            colorPalette="purple"
                            color="white"
                            w="full"
                            size="sm"
                            borderRadius="2xl"
                            boxShadow="neo.md"
                            _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                            _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                          >
                            Start Live Chat
                          </Button>
                        </Box>
                      </HStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Community Resources */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="md" color="purple.900">Community Resources</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={2} align="stretch">
                      {communityResources.map((resource, index) => (
                        <HStack
                          key={index}
                          p={3}
                          bg="neomorphic.background"
                          borderRadius="2xl"
                          boxShadow="neo.sm"
                          cursor="pointer"
                          _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                          transition="all 0.3s"
                        >
                          <Icon as={resource.icon} boxSize={5} color="purple.600" />
                          <Text fontSize="sm" color="purple.900">{resource.name}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Quick Actions */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="md" color="purple.900">Quick Actions</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={2} align="stretch">
                      {quickActions.map((action, index) => (
                        <HStack
                          key={index}
                          p={3}
                          bg="neomorphic.background"
                          borderRadius="2xl"
                          boxShadow="neo.sm"
                          cursor="pointer"
                          _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                          transition="all 0.3s"
                        >
                          <Icon as={action.icon} boxSize={5} color="purple.600" />
                          <Text fontSize="sm" color="purple.900">{action.name}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            </GridItem>
          </Grid>

          {/* Footer */}
          <Box textAlign="center" py={8} borderTop="1px" borderColor={borderColor}>
            <Text fontSize="sm" color="purple.600">
              © 2025 Headspace Genie. All rights reserved.
            </Text>
          </Box>
        </VStack>
      </Container>
    </MainLayout>
  )
}
