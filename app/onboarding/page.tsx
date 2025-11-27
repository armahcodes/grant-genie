"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Card,
  Progress,
  Icon,
  SimpleGrid,
  Spinner,
  Field,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiUser,
  FiBriefcase,
  FiTarget,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import { getErrorMessage } from "@/lib/utils/formHelpers";

// Zod validation schema
const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.string().min(1, "Please select an organization type"),
  role: z.string().min(2, "Role is required"),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

function OnboardingContent() {
  const router = useRouter();
  const user = useUser({ or: "redirect" });
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: user?.displayName || "",
      organizationName: "",
      organizationType: "",
      role: "",
      goals: [],
    },
    mode: "onChange",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const organizationTypes = [
    "Nonprofit Organization",
    "Foundation",
    "Educational Institution",
    "Government Agency",
    "Social Enterprise",
    "Other",
  ];

  const goalOptions = [
    "Find Grant Opportunities",
    "Write Grant Proposals",
    "Practice Donor Conversations",
    "Track Compliance & Reporting",
    "Manage Team Collaboration",
    "Learn Fundraising Best Practices",
  ];

  const goals = watch("goals");
  const organizationType = watch("organizationType");

  const handleGoalToggle = (goal: string) => {
    const currentGoals = goals || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];
    setValue("goals", newGoals);
  };

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof OnboardingFormData> = [];

    if (step === 1) {
      fieldsToValidate = ["fullName", "role"];
    } else if (step === 2) {
      fieldsToValidate = ["organizationName", "organizationType"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      await user.update({
        clientMetadata: {
          onboarded: "true",
          organizationName: data.organizationName,
          organizationType: data.organizationType,
          role: data.role,
          goals: data.goals.join(","),
        },
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  return (
    <Box minH="100vh" bg="neomorphic.background" py={{ base: 8, md: 12 }}>
      <Container maxW="4xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <VStack gap={2} textAlign="center">
            <Heading size={{ base: "xl", md: "2xl" }} color="purple.900">
              Welcome to HeadspaceGenie
            </Heading>
            <Text color="purple.700" fontSize={{ base: "md", md: "lg" }}>
              Let's get you set up in just a few steps
            </Text>
          </VStack>

          {/* Progress */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="purple.700" fontWeight="medium">
                Step {step} of {totalSteps}
              </Text>
              <Text fontSize="sm" color="purple.700">
                {Math.round(progress)}% Complete
              </Text>
            </HStack>
            <Progress.Root value={progress} colorPalette="purple">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>

          {/* Onboarding Steps */}
          <Card.Root bg="neomorphic.surface" p={{ base: 6, md: 8 }} borderRadius="3xl" boxShadow="neo.md" border="none">
            <Card.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                  <VStack gap={6} align="stretch">
                    <HStack gap={3}>
                      <Icon
                        as={FiUser}
                        boxSize={8}
                        color="purple.600"
                        p={2}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        boxShadow="neo.inset.sm"
                      />
                      <VStack align="start" gap={0}>
                        <Heading size={{ base: "md", md: "lg" }} color="purple.900">
                          About You
                        </Heading>
                        <Text color="purple.700" fontSize={{ base: "sm", md: "md" }}>
                          Tell us a bit about yourself
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack gap={4} align="stretch" mt={4}>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <Field.Root invalid={!!errors.fullName}>
                            <Field.Label fontWeight="medium" color="purple.900">
                              Full Name
                            </Field.Label>
                            <Input
                              {...field}
                              size={{ base: "md", md: "lg" }}
                              placeholder="Enter your full name"
                            />
                            <Field.ErrorText>
                              {getErrorMessage(errors.fullName)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />

                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <Field.Root invalid={!!errors.role}>
                            <Field.Label fontWeight="medium" color="purple.900">
                              Your Role
                            </Field.Label>
                            <Input
                              {...field}
                              size={{ base: "md", md: "lg" }}
                              placeholder="e.g., Executive Director, Development Manager"
                            />
                            <Field.ErrorText>
                              {getErrorMessage(errors.role)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />
                    </VStack>
                  </VStack>
                )}

                {step === 2 && (
                  <VStack gap={6} align="stretch">
                    <HStack gap={3}>
                      <Icon
                        as={FiBriefcase}
                        boxSize={8}
                        color="purple.600"
                        p={2}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        boxShadow="neo.inset.sm"
                      />
                      <VStack align="start" gap={0}>
                        <Heading size={{ base: "md", md: "lg" }} color="purple.900">
                          Your Organization
                        </Heading>
                        <Text color="purple.700" fontSize={{ base: "sm", md: "md" }}>
                          Help us understand your mission
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack gap={4} align="stretch" mt={4}>
                      <Controller
                        name="organizationName"
                        control={control}
                        render={({ field }) => (
                          <Field.Root invalid={!!errors.organizationName}>
                            <Field.Label fontWeight="medium" color="purple.900">
                              Organization Name
                            </Field.Label>
                            <Input
                              {...field}
                              size={{ base: "md", md: "lg" }}
                              placeholder="Enter your organization name"
                            />
                            <Field.ErrorText>
                              {getErrorMessage(errors.organizationName)}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      />

                      <Field.Root invalid={!!errors.organizationType}>
                        <Field.Label fontWeight="medium" color="purple.900">
                          Organization Type
                        </Field.Label>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2} w="full">
                          {organizationTypes.map((type) => (
                            <Button
                              key={type}
                              type="button"
                              variant={
                                organizationType === type ? "solid" : "outline"
                              }
                              colorPalette="purple"
                              onClick={() => setValue("organizationType", type)}
                              size={{ base: "sm", md: "md" }}
                              textAlign="left"
                              justifyContent="flex-start"
                              bg={organizationType === type ? undefined : "neomorphic.background"}
                              border="none"
                              borderRadius="2xl"
                              boxShadow={organizationType === type ? "neo.md" : "neo.sm"}
                              _hover={{
                                boxShadow: organizationType === type ? "neo.lg" : "neo.md",
                                transform: "translateY(-2px)"
                              }}
                              _active={{
                                transform: "scale(0.98)",
                                boxShadow: organizationType === type ? "neo.sm" : "neo.inset.sm"
                              }}
                            >
                              {organizationType === type && (
                                <Icon as={FiCheck} mr={2} />
                              )}
                              {type}
                            </Button>
                          ))}
                        </SimpleGrid>
                        <Field.ErrorText>
                          {getErrorMessage(errors.organizationType)}
                        </Field.ErrorText>
                      </Field.Root>
                    </VStack>
                  </VStack>
                )}

                {step === 3 && (
                  <VStack gap={6} align="stretch">
                    <HStack gap={3}>
                      <Icon
                        as={FiTarget}
                        boxSize={8}
                        color="purple.600"
                        p={2}
                        bg="neomorphic.background"
                        borderRadius="2xl"
                        boxShadow="neo.inset.sm"
                      />
                      <VStack align="start" gap={0}>
                        <Heading size={{ base: "md", md: "lg" }} color="purple.900">
                          Your Goals
                        </Heading>
                        <Text color="purple.700" fontSize={{ base: "sm", md: "md" }}>
                          What would you like to accomplish?
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack gap={2} align="stretch" mt={4}>
                      <Field.Root invalid={!!errors.goals}>
                        <Text fontSize={{ base: "sm", md: "md" }} color="purple.700" mb={2}>
                          Select all that apply:
                        </Text>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
                          {goalOptions.map((goal) => (
                            <Button
                              key={goal}
                              type="button"
                              variant={goals?.includes(goal) ? "solid" : "outline"}
                              colorPalette="purple"
                              onClick={() => handleGoalToggle(goal)}
                              size={{ base: "sm", md: "md" }}
                              textAlign="left"
                              justifyContent="flex-start"
                              bg={goals?.includes(goal) ? undefined : "neomorphic.background"}
                              border="none"
                              borderRadius="2xl"
                              boxShadow={goals?.includes(goal) ? "neo.md" : "neo.sm"}
                              _hover={{
                                boxShadow: goals?.includes(goal) ? "neo.lg" : "neo.md",
                                transform: "translateY(-2px)"
                              }}
                              _active={{
                                transform: "scale(0.98)",
                                boxShadow: goals?.includes(goal) ? "neo.sm" : "neo.inset.sm"
                              }}
                            >
                              {goals?.includes(goal) && <Icon as={FiCheck} mr={2} />}
                              {goal}
                            </Button>
                          ))}
                        </SimpleGrid>
                        <Field.ErrorText>
                          {getErrorMessage(errors.goals as any)}
                        </Field.ErrorText>
                      </Field.Root>
                    </VStack>
                  </VStack>
                )}

                {/* Navigation Buttons */}
                <HStack justify="space-between" mt={8}>
                  <Button
                    type="button"
                    variant="outline"
                    colorPalette="purple"
                    color="purple.900"
                    onClick={handleBack}
                    disabled={step === 1}
                    size={{ base: "md", md: "lg" }}
                    bg="neomorphic.background"
                    border="none"
                    borderRadius="2xl"
                    boxShadow="neo.sm"
                    _hover={{ boxShadow: "neo.md", transform: "translateY(-2px)", color: "purple.700" }}
                    _active={{ boxShadow: "neo.inset.sm", transform: "translateY(0)" }}
                  >
                    Back
                  </Button>

                  {step < totalSteps ? (
                    <Button
                      type="button"
                      colorPalette="purple"
                      color="white"
                      onClick={handleNext}
                      size={{ base: "md", md: "lg" }}
                      borderRadius="2xl"
                      boxShadow="neo.md"
                      _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                      _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                    >
                      Continue
                      <Icon as={FiArrowRight} ml={2} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      colorPalette="purple"
                      color="white"
                      size={{ base: "md", md: "lg" }}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      borderRadius="2xl"
                      boxShadow="neo.md"
                      _hover={{ boxShadow: "neo.lg", transform: "translateY(-2px)" }}
                      _active={{ transform: "scale(0.98)", boxShadow: "neo.sm" }}
                    >
                      {isSubmitting ? "Saving..." : "Complete Setup"}
                      <Icon as={FiCheck} ml={2} />
                    </Button>
                  )}
                </HStack>
              </form>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
}

function LoadingFallback() {
  return (
    <Box minH="100vh" bg="neomorphic.background" display="flex" alignItems="center" justifyContent="center">
      <VStack gap={4}>
        <Spinner size="xl" colorPalette="purple" borderWidth="4px" />
        <Text color="purple.700">Loading...</Text>
      </VStack>
    </Box>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OnboardingContent />
    </Suspense>
  );
}
