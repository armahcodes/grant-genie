# Chakra UI v3 Migration Guide for Grant Genie

## Summary of Changes Made

✅ **Completed Files:**
- app/compliance-tracker/page.tsx
- app/page.tsx
- app/grant-application/page.tsx (with React Hook Form)
- components/auth/LoginModal.tsx
- components/auth/SignupModal.tsx
- components/auth/ProtectedRoute.tsx
- components/layout/MainLayout.tsx
- components/layout/Sidebar.tsx
- components/Sidebar.tsx
- app/providers.tsx

## ✅ ALL FILES COMPLETED!

All files have been successfully migrated to Chakra UI v3:

**Pages:**
- ✅ app/landing/page.tsx
- ✅ app/grant-search/page.tsx
- ✅ app/notifications/page.tsx
- ✅ app/profile/page.tsx
- ✅ app/reporting/page.tsx
- ✅ app/resources/page.tsx
- ✅ app/settings/page.tsx
- ✅ app/support/page.tsx
- ✅ app/compliance-tracker/page.tsx
- ✅ app/page.tsx (dashboard)
- ✅ app/grant-application/page.tsx

**Components:**
- ✅ components/auth/LoginModal.tsx
- ✅ components/auth/SignupModal.tsx
- ✅ components/auth/ProtectedRoute.tsx
- ✅ components/layout/MainLayout.tsx
- ✅ components/layout/Sidebar.tsx
- ✅ components/Sidebar.tsx
- ✅ app/providers.tsx

## Common Migration Patterns

### 1. Import Changes

**Remove:**
```typescript
import { FormControl, FormLabel, Divider, useColorModeValue } from '@chakra-ui/react'
```

**Add:**
```typescript
import { Field, Separator } from '@chakra-ui/react'
```

### 2. Component Replacements

| Old (v2) | New (v3) |
|----------|---------|
| `<Card>` | `<Card.Root>` |
| `<CardHeader>` | `<Card.Header>` |
| `<CardBody>` | `<Card.Body>` |
| `<FormControl>` | `<Field.Root>` |
| `<FormLabel>` | `<Field.Label>` |
| `<Select>` | `<NativeSelectRoot><NativeSelectField>` |
| `<Table>` | `<Table.Root>` |
| `<Thead>` | `<Table.Header>` |
| `<Tbody>` | `<Table.Body>` |
| `<Tr>` | `<Table.Row>` |
| `<Th>` | `<Table.ColumnHeader>` |
| `<Td>` | `<Table.Cell>` |
| `<Tabs>` | `<Tabs.Root>` |
| `<TabList>` | `<Tabs.List>` |
| `<Tab>` | `<Tabs.Trigger>` |
| `<TabPanels>` | `<Tabs.ContentGroup>` |
| `<TabPanel>` | `<Tabs.Content>` |
| `<Modal>` | `<Dialog.Root>` |
| `<ModalOverlay>` | `<Dialog.Backdrop>` |
| `<ModalContent>` | `<Dialog.Content>` (wrapped in `<Dialog.Positioner>`) |
| `<ModalHeader>` | `<Dialog.Header>` |
| `<ModalBody>` | `<Dialog.Body>` |
| `<ModalCloseButton>` | `<Dialog.CloseTrigger>` |
| `<Menu>` | `<MenuRoot>` |
| `<MenuButton>` | `<MenuTrigger>` |
| `<MenuList>` | `<MenuContent>` |
| `<MenuDivider>` | `<MenuSeparator>` |
| `<Checkbox>` | `<Checkbox.Root>` with `<Checkbox.Control>`, `<Checkbox.Label>` |
| `<Avatar>` | `<Avatar.Root>` with `<Avatar.Fallback>` |
| `<Progress>` | `<Progress.Root>` with `<Progress.Track>`, `<Progress.Range>` |
| `<Divider>` | `<Separator>` |

### 3. Prop Changes

| Old Prop | New Prop | Notes |
|----------|----------|-------|
| `spacing` | `gap` | On Stack components (VStack, HStack) |
| `isLoading` | `loading` | On Button |
| `isChecked` | `checked` | On Checkbox |
| `noOfLines` | `lineClamp` | On Text |
| `leftIcon` | Wrap icon as child | Button icons go inside |
| `icon` | Wrap as child | IconButton - put Icon as child |
| `isCentered` | `placement="center"` | Dialog |
| `isOpen` | `open` | Dialog |
| `onClose` | `onOpenChange={(e) => !e.open && onClose()}` | Dialog |

### 4. Removed Features

- `useColorModeValue()` - Replace with hard-coded values or custom theme
- Table variant `"simple"` - Use `"outline"` or `"line"` instead

### 5. Select Component Pattern

**Old:**
```tsx
<FormControl>
  <FormLabel>Label</FormLabel>
  <Select placeholder="Choose">
    <option value="1">Option 1</option>
  </Select>
</FormControl>
```

**New:**
```tsx
<Field.Root>
  <Field.Label>Label</Field.Label>
  <NativeSelectRoot>
    <NativeSelectField placeholder="Choose">
      <option value="1">Option 1</option>
    </NativeSelectField>
  </NativeSelectRoot>
</Field.Root>
```

### 6. Checkbox Pattern

**Old:**
```tsx
<Checkbox isChecked={value} onChange={(e) => setValue(e.target.checked)}>
  Label
</Checkbox>
```

**New:**
```tsx
<Checkbox.Root checked={value} onCheckedChange={(e: any) => setValue(!!e.checked)}>
  <Checkbox.HiddenInput />
  <Checkbox.Control />
  <Checkbox.Label>Label</Checkbox.Label>
</Checkbox.Root>
```

### 7. Dialog/Modal Pattern

**Old:**
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalCloseButton />
    <ModalBody>Content</ModalBody>
  </ModalContent>
</Modal>
```

**New:**
```tsx
<Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>Title</Dialog.Header>
      <Dialog.CloseTrigger />
      <Dialog.Body>Content</Dialog.Body>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

### 8. IconButton Pattern

**Old:**
```tsx
<IconButton aria-label="Add" icon={<AddIcon />} />
```

**New:**
```tsx
<IconButton aria-label="Add">
  <AddIcon />
</IconButton>
```

### 9. Button with Icon Pattern

**Old:**
```tsx
<Button leftIcon={<AddIcon />}>Add Item</Button>
```

**New:**
```tsx
<Button>
  <AddIcon />
  Add Item
</Button>
```

## React Hook Form Integration Pattern

For forms, use React Hook Form:

```typescript
import { useForm } from 'react-hook-form'

interface FormData {
  field1: string
  field2: string
}

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field.Root required>
        <Field.Label>Field 1</Field.Label>
        <Input {...register('field1', { required: true })} />
      </Field.Root>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Quick Fix Checklist for Each File

1. ✅ Update imports - remove old components, add new ones
2. ✅ Replace `spacing` with `gap` on all Stack components
3. ✅ Replace `Card` with `Card.Root`, `Card.Header`, `Card.Body`
4. ✅ Replace `FormControl/FormLabel` with `Field.Root/Field.Label`
5. ✅ Replace `Select` with `NativeSelectRoot/NativeSelectField`
6. ✅ Fix IconButton - move icon inside as child
7. ✅ Fix Button with leftIcon - move icon inside as child
8. ✅ Replace `Modal` with `Dialog.Root` and sub-components
9. ✅ Replace `Table` components with namespaced versions
10. ✅ Replace `Tabs` components with namespaced versions
11. ✅ Remove `useColorModeValue` - use hard-coded colors
12. ✅ For forms: integrate React Hook Form

## Example: Complete File Conversion

See `app/grant-application/page.tsx` for a complete example of:
- React Hook Form integration
- All Chakra UI v3 components
- Proper form handling
- IconButton usage
- Card components

## ✅ Migration Complete - Zero Errors!

**Error Reduction Progress:**
- Started with: ~500+ TypeScript errors
- After 10 files: 277 errors
- After 14 files: ~180 errors
- **FINAL: 0 errors** ✨

**Total Files Fixed: 18 files**
- 11 page components
- 6 layout/auth components
- 1 provider configuration

**TypeScript Status:** `npx tsc --noEmit` ✅ PASSING

All files have been successfully migrated to Chakra UI v3.28.0!
