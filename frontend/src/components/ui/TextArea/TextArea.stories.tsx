import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta = {
  title: 'UI/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Multi-line text input with optional label, validation error, and helper text.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '24rem' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    label: 'Descripción',
    placeholder: 'Escribe aquí…',
    rows: 4,
    disabled: false,
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    label: 'Contenido del post',
    placeholder: 'Redacta el contenido…',
    helperText: 'Máximo 2,200 caracteres para Instagram.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Contenido',
    error: 'El contenido es obligatorio.',
    defaultValue: '',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Descripción',
    defaultValue: 'Este campo está bloqueado.',
    disabled: true,
  },
};

export const Large: Story = {
  args: {
    label: 'Briefing de campaña',
    placeholder: 'Describe la campaña en detalle…',
    rows: 8,
  },
};
