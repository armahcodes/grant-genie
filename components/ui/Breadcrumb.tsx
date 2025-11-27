'use client'

import {
  Box,
  Flex,
  Link,
  Text,
  Icon,
} from '@chakra-ui/react'
import { MdChevronRight, MdHome } from 'react-icons/md'
import NextLink from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
}

/**
 * Breadcrumb Component
 * 
 * Displays hierarchical navigation breadcrumbs.
 * Automatically includes a home link and separators between items.
 * 
 * @example
 * <Breadcrumb items={[
 *   { label: 'Grant Application', href: '/grant-application' },
 *   { label: 'Proposal', isCurrentPage: true }
 * ]} />
 */
export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/dashboard' }, ...items]
    : items

  return (
    <Box
      as="nav"
      aria-label="Breadcrumb"
      py={2}
      px={4}
      bg="gray.50"
      borderRadius="md"
      mb={4}
    >
      <Flex align="center" gap={2} flexWrap="wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isHome = index === 0 && showHome

          return (
            <Flex key={index} align="center" gap={2}>
              {item.href && !isLast ? (
                <NextLink href={item.href} passHref legacyBehavior>
                  <Link
                    color="purple.600"
                    fontWeight="medium"
                    fontSize="sm"
                    _hover={{ color: 'purple.700', textDecoration: 'underline' }}
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'purple.500',
                      outlineOffset: '2px',
                      borderRadius: 'sm',
                    }}
                  >
                    <Flex align="center" gap={1}>
                      {isHome && <Icon as={MdHome} />}
                      <span>{item.label}</span>
                    </Flex>
                  </Link>
                </NextLink>
              ) : (
                <Text
                  color={isLast ? 'gray.700' : 'purple.600'}
                  fontWeight={isLast ? 'semibold' : 'medium'}
                  fontSize="sm"
                  aria-current={isLast ? 'page' : undefined}
                >
                  <Flex align="center" gap={1}>
                    {isHome && <Icon as={MdHome} />}
                    <span>{item.label}</span>
                  </Flex>
                </Text>
              )}

              {!isLast && (
                <Icon as={MdChevronRight} color="gray.400" aria-hidden="true" />
              )}
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}