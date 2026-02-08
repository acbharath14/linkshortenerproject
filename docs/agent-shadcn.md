# shadcn/ui Component Standards

## Core Principle
- **shadcn/ui is the ONLY UI component library** for this application
- ALL UI elements must use shadcn/ui components
- **Do NOT create custom components** when shadcn/ui provides an equivalent

## Implementation Requirements

### Component Usage
- Always use shadcn/ui components from `@/components/ui`
- Import components from the UI component directory:
  ```typescript
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader } from "@/components/ui/card"
  ```

### Adding New Components
- Use the shadcn CLI to add components:
  ```bash
  npx shadcn@latest add [component-name]
  ```
- Never manually create UI components that shadcn/ui provides
- Check [shadcn/ui components](https://ui.shadcn.com/docs/components) before building custom solutions

### Configuration
- Project uses **"new-york"** style variant
- Tailwind CSS integration with CSS variables enabled
- Base color: **neutral**
- Icon library: **Lucide React**
- RSC (React Server Components) enabled

### Available Component Categories
Use shadcn/ui for:
- **Form elements**: Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- **Buttons**: Button, Toggle, ToggleGroup
- **Layout**: Card, Separator, Tabs, Accordion, Sheet, Dialog
- **Navigation**: NavigationMenu, Menubar, DropdownMenu, ContextMenu
- **Feedback**: Alert, AlertDialog, Toast, Progress, Skeleton
- **Data display**: Table, Avatar, Badge, HoverCard, Tooltip
- **Overlays**: Dialog, Popover, Sheet, AlertDialog

### Customization
- Use Tailwind utility classes for styling variations
- Leverage component props for behavior customization
- Modify component variants through className prop
- Use CSS variables for theme customization (defined in `app/globals.css`)

## Prohibited
- **Do not create custom components** when shadcn/ui provides them
- Do not use other UI libraries (Material-UI, Ant Design, Chakra UI, etc.)
- Do not inline styles unless absolutely necessary
- Do not bypass shadcn/ui for standard UI patterns

## References
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component Examples](https://ui.shadcn.com/docs/components)
- [Installation Guide](https://ui.shadcn.com/docs/installation/next)
