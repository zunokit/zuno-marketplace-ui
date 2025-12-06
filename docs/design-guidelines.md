# Design Guidelines & Component System

## Overview

This document outlines the design guidelines and component system for the Zuno NFT Marketplace. It establishes the visual language, interaction patterns, and component standards that ensure a cohesive and exceptional user experience across all features of the platform.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Visual Design System](#visual-design-system)
- [Component Library](#component-library)
- [Component Patterns](#component-patterns)
- [Responsive Design](#responsive-design)
- [Interaction Design](#interaction-design)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Animation Guidelines](#animation-guidelines)
- [Dark Mode Guidelines](#dark-mode-guidelines)
- [Brand Guidelines](#brand-guidelines)

## Design Philosophy

### Core Principles

1. **User-Centric**: Every design decision should prioritize user needs and experiences
2. **Clarity & Simplicity**: Clean, intuitive interfaces that reduce cognitive load
3. **Consistency**: Unified design language across all features and interactions
4. **Performance**: Fast, responsive interactions that feel native
5. **Accessibility**: Inclusive design that works for everyone

### Design Principles in Action

#### 1. Clarity First
- Clear visual hierarchy to guide user attention
- Simple, readable typography
- Intuitive navigation and information architecture
- Meaningful micro-interactions that provide feedback

#### 2. Consistency & Standards
- Reusable components with predictable behavior
- Consistent spacing and sizing
- Unified color palette and typography scale
- Standardized interaction patterns

#### 3. Accessibility by Default
- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Screen reader compatibility
- Responsive design for all devices

## Visual Design System

### Color System

#### Primary Colors
```typescript
// src/shared/theme/colors.ts
const colors = {
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#7DD3FC',
    300: '#38BDF8',
    400: '#0EA5E9',
    500: '#0284C7',
    600: '#0369A1',
    700: '#075985',
    800: '#0C4A6E',
    900: '#082F49',
    950: '#0E1F3A',
  },
  secondary: {
    // ... secondary colors
  },
  success: {
    // ... success colors
  },
  warning: {
    // ... warning colors
  },
  error: {
    // ... error colors
  },
  neutral: {
    // ... neutral grays
  },
};
```

#### Color Usage Guidelines

```typescript
// Do's and Don'ts
// ✅ Use primary colors for:
//    - Primary CTAs (Buy, Mint, Connect)
//    - Active states and selections
//    - Important notifications

// ❌ Avoid primary colors for:
//    - Background elements
//    - Less important text
//    - Decorative elements

// ✅ Use neutral colors for:
//    - Text and backgrounds
//    - Dividers and borders
//    - Supporting elements

// ❌ Avoid neutral colors for:
//    - Primary CTAs
//    - Important alerts
//    - Interactive elements
```

### Typography System

#### Font Scale
```typescript
// src/shared/theme/typography.ts
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};
```

#### Typography Hierarchy

```typescript
// Headings
<h1 className="text-5xl font-bold text-gray-900">Heading 1</h1>
<h2 className="text-3xl font-bold text-gray-900">Heading 2</h2>
<h3 className="text-2xl font-semibold text-gray-900">Heading 3</h3>
<h4 className="text-xl font-semibold text-gray-900">Heading 4</h4>

// Body Text
<p className="text-lg text-gray-700">Large body text</p>
<p className="text-base text-gray-700">Body text</p>
<p className="text-sm text-gray-600">Small body text</p>

// Captions & Labels
<p className="text-xs text-gray-500">Caption text</p>
<label className="text-sm font-medium text-gray-700">Label text</label>
```

### Spacing System

#### Spacing Scale
```typescript
// src/shared/theme/spacing.ts
const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  2: '0.5rem',       // 8px
  3: '0.75rem',      // 12px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  8: '2rem',         // 32px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  32: '8rem',        // 128px
};
```

#### Spacing Guidelines

```typescript
// Consistent spacing creates visual rhythm
const Card = () => (
  <div className="p-6">           // 1rem padding
    <h3 className="mb-4">       // 1rem margin bottom
      Card Title
    </h3>
    <p className="mb-6">         // 1.5rem margin bottom
      Card content
    </p>
    <button className="px-6 py-3"> // 1rem horizontal, 0.75rem vertical
      Action
    </button>
  </div>
);
```

### Border Radius System

```typescript
const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};
```

## Component Library

### Shadcn/ui Integration

#### Base Components

```typescript
// src/shared/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### Custom Components

```typescript
// src/shared/components/NFTCard.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NFTCardProps {
  nft: NFT
  onClick?: () => void
  showPrice?: boolean
  className?: string
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onClick,
  showPrice = true,
  className,
}) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Price Badge */}
        {showPrice && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/80 text-white">
              {nft.price} ETH
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{nft.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {nft.description}
        </p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {nft.ownerCount} owners
          </span>
          {nft.floorPrice && (
            <span className="text-sm font-medium">
              Floor: {nft.floorPrice} ETH
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
```

### Form Components

#### Form Component Pattern
```typescript
// src/shared/components/forms/Input.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

#### Form Integration
```typescript
// src/shared/components/forms/NFTMintForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const mintSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  price: z.string().regex(/^\d+(\.\d+)?$/),
  quantity: z.number().min(1).max(100),
})

export const NFTMintForm = () => {
  const form = useForm<z.infer<typeof mintSchema>>({
    resolver: zodResolver(mintSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: 1,
    },
  })

  const onSubmit = (values: z.infer<typeof mintSchema>) => {
    // Handle mint submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NFT Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter NFT name" {...field} />
              </FormControl>
              <FormDescription>
                This will be the public name of your NFT.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* More form fields */}

        <Button type="submit" className="w-full">
          Mint NFT
        </Button>
      </form>
    </Form>
  )
}
```

## Component Patterns

### 1. Layout Components

#### Container Component
```typescript
// src/shared/components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
}) => {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}
```

#### Grid Component
```typescript
// src/shared/components/layout/Grid.tsx
interface GridProps {
  children: React.ReactNode
  cols?: number
  gap?: number
  className?: string
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 6,
  className,
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  const gapClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  }

  return (
    <div
      className={cn(
        'grid',
        gridClasses[cols as keyof typeof gridClasses],
        gapClasses[gap as keyof typeof gapClasses],
        className
      )}
    >
      {children}
    </div>
  )
}
```

### 2. Data Display Components

#### Table Component
```typescript
// src/shared/components/Table.tsx
interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
  sortable?: boolean
}

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  className?: string
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  className,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full', className)}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key as string}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 3. Feedback Components

#### Loading Spinner
```typescript
// src/shared/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
        sizeClasses[size],
        className
      )}
    />
  )
}
```

#### Toast Notifications
```typescript
// src/shared/components/Toast.tsx
interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-dismiss toast
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircleIcon,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: XCircleIcon,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: ExclamationTriangleIcon,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: InformationCircleIcon,
    },
  }

  const Icon = typeConfig[type].icon

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        typeConfig[type].bgColor,
        typeConfig[type].borderColor
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={cn(
              'h-5 w-5',
              typeConfig[type].textColor
            )}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3
            className={cn(
              'text-sm font-medium',
              typeConfig[type].textColor
            )}
          >
            {title}
          </h3>
          {message && (
            <div
              className={cn(
                'mt-1 text-sm',
                typeConfig[type].textColor
              )}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

## Responsive Design

### Breakpoint System
```typescript
// src/shared/theme/breakpoints.ts
const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large desktop
}
```

### Responsive Component Example
```typescript
// src/shared/components/ResponsiveGrid.tsx
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: {
    sm?: number
    md?: number
    lg?: number
  }
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = { sm: 4, md: 6, lg: 8 },
}) => {
  const gridClasses = [
    `grid`,
    `grid-cols-${cols.sm}`,
    `md:grid-cols-${cols.md}`,
    `lg:grid-cols-${cols.lg}`,
    `xl:grid-cols-${cols.xl}`,
    `gap-${gap.sm}`,
    `md:gap-${gap.md}`,
    `lg:gap-${gap.lg}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}
```

### Responsive Images
```typescript
// src/shared/components/ResponsiveImage.tsx
interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={cn(
        'w-full h-full object-cover',
        className
      )}
    />
  )
}
```

## Interaction Design

### Hover States
```typescript
// src/shared/components/HoverCard.tsx
export const HoverCard = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card content */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
      )}
    </div>
  )
}
```

### Focus States
```typescript
// src/shared/components/FocusableCard.tsx
export const FocusableCard: React.FC<FocusableCardProps> = ({ children, onClick }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      tabIndex={0}
      className={cn(
        'p-4 rounded-lg border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isFocused
          ? 'border-primary-300 shadow-md'
          : 'border-gray-200'
      )}
      onClick={onClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {children}
    </div>
  )
}
```

### Loading States
```typescript
// src/shared/components/SkeletonLoader.tsx
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

// Usage in components
export const NFTCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-lg" />
    <div className="space-y-2 mt-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
)
```

## Accessibility Guidelines

### ARIA Implementation
```typescript
// src/shared/components/AccessibleModal.tsx
export const AccessibleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement

      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        role="document"
      >
        <div className="p-6">
          <h2
            id="modal-title"
            className="text-xl font-semibold"
          >
            {title}
          </h2>
          <div className="mt-4">
            {children}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              ref={firstFocusableRef}
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button onClick={onClose}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Keyboard Navigation
```typescript
// src/shared/components/KeyboardNavigation.tsx
export const useKeyboardNavigation = (
  items: any[],
  options: {
    onSelect?: (item: any) => void
    orientation?: 'horizontal' | 'vertical'
    loop?: boolean
  } = {}
) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { onSelect, orientation = 'vertical', loop = true } = options

  const handleKeyDown = (e: KeyboardEvent) => {
    const itemCount = items.length
    let newIndex = selectedIndex

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = selectedIndex + 1
        if (newIndex >= itemCount && loop) newIndex = 0
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = selectedIndex - 1
        if (newIndex < 0 && loop) newIndex = itemCount - 1
        break
      case 'Enter':
      case ' ':
        if (onSelect && items[selectedIndex]) {
          onSelect(items[selectedIndex])
        }
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = itemCount - 1
        break
      default:
        return
    }

    if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < itemCount) {
      setSelectedIndex(newIndex)
    }
  }

  return {
    selectedIndex,
    setIndex: setSelectedIndex,
    handleKeyDown,
  }
}
```

### Focus Management
```typescript
// src/shared/hooks/useFocusTrap.tsx
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef])
}
```

## Animation Guidelines

### Framer Motion Integration
```typescript
// src/shared/components/animations/AnimatedCard.tsx
import { motion } from 'framer-motion'
import { useState } from 'react'

export const AnimatedCard = ({ children, ...props }: AnimatedCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer"
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

### Page Transitions
```typescript
// src/shared/components//PageTransition.tsx
import { AnimatePresence, motion } from 'framer-motion'

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  location,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Micro-interactions
```typescript
// src/shared/components/Button.tsx
export const AnimatedButton = ({ children, ...props }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

## Dark Mode Guidelines

### Theme Configuration
```typescript
// src/shared/theme/theme.ts
const theme = {
  light: {
    background: 'white',
    foreground: '#0f172a',
    card: {
      DEFAULT: 'white',
      foreground: '#0f172a',
    },
    popover: {
      DEFAULT: 'white',
      foreground: '#0f172a',
    },
    primary: {
      DEFAULT: '#0284c7',
      foreground: 'white',
    },
    // ... more light theme colors
  },
  dark: {
    background: '#0f172a',
    foreground: '#f8fafc',
    card: {
      DEFAULT: '#1e293b',
      foreground: '#f8fafc',
    },
    popover: {
      DEFAULT: '#1e293b',
      foreground: '#f8fafc',
    },
    primary: {
      DEFAULT: '#0ea5e9',
      foreground: 'white',
    },
    // ... more dark theme colors
  },
}

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme }
}
```

### Theme-aware Components
```typescript
// src/shared/components/ThemeAwareCard.tsx
export const ThemeAwareCard: React.FC<ThemeAwareCardProps> = ({ children, ...props }) => {
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        'rounded-lg border transition-colors',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## Brand Guidelines

### Logo Usage
```typescript
// src/shared/components/Logo.tsx
export const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-20 h-6',
    md: 'w-32 h-10',
    lg: 'w-48 h-14',
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      <svg viewBox="0 0 200 50" className="w-full h-full">
        {/* Logo SVG content */}
        <text
          x="0"
          y="35"
          fontSize="32"
          fontWeight="bold"
          fill="currentColor"
          className="font-sans"
        >
          ZUNO
        </text>
      </svg>
    </div>
  )
}
```

### Color Usage for Brand Elements
```typescript
// Brand colors for consistent application
const brandColors = {
  primary: {
    light: '#0284c7',
    dark: '#0ea5e9',
  },
  secondary: {
    light: '#7c3aed',
    dark: '#8b5cf6',
  },
  accent: {
    light: '#dc2626',
    dark: '#ef4444',
  },
}
```

### Typography for Brand Voice
```typescript
// Brand typography guide
const brandTypography = {
  headings: {
    // Bold, clean, modern
    h1: 'text-5xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
  },
  body: {
    // Clean and readable
    large: 'text-lg text-gray-700',
    normal: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
  },
  captions: {
    // Subtle and informative
    regular: 'text-xs text-gray-500',
  },
}
```

This comprehensive design guidelines document establishes the foundation for creating a cohesive, accessible, and visually appealing user experience across the Zuno NFT Marketplace. All design decisions should reference and adhere to these guidelines while maintaining flexibility for creative solutions.