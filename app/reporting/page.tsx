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
  SimpleGrid,
  Icon,
  Stat,
  Progress,
  Table,
  Badge,
  Separator,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react'
import {
  FiDownload,
  FiTrendingUp,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiPieChart,
  FiBarChart2,
} from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useFundingByCategory, useGrantReports } from '@/lib/api/dashboard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { useUser } from '@stackframe/stack'

export default function ReportingPage() {
  const user = useUser()
  const { data: fundingData, isLoading: fundingLoading } = useFundingByCategory(user?.id)
  const { data: reportsData, isLoading: reportsLoading } = useGrantReports(user?.id)

  const recentGrants = reportsData?.reports || []
  const fundingByCategory = fundingData?.funding || []
  const isLoading = fundingLoading || reportsLoading

  return (
    <MainLayout>
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Reporting & Analytics', isCurrentPage: true },
            ]}
          />

          {/* Header */}
          <HStack justify="space-between">
            <Box>
              <Heading size="lg" mb={2} color="purple.900">
                Reporting & Analytics
              </Heading>
              <Text color="purple.800">
                Track your grant performance and generate comprehensive reports
              </Text>
            </Box>
            <HStack>
              <NativeSelectRoot
                w="200px"
                bg="neomorphic.background"
                borderRadius="2xl"
                boxShadow="neo.inset.sm"
              >
                <NativeSelectField
                  defaultValue="2025"
                  border="none"
                  color="purple.900"
                  _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                >
                  <option value="2025">Year: 2025</option>
                  <option value="2024">Year: 2024</option>
                  <option value="2023">Year: 2023</option>
                </NativeSelectField>
              </NativeSelectRoot>
              <Button
                colorPalette="purple"
                color="white"
                borderRadius="2xl"
                boxShadow="neo.md"
                _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
              >
                <Icon as={FiDownload} />
                Export Report
              </Button>
            </HStack>
          </HStack>

          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            <Card.Root
              bg="neomorphic.surface"
              borderRadius="3xl"
              boxShadow="neo.md"
              border="none"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'neo.lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Stat.Root>
                  <Stat.Label>Total Funding Secured</Stat.Label>
                  <HStack gap={2} align="baseline">
                    <Icon as={FiDollarSign} color="green.500" boxSize={6} />
                    <Stat.ValueText>$485,000</Stat.ValueText>
                  </HStack>
                  <Stat.HelpText>
                    <Stat.UpIndicator />
                    23.5% from last year
                  </Stat.HelpText>
                </Stat.Root>
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
                <Stat.Root>
                  <Stat.Label>Active Grants</Stat.Label>
                  <HStack gap={2} align="baseline">
                    <Icon as={FiFileText} color="purple.500" boxSize={6} />
                    <Stat.ValueText>12</Stat.ValueText>
                  </HStack>
                  <Stat.HelpText>
                    <Stat.UpIndicator />
                    3 new this month
                  </Stat.HelpText>
                </Stat.Root>
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
                <Stat.Root>
                  <Stat.Label>Success Rate</Stat.Label>
                  <HStack gap={2} align="baseline">
                    <Icon as={FiCheckCircle} color="purple.500" boxSize={6} />
                    <Stat.ValueText>68%</Stat.ValueText>
                  </HStack>
                  <Stat.HelpText>
                    <Stat.UpIndicator />
                    12% improvement
                  </Stat.HelpText>
                </Stat.Root>
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
                <Stat.Root>
                  <Stat.Label>Compliance Rate</Stat.Label>
                  <HStack gap={2} align="baseline">
                    <Icon as={FiTrendingUp} color="purple.500" boxSize={6} />
                    <Stat.ValueText>94%</Stat.ValueText>
                  </HStack>
                  <Stat.HelpText>
                    <Stat.UpIndicator />
                    On track
                  </Stat.HelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Charts Section */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {/* Funding by Category */}
            <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              <Card.Header>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiPieChart} color="purple.500" />
                    <Heading size="md">Funding by Category</Heading>
                  </HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="purple.900"
                    bg="neomorphic.background"
                    borderRadius="2xl"
                    boxShadow="neo.sm"
                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                    _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                  >
                    View Details
                  </Button>
                </HStack>
              </Card.Header>
              <Card.Body>
                {isLoading ? (
                  <Text color="purple.700">Loading funding data...</Text>
                ) : fundingByCategory.length === 0 ? (
                  <Text color="purple.700">No funding data available</Text>
                ) : (
                  <VStack gap={4} align="stretch">
                    {fundingByCategory.map((item, index) => (
                    <Box key={index}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">
                          {item.category}
                        </Text>
                        <HStack>
                          <Text fontSize="sm" color="purple.700">
                            {item.amount}
                          </Text>
                          <Badge>{item.percentage}%</Badge>
                        </HStack>
                      </HStack>
                      <Progress.Root value={item.percentage} size="sm" colorPalette="purple">
                        <Progress.Track>
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                    </Box>
                    ))}
                  </VStack>
                )}
              </Card.Body>
            </Card.Root>

            {/* Application Timeline */}
            <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              <Card.Header>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiBarChart2} color="purple.500" />
                    <Heading size="md">Application Timeline</Heading>
                  </HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="purple.900"
                    bg="neomorphic.background"
                    borderRadius="2xl"
                    boxShadow="neo.sm"
                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                    _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                  >
                    View Details
                  </Button>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Q1 2025</Text>
                    <Badge colorPalette="green">8 Applications</Badge>
                  </HStack>
                  <Progress.Root value={80} size="sm" colorPalette="green">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>

                  <HStack justify="space-between">
                    <Text fontSize="sm">Q4 2024</Text>
                    <Badge colorPalette="purple">6 Applications</Badge>
                  </HStack>
                  <Progress.Root value={60} size="sm" colorPalette="purple">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>

                  <HStack justify="space-between">
                    <Text fontSize="sm">Q3 2024</Text>
                    <Badge colorPalette="purple">5 Applications</Badge>
                  </HStack>
                  <Progress.Root value={50} size="sm" colorPalette="purple">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>

                  <HStack justify="space-between">
                    <Text fontSize="sm">Q2 2024</Text>
                    <Badge colorPalette="orange">4 Applications</Badge>
                  </HStack>
                  <Progress.Root value={40} size="sm" colorPalette="orange">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Grant Performance Table */}
          <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Header>
              <Heading size="md">Grant Performance Overview</Heading>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <Text color="purple.700">Loading grant reports...</Text>
              ) : recentGrants.length === 0 ? (
                <Text color="purple.700">No grant reports available</Text>
              ) : (
                <Table.Root variant="outline">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Grant Name</Table.ColumnHeader>
                      <Table.ColumnHeader>Award Amount</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Progress</Table.ColumnHeader>
                      <Table.ColumnHeader>End Date</Table.ColumnHeader>
                      <Table.ColumnHeader>Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {recentGrants.map((grant, index) => (
                    <Table.Row key={index}>
                      <Table.Cell fontWeight="medium">{grant.name}</Table.Cell>
                      <Table.Cell>{grant.amount}</Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={grant.status === 'Active' ? 'green' : 'gray'}>
                          {grant.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack gap={3}>
                          <Progress.Root value={grant.progress} size="sm" colorPalette="purple" w="100px">
                            <Progress.Track>
                              <Progress.Range />
                            </Progress.Track>
                          </Progress.Root>
                          <Text fontSize="sm">{grant.progress}%</Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell fontSize="sm">{grant.endDate}</Table.Cell>
                      <Table.Cell>
                        <Button
                          size="xs"
                          variant="outline"
                          color="purple.900"
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.sm"
                          _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                          _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                        >
                          View Report
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Body>
          </Card.Root>

          {/* Report Templates */}
          <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Header>
              <Heading size="md">Report Templates</Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Card.Root
                  bg="neomorphic.background"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  border="none"
                  _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                >
                  <Card.Body>
                    <VStack gap={3}>
                      <Icon as={FiFileText} boxSize={8} color="purple.500" />
                      <Text fontWeight="medium">Financial Summary</Text>
                      <Text fontSize="sm" color="purple.700" textAlign="center">
                        Comprehensive financial report across all grants
                      </Text>
                      <Button
                        size="sm"
                        w="full"
                        colorPalette="purple"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                        _active={{ transform: 'scale(0.98)', boxShadow: 'neo.inset.sm' }}
                      >
                        <Icon as={FiDownload} />
                        Generate
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                <Card.Root
                  bg="neomorphic.background"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  border="none"
                  _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                >
                  <Card.Body>
                    <VStack gap={3}>
                      <Icon as={FiBarChart2} boxSize={8} color="purple.500" />
                      <Text fontWeight="medium">Impact Report</Text>
                      <Text fontSize="sm" color="purple.700" textAlign="center">
                        Measure program outcomes and community impact
                      </Text>
                      <Button
                        size="sm"
                        w="full"
                        colorPalette="purple"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                        _active={{ transform: 'scale(0.98)', boxShadow: 'neo.inset.sm' }}
                      >
                        <Icon as={FiDownload} />
                        Generate
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                <Card.Root
                  bg="neomorphic.background"
                  borderRadius="2xl"
                  boxShadow="neo.sm"
                  border="none"
                  _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                >
                  <Card.Body>
                    <VStack gap={3}>
                      <Icon as={FiCheckCircle} boxSize={8} color="purple.500" />
                      <Text fontWeight="medium">Compliance Report</Text>
                      <Text fontSize="sm" color="purple.700" textAlign="center">
                        Track compliance status and requirements
                      </Text>
                      <Button
                        size="sm"
                        w="full"
                        colorPalette="purple"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                        _active={{ transform: 'scale(0.98)', boxShadow: 'neo.inset.sm' }}
                      >
                        <Icon as={FiDownload} />
                        Generate
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>

          {/* Export Options */}
          <Card.Root bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Header>
              <Heading size="md">Custom Report Builder</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <NativeSelectRoot
                    bg="neomorphic.background"
                    borderRadius="2xl"
                    boxShadow="neo.inset.sm"
                  >
                    <NativeSelectField
                      placeholder="Select Date Range"
                      border="none"
                      color="purple.900"
                      _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                    >
                      <option value="last-month">Last Month</option>
                      <option value="last-quarter">Last Quarter</option>
                      <option value="last-year">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </NativeSelectField>
                  </NativeSelectRoot>

                  <NativeSelectRoot
                    bg="neomorphic.background"
                    borderRadius="2xl"
                    boxShadow="neo.inset.sm"
                  >
                    <NativeSelectField
                      placeholder="Select Grant(s)"
                      border="none"
                      color="purple.900"
                      _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                    >
                      <option value="all">All Grants</option>
                      <option value="active">Active Grants Only</option>
                      <option value="completed">Completed Grants Only</option>
                    </NativeSelectField>
                  </NativeSelectRoot>

                  <NativeSelectRoot
                    bg="neomorphic.background"
                    borderRadius="2xl"
                    boxShadow="neo.inset.sm"
                  >
                    <NativeSelectField
                      placeholder="Export Format"
                      border="none"
                      color="purple.900"
                      _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel (XLSX)</option>
                      <option value="csv">CSV</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </SimpleGrid>

                <Separator />

                <HStack justify="flex-end">
                  <Button
                    variant="outline"
                    color="purple.900"
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    boxShadow="neo.sm"
                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                    _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                  >
                    Preview
                  </Button>
                  <Button
                    colorPalette="purple"
                    color="white"
                    borderRadius="2xl"
                    boxShadow="neo.md"
                    _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                  >
                    <Icon as={FiDownload} />
                    Generate Custom Report
                  </Button>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </MainLayout>
  )
}
