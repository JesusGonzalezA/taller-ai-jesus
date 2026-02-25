import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

/** Simple placeholder icons for stories */
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A square button designed to hold a single icon. Always provide an `aria-label` for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'outline', 'primary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    icon: <CloseIcon />,
    'aria-label': 'Close',
    variant: 'ghost',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  args: { variant: 'ghost', icon: <CloseIcon />, 'aria-label': 'Close' },
};

export const Outline: Story = {
  args: { variant: 'outline', icon: <EditIcon />, 'aria-label': 'Edit' },
};

export const Primary: Story = {
  args: { variant: 'primary', icon: <PlusIcon />, 'aria-label': 'Add' },
};

export const Small: Story = {
  args: { size: 'sm', icon: <CloseIcon />, 'aria-label': 'Close' },
};

export const Large: Story = {
  args: { size: 'lg', icon: <EditIcon />, 'aria-label': 'Edit' },
};

export const Disabled: Story = {
  args: { disabled: true, icon: <CloseIcon />, 'aria-label': 'Close' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton icon={<CloseIcon />} aria-label="Ghost" variant="ghost" />
      <IconButton icon={<EditIcon />} aria-label="Outline" variant="outline" />
      <IconButton icon={<PlusIcon />} aria-label="Primary" variant="primary" />
    </div>
  ),
};
