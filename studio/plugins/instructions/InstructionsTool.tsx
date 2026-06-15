import { Box, Card, Code, Container, Heading, Text } from '@sanity/ui'
import { useMemo, useRef } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import instructions from '../../INSTRUCTIONS.md?raw'

const readableTextStyle = {
  maxWidth: '80ch',
  textWrap: 'pretty',
} as const

const MarkdownBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li > p {
    display: inline;
    margin: 0;
  }

  li > p + p {
    display: block;
    margin-top: 0.5em;
  }
`

const headingMarginTop = {
  h1: 4,
  h2: 4,
  h3: 4,
  h4: 3,
} as const

function createMarkdownComponents(isFirstBlock: {
  current: boolean
}): Components {
  const consumeFirstBlock = () => {
    const isFirst = isFirstBlock.current
    if (isFirstBlock.current) {
      isFirstBlock.current = false
    }
    return isFirst
  }

  const heading = (
    level: keyof typeof headingMarginTop,
    as: 'h1' | 'h2' | 'h3' | 'h4',
    size: 1 | 2 | 4
  ) =>
    function HeadingComponent({ children }: { children?: React.ReactNode }) {
      const marginTop = consumeFirstBlock() ? 0 : headingMarginTop[level]

      return (
        <Box marginTop={marginTop}>
          <Heading as={as} size={size} style={{ marginBottom: '.3em' }}>
            {children}
          </Heading>
        </Box>
      )
    }

  return {
    h1: heading('h1', 'h1', 4),
    h2: heading('h2', 'h2', 2),
    h3: heading('h3', 'h3', 1),
    h4: heading('h4', 'h4', 1),
    p: ({ children }) => {
      consumeFirstBlock()
      return (
        <Text as="p" size={2} style={{ margin: 0, ...readableTextStyle }}>
          {children}
        </Text>
      )
    },
    strong: ({ children }) => (
      <Text as="span" weight="semibold">
        {children}
      </Text>
    ),
    em: ({ children }) => (
      <Text as="span" style={{ fontStyle: 'italic' }}>
        {children}
      </Text>
    ),
    ul: ({ children }) => {
      consumeFirstBlock()
      return (
        <Box
          as="ul"
          padding={0}
          style={{
            listStyleType: 'disc',
            listStylePosition: 'outside',
            paddingInlineStart: '1.25em',
            color: 'var(--card-fg-color)',
            margin: 0,
          }}
        >
          {children}
        </Box>
      )
    },
    ol: ({ children }) => {
      consumeFirstBlock()
      return (
        <Box
          as="ol"
          padding={0}
          style={{
            listStyleType: 'decimal',
            listStylePosition: 'outside',
            paddingInlineStart: '1.25em',
            color: 'var(--card-fg-color)',
            margin: 0,
          }}
        >
          {children}
        </Box>
      )
    },
    li: ({ children }) => (
      <Text
        as="li"
        size={2}
        style={{
          display: 'list-item',
          paddingTop: '.7em',
          paddingBottom: '.7em',
          ...readableTextStyle,
        }}
      >
        {children}
      </Text>
    ),
    blockquote: ({ children }) => {
      consumeFirstBlock()
      return (
        <Card padding={3} radius={2} border tone="transparent">
          <Text size={2} muted>
            {children}
          </Text>
        </Card>
      )
    },
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{
          color: 'var(--card-link-fg-color)',
          textDecoration: 'underline',
          display: 'inline-block',
        }}
      >
        {children}
      </a>
    ),
    hr: () => {
      consumeFirstBlock()
      return (
        <Box
          marginY={4}
          style={{ borderTop: '1px solid var(--card-border-color)' }}
        />
      )
    },
    code: ({ className, children }) => {
      const isBlock = Boolean(className)

      if (isBlock) {
        consumeFirstBlock()
        return (
          <Card padding={3} radius={2} tone="transparent" border>
            <Code size={1}>{String(children).replace(/\n$/, '')}</Code>
          </Card>
        )
      }

      return <Code size={1}>{children}</Code>
    },
    table: ({ children }) => {
      consumeFirstBlock()
      return (
        <Box overflow="auto">
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: 'var(--card-fg-color)',
            }}
          >
            {children}
          </table>
        </Box>
      )
    },
    thead: ({ children }) => <thead>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr style={{ borderBottom: '1px solid var(--card-border-color)' }}>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th
        style={{
          display: 'table-cell',
          textAlign: 'left',
          padding: '0.5rem 0.75rem',
          fontWeight: 600,
          fontSize: '0.8125rem',
          verticalAlign: 'top',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        style={{
          display: 'table-cell',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          verticalAlign: 'top',
        }}
      >
        {children}
      </td>
    ),
  }
}

export function InstructionsTool() {
  const isFirstBlock = useRef(true)
  isFirstBlock.current = true

  const markdownComponents = useMemo(
    () => createMarkdownComponents(isFirstBlock),
    []
  )

  return (
    <Box height="fill" overflow="auto">
      <Container width={2} padding={4}>
        <Card padding={4} radius={2} shadow={1}>
          <MarkdownBody>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {instructions}
            </ReactMarkdown>
          </MarkdownBody>
        </Card>
      </Container>
    </Box>
  )
}
