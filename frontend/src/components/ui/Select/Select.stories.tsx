import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

const INDUSTRY_OPTIONS = [
  { value: 'tech', label: 'Tecnología' },
  { value: 'retail', label: 'Comercio' },
  { value: 'health', label: 'Salud' },
  { value: 'education', label: 'Educación' },
  { value: 'food', label: 'Alimentación' },
];

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Native select dropdown with optional label, validation error, and helper text.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '20rem' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Red social',
    options: PLATFORM_OPTIONS,
    placeholder: 'Selecciona una plataforma',
    disabled: false,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    label: 'Sector',
    options: INDUSTRY_OPTIONS,
    placeholder: 'Elige un sector',
    helperText: 'Selecciona el sector principal de tu empresa.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Red social',
    options: PLATFORM_OPTIONS,
    error: 'Debes seleccionar una red social.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Red social',
    options: PLATFORM_OPTIONS,
    disabled: true,
    defaultValue: 'instagram',
  },
};

export const NoLabel: Story = {
  args: {
    label: undefined,
    options: PLATFORM_OPTIONS,
    placeholder: 'Sin etiqueta',
  },
};
