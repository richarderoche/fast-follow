'use client'
import { cn } from '@/lib/utils'
import { SettingsQueryResult } from '@/sanity.types'
import { useState } from 'react'
import IconCopy from '../icons/IconCopy'

export default function Contact({ data }: { data: SettingsQueryResult }) {
  const { contactGeneral, contactTeam } = data || {}
  const hasTeam = contactTeam && contactTeam.length > 0
  const longEmail = contactGeneral && contactGeneral.length > 22 ? true : false
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = () => {
    setIsCopying(true)
    navigator.clipboard.writeText(contactGeneral || '')
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  }

  return (
    <div className="mt-gut-200 flex flex-col gap-gut px-gut">
      {contactGeneral && (
        <div className="corner-container">
          <button
            type="button"
            className="flex flex-col text-left w-full border border-divider corner p-gut-75 hover:bg-bg-subtle transition-colors disabled:opacity-80 disabled:pointer-events-none"
            onClick={handleCopy}
            disabled={isCopying}
          >
            <p className={cn('text-body-subtle', longEmail && 'ts-p-sm')}>
              {isCopying ? 'Talk Soon!' : 'General Inquiries'}
            </p>
            <div
              className={cn(
                'flex justify-between items-center gap-gut-50',
                longEmail ? 'ts-h4' : 'ts-h3'
              )}
            >
              <p>{isCopying ? 'Copied to Clipboard' : contactGeneral}</p>
              <IconCopy className="size-[.8em]" />
            </div>
          </button>
        </div>
      )}

      {hasTeam && (
        <div>
          <h3 className="text-body-subtle mb-gut-50">Our Team</h3>
          <div className="flex flex-col gap-gut">
            {contactTeam.map((teamMember) => {
              const { _key, name, role, email, phone } = teamMember
              const hasContactInfo = email || phone
              return (
                <div className="border-t border-divider pt-gut-75" key={_key}>
                  {role && <p className="ts-p-sm text-body-subtle">{role}</p>}
                  <p className="ts-h4">{name}</p>
                  {hasContactInfo && (
                    <div className="flex justify-between gap-gut-50 ts-p-sm mt-gut-25">
                      {email && (
                        <a
                          rel="noreferrer noopener"
                          target="_blank"
                          href={`mailto:${email}`}
                          className="inline-link-stealth"
                        >
                          {email}
                        </a>
                      )}
                      {phone && <p className="">{phone}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
