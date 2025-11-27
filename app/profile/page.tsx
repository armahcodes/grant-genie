'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Field,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Avatar,
  Separator,
  Icon,
  Flex,
  NativeSelectRoot,
  NativeSelectField,
  List,
  Switch,
  Card,
  Badge,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiUser, FiBell, FiLock, FiShield, FiMail, FiSmartphone, FiGlobe, FiBriefcase } from 'react-icons/fi'
import MainLayout from '@/components/layout/MainLayout'
import { useAppToast } from '@/lib/utils/toast'
import { getErrorMessage } from '@/lib/utils/formHelpers'
import { useUIStore } from '@/lib/stores'
import {
  usePersonalInfo,
  useUpdatePersonalInfo,
  useOrganizationInfo,
  useUpdateOrganizationInfo,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useUpdatePassword,
} from '@/lib/api/user'

// Zod validation schemas for each tab
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  jobTitle: z.string().min(2, 'Job title is required'),
  bio: z.string().optional(),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
})

const organizationSchema = z.object({
  orgName: z.string().min(2, 'Organization name is required'),
  orgType: z.string().min(1, 'Organization type is required'),
  taxId: z.string().regex(/^\d{2}-\d{7}$/, 'Tax ID must be in format XX-XXXXXXX'),
  orgWebsite: z.string().url('Invalid URL format').optional().or(z.literal('')),
  orgPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  orgEmail: z.string().email('Invalid email address'),
})

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  deadlineReminders: z.boolean(),
  complianceAlerts: z.boolean(),
  grantMatches: z.boolean(),
  weeklyDigest: z.boolean(),
})

const securitySchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
type OrganizationFormData = z.infer<typeof organizationSchema>
type NotificationsFormData = z.infer<typeof notificationsSchema>
type SecurityFormData = z.infer<typeof securitySchema>

export default function ProfilePage() {
  const toast = useAppToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Zustand UI state
  const activeTab = useUIStore((state) => state.activeProfileTab)
  const setActiveTab = useUIStore((state) => state.setActiveProfileTab)

  // TanStack Query hooks
  const { data: personalInfo } = usePersonalInfo()
  const { data: organizationInfo } = useOrganizationInfo()
  const { data: notificationPrefs } = useNotificationPreferences()

  // TanStack Query mutations
  const updatePersonalMutation = useUpdatePersonalInfo()
  const updateOrganizationMutation = useUpdateOrganizationInfo()
  const updateNotificationsMutation = useUpdateNotificationPreferences()
  const updatePasswordMutation = useUpdatePassword()

  // Personal Information Form
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

  // Organization Form
  const organizationForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      orgName: '',
      orgType: '',
      taxId: '',
      orgWebsite: '',
      orgPhone: '',
      orgEmail: '',
    },
    mode: 'onChange',
  })

  // Notifications Form
  const notificationsForm = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: false,
      pushNotifications: false,
      smsNotifications: false,
      deadlineReminders: false,
      complianceAlerts: false,
      grantMatches: false,
      weeklyDigest: false,
    },
    mode: 'onChange',
  })

  // Security Form
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  // Update form values when data is fetched
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

  useEffect(() => {
    if (notificationPrefs) {
      notificationsForm.reset(notificationPrefs)
    }
  }, [notificationPrefs, notificationsForm])

  // Submit handlers using TanStack Query mutations
  const onSavePersonal = (data: PersonalInfoFormData) => {
    updatePersonalMutation.mutate(data)
  }

  const onSaveOrganization = (data: OrganizationFormData) => {
    updateOrganizationMutation.mutate(data)
  }

  const onSaveNotifications = (data: NotificationsFormData) => {
    updateNotificationsMutation.mutate(data)
  }

  const onSaveSecurity = (data: SecurityFormData) => {
    if (data.currentPassword && data.newPassword) {
      updatePasswordMutation.mutate({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }, {
        onSuccess: () => {
          securityForm.reset()
        },
      })
    }
  }

  const menuItems: Array<{ id: 'personal' | 'organization' | 'notifications' | 'security'; icon: any; label: string }> = [
    { id: 'personal', icon: FiUser, label: 'Personal Information' },
    { id: 'organization', icon: FiBriefcase, label: 'Organization Details' },
    { id: 'notifications', icon: FiBell, label: 'Notification Preferences' },
    { id: 'security', icon: FiLock, label: 'Security Settings' },
  ]

  return (
    <MainLayout>
      <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2} color="purple.900">Profile Management</Heading>
          <Text color="purple.800">Manage your contact information and organization details</Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={6}>
          {/* Left Sidebar */}
          <GridItem>
            <VStack gap={6} align="stretch">
              {/* Profile Picture Section */}
              <Box p={6} bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <VStack gap={4}>
                  <Avatar.Root size="2xl" bg="purple.500">
                    <Avatar.Fallback>SJ</Avatar.Fallback>
                  </Avatar.Root>
                  <Button
                    size="sm"
                    colorPalette="purple"
                    borderRadius="2xl"
                    boxShadow="neo.sm"
                    _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.98)', boxShadow: 'neo.inset.sm' }}
                  >
                    <Icon as={FiUser} />
                    Change Photo
                  </Button>
                </VStack>
              </Box>

              {/* Navigation Menu */}
              <Box p={4} bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
                <List.Root gap={2}>
                  {menuItems.map((item) => (
                    <List.Item
                      key={item.id}
                      p={3}
                      borderRadius="2xl"
                      cursor="pointer"
                      bg={activeTab === item.id ? 'neomorphic.background' : 'transparent'}
                      color={activeTab === item.id ? 'purple.600' : 'purple.800'}
                      fontWeight={activeTab === item.id ? 'semibold' : 'normal'}
                      boxShadow={activeTab === item.id ? 'neo.inset.sm' : 'none'}
                      _hover={{ bg: 'neomorphic.background', boxShadow: activeTab === item.id ? 'neo.inset.sm' : 'neo.sm' }}
                      onClick={() => setActiveTab(item.id)}
                      transition="all 0.3s"
                    >
                      <Flex align="center">
                        <Icon as={item.icon} boxSize={5} mr={2} />
                        <Text>{item.label}</Text>
                      </Flex>
                    </List.Item>
                  ))}
                </List.Root>
              </Box>
            </VStack>
          </GridItem>

          {/* Main Content Area */}
          <GridItem>
            <Box p={8} bg="neomorphic.surface" borderRadius="3xl" boxShadow="neo.md" border="none">
              {activeTab === 'personal' && (
                <form onSubmit={personalForm.handleSubmit(onSavePersonal)}>
                  <VStack gap={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={2} color="purple.900">Personal Information</Heading>
                      <Text color="purple.700" fontSize="sm">
                        Update your personal details and contact information
                      </Text>
                    </Box>

                    <Separator />

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <Controller
                        name="firstName"
                        control={personalForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!personalForm.formState.errors.firstName}>
                            <Field.Label color="purple.900" fontWeight="medium">First Name</Field.Label>
                            <Input {...field} color="purple.900" />
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
                            <Input {...field} color="purple.900" />
                            <Field.ErrorText>
                              {getErrorMessage(personalForm.formState.errors.lastName)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                    </Grid>

                    <Controller
                      name="email"
                      control={personalForm.control}
                      render={({ field }) => (
                        <Field.Root invalid={!!personalForm.formState.errors.email}>
                          <Field.Label color="purple.900" fontWeight="medium">Email Address</Field.Label>
                          <Input {...field} type="email" color="purple.900" />
                          <Field.ErrorText>
                            {getErrorMessage(personalForm.formState.errors.email)}
                          </Field.ErrorText>
                        </Field.Root>
                      )}
                    />

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <Controller
                        name="phone"
                        control={personalForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!personalForm.formState.errors.phone}>
                            <Field.Label color="purple.900" fontWeight="medium">Phone Number</Field.Label>
                            <Input {...field} color="purple.900" />
                            <Field.ErrorText>
                              {getErrorMessage(personalForm.formState.errors.phone)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />

                      <Controller
                        name="jobTitle"
                        control={personalForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!personalForm.formState.errors.jobTitle}>
                            <Field.Label color="purple.900" fontWeight="medium">Job Title</Field.Label>
                            <Input {...field} color="purple.900" />
                            <Field.ErrorText>
                              {getErrorMessage(personalForm.formState.errors.jobTitle)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                    </Grid>

                    <Controller
                      name="bio"
                      control={personalForm.control}
                      render={({ field }) => (
                        <Field.Root invalid={!!personalForm.formState.errors.bio}>
                          <Field.Label color="purple.900" fontWeight="medium">Bio</Field.Label>
                          <Textarea
                            {...field}
                            placeholder="Tell us about yourself and your role..."
                            rows={4}
                            color="purple.900"
                            _placeholder={{ color: 'purple.400' }}
                          />
                          <Field.ErrorText>
                            {getErrorMessage(personalForm.formState.errors.bio)}
                          </Field.ErrorText>
                        </Field.Root>
                      )}
                    />

                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Address Information</Heading>

                      <VStack gap={4} align="stretch">
                        <Controller
                          name="streetAddress"
                          control={personalForm.control}
                          render={({ field }) => (
                            <Field.Root invalid={!!personalForm.formState.errors.streetAddress}>
                              <Field.Label color="purple.900" fontWeight="medium">Street Address</Field.Label>
                              <Input {...field} color="purple.900" />
                              <Field.ErrorText>
                                {getErrorMessage(personalForm.formState.errors.streetAddress)}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        />

                        <Grid templateColumns={{ base: '1fr', md: '2fr 2fr 1fr' }} gap={4}>
                          <Controller
                            name="city"
                            control={personalForm.control}
                            render={({ field }) => (
                              <Field.Root invalid={!!personalForm.formState.errors.city}>
                                <Field.Label color="purple.900" fontWeight="medium">City</Field.Label>
                                <Input {...field} color="purple.900" />
                                <Field.ErrorText>
                                  {getErrorMessage(personalForm.formState.errors.city)}
                                </Field.ErrorText>
                              </Field.Root>
                            )}
                          />

                          <Controller
                            name="state"
                            control={personalForm.control}
                            render={({ field }) => (
                              <Field.Root invalid={!!personalForm.formState.errors.state}>
                                <Field.Label color="purple.900" fontWeight="medium">State</Field.Label>
                                <NativeSelectRoot>
                                  <NativeSelectField {...field} color="purple.900">
                                    <option value="Illinois">Illinois</option>
                                    <option value="California">California</option>
                                    <option value="New York">New York</option>
                                    <option value="Texas">Texas</option>
                                    <option value="Florida">Florida</option>
                                    {/* Add more states as needed */}
                                  </NativeSelectField>
                                </NativeSelectRoot>
                                <Field.ErrorText>
                                  {getErrorMessage(personalForm.formState.errors.state)}
                                </Field.ErrorText>
                              </Field.Root>
                            )}
                          />

                          <Controller
                            name="zipCode"
                            control={personalForm.control}
                            render={({ field }) => (
                              <Field.Root invalid={!!personalForm.formState.errors.zipCode}>
                                <Field.Label color="purple.900" fontWeight="medium">ZIP Code</Field.Label>
                                <Input {...field} color="purple.900" />
                                <Field.ErrorText>
                                  {getErrorMessage(personalForm.formState.errors.zipCode)}
                                </Field.ErrorText>
                              </Field.Root>
                            )}
                          />
                        </Grid>
                      </VStack>
                    </Box>

                    <HStack gap={4} justify="flex-end" pt={4}>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => personalForm.reset()}
                        disabled={personalForm.formState.isSubmitting}
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                        _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorPalette="purple"
                        loading={personalForm.formState.isSubmitting}
                        disabled={personalForm.formState.isSubmitting}
                        borderRadius="2xl"
                        boxShadow="neo.md"
                        _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                        _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                      >
                        {personalForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}

              {activeTab === 'organization' && (
                <form onSubmit={organizationForm.handleSubmit(onSaveOrganization)}>
                  <VStack gap={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={2} color="purple.900">Organization Details</Heading>
                      <Text color="purple.700" fontSize="sm">
                        Manage your organization's information and settings
                      </Text>
                    </Box>

                    <Separator />

                    <Controller
                      name="orgName"
                      control={organizationForm.control}
                      render={({ field }) => (
                        <Field.Root invalid={!!organizationForm.formState.errors.orgName}>
                          <Field.Label color="purple.900" fontWeight="medium">Organization Name</Field.Label>
                          <Input {...field} color="purple.900" />
                          <Field.ErrorText>
                            {getErrorMessage(organizationForm.formState.errors.orgName)}
                          </Field.ErrorText>
                        </Field.Root>
                      )}
                    />

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <Controller
                        name="orgType"
                        control={organizationForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!organizationForm.formState.errors.orgType}>
                            <Field.Label color="purple.900" fontWeight="medium">Organization Type</Field.Label>
                            <NativeSelectRoot>
                              <NativeSelectField {...field} color="purple.900">
                                <option value="nonprofit">Nonprofit Organization</option>
                                <option value="educational">Educational Institution</option>
                                <option value="government">Government Agency</option>
                                <option value="research">Research Institution</option>
                                <option value="community">Community Organization</option>
                              </NativeSelectField>
                            </NativeSelectRoot>
                            <Field.ErrorText>
                              {getErrorMessage(organizationForm.formState.errors.orgType)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />

                      <Controller
                        name="taxId"
                        control={organizationForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!organizationForm.formState.errors.taxId}>
                            <Field.Label color="purple.900" fontWeight="medium">Tax ID / EIN</Field.Label>
                            <Input {...field} color="purple.900" placeholder="XX-XXXXXXX" />
                            <Field.ErrorText>
                              {getErrorMessage(organizationForm.formState.errors.taxId)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                    </Grid>

                    <Controller
                      name="orgWebsite"
                      control={organizationForm.control}
                      render={({ field }) => (
                        <Field.Root invalid={!!organizationForm.formState.errors.orgWebsite}>
                          <Field.Label color="purple.900" fontWeight="medium">Organization Website</Field.Label>
                          <Input {...field} type="url" color="purple.900" placeholder="https://yourorganization.org" />
                          <Field.ErrorText>
                            {getErrorMessage(organizationForm.formState.errors.orgWebsite)}
                          </Field.ErrorText>
                        </Field.Root>
                      )}
                    />

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <Controller
                        name="orgPhone"
                        control={organizationForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!organizationForm.formState.errors.orgPhone}>
                            <Field.Label color="purple.900" fontWeight="medium">Organization Phone</Field.Label>
                            <Input {...field} type="tel" color="purple.900" />
                            <Field.ErrorText>
                              {getErrorMessage(organizationForm.formState.errors.orgPhone)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />

                      <Controller
                        name="orgEmail"
                        control={organizationForm.control}
                        render={({ field }) => (
                          <Field.Root invalid={!!organizationForm.formState.errors.orgEmail}>
                            <Field.Label color="purple.900" fontWeight="medium">Organization Email</Field.Label>
                            <Input {...field} type="email" color="purple.900" />
                            <Field.ErrorText>
                              {getErrorMessage(organizationForm.formState.errors.orgEmail)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                    </Grid>

                    <Card.Root variant="outline" borderColor="purple.200" bg="purple.50">
                      <Card.Body>
                        <HStack gap={3}>
                          <Icon as={FiShield} boxSize={5} color="purple.600" />
                          <Box flex={1}>
                            <Text fontWeight="semibold" color="purple.900" mb={1}>Verification Status</Text>
                            <Text fontSize="sm" color="purple.700">
                              Your organization is verified. This helps you access exclusive grant opportunities.
                            </Text>
                          </Box>
                          <Badge colorPalette="green" size="lg">Verified</Badge>
                        </HStack>
                      </Card.Body>
                    </Card.Root>

                    <HStack gap={4} justify="flex-end" pt={4}>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => organizationForm.reset()}
                        disabled={organizationForm.formState.isSubmitting}
                        color="purple.900"
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                        _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorPalette="purple"
                        color="white"
                        loading={organizationForm.formState.isSubmitting}
                        disabled={organizationForm.formState.isSubmitting}
                        borderRadius="2xl"
                        boxShadow="neo.md"
                        _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                        _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                      >
                        {organizationForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}

              {activeTab === 'notifications' && (
                <form onSubmit={notificationsForm.handleSubmit(onSaveNotifications)}>
                  <VStack gap={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={2} color="purple.900">Notification Preferences</Heading>
                      <Text color="purple.700" fontSize="sm">
                        Choose how and when you want to be notified about grant activities
                      </Text>
                    </Box>

                    <Separator />

                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Notification Channels</Heading>
                      <VStack gap={4} align="stretch">
                        <Controller
                          name="emailNotifications"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={4} border="1px" borderColor="purple.200" borderRadius="md">
                              <HStack gap={3}>
                                <Icon as={FiMail} boxSize={5} color="purple.600" />
                                <Box>
                                  <Text fontWeight="medium" color="purple.900">Email Notifications</Text>
                                  <Text fontSize="sm" color="purple.700">Receive updates via email</Text>
                                </Box>
                              </HStack>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />

                        <Controller
                          name="pushNotifications"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={4} border="1px" borderColor="purple.200" borderRadius="md">
                              <HStack gap={3}>
                                <Icon as={FiBell} boxSize={5} color="purple.600" />
                                <Box>
                                  <Text fontWeight="medium" color="purple.900">Push Notifications</Text>
                                  <Text fontSize="sm" color="purple.700">Get instant alerts in your browser</Text>
                                </Box>
                              </HStack>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />

                        <Controller
                          name="smsNotifications"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={4} border="1px" borderColor="purple.200" borderRadius="md">
                              <HStack gap={3}>
                                <Icon as={FiSmartphone} boxSize={5} color="purple.600" />
                                <Box>
                                  <Text fontWeight="medium" color="purple.900">SMS Notifications</Text>
                                  <Text fontSize="sm" color="purple.700">Text messages for urgent updates</Text>
                                </Box>
                              </HStack>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />
                      </VStack>
                    </Box>

                    <Separator />

                    <Box>
                      <Heading size="sm" mb={4} color="purple.900">Alert Types</Heading>
                      <VStack gap={3} align="stretch">
                        <Controller
                          name="deadlineReminders"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={3} _hover={{ bg: 'purple.50' }} borderRadius="md">
                              <Text color="purple.900">Deadline Reminders</Text>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />

                        <Controller
                          name="complianceAlerts"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={3} _hover={{ bg: 'purple.50' }} borderRadius="md">
                              <Text color="purple.900">Compliance Alerts</Text>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />

                        <Controller
                          name="grantMatches"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={3} _hover={{ bg: 'purple.50' }} borderRadius="md">
                              <Text color="purple.900">New Grant Matches</Text>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />

                        <Controller
                          name="weeklyDigest"
                          control={notificationsForm.control}
                          render={({ field }) => (
                            <HStack justify="space-between" p={3} _hover={{ bg: 'purple.50' }} borderRadius="md">
                              <Text color="purple.900">Weekly Activity Digest</Text>
                              <Switch.Root
                                checked={field.value}
                                onCheckedChange={(e: any) => field.onChange(!!e.checked)}
                              >
                                <Switch.Thumb />
                              </Switch.Root>
                            </HStack>
                          )}
                        />
                      </VStack>
                    </Box>

                    <HStack gap={4} justify="flex-end" pt={4}>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => notificationsForm.reset()}
                        disabled={notificationsForm.formState.isSubmitting}
                        bg="neomorphic.background"
                        border="none"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)' }}
                        _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                      >
                        Reset to Default
                      </Button>
                      <Button
                        type="submit"
                        colorPalette="purple"
                        loading={notificationsForm.formState.isSubmitting}
                        disabled={notificationsForm.formState.isSubmitting}
                        borderRadius="2xl"
                        boxShadow="neo.md"
                        _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                        _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                      >
                        {notificationsForm.formState.isSubmitting ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}

              {activeTab === 'security' && (
                <VStack gap={6} align="stretch">
                  <Box>
                    <Heading size="md" mb={2} color="purple.900">Security Settings</Heading>
                    <Text color="purple.700" fontSize="sm">
                      Manage your account security and authentication methods
                    </Text>
                  </Box>

                  <Separator />

                  <Box>
                    <Heading size="sm" mb={4} color="purple.900">Change Password</Heading>
                    <form onSubmit={securityForm.handleSubmit(onSaveSecurity)}>
                      <VStack gap={4} align="stretch">
                        <Controller
                          name="currentPassword"
                          control={securityForm.control}
                          render={({ field }) => (
                            <Field.Root invalid={!!securityForm.formState.errors.currentPassword}>
                              <Field.Label color="purple.900" fontWeight="medium">Current Password</Field.Label>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter current password"
                                color="purple.900"
                                _placeholder={{ color: 'purple.400' }}
                              />
                              <Field.ErrorText>
                                {getErrorMessage(securityForm.formState.errors.currentPassword)}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        />

                        <Controller
                          name="newPassword"
                          control={securityForm.control}
                          render={({ field }) => (
                            <Field.Root invalid={!!securityForm.formState.errors.newPassword}>
                              <Field.Label color="purple.900" fontWeight="medium">New Password</Field.Label>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter new password"
                                color="purple.900"
                                _placeholder={{ color: 'purple.400' }}
                              />
                              <Field.ErrorText>
                                {getErrorMessage(securityForm.formState.errors.newPassword)}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        />

                        <Controller
                          name="confirmPassword"
                          control={securityForm.control}
                          render={({ field }) => (
                            <Field.Root invalid={!!securityForm.formState.errors.confirmPassword}>
                              <Field.Label color="purple.900" fontWeight="medium">Confirm New Password</Field.Label>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Confirm new password"
                                color="purple.900"
                                _placeholder={{ color: 'purple.400' }}
                              />
                              <Field.ErrorText>
                                {getErrorMessage(securityForm.formState.errors.confirmPassword)}
                              </Field.ErrorText>
                            </Field.Root>
                          )}
                        />

                        <Button
                          type="submit"
                          colorPalette="purple"
                          alignSelf="flex-start"
                          loading={securityForm.formState.isSubmitting}
                          disabled={securityForm.formState.isSubmitting}
                          borderRadius="2xl"
                          boxShadow="neo.md"
                          _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                          _active={{ transform: 'scale(0.98)', boxShadow: 'neo.sm' }}
                        >
                          {securityForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                        </Button>
                      </VStack>
                    </form>
                  </Box>

                  <Separator />

                  <Box>
                    <Heading size="sm" mb={4} color="purple.900">Two-Factor Authentication</Heading>
                    <Card.Root variant="outline" borderColor={twoFactorEnabled ? 'green.200' : 'gray.200'} bg={twoFactorEnabled ? 'green.50' : 'white'}>
                      <Card.Body>
                        <HStack justify="space-between" mb={4}>
                          <HStack gap={3}>
                            <Icon as={FiShield} boxSize={6} color={twoFactorEnabled ? 'green.600' : 'gray.600'} />
                            <Box>
                              <Text fontWeight="semibold" color="purple.900" mb={1}>
                                {twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                              </Text>
                              <Text fontSize="sm" color="purple.700">
                                Add an extra layer of security to your account
                              </Text>
                            </Box>
                          </HStack>
                          <Switch.Root
                            checked={twoFactorEnabled}
                            onCheckedChange={(e: any) => setTwoFactorEnabled(!!e.checked)}
                          >
                            <Switch.Thumb />
                          </Switch.Root>
                        </HStack>

                        {twoFactorEnabled && (
                          <VStack gap={3} align="stretch" pt={3} borderTop="1px" borderColor="purple.200">
                            <Text fontSize="sm" color="purple.700">
                              Two-factor authentication is active. You'll need to enter a code from your authenticator app when signing in.
                            </Text>
                            <HStack gap={2}>
                              <Button
                                size="sm"
                                variant="outline"
                                color="purple.900"
                                bg="neomorphic.background"
                                border="none"
                                borderRadius="2xl"
                                boxShadow="neo.sm"
                                _hover={{ boxShadow: 'neo.md', color: 'purple.700' }}
                              >
                                View Recovery Codes
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                color="purple.900"
                                bg="neomorphic.background"
                                border="none"
                                borderRadius="2xl"
                                boxShadow="neo.sm"
                                _hover={{ boxShadow: 'neo.md', color: 'purple.700' }}
                              >
                                Reset 2FA
                              </Button>
                            </HStack>
                          </VStack>
                        )}
                      </Card.Body>
                    </Card.Root>
                  </Box>

                  <Separator />

                  <Box>
                    <Heading size="sm" mb={4} color="purple.900">Active Sessions</Heading>
                    <VStack gap={3} align="stretch">
                      <HStack justify="space-between" p={4} border="1px" borderColor="purple.200" borderRadius="md">
                        <HStack gap={3}>
                          <Icon as={FiGlobe} boxSize={5} color="purple.600" />
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Current Session</Text>
                            <Text fontSize="sm" color="purple.700">Springfield, IL • Chrome on Windows</Text>
                          </Box>
                        </HStack>
                        <Badge colorPalette="green">Active Now</Badge>
                      </HStack>

                      <HStack justify="space-between" p={4} border="1px" borderColor="purple.200" borderRadius="md">
                        <HStack gap={3}>
                          <Icon as={FiSmartphone} boxSize={5} color="purple.600" />
                          <Box>
                            <Text fontWeight="medium" color="purple.900">Mobile Device</Text>
                            <Text fontSize="sm" color="purple.700">Last active 2 hours ago</Text>
                          </Box>
                        </HStack>
                        <Button
                          size="sm"
                          variant="outline"
                          colorPalette="red"
                          color="red.700"
                          bg="neomorphic.background"
                          border="none"
                          borderRadius="2xl"
                          boxShadow="neo.sm"
                          _hover={{ boxShadow: 'neo.md', color: 'red.600' }}
                        >
                          Revoke
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>

                  <Card.Root variant="outline" borderColor="red.200" bg="red.50">
                    <Card.Body>
                      <Heading size="sm" color="red.800" mb={2}>Danger Zone</Heading>
                      <Text fontSize="sm" color="red.700" mb={4}>
                        Once you delete your account, there is no going back. Please be certain.
                      </Text>
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        color="red.700"
                        borderRadius="2xl"
                        boxShadow="neo.sm"
                        _hover={{ boxShadow: 'neo.md', color: 'red.600' }}
                      >
                        Delete Account
                      </Button>
                    </Card.Body>
                  </Card.Root>
                </VStack>
              )}
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
    </MainLayout>
  )
}
