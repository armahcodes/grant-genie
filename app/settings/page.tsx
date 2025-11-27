'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Field,
  Input,
  Textarea,
  Icon,
  SimpleGrid,
  NativeSelectRoot,
  NativeSelectField,
  Avatar,
  Separator,
  Card,
  Checkbox,
  Badge,
} from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiUser, FiBriefcase, FiBell, FiShield, FiCamera } from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useAppToast } from '@/lib/utils/toast'
import {
  usePersonalInfo,
  useUpdatePersonalInfo,
  useOrganizationInfo,
  useUpdateOrganizationInfo,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/lib/api/user'
import { getErrorMessage } from '@/lib/utils/formHelpers'

// Validation Schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  bio: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
})

const organizationInfoSchema = z.object({
  orgName: z.string().min(1, 'Organization name is required'),
  orgType: z.string().min(1, 'Organization type is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  orgWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
  orgPhone: z.string().min(1, 'Phone is required'),
  orgEmail: z.string().email('Invalid email'),
  missionStatement: z.string().optional(),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
type OrganizationInfoFormData = z.infer<typeof organizationInfoSchema>

interface SectionTabProps {
  icon: any
  label: string
  isActive?: boolean
  onClick: () => void
}

const SectionTab = ({ icon, label, isActive, onClick }: SectionTabProps) => {
  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      w="full"
      bg={isActive ? 'neomorphic.background' : 'transparent'}
      color={isActive ? 'purple.600' : 'purple.900'}
      fontWeight={isActive ? 'semibold' : 'medium'}
      border="none"
      borderRadius="2xl"
      boxShadow={isActive ? 'neo.inset.sm' : 'none'}
      _hover={{
        bg: 'neomorphic.background',
        boxShadow: isActive ? 'neo.inset.sm' : 'neo.sm'
      }}
      onClick={onClick}
    >
      <Icon as={icon} />
      {label}
    </Button>
  )
}

export default function SettingsPage() {
  const toast = useAppToast()
  const [activeSection, setActiveSection] = useState('personal')

  // Notification preferences local state
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    deadlineReminders: true,
    complianceAlerts: true,
    grantMatches: true,
    weeklyDigest: false,
  })

  // TanStack Query - Fetch data from API
  const { data: personalInfo } = usePersonalInfo()
  const { data: organizationInfo } = useOrganizationInfo()
  const { data: notificationPrefs } = useNotificationPreferences()

  // TanStack Query - Mutations
  const updatePersonalMutation = useUpdatePersonalInfo()
  const updateOrganizationMutation = useUpdateOrganizationInfo()
  const updateNotificationsMutation = useUpdateNotificationPreferences()

  // Update notification state when data is fetched
  useEffect(() => {
    if (notificationPrefs) {
      setNotifPrefs(notificationPrefs)
    }
  }, [notificationPrefs])

  // React Hook Form - Personal Info
  const personalForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      bio: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
    },
    mode: 'onChange',
  })

  // React Hook Form - Organization Info
  const organizationForm = useForm<OrganizationInfoFormData>({
    resolver: zodResolver(organizationInfoSchema),
    defaultValues: {
      orgName: '',
      orgType: '',
      taxId: '',
      orgWebsite: '',
      orgPhone: '',
      orgEmail: '',
      missionStatement: '',
    },
    mode: 'onChange',
  })

  // Update forms when data is fetched
  useEffect(() => {
    if (personalInfo) {
      personalForm.reset(personalInfo)
    }
  }, [personalInfo, personalForm])

  useEffect(() => {
    if (organizationInfo) {
      organizationForm.reset(organizationInfo)
    }
  }, [organizationInfo, organizationForm])

  // Form submit handlers
  const onSavePersonal = (data: PersonalInfoFormData) => {
    updatePersonalMutation.mutate(data)
  }

  const onSaveOrganization = (data: OrganizationInfoFormData) => {
    updateOrganizationMutation.mutate(data)
  }

  const onSaveNotifications = () => {
    updateNotificationsMutation.mutate(notifPrefs)
  }

  const handleNotifToggle = (key: keyof typeof notifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <MainLayout>
      <Box minH="100vh" bg="neomorphic.background">
        <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <Heading size="lg" mb={2} color="purple.900">
            Profile Management
          </Heading>
          <Text color="purple.800">
            Manage your contact information and organization details
          </Text>
        </Box>

        <Flex gap={6} direction={{ base: 'column', lg: 'row' }}>
          {/* Left Sidebar Navigation */}
          <Card.Root
            w={{ base: 'full', lg: '280px' }}
            h="fit-content"
            flexShrink={0}
            bg="neomorphic.surface"
            borderRadius="3xl"
            boxShadow="neo.md"
            border="none"
          >
            <Card.Body p={4}>
              <VStack gap={2} align="stretch">
                <SectionTab
                  icon={FiUser}
                  label="Personal Information"
                  isActive={activeSection === 'personal'}
                  onClick={() => setActiveSection('personal')}
                />
                <SectionTab
                  icon={FiBriefcase}
                  label="Organization Details"
                  isActive={activeSection === 'organization'}
                  onClick={() => setActiveSection('organization')}
                />
                <SectionTab
                  icon={FiBell}
                  label="Notification Preferences"
                  isActive={activeSection === 'notifications'}
                  onClick={() => setActiveSection('notifications')}
                />
                <SectionTab
                  icon={FiShield}
                  label="Security Settings"
                  isActive={activeSection === 'security'}
                  onClick={() => setActiveSection('security')}
                />
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Main Content Area */}
          <Card.Root flex={1} bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Body p={8}>
              {activeSection === 'personal' && (
                <Box as="form" onSubmit={personalForm.handleSubmit(onSavePersonal)}>
                  <Heading size="md" mb={2} color="purple.900">
                    Personal Information
                  </Heading>
                  <Text color="purple.800" mb={6}>
                    Update your personal details and contact information
                  </Text>

                  {/* Profile Photo */}
                  <Flex align="center" gap={4} mb={8}>
                    <Avatar.Root size="xl" bg="purple.500">
                      <Avatar.Fallback>
                        {personalInfo?.firstName?.[0]}{personalInfo?.lastName?.[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      color="purple.900"
                      bg="neomorphic.background"
                      border="none"
                      borderRadius="2xl"
                      boxShadow="neo.sm"
                      _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                      _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                    >
                      <Icon as={FiCamera} />
                      Change Photo
                    </Button>
                  </Flex>

                  <VStack gap={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      <Controller
                        name="firstName"
                        control={personalForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!personalForm.formState.errors.firstName}>
                            <Field.Label color="purple.900" fontWeight="medium">First Name</Field.Label>
                            <Input
                              {...field}
                              placeholder="Enter first name"
                              color="purple.900"
                            />
                            <Field.ErrorText>
                              {getErrorMessage(personalForm.formState.errors.firstName)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                      <Controller
                        name="lastName"
                        control={personalForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!personalForm.formState.errors.lastName}>
                            <Field.Label color="purple.900" fontWeight="medium">Last Name</Field.Label>
                            <Input
                              {...field}
                              placeholder="Enter last name"
                              color="purple.900"
                            />
                            <Field.ErrorText>
                              {getErrorMessage(personalForm.formState.errors.lastName)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                    </SimpleGrid>

                    <Field.Root>
                      <Field.Label color="purple.900" fontWeight="medium">Email Address</Field.Label>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        defaultValue="sarah.johnson@nonprofit6.org"
                        color="purple.900"
                      />
                    </Field.Root>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Phone Number</Field.Label>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          defaultValue="+1 (555) 123-4567"
                          color="purple.900"
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Job Title</Field.Label>
                        <Input
                          placeholder="Enter job title"
                          defaultValue="Program Director"
                          color="purple.900"
                        />
                      </Field.Root>
                    </SimpleGrid>

                    <Field.Root>
                      <Field.Label color="purple.900" fontWeight="medium">Bio</Field.Label>
                      <Textarea
                        placeholder="Tell us about yourself and your role..."
                        rows={4}
                        color="purple.900"
                      />
                    </Field.Root>

                    <Separator my={4} />

                    {/* Address Information */}
                    <Heading size="sm" mb={2} color="purple.900">
                      Address Information
                    </Heading>

                    <Field.Root>
                      <Field.Label color="purple.900" fontWeight="medium">Street Address</Field.Label>
                      <Input
                        placeholder="Enter street address"
                        defaultValue="123 Main Street"
                        color="purple.900"
                      />
                    </Field.Root>

                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">City</Field.Label>
                        <Input
                          placeholder="Enter city"
                          defaultValue="Springfield"
                          color="purple.900"
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">State</Field.Label>
                        <NativeSelectRoot>
                          <NativeSelectField defaultValue="IL" color="purple.900">
                            <option value="">Select state</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="CA">California</option>
                            <option value="FL">Florida</option>
                            <option value="IL">Illinois</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                          </NativeSelectField>
                        </NativeSelectRoot>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">ZIP Code</Field.Label>
                        <Input
                          placeholder="Enter ZIP code"
                          defaultValue="62701"
                          color="purple.900"
                        />
                      </Field.Root>
                    </SimpleGrid>

                    {/* Action Buttons */}
                    <Flex justify="flex-end" gap={4} pt={4}>
                      <Button
                        variant="outline"
                        type="button"
                        color="purple.900"
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                        _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorPalette="purple"
                        color="white"
                        loading={updatePersonalMutation.isPending}
                        disabled={updatePersonalMutation.isPending}
                        borderRadius="2xl"
                        boxShadow="neo.md"
                        _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                        _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                      >
                        {updatePersonalMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              )}

              {activeSection === 'organization' && (
                <Box>
                  <Heading size="md" mb={2} color="purple.900">
                    Organization Details
                  </Heading>
                  <Text color="purple.800" mb={6}>
                    Manage your organization information and settings
                  </Text>

                  <VStack gap={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Organization Name</Field.Label>
                        <Input
                          placeholder="Enter organization name"
                          defaultValue="Nonprofit Organization"
                          color="purple.900"
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Organization Type</Field.Label>
                        <NativeSelectRoot>
                          <NativeSelectField defaultValue="nonprofit" color="purple.900">
                            <option value="nonprofit">Nonprofit</option>
                            <option value="education">Educational Institution</option>
                            <option value="government">Government Agency</option>
                            <option value="foundation">Private Foundation</option>
                            <option value="other">Other</option>
                          </NativeSelectField>
                        </NativeSelectRoot>
                      </Field.Root>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Tax ID / EIN</Field.Label>
                        <Input
                          placeholder="XX-XXXXXXX"
                          defaultValue="12-3456789"
                          color="purple.900"
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Organization Website</Field.Label>
                        <Input
                          type="url"
                          placeholder="https://example.org"
                          defaultValue="https://nonprofit.org"
                          color="purple.900"
                        />
                      </Field.Root>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Primary Contact Phone</Field.Label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          defaultValue="+1 (555) 987-6543"
                          color="purple.900"
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label color="purple.900" fontWeight="medium">Primary Contact Email</Field.Label>
                        <Input
                          type="email"
                          placeholder="contact@example.org"
                          defaultValue="contact@nonprofit.org"
                          color="purple.900"
                        />
                      </Field.Root>
                    </SimpleGrid>

                    <Field.Root>
                      <Field.Label color="purple.900" fontWeight="medium">Mission Statement</Field.Label>
                      <Textarea
                        placeholder="Enter your organization's mission statement"
                        rows={4}
                        defaultValue="Our mission is to create positive change in local communities through education and outreach programs."
                        color="purple.900"
                      />
                    </Field.Root>

                    <Separator my={2} />

                    <Flex justify="flex-end" gap={4} pt={4}>
                      <Button
                        variant="outline"
                        color="purple.900"
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                        _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        colorPalette="purple"
                        color="white"
                        borderRadius="2xl"
                        boxShadow="neo.md"
                        _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                        _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                      >
                        Save Changes
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              )}

              {activeSection === 'notifications' && (
                <Box>
                  <Heading size="md" mb={2} color="purple.900">
                    Notification Preferences
                  </Heading>
                  <Text color="purple.800" mb={6}>
                    Control how and when you receive notifications about your grants
                  </Text>

                  <VStack gap={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Notification Channels</Heading>
                      <VStack gap={4} align="stretch">
                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Email Notifications</Text>
                            <Text fontSize="sm" color="purple.800">Receive updates via email</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.emailNotifications} onCheckedChange={() => handleNotifToggle('emailNotifications')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>

                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Push Notifications</Text>
                            <Text fontSize="sm" color="purple.800">Get browser push notifications</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.pushNotifications} onCheckedChange={() => handleNotifToggle('pushNotifications')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>

                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">SMS Notifications</Text>
                            <Text fontSize="sm" color="purple.800">Receive text message alerts</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.smsNotifications} onCheckedChange={() => handleNotifToggle('smsNotifications')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>
                      </VStack>
                    </Box>

                    <Separator />

                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Alert Types</Heading>
                      <VStack gap={4} align="stretch">
                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Deadline Reminders</Text>
                            <Text fontSize="sm" color="purple.800">Get notified about upcoming deadlines</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.deadlineReminders} onCheckedChange={() => handleNotifToggle('deadlineReminders')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>

                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Compliance Alerts</Text>
                            <Text fontSize="sm" color="purple.800">Alerts for compliance requirements</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.complianceAlerts} onCheckedChange={() => handleNotifToggle('complianceAlerts')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>

                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">New Grant Matches</Text>
                            <Text fontSize="sm" color="purple.800">Alerts when new grants match your profile</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.grantMatches} onCheckedChange={() => handleNotifToggle('grantMatches')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>

                        <HStack justify="space-between" p={4} bg="neomorphic.background" border="none" borderRadius="2xl" boxShadow="neo.inset.sm">
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Weekly Activity Digest</Text>
                            <Text fontSize="sm" color="purple.800">Summary of weekly activities</Text>
                          </Box>
                          <Checkbox.Root checked={notifPrefs.weeklyDigest} onCheckedChange={() => handleNotifToggle('weeklyDigest')} size="lg">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>
                        </HStack>
                      </VStack>
                    </Box>

                    <Separator my={2} />

                    <Flex justify="flex-end" gap={4} pt={4}>
                      <Button
                        variant="outline"
                        type="button"
                        color="purple.900"
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                        _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                      >
                        Reset to Default
                      </Button>
                      <Button
                        colorPalette="purple"
                        color="white"
                        onClick={onSaveNotifications}
                        loading={updateNotificationsMutation.isPending}
                        disabled={updateNotificationsMutation.isPending}
                        borderRadius="2xl"
                        boxShadow="neo.md"
                        _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                        _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                      >
                        {updateNotificationsMutation.isPending ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              )}

              {activeSection === 'security' && (
                <Box>
                  <Heading size="md" mb={2} color="purple.900">
                    Security Settings
                  </Heading>
                  <Text color="purple.800" mb={6}>
                    Manage your password, authentication, and account security
                  </Text>

                  <VStack gap={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Change Password</Heading>
                      <VStack gap={4} align="stretch">
                        <Field.Root>
                          <Field.Label color="purple.900" fontWeight="medium">Current Password</Field.Label>
                          <Input
                            type="password"
                            placeholder="Enter current password"
                            color="purple.900"
                          />
                        </Field.Root>

                        <Field.Root>
                          <Field.Label color="purple.900" fontWeight="medium">New Password</Field.Label>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            color="purple.900"
                          />
                          <Text fontSize="xs" color="purple.700" mt={1}>
                            Password must be at least 8 characters with uppercase, lowercase, and numbers
                          </Text>
                        </Field.Root>

                        <Field.Root>
                          <Field.Label color="purple.900" fontWeight="medium">Confirm New Password</Field.Label>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            color="purple.900"
                          />
                        </Field.Root>

                        <Button
                          colorPalette="purple"
                          color="white"
                          alignSelf="flex-start"
                          borderRadius="2xl"
                          boxShadow="neo.md"
                          _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                          _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                        >
                          Update Password
                        </Button>
                      </VStack>
                    </Box>

                    <Separator />

                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Two-Factor Authentication</Heading>
                      <Card.Root bg="neomorphic.background" borderRadius="2xl" boxShadow="neo.inset.sm" border="none">
                        <Card.Body>
                          <HStack justify="space-between">
                            <Box>
                              <Text fontWeight="semibold" mb={1} color="purple.900">Enable 2FA</Text>
                              <Text fontSize="sm" color="purple.800">
                                Add an extra layer of security to your account
                              </Text>
                            </Box>
                            <Checkbox.Root size="lg">
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                            </Checkbox.Root>
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    </Box>

                    <Separator />

                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Active Sessions</Heading>
                      <VStack gap={3} align="stretch">
                        <Card.Root bg="neomorphic.background" borderRadius="2xl" boxShadow="neo.inset.sm" border="none">
                          <Card.Body>
                            <HStack justify="space-between">
                              <Box>
                                <Text fontWeight="medium" color="purple.900">Windows Desktop - Chrome</Text>
                                <Text fontSize="sm" color="purple.800">
                                  Current session • Last active: Now
                                </Text>
                              </Box>
                              <Badge colorPalette="green">Active</Badge>
                            </HStack>
                          </Card.Body>
                        </Card.Root>

                        <Card.Root bg="neomorphic.background" borderRadius="2xl" boxShadow="neo.inset.sm" border="none">
                          <Card.Body>
                            <HStack justify="space-between">
                              <Box>
                                <Text fontWeight="medium" color="purple.900">iPhone - Safari</Text>
                                <Text fontSize="sm" color="purple.800">
                                  Last active: 2 hours ago
                                </Text>
                              </Box>
                              <Button
                                size="sm"
                                variant="outline"
                                colorPalette="red"
                                bg="neomorphic.background"
                                border="none"
                                borderRadius="2xl"
                                boxShadow="neo.sm"
                                _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)" }}
                                _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                              >
                                Revoke
                              </Button>
                            </HStack>
                          </Card.Body>
                        </Card.Root>
                      </VStack>
                    </Box>

                    <Separator />

                    <Box>
                      <Heading size="sm" mb={4} color="red.800">Danger Zone</Heading>
                      <Card.Root borderRadius="2xl" boxShadow="neo.sm" border="1px solid" borderColor="red.200" bg="red.50">
                        <Card.Body>
                          <VStack align="stretch" gap={3}>
                            <Box>
                              <Text fontWeight="semibold" color="red.800" mb={2}>
                                Delete Account
                              </Text>
                              <Text fontSize="sm" color="red.700">
                                Once you delete your account, there is no going back. Please be certain.
                              </Text>
                            </Box>
                            <Button
                              size="sm"
                              colorPalette="red"
                              variant="outline"
                              alignSelf="flex-start"
                              borderRadius="2xl"
                              boxShadow="neo.sm"
                              _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)" }}
                              _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                            >
                              Delete Account
                            </Button>
                          </VStack>
                        </Card.Body>
                      </Card.Root>
                    </Box>
                  </VStack>
                </Box>
              )}
            </Card.Body>
          </Card.Root>
        </Flex>
      </Container>
      </Box>
    </MainLayout>
  )
}
