'use client'

import { cn } from '@/lib/utils'
import { Select as BaseSelect } from '@base-ui/react'
import { useMemo } from 'react'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  label: string
  /** `null` means the empty option (“All”) is selected. */
  value: string | null
  onValueChange: (next: string | null) => void
  options: SelectOption[]
  emptyLabel?: string
  className?: string
}

const itemClass =
  'ts-h5 grid grid-cols-[0.75em_1fr] items-center gap-2 cursor-pointer px-gut-50 py-gut-25 text-left hover:bg-bg-subtle rounded-[3px]'

export default function Select({
  label,
  value,
  onValueChange,
  options,
  emptyLabel = 'All',
  className,
}: SelectProps) {
  const stringValue = value ?? ''

  const items = useMemo(
    () => [
      { label: emptyLabel, value: '' },
      ...options.map((o) => ({ label: o.label, value: o.value })),
    ],
    [emptyLabel, options]
  )

  return (
    <div
      className={cn(
        'flex flex-col w-full gap-gut-25 corner-container',
        className
      )}
    >
      <BaseSelect.Root
        items={items}
        value={stringValue}
        onValueChange={(v) => onValueChange(v === '' ? null : v)}
        modal={false}
      >
        <BaseSelect.Label className="ts-p-sm">{label}</BaseSelect.Label>
        <BaseSelect.Trigger
          className={cn(
            'flex w-full max-w-full items-center justify-between gap-[.2em]',
            'border corner py-[.25em] px-[.6em] text-left ts-h5'
          )}
        >
          <BaseSelect.Value placeholder={emptyLabel} />
          <BaseSelect.Icon className="shrink-0 text-neutral-500">
            <CaretIcon />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            alignItemWithTrigger={false}
            className="z-1100"
          >
            <BaseSelect.Popup
              className={cn(
                'max-h-[min(18rem,40vh)] min-w-(--anchor-width) overflow-auto',
                'border bg-bg p-5 mt-gut-25 corner transition-all',
                'data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 origin-top'
              )}
            >
              <BaseSelect.List>
                <BaseSelect.Item value="" className={itemClass}>
                  <BaseSelect.ItemIndicator className="col-start-1">
                    <CheckIcon />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText className="col-start-2">
                    {emptyLabel}
                  </BaseSelect.ItemText>
                </BaseSelect.Item>
                {options.map((opt) => (
                  <BaseSelect.Item
                    key={opt.value}
                    value={opt.value}
                    className={itemClass}
                  >
                    <BaseSelect.ItemIndicator className="col-start-1">
                      <CheckIcon />
                    </BaseSelect.ItemIndicator>
                    <BaseSelect.ItemText className="col-start-2">
                      {opt.label}
                    </BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  )
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentcolor"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className="size-12"
      {...props}
    >
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}

function CaretIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      className="size-12 text-body"
      {...props}
    >
      <path
        d="M13.25 0.75L7 7L0.75 0.75"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
