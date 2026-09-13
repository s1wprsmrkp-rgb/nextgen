import React from 'react';
import { VerificationStatus } from '../types';
import { ShieldCheck, CheckCircle2, Award, Users, UserCheck } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Institution verified':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          label: 'Institution Verified',
          desc: 'Verified by an accredited institution, festival or university',
        };
      case 'Mentor verified':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: UserCheck,
          label: 'Mentor Verified',
          desc: 'Endorsed by a verified industry mentor or coach',
        };
      case 'Evidence-backed':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: CheckCircle2,
          label: 'Evidence-Backed',
          desc: 'Supported by verifiable recordings, repositories or media',
        };
      case 'Community recognition':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          icon: Users,
          label: 'Community Recognition',
          desc: 'Recognized by peers and community reviews',
        };
      case 'Self-declared':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Award,
          label: 'Self-Declared',
          desc: 'Reported by talent, awaiting external verification',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      title={config.desc}
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]} transition-all`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
};
