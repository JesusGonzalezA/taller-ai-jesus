import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Text input field with optional label, validation error, and helper text.',
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
    error: { control: 'text' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'url'] },
  },
  args: {
    label: 'Email',
    placeholder: 'nombre@empresa.com',
    type: 'email',
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    label: 'Usuario',
    placeholder: 'usuario@dominio.com',
    helperText: 'Este valor se mostrará públicamente.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'nombre@empresa.com',
    error: 'El email no es válido.',
    defaultValue: 'no-es-un-email',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    defaultValue: 'bloqueado@empresa.com',
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: { label: undefined, placeholder: 'Sin etiqueta…' },
};

export const Password: Story = {
  args: { label: 'Contraseña', type: 'password', placeholder: '••••••••' },
};
