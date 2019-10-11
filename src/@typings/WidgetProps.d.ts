import { Widget } from '.';

export interface WidgetProps extends Widget {
  pageContent: string;
  placeholderSkeleton: string;
  repeatCount: number;
  placeholderClass: string;
  itemClass: string;
  width: number;
  height: number;
}
