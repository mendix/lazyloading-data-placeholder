import { Widget } from '.';

export interface WidgetProps extends Widget {
  pageContent: string;
  placeholderSkeleton: string;
  repeatCount: number;
  width: number;
  height: number;
}
