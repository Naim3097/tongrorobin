import React from 'react'

import { parseInline } from '@/lib/inlineLinks'
import { waLink } from '@/lib/site'

const WA_PREFIX = 'wa:'

/** Renders a CMS text field, turning `[phrase](target)` into links. */
export function InlineText({ text, whatsappNumber }: { text: string; whatsappNumber: string }) {
  return (
    <>
      {parseInline(text).map((part, i) =>
        'text' in part ? (
          <React.Fragment key={i}>{part.text}</React.Fragment>
        ) : (
          <a
            key={i}
            href={
              part.target.startsWith(WA_PREFIX)
                ? waLink(whatsappNumber, part.target.slice(WA_PREFIX.length))
                : part.target
            }
          >
            {part.label}
          </a>
        ),
      )}
    </>
  )
}

/** A heading or paragraph where each new line in the CMS is a line break on the page. */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </>
  )
}
