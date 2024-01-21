import * as React from 'react'

import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
  text?: string
  colorClass?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'card'
    | 'descructive'
    | 'muted'
}

const TextDivider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, text = 'OR', colorClass = 'default' }, ref) => {
    return (
      <div className={cn(`flex center items-center`, className)} ref={ref}>
        <hr
          className={cn(
            `m-0 h-px grow border-none`,
            `bg-foreground/20`
          )}
        />
        <span
          className={cn(
            `text-12 text-tone-2 px-[1rem]`,
            `text-foreground`
          )}
        >
          {text}
        </span>
        <hr
          className={cn(
            `m-0 h-px grow border-none`,
            colorClass === 'default'
              ? 'bg-foreground/20'
              : `bg-foreground/20`
          )}
        />
      </div>
    )
  }
)

TextDivider.displayName = 'TextDivider'

export { TextDivider }
