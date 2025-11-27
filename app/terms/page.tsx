'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  List,
  Link,
} from '@chakra-ui/react'
import MainLayout from '@/components/layout/MainLayout'
import NextLink from 'next/link'

export default function TermsOfService() {
  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background" py={12}>
        <Container maxW="4xl">
          <VStack gap={8} align="stretch">
            <VStack align="start" gap={2}>
              <Heading size="2xl" color="purple.900">
                Terms of Service
              </Heading>
              <Text color="purple.600" fontSize="sm">
                Last Updated: {new Date().toLocaleDateString()}
              </Text>
            </VStack>

            <Box
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              p={8}
            >
              <VStack gap={8} align="stretch" color="purple.900" lineHeight="tall">
                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    1. Acceptance of Terms
                  </Heading>
                  <Text>
                    By accessing and using HeadspaceGenie.ai ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    2. Use License
                  </Heading>
                  <Text>
                    Permission is granted to temporarily use the Service for personal or organizational use. This is the grant of a license, not a transfer of title.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    3. Beta Program
                  </Heading>
                  <Text>
                    HeadspaceGenie.ai is currently in beta. The Service is provided "as is" and we make no guarantees about uptime, data persistence, or feature availability during the beta period.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    4. User Data
                  </Heading>
                  <Text>
                    You retain all rights to any content you create using the Service. We do not claim ownership of your generated content, documents, or data.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    5. Acceptable Use
                  </Heading>
                  <Text mb={3}>You agree not to use the Service to:</Text>
                  <List.Root ml={6} gap={2}>
                    <List.Item>Generate harmful, illegal, or discriminatory content</List.Item>
                    <List.Item>Violate any applicable laws or regulations</List.Item>
                    <List.Item>Infringe on intellectual property rights of others</List.Item>
                    <List.Item>Attempt to reverse engineer or exploit the Service</List.Item>
                  </List.Root>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    6. Billing and Cancellation
                  </Heading>
                  <Text>
                    Subscriptions are billed monthly. You may cancel at any time from your account settings. Cancellations take effect at the end of the current billing period. No refunds for partial months.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    7. Disclaimer
                  </Heading>
                  <Text>
                    The Service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted or error-free.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    8. Limitation of Liability
                  </Heading>
                  <Text>
                    HeadspaceGenie.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    9. Changes to Terms
                  </Heading>
                  <Text>
                    We reserve the right to modify these terms at any time. Continued use of the Service constitutes acceptance of modified terms.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    10. Contact
                  </Heading>
                  <Text>
                    For questions about these Terms, contact us at:{' '}
                    <Link href="mailto:hello@headspacegenie.ai" color="purple.600" fontWeight="semibold">
                      hello@headspacegenie.ai
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Box textAlign="center" pt={8}>
              <NextLink href="/" passHref>
                <Link
                  color="purple.600"
                  fontWeight="semibold"
                  fontSize="lg"
                  _hover={{ color: "purple.700" }}
                >
                  ← Back to Home
                </Link>
              </NextLink>
            </Box>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  )
}
