import {
  ArrowTrendingDownIcon,
  MinusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/solid';

export const INTERVAL = 60;

export const API_ENDPOINT = 'http://localhost:4000/api';

export enum RATING_STATE {
  down,
  none,
  up,
}

export const STATE_DATA = [
  { color: 'failure', icon: <ArrowTrendingDownIcon className="w-6 h-6" /> },
  { color: 'warning', icon: <MinusIcon className="w-6 h-6" /> },
  { color: 'success', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
];
