import { Users } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artists',
  type: 'document',
  icon: Users,
  fields: [
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
    defineField({
      name: 'role',
      title: 'Role',
      description:
        'If multiple roles are needed, create a second artist entry.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artistRole' }] }],
      validation: (rule) => rule.max(1),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role.0.title',
    },
    prepare({ firstName, lastName, role }) {
      return { title: `${firstName} ${lastName}`, subtitle: role, media: Users }
    },
  },
})
