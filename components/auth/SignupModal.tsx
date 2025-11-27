'use client'

import {
  Dialog,
  VStack,
  Field,
  Input,
  Button,
  Text,
  HStack,
  Separator,
  Link,
  Checkbox,
  createToaster,
  SimpleGrid,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
}

const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async () => {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.organization ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toaster.create({
        title: 'Error',
        description: 'Please fill in all fields',
        type: 'error',
        duration: 3000,
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toaster.create({
        title: 'Error',
        description: 'Passwords do not match',
        type: 'error',
        duration: 3000,
      })
      return
    }

    if (!agreeToTerms) {
      toaster.create({
        title: 'Error',
        description: 'Please agree to the terms and conditions',
        type: 'error',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      login({
        id: '1',
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        organization: formData.organization,
      })

      toaster.create({
        title: 'Success',
        description: 'Account created successfully! Welcome to Headspace Genie.',
        type: 'success',
        duration: 3000,
      })

      setIsLoading(false)
      onClose()
      router.push('/')
    }, 1000)
  }

  const handleGoogleSignup = () => {
    toaster.create({
      title: 'Coming Soon',
      description: 'Google signup will be available soon',
      type: 'info',
      duration: 3000,
    })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg" placement="center">
      <Dialog.Backdrop backdropFilter="blur(5px)" />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header color="purple.900">Create Your Account</Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body pb={6}>
            <VStack gap={4}>
              <SimpleGrid columns={2} gap={4} w="full">
                <Field.Root>
                  <Field.Label color="purple.900" fontWeight="medium">First Name</Field.Label>
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    color="purple.900"
                    _placeholder={{ color: 'purple.400' }}
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    boxShadow="neo.inset.sm"
                    _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px',
                    }}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label color="purple.900" fontWeight="medium">Last Name</Field.Label>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    color="purple.900"
                    _placeholder={{ color: 'purple.400' }}
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    boxShadow="neo.inset.sm"
                    _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px',
                    }}
                  />
                </Field.Root>
              </SimpleGrid>

              <Field.Root>
                <Field.Label color="purple.900" fontWeight="medium">Email</Field.Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  color="purple.900"
                  _placeholder={{ color: 'purple.400' }}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.inset.sm"
                  _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label color="purple.900" fontWeight="medium">Organization</Field.Label>
                <Input
                  name="organization"
                  placeholder="Your organization name"
                  value={formData.organization}
                  onChange={handleInputChange}
                  color="purple.900"
                  _placeholder={{ color: 'purple.400' }}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.inset.sm"
                  _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label color="purple.900" fontWeight="medium">Password</Field.Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  color="purple.900"
                  _placeholder={{ color: 'purple.400' }}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.inset.sm"
                  _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label color="purple.900" fontWeight="medium">Confirm Password</Field.Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  color="purple.900"
                  _placeholder={{ color: 'purple.400' }}
                  bg="neomorphic.background"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="neo.inset.sm"
                  _focus={{ boxShadow: 'neo.inset.md', outline: 'none' }}
                  _focusVisible={{
                    outline: '3px solid',
                    outlineColor: 'purple.500',
                    outlineOffset: '2px',
                  }}
                />
              </Field.Root>

              <Checkbox.Root
                w="full"
                checked={agreeToTerms}
                onCheckedChange={(e: any) => setAgreeToTerms(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  <Text fontSize="sm" color="purple.800">
                    I agree to the{' '}
                    <Link color="purple.600" fontWeight="semibold">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link color="purple.600" fontWeight="semibold">
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox.Label>
              </Checkbox.Root>

              <Button
                colorPalette="purple"
                w="full"
                onClick={handleSignup}
                loading={isLoading}
                borderRadius="2xl"
                boxShadow="neo.md"
                py={6}
                fontSize="md"
                fontWeight="semibold"
                color="white"
                _hover={{ boxShadow: 'neo.lg', transform: 'translateY(-2px)' }}
                _active={{ boxShadow: 'neo.sm', transform: 'translateY(0)' }}
                _focusVisible={{
                  outline: '3px solid',
                  outlineColor: 'purple.500',
                  outlineOffset: '2px',
                }}
              >
                Create Account
              </Button>

              <HStack w="full">
                <Separator />
                <Text fontSize="sm" color="purple.800" whiteSpace="nowrap">
                  or sign up with
                </Text>
                <Separator />
              </HStack>

              <Button
                w="full"
                variant="outline"
                onClick={handleGoogleSignup}
                color="purple.900"
                bg="neomorphic.background"
                border="none"
                borderRadius="2xl"
                boxShadow="neo.sm"
                py={6}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ boxShadow: 'neo.md', transform: 'translateY(-2px)', color: 'purple.700' }}
                _active={{ boxShadow: 'neo.inset.sm', transform: 'translateY(0)' }}
                _focusVisible={{
                  outline: '3px solid',
                  outlineColor: 'purple.500',
                  outlineOffset: '2px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </svg>
                Google
              </Button>

              <Text fontSize="sm" textAlign="center" color="purple.800">
                Already have an account?{' '}
                <Link
                  color="purple.600"
                  fontWeight="semibold"
                  onClick={() => {
                    onClose()
                    onSwitchToLogin?.()
                  }}
                >
                  Log in
                </Link>
              </Text>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
