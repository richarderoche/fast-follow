import { BookIcon } from '@sanity/icons'
import { definePlugin } from 'sanity'
import { InstructionsTool } from './InstructionsTool'

export const instructionsPlugin = definePlugin({
  name: 'instructions',
  tools: (prev) => [
    ...prev,
    {
      name: 'instructions',
      title: 'Instructions',
      icon: BookIcon,
      component: InstructionsTool,
    },
  ],
})
