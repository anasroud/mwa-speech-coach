import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import * as icons from 'lucide-angular';

const PICK = [
  'Sparkle',
  'Mic',
  'ChartBar',
  'Target',
  'Users',
  'MoveLeft',
  'Pause',
  'Mail',
  'Lock',
  'Eye',
  'User',
  'EyeOff',
  'Star',
  'Clock',
  'Play',
  'TrendingUp',
  'CircleStop',
  'Trash',
  'ChartColumn',
  'CloudUpload',
  'Calendar',
  'RotateCcw',
  'AlarmCheck',
  'Zap',
  'Ban',
  'CircleAlert',
  'Volume2',
  'CircleCheckBig',
] as const;

export const ICON_PROVIDERS = importProvidersFrom(
  LucideAngularModule.pick(
    Object.fromEntries(PICK.map((n) => [n, (icons as any)[n]]))
  )
);
