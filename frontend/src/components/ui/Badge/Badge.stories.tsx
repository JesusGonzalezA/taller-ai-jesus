import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inline label used to communicate status, category, or metadata at a glance. Use `success` for active/published states, `warning` for pending/draft, `danger` for errors/archived, and `info` for informational tags.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    children: { control: 'text' },
  },
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Default' } };
export const Primary: Story = { args: { variant: 'primary', children: 'Primario' } };
export const Success: Story = { args: { variant: 'success', children: 'Publicado' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Borrador' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Error' } };
export const Info: Story = { args: { variant: 'info', children: 'Información' } };

export const SmallSize: Story = {
  args: { size: 'sm', children: 'Pequeño' },
};

export const PublicationStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge variant="warning">Borrador</Badge>
      <Badge variant="primary">En revisión</Badge>
      <Badge variant="success">Aprobado</Badge>
      <Badge variant="info">Exportado</Badge>
      <Badge variant="danger">Rechazado</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {(['default', 'primary', 'success', 'warning', 'danger', 'info'] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
