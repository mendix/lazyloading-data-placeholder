import { Widget } from '.';

export interface WidgetProps extends Widget {
  pageContent: string;
  placeholderSkeleton: string;
  repeatCount: number;
  containerClass: string;
  containerStyle: string;
  itemClass: string;
  itemStyle: string;
}
