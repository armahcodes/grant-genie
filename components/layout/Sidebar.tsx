'use client'

import {
  Box,
  Flex,
  Icon,
  Link,
  VStack,
  Text,
  Avatar,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Button,
  HStack,
  IconButton,
  DrawerRoot,
  DrawerBackdrop,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseTrigger,
  Portal,
} from '@chakra-ui/react'
import { ColorModeToggle } from '@/components/ui/ColorModeToggle'
import { IconType } from 'react-icons'
// Icon Library Standardization - Using Feather Icons (fi) exclusively
import {
  FiHome,
  FiSearch,
  FiFileText,
  FiCheckSquare,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiBook,
  FiHelpCircle,
  FiLogOut,
  FiUser,
  FiMenu,
} from 'react-icons/fi'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@stackframe/stack'
import { useState } from 'react'
import { colors } from '@/theme/tokens'
/**
 * TODO: Props Drilling Refactoring
 * 
 * Current Implementation:
 * - Mobile menu state (isOpen/setIsOpen) is managed at the Sidebar component level
 * - The state and handlers are passed down through SidebarContent via props
 * - onClose callback is drilled through to child navigation items
 * 
 * Future Improvement:
 * - Consider refactoring to use React Context for mobile menu state management
 * - This would eliminate props drilling and make the state accessible throughout the component tree
 * - Could create a SidebarContext that provides: { isOpen, onOpen, onClose, onToggle }
 * - Would simplify component interfaces and make state management more scalable
 * 
 * Related: See COMPONENT_ARCHITECTURE.md for more architectural guidelines
 */


interface NavItemProps {
  icon: IconType
  children: string
  href: string
  isActive?: boolean
}

const NavItem = ({ icon, children, href, isActive }: NavItemProps) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
        w="full"
      >
        <Flex
          align="center"
          p="3"
          mx="2"
          borderRadius="2xl"
          role="group"
          cursor="pointer"
          bg={isActive ? 'neomorphic.background' : 'transparent'}
          color={isActive ? 'purple.600' : 'inherit'}
          boxShadow={isActive ? 'neo.inset.sm' : 'none'}
          _hover={{
            bg: 'neomorphic.background',
            boxShadow: isActive ? 'neo.inset.sm' : 'neo.sm',
          }}
          _focusVisible={{
            outline: '3px solid',
            outlineColor: 'purple.500',
            outlineOffset: '2px',
            bg: 'neomorphic.background'
          }}
          transition="all 0.2s"
        >
          <Icon
            mr="3"
            fontSize="20"
            as={icon}
            aria-hidden="true"
          />
          <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'medium'}>
            {children}
          </Text>
        </Flex>
      </Link>
    </NextLink>
  )
}

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname()
  const router = useRouter()
  const user = useUser()

  const handleLogout = async () => {
    await user?.signOut()
    router.push('/')
  }

  const handleNavClick = () => {
    onClose?.()
  }

  const { deepIndigo, softTeal } = colors.brand

  return (
    <Box
      bg="neomorphic.surface"
      borderRight="none"
      h="full"
      display="flex"
      flexDirection="column"
      boxShadow={{ base: 'none', md: 'neo.md' }}
    >
      <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
        <Text
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="bold"
          bgGradient={`linear(to-r, ${deepIndigo}, ${softTeal})`}
          bgClip="text"
        >
          Headspace Genie
        </Text>
        <ColorModeToggle />
      </Flex>

      <VStack gap={1} align="stretch" flex={1} overflowY="auto" pb={4}>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiHome} href="/dashboard" isActive={pathname === '/dashboard'}>
            Dashboard
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiSearch} href="/grant-search" isActive={pathname === '/grant-search'}>
            Grant Search
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiFileText} href="/grant-application" isActive={pathname === '/grant-application'}>
            Grant Application
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiCheckSquare} href="/compliance-tracker" isActive={pathname === '/compliance-tracker'}>
            Compliance Tracker
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiBarChart2} href="/reporting" isActive={pathname === '/reporting'}>
            Reporting
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiBell} href="/notifications" isActive={pathname === '/notifications'}>
            Notifications
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiBook} href="/resources" isActive={pathname === '/resources'}>
            Resources
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiHelpCircle} href="/support" isActive={pathname === '/support'}>
            Support
          </NavItem>
        </Box>
        <Box onClick={handleNavClick}>
          <NavItem icon={FiSettings} href="/profile" isActive={pathname === '/profile'}>
            Settings
          </NavItem>
        </Box>
      </VStack>

      {/* User Profile Section */}
      <Box
        borderTop="none"
        p={4}
      >
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              variant="ghost"
              w="full"
              textAlign="left"
              color="purple.900"
              aria-label={`User menu for ${user?.displayName || 'User'}`}
              _hover={{ bg: 'neomorphic.background', boxShadow: 'neo.sm' }}
              _focusVisible={{
                outline: '3px solid',
                outlineColor: 'purple.500',
                outlineOffset: '2px'
              }}
            >
              <HStack gap={3}>
                <Avatar.Root size="sm" bg="purple.600">
                  <Avatar.Fallback>
                    {(user?.displayName || 'U').substring(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <VStack align="start" gap={0} flex={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="purple.900" lineClamp={1}>
                    {user?.displayName || 'User'}
                  </Text>
                  <Text fontSize="xs" color="purple.600" lineClamp={1}>
                    {user?.primaryEmail || 'No email'}
                  </Text>
                </VStack>
              </HStack>
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              value="profile"
              onClick={() => { router.push('/profile'); onClose?.() }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'purple.500',
                outlineOffset: '0px'
              }}
            >
              <Icon as={FiUser} />
              Profile Settings
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              value="logout"
              onClick={handleLogout}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'purple.500',
                outlineOffset: '0px'
              }}
            >
              <Icon as={FiLogOut} />
              Log Out
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Box>
    </Box>
  )
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        h="56px"
        bg="neomorphic.surface"
        borderBottom="none"
        boxShadow="neo.sm"
        zIndex={10}
        px={4}
      >
        <Flex justify="space-between" align="center" h="full">
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient={`linear(to-r, ${colors.brand.deepIndigo}, ${colors.brand.softTeal})`}
            bgClip="text"
          >
            Headspace Genie
          </Text>
          <DrawerRoot
            open={isOpen}
            onOpenChange={(e) => setIsOpen(e.open)}
            placement="start"
            trapFocus={true}
            closeOnEscape={true}
            closeOnInteractOutside={true}
          >
            <Portal>
              <DrawerBackdrop />
              <DrawerContent>
                <DrawerHeader>
                  <DrawerCloseTrigger
                    aria-label="Close navigation menu"
                    _focusVisible={{
                      outline: '3px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px'
                    }}
                  />
                </DrawerHeader>
                <DrawerBody p={0}>
                  <SidebarContent onClose={() => setIsOpen(false)} />
                </DrawerBody>
              </DrawerContent>
            </Portal>
            <DrawerTrigger asChild>
              <IconButton
                aria-label="Open navigation menu"
                variant="ghost"
                colorPalette="purple"
                _focusVisible={{
                  outline: '3px solid',
                  outlineColor: 'purple.500',
                  outlineOffset: '2px'
                }}
              >
                <Icon as={FiMenu} boxSize={6} />
              </IconButton>
            </DrawerTrigger>
          </DrawerRoot>
        </Flex>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        w="240px"
        h="100vh"
        position="fixed"
        left={0}
        top={0}
        zIndex={5}
      >
        <SidebarContent />
      </Box>
    </>
  )
}
