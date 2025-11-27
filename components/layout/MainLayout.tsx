'use client'

import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import SupportGenie from '@/components/SupportGenie'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ProtectedRoute>
      <Flex minH="100vh">
        <Sidebar />
        <Box
          ml={{ base: 0, md: '240px' }}
          mt={{ base: '56px', md: 0 }}
          w={{ base: 'full', md: 'calc(100% - 240px)' }}
          bg="neomorphic.background"
          minH={{ base: 'calc(100vh - 56px)', md: '100vh' }}
        >
          {children}
        </Box>
      </Flex>
      <SupportGenie />
    </ProtectedRoute>
  )
}
