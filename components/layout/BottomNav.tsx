'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapIcon, CalendarIcon, ListIcon, WalletIcon, PackageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  tripId: string
}

const tabs = [
  { label: 'Itinerary', href: 'itinerary', Icon: ListIcon },
  { label: 'Calendar', href: 'calendar', Icon: CalendarIcon },
  { label: 'Map', href: 'map', Icon: MapIcon },
  { label: 'Expenses', href: 'expenses', Icon: WalletIcon },
  { label: 'Checklist', href: 'checklist', Icon: PackageIcon },
]

export function BottomNav({ tripId }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex">
        {tabs.map(({ label, href, Icon }) => {
          const to = `/trips/${tripId}/${href}`
          const active = pathname.startsWith(to)
          return (
            <Link
              key={href}
              href={to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
