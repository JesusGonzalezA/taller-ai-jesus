import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const SampleContent = () => (
  <div>
    <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-family-sans)', fontSize: '1rem' }}>
      Título de la tarjeta
    </h3>
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-family-sans)',
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
      }}
    >
      Contenido de ejemplo para visualizar la tarjeta con diferentes configuraciones de relleno y
      sombra.
    </p>
  </div>
);

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Generic surface container. Use to group related content with an optional border and shadow.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '20rem' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    shadow: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
  args: {
    children: <SampleContent />,
    padding: 'md',
    shadow: 'sm',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargePadding: Story = {
  args: { padding: 'lg', shadow: 'md' },
};

export const NoPadding: Story = {
  args: { padding: 'none', shadow: 'none' },
};

export const ElevatedShadow: Story = {
  args: { padding: 'md', shadow: 'lg' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {(['none', 'sm', 'md', 'lg'] as const).map((shadow) => (
        <Card key={shadow} padding="md" shadow={shadow}>
          <p style={{ margin: 0, fontFamily: 'var(--font-family-sans)', fontSize: '0.875rem' }}>
            <strong>shadow:</strong> {shadow}
          </p>
        </Card>
      ))}
    </div>
  ),
};
