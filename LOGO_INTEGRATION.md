# Logo Integration Guide

## How to Add Your Logo

### 1. Add Logo Files to Public Folder

Place your logo files in the `/public` folder:

```
public/
├── logo.png          # Main logo (recommended: 512x512px or higher)
├── logo.svg          # Vector version (optional, better for scaling)
├── favicon.ico       # Browser tab icon (16x16px, 32x32px, 48x48px)
├── favicon.png       # Alternative favicon (32x32px)
└── apple-touch-icon.png  # iOS home screen icon (180x180px)
```

### 2. Update Logo Component

In `/app/components/ui/logo.tsx`, uncomment and update the Image component:

```tsx
// Replace this placeholder:
<div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
  <span className="text-white font-bold text-xs">LOGO</span>
</div>

// With this (uncomment the Image component):
<Image
  src="/logo.png"  // or "/logo.svg" for vector
  alt="Alchera Logo"
  fill
  className="object-contain"
  priority
/>
```

### 3. Logo Variants Available

The Logo component supports different variants:

- **`variant="default"`**: Full logo with text (main branding)
- **`variant="minimal"`**: Compact logo with abbreviated text
- **`variant="text-only"`**: Text-only version

### 4. Size Options

- **`size="sm"`**: Small (32x32px)
- **`size="md"`**: Medium (48x48px) 
- **`size="lg"`**: Large (64x64px)
- **`size="xl"`**: Extra Large (96x96px)

### 5. Usage Examples

```tsx
// Main header logo
<Logo size="md" variant="minimal" />

// Large hero logo
<Logo size="xl" variant="default" />

// Text-only for mobile
<Logo size="sm" variant="text-only" />
```

### 6. Animation Options

The logo includes smooth animations by default. To disable:

```tsx
<Logo animated={false} />
```

## Current Implementation

The logo is currently integrated in:
- Main page header (minimal variant)
- Browser tab (favicon)
- Ready for additional placements

## Design Considerations

- Logo should work well on dark backgrounds
- Consider creating a light version for potential light mode
- Ensure logo is readable at small sizes (favicon)
- Vector format (SVG) recommended for best quality at all sizes
