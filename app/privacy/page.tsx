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

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background" py={12}>
        <Container maxW="4xl">
          <VStack gap={8} align="stretch">
            <VStack align="start" gap={2}>
              <Heading size="2xl" color="purple.900">
                Privacy Policy
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
                    1. Information We Collect
                  </Heading>
                  <Text mb={3}>We collect information you provide directly to us when you:</Text>
                  <List.Root ml={6} gap={2}>
                    <List.Item>Create an account</List.Item>
                    <List.Item>Use our AI services to generate content</List.Item>
                    <List.Item>Upload documents for AI training</List.Item>
                    <List.Item>Contact our support team</List.Item>
                    <List.Item>Subscribe to our newsletter</List.Item>
                  </List.Root>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    2. How We Use Your Information
                  </Heading>
                  <Text mb={3}>We use the information we collect to:</Text>
                  <List.Root ml={6} gap={2}>
                    <List.Item>Provide, maintain, and improve our services</List.Item>
                    <List.Item>Train AI models on your organization's writing style (with your permission)</List.Item>
                    <List.Item>Process transactions and send related information</List.Item>
                    <List.Item>Send technical notices, updates, and support messages</List.Item>
                    <List.Item>Respond to your comments and questions</List.Item>
                  </List.Root>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    3. Data Security
                  </Heading>
                  <Text mb={3}>
                    We take data security seriously and implement appropriate technical and organizational measures to protect your data, including:
                  </Text>
                  <List.Root ml={6} gap={2}>
                    <List.Item>256-bit encryption for data in transit and at rest</List.Item>
                    <List.Item>Regular security audits and penetration testing</List.Item>
                    <List.Item>Access controls and authentication mechanisms</List.Item>
                    <List.Item>Secure data centers with SOC 2 Type II compliance</List.Item>
                  </List.Root>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    4. Data Ownership
                  </Heading>
                  <Text>
                    You retain full ownership of all content you create using HeadspaceGenie.ai. We do not claim any ownership rights to your generated content, uploaded documents, or data.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    5. Third-Party Services
                  </Heading>
                  <Text mb={3}>We use select third-party services to operate our platform:</Text>
                  <List.Root ml={6} gap={2}>
                    <List.Item>OpenAI for AI model access</List.Item>
                    <List.Item>Authentication providers for secure login</List.Item>
                    <List.Item>Payment processors for billing</List.Item>
                    <List.Item>Analytics tools to improve our service</List.Item>
                  </List.Root>
                  <Text mt={3}>
                    These providers have access only to the information necessary to perform their functions and are obligated to protect your data.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    6. Data Retention
                  </Heading>
                  <Text>
                    We retain your data for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    7. Your Rights
                  </Heading>
                  <Text mb={3}>You have the right to:</Text>
                  <List.Root ml={6} gap={2}>
                    <List.Item>Access your personal data</List.Item>
                    <List.Item>Correct inaccurate data</List.Item>
                    <List.Item>Request deletion of your data</List.Item>
                    <List.Item>Export your data</List.Item>
                    <List.Item>Opt-out of marketing communications</List.Item>
                  </List.Root>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    8. GDPR Compliance
                  </Heading>
                  <Text>
                    For users in the European Union, we comply with GDPR requirements. You have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    9. Children's Privacy
                  </Heading>
                  <Text>
                    Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    10. Changes to This Policy
                  </Heading>
                  <Text>
                    We may update this privacy policy from time to time. We will notify you of significant changes via email or through our service.
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" mb={4} color="purple.900">
                    11. Contact Us
                  </Heading>
                  <Text>
                    If you have questions about this Privacy Policy, please contact us at:{' '}
                    <Link href="mailto:privacy@headspacegenie.ai" color="purple.600" fontWeight="semibold">
                      privacy@headspacegenie.ai
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
