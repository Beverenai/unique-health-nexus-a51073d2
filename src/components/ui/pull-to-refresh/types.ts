
import { MotionValue } from "framer-motion";

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  pullDistance?: number;
  className?: string;
}

export interface PullIndicatorProps {
  springY: MotionValue<number>;
  rotate: MotionValue<number>;
  refreshing: boolean;
}

export interface PullContextType {
  isPulling: boolean;
  thresholdReached: boolean;
  pullDistance: number;
  currentY: MotionValue<number>;
  springY: MotionValue<number>;
  rotate: MotionValue<number>;
}
