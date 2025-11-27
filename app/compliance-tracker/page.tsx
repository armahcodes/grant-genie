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
  Badge,
  Icon,
  SimpleGrid,
  Progress,
  Checkbox,
  Tabs,
  Table,
  Flex,
  Separator,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useUser } from '@stackframe/stack'
import { formatDate } from '@/lib/utils/dates'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiFileText,
  FiCalendar,
  FiUpload,
  FiDownload,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useCompliance } from '@/lib/api/compliance'
import type { ComplianceItem } from '@/lib/api/compliance'
import { ComplianceTaskSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { NoPendingTasksEmptyState, NoOverdueTasksEmptyState } from '@/components/ui/EmptyState'
import { useAppToast } from '@/lib/utils/toast'
import { UploadSpinner } from '@/components/ui/LoadingSpinner'

export default function ComplianceTrackerPage() {
  const user = useUser()
  const toast = useAppToast()

  // TanStack Query - Fetch compliance items from API
  const { data: complianceData, isLoading } = useCompliance(user?.id)
  const tasks = complianceData?.items || []

  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleFileUpload = async (taskId: string) => {
    setSelectedTaskId(taskId)
    fileInputRef.current?.click()
  }

  const onFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedTaskId) return

    setUploadingTaskId(selectedTaskId)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('taskId', selectedTaskId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.complianceDocumentUploaded()
      } else {
        toast.error('Failed to upload document', 'Upload Error')
      }
    } catch {
      toast.error('Failed to upload document', 'Upload Error')
    } finally {
      setUploadingTaskId(null)
      setSelectedTaskId(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleExportReport = () => {
    const csvContent = [
      ['Requirement', 'Status', 'Priority', 'Due Date', 'Grant'].join(','),
      ...tasks.map(task => [
        `"${task.requirement}"`,
        task.status,
        task.priority,
        task.dueDate ? formatDate(task.dueDate) : '',
        `"${task.grantName || ''}"`,
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Report exported successfully', 'Export Complete')
  }

  const handleDownloadTemplate = (templateName: string) => {
    // Generate a simple template based on the type
    const templates: Record<string, string> = {
      'Financial Report': 'Organization Name:,\nReport Period:,\nTotal Expenses:,\nGrant Amount Used:,\nRemaining Balance:,',
      'Progress Report': 'Project Name:,\nReporting Period:,\nObjectives Met:,\nChallenges:,\nNext Steps:,',
      'Annual Report': 'Fiscal Year:,\nProgram Summary:,\nBeneficiaries Served:,\nOutcomes Achieved:,\nLessons Learned:,',
    }

    const content = templates[templateName] || 'Template content not available'
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateName.toLowerCase().replace(/\s+/g, '_')}_template.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${templateName} template downloaded`, 'Download Complete')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'green'
      case 'In Progress':
      case 'Upcoming':
        return 'purple'
      case 'Overdue':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'red'
      case 'Medium':
        return 'orange'
      case 'Low':
        return 'green'
      default:
        return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return FiCheckCircle
      case 'Overdue':
        return FiAlertCircle
      default:
        return FiClock
    }
  }

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length
  const totalTasks = tasks.length
  const complianceRate = Math.round((completedTasks / totalTasks) * 100)

  const overdueTasks = tasks.filter((t) => t.status === 'Overdue')
  const pendingTasks = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Upcoming')
  const completedTasksList = tasks.filter((t) => t.status === 'Completed')

  return (
    <MainLayout>
      {/* Hidden file input for document uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
        hidden
        onChange={onFileSelected}
      />
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Compliance Tracker', isCurrentPage: true },
            ]}
          />

          {/* Header */}
          <Box>
            <Heading size="lg" mb={2} color="purple.900">
              Compliance Tracker
            </Heading>
            <Text color="purple.800">
              Monitor and manage all compliance requirements for your active grants
            </Text>
          </Box>

          {/* Stats Overview */}
          {isLoading ? (
            <LoadingSkeleton variant="card" count={4} height="120px" />
          ) : (
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
            <Card.Root
              role="article"
              aria-label={`${completedTasks} completed compliance tasks`}
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Icon as={FiCheckCircle} boxSize={8} color="green.500" aria-hidden="true" />
                  <Text fontSize="2xl" fontWeight="bold" color="purple.900">
                    {completedTasks}
                  </Text>
                  <Text fontSize="sm" color="purple.700">
                    Completed Tasks
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              role="article"
              aria-label={`${pendingTasks.length} pending compliance tasks`}
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Icon as={FiClock} boxSize={8} color="purple.500" aria-hidden="true" />
                  <Text fontSize="2xl" fontWeight="bold" color="purple.900">
                    {pendingTasks.length}
                  </Text>
                  <Text fontSize="sm" color="purple.700">
                    Pending Tasks
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              role="article"
              aria-label={`${overdueTasks.length} overdue compliance tasks requiring immediate attention`}
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Icon as={FiAlertCircle} boxSize={8} color="red.500" aria-hidden="true" />
                  <Text fontSize="2xl" fontWeight="bold" color="purple.900">
                    {overdueTasks.length}
                  </Text>
                  <Text fontSize="sm" color="purple.700">
                    Overdue Tasks
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              role="article"
              aria-label={`Compliance rate is ${complianceRate} percent`}
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color="purple.700" mb={1}>
                    Compliance Rate
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.900">
                    {complianceRate}%
                  </Text>
                  <Progress.Root
                    value={complianceRate}
                    size="sm"
                    colorPalette="green"
                    w="full"
                    borderRadius="full"
                    aria-label={`Compliance progress: ${complianceRate}%`}
                  >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
          )}

          {/* Tabs for Different Views */}
          <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Body>
              <Tabs.Root defaultValue="all">
                <Tabs.List>
                  <Tabs.Trigger value="all">All Tasks ({totalTasks})</Tabs.Trigger>
                  <Tabs.Trigger value="overdue">
                    Overdue ({overdueTasks.length})
                    {overdueTasks.length > 0 && (
                      <Badge ml={2} colorPalette="red">
                        !
                      </Badge>
                    )}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="pending">Pending ({pendingTasks.length})</Tabs.Trigger>
                  <Tabs.Trigger value="completed">Completed ({completedTasks})</Tabs.Trigger>
                </Tabs.List>

                <Tabs.ContentGroup>
                  {/* All Tasks */}
                  <Tabs.Content value="all" px={0}>
                    {isMobile ? (
                      <VStack gap={4} align="stretch">
                        {tasks.map((task) => (
                          <Card.Root
                            key={task.id}
                            bg="neomorphic.background"
                            borderRadius="2xl"
                            boxShadow="neo.sm"
                            border="none"
                            _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                            transition="all 0.3s"
                          >
                            <Card.Body>
                              <VStack gap={3} align="stretch">
                                <Flex justify="space-between" align="start">
                                  <VStack align="start" gap={1} flex={1}>
                                    <Text fontWeight="semibold" fontSize="sm">
                                      {task.grantName}
                                    </Text>
                                    <HStack>
                                      <Icon as={FiFileText} color="purple.600" boxSize={4} />
                                      <Text fontSize="sm">{task.requirement}</Text>
                                    </HStack>
                                  </VStack>
                                  <Badge colorPalette={getStatusColor(task.status)}>
                                    {task.status}
                                  </Badge>
                                </Flex>
                                <SimpleGrid columns={2} gap={2}>
                                  <Box>
                                    <Text fontSize="xs" color="purple.600">Due Date</Text>
                                    <Text fontSize="sm" color="purple.900">{formatDate(task.dueDate)}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontSize="xs" color="purple.600">Priority</Text>
                                    <Badge colorPalette={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                  </Box>
                                </SimpleGrid>
                                <HStack gap={2}>
                                  <Button
                                    size="sm"
                                    flex={1}
                                    onClick={() => handleFileUpload(task.id)}
                                    disabled={uploadingTaskId === task.id}
                                    colorPalette="purple"
                                    borderRadius="2xl"
                                    boxShadow="neo.sm"
                                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.inset.sm' }}
                                  >
                                    <Icon as={FiUpload} />
                                    {uploadingTaskId === task.id ? 'Uploading...' : 'Upload'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    flex={1}
                                    variant="outline"
                                    color="purple.900"
                                    bg="neomorphic.background"
                                    border="none"
                                    borderRadius="2xl"
                                    boxShadow="neo.sm"
                                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                                    _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                                  >
                                    View
                                  </Button>
                                </HStack>
                              </VStack>
                            </Card.Body>
                          </Card.Root>
                        ))}
                      </VStack>
                    ) : (
                      <Table.Root variant="outline">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Grant Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Task</Table.ColumnHeader>
                            <Table.ColumnHeader>Due Date</Table.ColumnHeader>
                            <Table.ColumnHeader>Priority</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Actions</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {tasks.map((task) => (
                            <Table.Row key={task.id}>
                              <Table.Cell fontWeight="medium">{task.grantName}</Table.Cell>
                              <Table.Cell>
                                <HStack>
                                  <Icon as={FiFileText} color="purple.600" />
                                  <Text>{task.requirement}</Text>
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>
                                <HStack>
                                  <Icon as={FiCalendar} color="purple.600" boxSize={4} />
                                  <Text fontSize="sm">{formatDate(task.dueDate)}</Text>
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorPalette={getPriorityColor(task.priority)}>
                                  {task.priority.toUpperCase()}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <HStack>
                                  <Icon
                                    as={getStatusIcon(task.status)}
                                    color={`${getStatusColor(task.status)}.500`}
                                  />
                                  <Badge colorPalette={getStatusColor(task.status)}>
                                    {task.status}
                                  </Badge>
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>
                                <HStack gap={2}>
                                  <Button
                                    size="sm"
                                    aria-label={`Upload compliance document for ${task.requirement}`}
                                    onClick={() => handleFileUpload(task.id)}
                                    disabled={uploadingTaskId === task.id}
                                    colorPalette="purple"
                                    borderRadius="2xl"
                                    boxShadow="neo.sm"
                                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.inset.sm' }}
                                    _focusVisible={{
                                      outline: '3px solid',
                                      outlineColor: 'purple.500',
                                      outlineOffset: '2px'
                                    }}
                                  >
                                    {uploadingTaskId === task.id ? (
                                      <>
                                        <Icon
                                          as={FiUpload}
                                          animation="spin 1s linear infinite"
                                          css={{
                                            '@keyframes spin': {
                                              from: { transform: 'rotate(0deg)' },
                                              to: { transform: 'rotate(360deg)' }
                                            }
                                          }}
                                        />
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Icon as={FiUpload} />
                                        Upload
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    color="purple.900"
                                    aria-label={`View details for ${task.requirement}`}
                                    bg="neomorphic.background"
                                    borderRadius="2xl"
                                    boxShadow="neo.sm"
                                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                                    _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                                    _focusVisible={{
                                      outline: '3px solid',
                                      outlineColor: 'purple.500',
                                      outlineOffset: '2px'
                                    }}
                                  >
                                    View
                                  </Button>
                                </HStack>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    )}
                  </Tabs.Content>

                  {/* Overdue Tasks */}
                  <Tabs.Content value="overdue" px={0}>
                    {isLoading ? (
                      <ComplianceTaskSkeleton count={3} />
                    ) : overdueTasks.length === 0 ? (
                      <NoOverdueTasksEmptyState />
                    ) : (
                    <VStack gap={4} align="stretch">
                      {overdueTasks.map((task) => (
                        <Card.Root
                          key={task.id}
                          bg="neomorphic.surface"
                          borderRadius="3xl"
                          boxShadow="neo.md"
                          border="none"
                          borderLeft="4px solid"
                          borderLeftColor="red.500"
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'neo.lg' }}
                          transition="all 0.3s"
                        >
                          <Card.Body>
                            <HStack justify="space-between">
                              <VStack align="start" gap={2}>
                                <HStack>
                                  <Icon as={FiAlertCircle} color="red.500" />
                                  <Heading size="sm">{task.requirement}</Heading>
                                  <Badge colorPalette="red">OVERDUE</Badge>
                                </HStack>
                                <Text fontSize="sm" color="purple.800">
                                  {task.grantName}
                                </Text>
                                <Text fontSize="sm" color="red.600" fontWeight="medium">
                                  Due: {formatDate(task.dueDate)}
                                </Text>
                              </VStack>
                              <Button
                                size="lg"
                                colorPalette="red"
                                aria-label={`Submit overdue task: ${task.requirement}`}
                                borderRadius="2xl"
                                boxShadow="neo.md"
                                _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                                _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                                _focusVisible={{
                                  outline: '3px solid',
                                  outlineColor: 'red.500',
                                  outlineOffset: '2px'
                                }}
                              >
                                <Icon as={FiUpload} />
                                Submit Now
                              </Button>
                            </HStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </VStack>
                    )}
                  </Tabs.Content>

                  {/* Pending Tasks */}
                  <Tabs.Content value="pending" px={0}>
                    {isLoading ? (
                      <ComplianceTaskSkeleton count={5} />
                    ) : pendingTasks.length === 0 ? (
                      <NoPendingTasksEmptyState />
                    ) : (
                    <VStack gap={4} align="stretch">
                      {pendingTasks.map((task) => (
                        <Card.Root
                          key={task.id}
                          bg="neomorphic.surface"
                          borderRadius="3xl"
                          boxShadow="neo.md"
                          border="none"
                          borderLeft="4px solid"
                          borderLeftColor="purple.500"
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'neo.lg' }}
                          transition="all 0.3s"
                        >
                          <Card.Body>
                            <HStack justify="space-between">
                              <VStack align="start" gap={2}>
                                <HStack>
                                  <Icon as={FiClock} color="purple.500" />
                                  <Heading size="sm">{task.requirement}</Heading>
                                  <Badge colorPalette={getPriorityColor(task.priority)}>
                                    {task.priority.toUpperCase()}
                                  </Badge>
                                </HStack>
                                <Text fontSize="sm" color="purple.800">
                                  {task.grantName}
                                </Text>
                                <Text fontSize="sm" color="purple.800">
                                  Due: {formatDate(task.dueDate)}
                                </Text>
                              </VStack>
                              <HStack>
                                <Button
                                  size="md"
                                  variant="outline"
                                  aria-label={`Download template for ${task.requirement}`}
                                  onClick={() => handleDownloadTemplate(task.requirement)}
                                  bg="neomorphic.background"
                                  border="none"
                                  borderRadius="2xl"
                                  boxShadow="neo.sm"
                                  _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                                  _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                                  _focusVisible={{
                                    outline: '3px solid',
                                    outlineColor: 'purple.500',
                                    outlineOffset: '2px'
                                  }}
                                >
                                  <Icon as={FiDownload} />
                                  Template
                                </Button>
                                <Button
                                  size="lg"
                                  colorPalette="purple"
                                  aria-label={`Upload document for ${task.requirement}`}
                                  onClick={() => handleFileUpload(task.id)}
                                  loading={uploadingTaskId === task.id}
                                  borderRadius="2xl"
                                  boxShadow="neo.md"
                                  _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                                  _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                                  _focusVisible={{
                                    outline: '3px solid',
                                    outlineColor: 'purple.500',
                                    outlineOffset: '2px'
                                  }}
                                >
                                  <Icon as={FiUpload} />
                                  {uploadingTaskId === task.id ? 'Uploading...' : 'Upload'}
                                </Button>
                              </HStack>
                            </HStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </VStack>
                    )}
                  </Tabs.Content>

                  {/* Completed Tasks */}
                  <Tabs.Content value="completed" px={0}>
                    <VStack gap={4} align="stretch">
                      {completedTasksList.map((task) => (
                        <Card.Root
                          key={task.id}
                          bg="neomorphic.surface"
                          borderRadius="3xl"
                          boxShadow="neo.md"
                          border="none"
                          borderLeft="4px solid"
                          borderLeftColor="green.500"
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'neo.lg' }}
                          transition="all 0.3s"
                        >
                          <Card.Body>
                            <HStack justify="space-between">
                              <VStack align="start" gap={2}>
                                <HStack>
                                  <Icon as={FiCheckCircle} color="green.500" />
                                  <Heading size="sm">{task.requirement}</Heading>
                                  <Badge colorPalette="green">COMPLETED</Badge>
                                </HStack>
                                <Text fontSize="sm" color="purple.700">
                                  {task.grantName}
                                </Text>
                                <Text fontSize="sm" color="purple.700">
                                  Submitted: {formatDate(task.dueDate)}
                                </Text>
                              </VStack>
                              <Button
                                size="md"
                                variant="outline"
                                aria-label={`Download receipt for ${task.requirement}`}
                                bg="neomorphic.background"
                                border="none"
                                borderRadius="2xl"
                                boxShadow="neo.sm"
                                _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                                _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                                _focusVisible={{
                                  outline: '3px solid',
                                  outlineColor: 'purple.500',
                                  outlineOffset: '2px'
                                }}
                              >
                                <Icon as={FiDownload} />
                                Download Receipt
                              </Button>
                            </HStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </VStack>
                  </Tabs.Content>
                </Tabs.ContentGroup>
              </Tabs.Root>
            </Card.Body>
          </Card.Root>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Card.Root
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack gap={3}>
                  <Icon as={FiUpload} boxSize={8} color="purple.500" />
                  <Heading size="sm">Bulk Upload</Heading>
                  <Text fontSize="sm" color="purple.800" textAlign="center">
                    Upload multiple compliance documents at once
                  </Text>
                  <Button
                    size="md"
                    colorPalette="purple"
                    w="full"
                    aria-label="Upload multiple compliance documents at once"
                    onClick={() => {
                      // Simulate bulk upload
                      toast.success('Bulk upload started', 'Upload in Progress')
                      setTimeout(() => {
                        toast.complianceDocumentUploaded()
                      }, 2000)
                    }}
                    borderRadius="2xl"
                    boxShadow="neo.md"
                    _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px'
                    }}
                  >
                    Upload Documents
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack gap={3}>
                  <Icon as={FiCalendar} boxSize={8} color="purple.500" />
                  <Heading size="sm">Set Reminders</Heading>
                  <Text fontSize="sm" color="purple.800" textAlign="center">
                    Configure automatic reminders for deadlines
                  </Text>
                  <Button
                    size="md"
                    colorPalette="purple"
                    w="full"
                    aria-label="Configure automatic deadline reminders"
                    onClick={() => toast.complianceReminderSet()}
                    borderRadius="2xl"
                    boxShadow="neo.md"
                    _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px'
                    }}
                  >
                    Manage Reminders
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <VStack gap={3}>
                  <Icon as={FiDownload} boxSize={8} color="purple.500" />
                  <Heading size="sm">Export Report</Heading>
                  <Text fontSize="sm" color="purple.800" textAlign="center">
                    Download compliance status report
                  </Text>
                  <Button
                    size="md"
                    colorPalette="purple"
                    w="full"
                    onClick={handleExportReport}
                    aria-label="Download compliance status report"
                    borderRadius="2xl"
                    boxShadow="neo.md"
                    _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px'
                    }}
                  >
                    <Icon as={FiDownload} mr={2} />
                    Export CSV
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </VStack>
      </Container>
    </MainLayout>
  )
}
