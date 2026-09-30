/**
 * CMS text fields allow one piece of inline markup: `[phrase](target)`.
 * `wa:message` targets open WhatsApp on the site's number with that message pre-filled,
 * so the number lives in one place; anything else is used as the address as written.
 */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

export type InlinePart = { text: string } | { label: string; target: string }

export const parseInline = (text: string): InlinePart[] => {
  const parts: InlinePart[] = []
  let last = 0

  for (const match of text.matchAll(LINK)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) })
    parts.push({ label: match[1], target: match[2] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })

  return parts
}

/** The text as read aloud, link phrases kept and their targets dropped. For structured data. */
export const stripInline = (text: string): string => text.replace(LINK, '$1')
