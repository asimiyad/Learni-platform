export function LogoIcon({ className, color = "currentColor", strokeWidth = 5 }: { className?: string, color?: string, strokeWidth?: number }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Top arc */}
      <path d="M 45 27 A 32 32 0 0 1 61 29" />
      
      {/* Left arc */}
      <path d="M 27 38 A 38 38 0 0 0 35 75" />
      
      {/* Pencil Top */}
      <path d="M 32 35 L 44 35" />
      <path d="M 32 35 L 38 20 L 44 35 Z" />
      <path d="M 35 27 L 38 20 L 41 27 Z" fill={color} stroke="none" />
      
      {/* Pencil Body */}
      <path d="M 32 35 L 32 65" />
      <path d="M 44 35 L 44 65" />
      <path d="M 38 35 L 38 65" />
      
      {/* Paintbrush Handle (Swoop) */}
      <path d="M 30 70 C 45 80 50 65 58 48" />
      <path d="M 35 75 C 50 85 58 70 65 53" />
      
      {/* Paintbrush Ferrule */}
      <path d="M 56 47 L 62 43 L 67 51 L 61 55 Z" />
      
      {/* Paintbrush Tip */}
      <path d="M 62 43 C 62 25 75 22 75 22 C 75 22 78 35 67 51 Z" fill={color} stroke="none" />
    </svg>
  )
}
