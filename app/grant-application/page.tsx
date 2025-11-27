'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Card,
  Badge,
  Textarea,
  IconButton,
  Spinner,
  Field,
} from '@chakra-ui/react'
import { useState, useRef, DragEvent, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  FiUpload,
  FiFileText,
  FiArrowRight,
  FiLoader,
  FiX,
  FiFile,
  FiAlertCircle,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useGrantGenieStore } from '@/lib/stores'
import { useAppToast } from '@/lib/utils/toast'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { useCreateGrantApplication } from '@/lib/api/grants'
import { useUser } from '@stackframe/stack'
import { gaps, padding } from '@/lib/constants/spacing'

// File type validation
const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface UploadedFile {
  file: File
  id: string
}

function GrantGenieContent() {
  const router = useRouter()
  const toast = useAppToast()
  const user = useUser()
  const { mutate: createApplication, isPending: isCreating } = useCreateGrantApplication()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { formData, setFormData } = useGrantGenieStore()
  
  // File upload state
  const [rfpFiles, setRfpFiles] = useState<UploadedFile[]>([])
  const [teachingFiles, setTeachingFiles] = useState<UploadedFile[]>([])
  const [isDraggingRfp, setIsDraggingRfp] = useState(false)
  const [isDraggingTeaching, setIsDraggingTeaching] = useState(false)
  
  const rfpInputRef = useRef<HTMLInputElement>(null)
  const teachingInputRef = useRef<HTMLInputElement>(null)

  // File validation
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`
    }
    
    const fileType = file.type
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(fileType)) {
      return `File "${file.name}" has an unsupported format. Please upload PDF, DOC, DOCX, or TXT files.`
    }
    
    return null
  }

  // Handle file selection
  const handleFileSelect = (files: FileList | null, type: 'rfp' | 'teaching') => {
    if (!files) return
    
    const newErrors = { ...errors }
    delete newErrors[`${type}Files`]
    
    const validFiles: UploadedFile[] = []
    
    Array.from(files).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        newErrors[`${type}Files`] = error
        toast.fileUploadError(error)
      } else {
        validFiles.push({
          file,
          id: `${Date.now()}-${Math.random()}`,
        })
      }
    })
    
    setErrors(newErrors)
    
    if (type === 'rfp') {
      setRfpFiles((prev) => [...prev, ...validFiles])
    } else {
      setTeachingFiles((prev) => [...prev, ...validFiles])
    }
    
    // Show success toast for valid files
    if (validFiles.length > 0) {
      if (validFiles.length === 1) {
        toast.fileUploadSuccess(validFiles[0].file.name)
      } else {
        toast.success(`${validFiles.length} files uploaded successfully`, 'Upload Complete')
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>, type: 'rfp' | 'teaching') => {
    e.preventDefault()
    if (type === 'rfp') {
      setIsDraggingRfp(true)
    } else {
      setIsDraggingTeaching(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>, type: 'rfp' | 'teaching') => {
    e.preventDefault()
    if (type === 'rfp') {
      setIsDraggingRfp(false)
    } else {
      setIsDraggingTeaching(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, type: 'rfp' | 'teaching') => {
    e.preventDefault()
    if (type === 'rfp') {
      setIsDraggingRfp(false)
    } else {
      setIsDraggingTeaching(false)
    }
    handleFileSelect(e.dataTransfer.files, type)
  }

  // Remove file
  const removeFile = (id: string, type: 'rfp' | 'teaching') => {
    if (type === 'rfp') {
      setRfpFiles((prev) => prev.filter((f) => f.id !== id))
    } else {
      setTeachingFiles((prev) => prev.filter((f) => f.id !== id))
    }
  }

  // Field validation
  const validateField = (field: string, value: string): string | null => {
    if (field === 'projectName' && !value.trim()) {
      return 'Project/Program Name is required'
    }
    if (field === 'funderName' && !value.trim()) {
      return 'Funder Name is required'
    }
    return null
  }

  // Handle field change with validation
  const handleFieldChange = (field: string, value: string) => {
    setFormData({ [field]: value })
    
    const error = validateField(field, value)
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    })
  }

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.projectName?.trim() &&
      formData.funderName?.trim() &&
      Object.keys(errors).length === 0
    )
  }

  const handleGenerate = async () => {
    // Validate all required fields
    const newErrors: Record<string, string> = {}

    if (!formData.projectName?.trim()) {
      newErrors.projectName = 'Project/Program Name is required'
    }
    if (!formData.funderName?.trim()) {
      newErrors.funderName = 'Funder Name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields', 'Validation Error')
      return
    }

    if (!user?.id) {
      toast.error('You must be logged in to create a grant application', 'Authentication Required')
      return
    }

    setErrors({})

    // Create the grant application in the database
    createApplication({
      grantTitle: formData.projectName,
      organization: user.primaryEmail || 'Unknown Organization',
      funderName: formData.funderName,
      focusArea: 'General', // Default focus area
      amount: formData.fundingAmount || undefined,
      deadline: formData.deadline || undefined,
      status: 'Draft' as const,
      rfpText: formData.rfpText || undefined,
      teachingMaterials: formData.teachingMaterials || undefined,
      projectName: formData.projectName,
    }, {
      onSuccess: () => {
        // Navigate to proposal page which will generate the content
        // Form data is already in Zustand store with persistence
        toast.success('Generating your grant proposal...', 'Generation Started')
        router.push('/grant-application/proposal')
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start generation. Please try again.'
        setErrors({ submit: errorMessage })
        // Error toast is already shown by the hook
      }
    })
  }

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background">
        <Container maxW="container.xl" py={padding.page}>
          <VStack gap={gaps.loose} align="stretch">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: 'Grant Application', isCurrentPage: true },
              ]}
            />

            {/* Header */}
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Heading size="xl" color="purple.900">
                  Grant Genie
                </Heading>
                <Text color="purple.700">
                  Make it yours and collaborate
                </Text>
              </VStack>
              <Badge colorPalette="purple" fontSize="sm" px={3} py={1}>
                Step 1 of 1
              </Badge>
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={gaps.loose}>
              {/* Left Column - Upload & Teaching */}
              <VStack gap={gaps.relaxed} align="stretch">
                {/* Upload Grant Materials */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="md" color="purple.900">
                      Upload Grant Materials
                    </Heading>
                    <Text fontSize="sm" color="purple.700" mt={2}>
                      Upload RFP or Guidelines, or paste the content in text box
                    </Text>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={gaps.normal} align="stretch">
                      {/* Upload Area */}
                      <input
                        ref={rfpInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        multiple
                        hidden
                        onChange={(e) => handleFileSelect(e.target.files, 'rfp')}
                      />
                      <Box
                        p={8}
                        border="none"
                        borderRadius="2xl"
                        bg="neomorphic.background"
                        cursor="pointer"
                        textAlign="center"
                        boxShadow={isDraggingRfp ? 'neo.lg' : 'neo.inset.md'}
                        _hover={{ boxShadow: 'neo.lg' }}
                        transition="all 0.3s"
                        onClick={() => rfpInputRef.current?.click()}
                        onDragOver={(e) => handleDragOver(e, 'rfp')}
                        onDragLeave={(e) => handleDragLeave(e, 'rfp')}
                        onDrop={(e) => handleDrop(e, 'rfp')}
                      >
                        <VStack gap={gaps.tight}>
                          <Icon as={FiUpload} boxSize={10} color="purple.600" />
                          <Text color="purple.900" fontWeight="medium">
                            Drop RFP or Guidelines here
                          </Text>
                          <Text fontSize="sm" color="purple.600">
                            Or click to browse (PDF, DOC, DOCX, TXT)
                          </Text>
                        </VStack>
                      </Box>

                      {/* Error message */}
                      {errors.rfpFiles && (
                        <HStack gap={gaps.tight} color="red.600" fontSize="sm">
                          <Icon as={FiAlertCircle} />
                          <Text>{errors.rfpFiles}</Text>
                        </HStack>
                      )}

                      {/* Uploaded files list */}
                      {rfpFiles.length > 0 && (
                        <VStack gap={gaps.tight} align="stretch">
                          {rfpFiles.map((uploadedFile) => (
                            <HStack
                              key={uploadedFile.id}
                              p={3}
                              bg="neomorphic.background"
                              borderRadius="xl"
                              border="none"
                              boxShadow="neo.sm"
                              justify="space-between"
                            >
                              <HStack gap={gaps.tight}>
                                <Icon as={FiFile} color="purple.600" />
                                <Text fontSize="sm" color="purple.900">
                                  {uploadedFile.file.name}
                                </Text>
                                <Text fontSize="xs" color="purple.600">
                                  ({(uploadedFile.file.size / 1024).toFixed(1)} KB)
                                </Text>
                              </HStack>
                              <IconButton
                                aria-label={`Remove file ${uploadedFile.file.name}`}
                                size="sm"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => removeFile(uploadedFile.id, 'rfp')}
                                _active={{ transform: 'scale(0.95)' }}
                                _focusVisible={{
                                  outline: '3px solid',
                                  outlineColor: 'red.500',
                                  outlineOffset: '2px'
                                }}
                              >
                                <Icon as={FiX} />
                              </IconButton>
                            </HStack>
                          ))}
                        </VStack>
                      )}

                      {/* Text Input Alternative */}
                      <Field.Root>
                        <Field.Label fontWeight="medium">
                          Or Paste RFP Content
                        </Field.Label>
                        <Textarea
                          placeholder="Paste foundation's request for proposals, guidelines, and strategic priorities..."
                          rows={6}
                          value={formData.rfpText}
                          onChange={(e) => setFormData({ rfpText: e.target.value })}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                        />
                        <Field.HelperText>
                          Paste the content or describe in text box
                        </Field.HelperText>
                      </Field.Root>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Teach the Grant Genie */}
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="md" color="purple.900">
                      Teach the Grant Genie
                    </Heading>
                    <Text fontSize="sm" color="purple.700" mt={2}>
                      Upload your own past grants and teach the Genie HOW you write
                    </Text>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={gaps.normal} align="stretch">
                      {/* Upload Area */}
                      <input
                        ref={teachingInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        multiple
                        hidden
                        onChange={(e) => handleFileSelect(e.target.files, 'teaching')}
                      />
                      <Box
                        p={8}
                        border="none"
                        borderRadius="2xl"
                        bg="neomorphic.background"
                        cursor="pointer"
                        textAlign="center"
                        boxShadow={isDraggingTeaching ? 'neo.lg' : 'neo.inset.md'}
                        _hover={{ boxShadow: 'neo.lg' }}
                        transition="all 0.3s"
                        onClick={() => teachingInputRef.current?.click()}
                        onDragOver={(e) => handleDragOver(e, 'teaching')}
                        onDragLeave={(e) => handleDragLeave(e, 'teaching')}
                        onDrop={(e) => handleDrop(e, 'teaching')}
                      >
                        <VStack gap={gaps.tight}>
                          <Icon as={FiFileText} boxSize={10} color="purple.600" />
                          <Text color="purple.900" fontWeight="medium">
                            Upload grants, reports, or narratives
                          </Text>
                          <Text fontSize="sm" color="purple.600">
                            that shows HOW you write (PDF, DOC, DOCX, TXT)
                          </Text>
                        </VStack>
                      </Box>

                      {/* Error message */}
                      {errors.teachingFiles && (
                        <HStack gap={gaps.tight} color="red.600" fontSize="sm">
                          <Icon as={FiAlertCircle} />
                          <Text>{errors.teachingFiles}</Text>
                        </HStack>
                      )}

                      {/* Uploaded files list */}
                      {teachingFiles.length > 0 && (
                        <VStack gap={gaps.tight} align="stretch">
                          {teachingFiles.map((uploadedFile) => (
                            <HStack
                              key={uploadedFile.id}
                              p={3}
                              bg="neomorphic.background"
                              borderRadius="xl"
                              border="none"
                              boxShadow="neo.sm"
                              justify="space-between"
                            >
                              <HStack gap={gaps.tight}>
                                <Icon as={FiFile} color="purple.600" />
                                <Text fontSize="sm" color="purple.900">
                                  {uploadedFile.file.name}
                                </Text>
                                <Text fontSize="xs" color="purple.600">
                                  ({(uploadedFile.file.size / 1024).toFixed(1)} KB)
                                </Text>
                              </HStack>
                              <IconButton
                                aria-label={`Remove file ${uploadedFile.file.name}`}
                                size="sm"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => removeFile(uploadedFile.id, 'teaching')}
                                _active={{ transform: 'scale(0.95)' }}
                                _focusVisible={{
                                  outline: '3px solid',
                                  outlineColor: 'red.500',
                                  outlineOffset: '2px'
                                }}
                              >
                                <Icon as={FiX} />
                              </IconButton>
                            </HStack>
                          ))}
                        </VStack>
                      )}

                      {/* Text Input Alternative */}
                      <Field.Root>
                        <Field.Label fontWeight="medium">
                          Or Paste Teaching Materials
                        </Field.Label>
                        <Textarea
                          placeholder="Paste grants, reports, or narratives that show HOW you write..."
                          rows={6}
                          value={formData.teachingMaterials}
                          onChange={(e) => setFormData({ teachingMaterials: e.target.value })}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                        />
                        <Field.HelperText>
                          Paste here or upload files above
                        </Field.HelperText>
                      </Field.Root>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Knowledge Capture */}
                <Card.Root bg="neomorphic.surface" border="none" borderRadius="3xl" boxShadow="neo.inset.sm">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Knowledge Capture
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize="sm" color="purple.700" lineHeight="tall">
                      Grant the proposal will use all the context to learn your writing style and the funder's priorities. Share as much as you can OR AVOID guidance and opt to control your grant style.
                    </Text>
                  </Card.Body>
                </Card.Root>

                {/* Talk to the Genie */}
                <Card.Root bg="neomorphic.surface" border="none" borderRadius="3xl" boxShadow="neo.inset.sm">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Talk to the Genie
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={gaps.tight} align="stretch">
                      <Text fontSize="sm" color="purple.700">
                        Ask one reflective or question to the Genie to customize:
                      </Text>
                      <Box
                        p={3}
                        bg="white"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="purple.200"
                      >
                        <Text fontSize="sm" color="purple.900" fontStyle="italic">
                          e.g., "How can I incorporate data-driven evidence into my problem statement?"
                        </Text>
                      </Box>
                      <Textarea
                        placeholder="Remember that Smith Foundation prefers concise strategic metrics over general statements..."
                        rows={3}
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.inset.sm"
                        _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                      />
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>

              {/* Right Column - Project Context */}
              <VStack gap={gaps.relaxed} align="stretch">
                <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                  <Card.Header>
                    <Heading size="md" color="purple.900">
                      Project Context Fields
                    </Heading>
                    <Text fontSize="sm" color="purple.700" mt={2}>
                      Provide the essential details for your grant proposal
                    </Text>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={gaps.relaxed} align="stretch">
                      {/* Project/Program Name */}
                      <Field.Root invalid={!!errors.projectName} required>
                        <Field.Label fontWeight="medium">
                          Project/Program Name
                        </Field.Label>
                        <Input
                          placeholder="Enter project name"
                          value={formData.projectName || ''}
                          onChange={(e) => handleFieldChange('projectName', e.target.value)}
                          aria-invalid={!!errors.projectName}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                        />
                        <Field.ErrorText>{errors.projectName}</Field.ErrorText>
                      </Field.Root>

                      {/* Funder Name */}
                      <Field.Root invalid={!!errors.funderName} required>
                        <Field.Label fontWeight="medium">
                          Funder Name
                        </Field.Label>
                        <Input
                          placeholder="Enter funder name"
                          value={formData.funderName || ''}
                          onChange={(e) => handleFieldChange('funderName', e.target.value)}
                          aria-invalid={!!errors.funderName}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                        />
                        <Field.ErrorText>{errors.funderName}</Field.ErrorText>
                      </Field.Root>

                      {/* Funding Deadline */}
                      <Field.Root>
                        <Field.Label fontWeight="medium">
                          Funding Deadline
                        </Field.Label>
                        <Input
                          type="date"
                          value={formData.deadline || ''}
                          onChange={(e) => handleFieldChange('deadline', e.target.value)}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                        />
                        <Field.HelperText>
                          Select the deadline for this grant application
                        </Field.HelperText>
                      </Field.Root>

                      {/* Estimated Grant Amount */}
                      <Field.Root>
                        <Field.Label fontWeight="medium">
                          Estimated Grant Amount
                        </Field.Label>
                        <Input
                          placeholder="$50,000"
                          value={formData.fundingAmount || ''}
                          onChange={(e) => handleFieldChange('fundingAmount', e.target.value)}
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.inset.sm"
                          _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                        />
                        <Field.HelperText>
                          Enter the amount you're requesting (optional)
                        </Field.HelperText>
                      </Field.Root>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Input Summary Preview */}
                <Card.Root bg="neomorphic.surface" border="none" borderRadius="3xl" boxShadow="neo.inset.sm">
                  <Card.Header>
                    <Heading size="sm" color="purple.900">
                      Input Summary
                    </Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={gaps.tight} align="stretch">
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>
                          Grant Materials
                        </Text>
                        <Text fontSize="sm" color="purple.900">
                          {rfpFiles.length > 0
                            ? `${rfpFiles.length} file${rfpFiles.length > 1 ? 's' : ''} uploaded`
                            : formData.rfpText
                            ? 'RFP content provided'
                            : 'Not provided yet'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>
                          Teaching Materials
                        </Text>
                        <Text fontSize="sm" color="purple.900">
                          {teachingFiles.length > 0
                            ? `${teachingFiles.length} file${teachingFiles.length > 1 ? 's' : ''} uploaded`
                            : formData.teachingMaterials
                            ? 'Writing samples provided'
                            : 'Not provided yet'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>
                          Project Name
                        </Text>
                        <Text fontSize="sm" color="purple.900">
                          {formData.projectName || 'Not entered'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="purple.600" mb={1}>
                          Funder
                        </Text>
                        <Text fontSize="sm" color="purple.900">
                          {formData.funderName || 'Not specified'}
                        </Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            </SimpleGrid>

            {/* Error Message */}
            {errors.submit && (
              <Card.Root bg="red.50" border="none" borderRadius="3xl" boxShadow="neo.sm">
                <Card.Body>
                  <HStack gap={gaps.tight}>
                    <Icon as={FiAlertCircle} color="red.700" />
                    <Text color="red.700" fontWeight="medium">
                      {errors.submit}
                    </Text>
                  </HStack>
                </Card.Body>
              </Card.Root>
            )}

            {/* Generate Button */}
            <HStack justify="center" pt={4}>
              <Button
                size="lg"
                colorPalette="purple"
                color="white"
                px={12}
                onClick={handleGenerate}
                disabled={isCreating || !isFormValid()}
                opacity={!isFormValid() && !isCreating ? 0.6 : 1}
                cursor={!isFormValid() && !isCreating ? 'not-allowed' : 'pointer'}
                borderRadius="2xl"
                boxShadow="neo.md"
                _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                _disabled={{
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  _hover: { bg: undefined, transform: 'none', boxShadow: 'neo.md' }
                }}
              >
                {isCreating ? (
                  <>
                    <Icon
                      as={FiLoader}
                      mr={2}
                      animation="spin 1s linear infinite"
                      css={{
                        '@keyframes spin': {
                          from: { transform: 'rotate(0deg)' },
                          to: { transform: 'rotate(360deg)' }
                        }
                      }}
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    Generate Draft
                    <Icon as={FiArrowRight} ml={2} />
                  </>
                )}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  )
}

export default function GrantGeniePage() {
  return (
    <Suspense fallback={
      <Box
        minH="100vh"
        bg="neomorphic.background"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="purple.600" />
      </Box>
    }>
      <GrantGenieContent />
    </Suspense>
  )
}
