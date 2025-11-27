'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Card,
  SimpleGrid,
  Separator,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import {
  FiShare2,
  FiDownload,
  FiSave,
  FiRefreshCw,
  FiCheck,
  FiCopy,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useGrantGenieStore } from '@/lib/stores'
import { useGrantWritingAgent } from '@/lib/agents'
import { useAppToast } from '@/lib/utils/toast'

export default function GrantProposalPage() {
  const router = useRouter()
  const toast = useAppToast()
  const { formData, proposalContent, isGenerating, isSaving, saveSessionToDb, sessionId } = useGrantGenieStore()
  const { generateProposal, error } = useGrantWritingAgent()

  useEffect(() => {
    // Check if we have form data, if not redirect back
    if (!formData.projectName || !formData.funderName) {
      router.push('/grant-application')
      return
    }

    // Only generate if we don't have content yet
    if (!proposalContent && !isGenerating) {
      handleGenerate()
    }
  }, [])

  const handleGenerate = async () => {
    try {
      await generateProposal({
        projectName: formData.projectName,
        funderName: formData.funderName,
        fundingAmount: formData.fundingAmount,
        deadline: formData.deadline,
        rfpText: formData.rfpText,
        teachingMaterials: formData.teachingMaterials,
      })
      // Auto-save the session after generation
      const savedId = await saveSessionToDb()
      if (savedId) {
        toast.success('Session saved automatically', 'Auto-saved')
      }
    } catch (err) {
      console.error('Error generating proposal:', err)
    }
  }

  const handleSaveSession = async () => {
    const savedId = await saveSessionToDb()
    if (savedId) {
      toast.success('Session saved successfully', 'Saved')
    } else {
      toast.error('Failed to save session', 'Save Error')
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleDownload = useCallback(() => {
    if (!proposalContent) return

    const filename = `${formData.projectName?.replace(/[^a-z0-9]/gi, '_') || 'proposal'}_${new Date().toISOString().split('T')[0]}.txt`
    const blob = new Blob([proposalContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Proposal downloaded successfully', 'Download Complete')
  }, [proposalContent, formData.projectName, toast])

  const handleCopyToClipboard = useCallback(async () => {
    if (!proposalContent) return

    try {
      await navigator.clipboard.writeText(proposalContent)
      toast.success('Proposal copied to clipboard', 'Copied')
    } catch {
      toast.error('Failed to copy to clipboard', 'Copy Failed')
    }
  }, [proposalContent, toast])

  const handleSaveToDatabase = useCallback(async () => {
    if (!proposalContent) return

    try {
      const response = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantTitle: formData.projectName,
          funderName: formData.funderName,
          amount: formData.fundingAmount,
          deadline: formData.deadline,
          status: 'Draft',
          generatedContent: proposalContent,
        }),
      })

      if (response.ok) {
        toast.success('Proposal saved to your grants', 'Saved Successfully')
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      toast.error('Failed to save proposal', 'Save Failed')
    }
  }, [proposalContent, formData, toast])

  const handleShare = useCallback(async () => {
    if (!proposalContent) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: formData.projectName || 'Grant Proposal',
          text: proposalContent.substring(0, 200) + '...',
        })
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopyToClipboard()
      toast.info('Link copied - share with your colleague', 'Share')
    }
  }, [proposalContent, formData.projectName, handleCopyToClipboard, toast])

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background">
        <Container maxW="container.xl" py={8}>
          <VStack gap={8} align="stretch">
            {/* Header */}
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={1}>
                <HStack gap={2}>
                  <Heading size="xl" color="purple.900">
                    Grant Genie
                  </Heading>
                  {sessionId && (
                    <Badge colorPalette="green" fontSize="xs">
                      <Icon as={FiCheck} mr={1} />
                      Saved
                    </Badge>
                  )}
                </HStack>
                <Text color="purple.700">
                  {formData?.projectName || 'Your generated proposal'}
                </Text>
              </VStack>
              <HStack gap={3}>
                <Button
                  variant="outline"
                  colorPalette="purple"
                  color="purple.900"
                  size="sm"
                  onClick={handleShare}
                  disabled={!proposalContent || isGenerating}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                  _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                >
                  <Icon as={FiShare2} mr={2} />
                  Share
                </Button>
                <Button
                  variant="outline"
                  colorPalette="purple"
                  color="purple.900"
                  size="sm"
                  onClick={handleCopyToClipboard}
                  disabled={!proposalContent || isGenerating}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                  _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                >
                  <Icon as={FiCopy} mr={2} />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  colorPalette="purple"
                  color="purple.900"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!proposalContent || isGenerating}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                  _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                >
                  <Icon as={FiDownload} mr={2} />
                  Download
                </Button>
                <Button
                  colorPalette="purple"
                  color="white"
                  size="sm"
                  onClick={async () => {
                    await handleSaveToDatabase()
                    await handleSaveSession()
                  }}
                  disabled={!proposalContent || isGenerating || isSaving}
                  borderRadius="2xl"
                  boxShadow="neo.md"
                  _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                  _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                >
                  <Icon as={FiSave} mr={2} />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </HStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
              {/* Left Sidebar - Reflection */}
              <VStack gap={6} align="stretch">
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Reflection
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize="sm" color="purple.700" lineHeight="tall">
                      Help me revise this proposal to emphasize the measurable outcomes and include specific data points.
                    </Text>
                  </Card.Body>
                </Card.Root>

                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Knowledge Capture
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize="sm" color="purple.700" lineHeight="tall">
                      Save the donor's profile and validate how to say "yes" without over-promising. Record the conversation for later reference. Capture next steps in real-time.
                    </Text>
                  </Card.Body>
                </Card.Root>

                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Talk to the Genie
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={3} align="stretch">
                      <Text fontSize="sm" color="purple.700">
                        Ask one reflective or question to the Genie to customize:
                      </Text>
                      <Box
                        p={3}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        border="none"
                        boxShadow="neo.inset.sm"
                      >
                        <Text fontSize="xs" color="purple.900">
                          Why would you want to run this?
                        </Text>
                      </Box>
                      <Box
                        p={3}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        border="none"
                        boxShadow="neo.inset.sm"
                      >
                        <Text fontSize="xs" color="purple.900">
                          Are you reflecting or asking the Genie for knowledge on this?
                        </Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>

              {/* Main Proposal Content */}
              <Box gridColumn={{ base: '1', lg: 'span 2' }}>
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Body p={8}>
                    {isGenerating ? (
                      <VStack gap={6} py={12} align="center">
                        <Spinner size="xl" color="purple.600" />
                        <VStack gap={2}>
                          <Heading size="lg" color="purple.900">
                            Generating Your Grant Proposal
                          </Heading>
                          <Text color="purple.700" textAlign="center">
                            The Genie is crafting a compelling proposal based on your inputs...
                          </Text>
                        </VStack>
                      </VStack>
                    ) : error ? (
                      <VStack gap={6} py={12} align="center">
                        <Text color="red.700" fontSize="lg">
                          {error}
                        </Text>
                        <Button
                          colorPalette="purple"
                          color="white"
                          onClick={handleRegenerate}
                          borderRadius="2xl"
                          boxShadow="neo.md"
                          _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                          _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                          _focusVisible={{
                            outline: '3px solid',
                            outlineColor: 'purple.500',
                            outlineOffset: '2px',
                          }}
                        >
                          <Icon as={FiRefreshCw} mr={2} />
                          Try Again
                        </Button>
                      </VStack>
                    ) : (
                      <VStack gap={8} align="stretch">
                        {/* Proposal Header */}
                        <VStack align="start" gap={3}>
                          <Heading size="2xl" color="purple.900">
                            {formData?.projectName || 'Grant Proposal'}
                          </Heading>
                          <Text fontSize="lg" color="purple.700" fontWeight="medium">
                            Submitted to: {formData?.funderName || 'Funder'}
                          </Text>
                          <Text fontSize="sm" color="purple.600">
                            Generated: {new Date().toLocaleString()}
                          </Text>
                        </VStack>

                        <Separator />

                        {/* AI Generated Content */}
                        <Box
                          color="purple.900"
                          lineHeight="tall"
                          css={{
                            '& h1, & h2, & h3': {
                              color: 'var(--chakra-colors-purple-900)',
                              fontWeight: 'bold',
                              marginTop: '1.5rem',
                              marginBottom: '1rem',
                            },
                            '& p': {
                              marginBottom: '1rem',
                            },
                            '& ul, & ol': {
                              marginLeft: '1.5rem',
                              marginBottom: '1rem',
                            },
                          }}
                          whiteSpace="pre-wrap"
                        >
                          {proposalContent || 'No content generated yet.'}
                        </Box>
                      </VStack>
                    )}
                  </Card.Body>
                </Card.Root>

                {/* Action Buttons */}
                {!isGenerating && !error && proposalContent && (
                  <HStack gap={4} justify="center" mt={8} flexWrap="wrap">
                    <Button
                      variant="outline"
                      colorPalette="purple"
                      color="purple.900"
                      onClick={() => router.push('/grant-application')}
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                      _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                      _focusVisible={{
                        outline: '3px solid',
                        outlineColor: 'purple.500',
                        outlineOffset: '2px',
                      }}
                    >
                      Edit Inputs
                    </Button>
                    <Button
                      variant="outline"
                      colorPalette="purple"
                      color="purple.900"
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                      _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
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
                      variant="outline"
                      colorPalette="purple"
                      color="purple.900"
                      onClick={handleDownload}
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                      _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                      _focusVisible={{
                        outline: '3px solid',
                        outlineColor: 'purple.500',
                        outlineOffset: '2px',
                      }}
                    >
                      <Icon as={FiDownload} mr={2} />
                      Download
                    </Button>
                    <Button
                      colorPalette="purple"
                      color="white"
                      onClick={handleSaveToDatabase}
                      borderRadius="2xl"
                      boxShadow="neo.md"
                      _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                      _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                      _focusVisible={{
                        outline: '3px solid',
                        outlineColor: 'purple.500',
                        outlineOffset: '2px',
                      }}
                    >
                      <Icon as={FiSave} mr={2} />
                      Save to Database
                    </Button>
                  </HStack>
                )}
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  )
}
