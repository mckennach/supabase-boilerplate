import React from 'react'

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string
  submark?: boolean
  className?: string
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ size = 24, submark = false, className, ...props }, ref) => {
    return (
      <div className={`w-[${size}px] h-[${size}px]`} ref={ref} {...props}>
        {submark ? (
          <svg
            width={`${size}px`}
            height={`${size}px`}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 100 100'
          >
            <circle cx='50' cy='50' r='50' strokeWidth='0px' fill='#facc15' />
            <circle
              cx='28.5'
              cy='41.5'
              r='15.5'
              strokeWidth='0px'
              fill='#fff'
            />
          </svg>
        ) : (
          <svg
            width={`${size}px`}
            height='100%'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 256.07 100'
          >
            <g>
              <circle className='logo-2' cx='50' cy='50' r='50' />
              <circle className='logo-3' cx='28.5' cy='41.5' r='15.5' />
            </g>
            <text className='logo-1' transform='translate(104.9 67.77)'>
              <tspan x='0' y='0'>
                ch
              </tspan>
              <tspan className='logo-4' x='64.72' y='0'>
                r
              </tspan>
              <tspan x='84.93' y='0'>
                ap
              </tspan>
            </text>
          </svg>
        )}
      </div>
    )
  }
)
