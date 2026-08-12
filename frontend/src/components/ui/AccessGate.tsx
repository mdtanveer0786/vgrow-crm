import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Lock } from 'lucide-react';

interface AccessGateProps {
  tier: 'Free' | 'Pro' | 'Enterprise';
  currentTier: string;
  children: React.ReactNode;
}

export default function AccessGate({ tier, currentTier, children }: AccessGateProps) {
  const tiers = ['Free', 'Pro', 'Enterprise'];
  const requiredIndex = tiers.indexOf(tier);
  const currentIndex = tiers.indexOf(currentTier || 'Free');

  if (currentIndex >= requiredIndex) {
    return <>{children}</>;
  }

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)', textAlign: 'center', border: '2px dashed var(--border-color)', background: 'var(--bg-secondary)' }}>
      <div aria-hidden="true" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <Lock style={{ width: '32px', height: '32px', color: 'var(--accent-indigo)' }} />
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: 'var(--space-2)' }}>Unlock {tier} Features</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: 'var(--space-6)', lineHeight: '1.5' }}>
        This feature requires the {tier} plan. Upgrade your workspace to access advanced reporting, AI agents, and more.
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/settings?tab=billing'}>
        Upgrade to {tier}
      </Button>
    </Card>
  );
}
