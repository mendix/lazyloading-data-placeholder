import '../style/style.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { WidgetProps } from '../@typings';
import { Placeholder, PlaceholderProps } from '../components/Placeholder';
import parseStyle from '../utils/parseStyle';

interface FormProps {
  location: 'content' | 'popup' | 'modal' | 'node';
  domNode?: HTMLElement;
  title?: string;
  context?: mendix.lib.MxContext;
  callback?(form: mxui.lib.form._FormBase): void;
  error?(error: Error): void;
}

export default class WidgetContainer {
  private widgetId: string;
  private widgetParams: WidgetProps;
  private widgetDomNode: HTMLElement;
  private divContent: HTMLElement | undefined;
  private subscriptionHandles: number[];
  private mxObjectContext: mendix.lib.MxObject | undefined;
  private loadingStarted: boolean;
  private pageInitiated: boolean;
  private contentForm: mxui.lib.form.InlineForm | undefined;

  constructor(id: string, params: WidgetProps, parentNode: HTMLElement) {
    this.widgetId = id;
    this.widgetParams = params;
    this.widgetDomNode = parentNode;
    this.subscriptionHandles = [];
    this.mxObjectContext = undefined;
    this.contentForm = undefined;
    this.divContent = undefined;
    this.loadingStarted = false;
    this.pageInitiated = false;
    this.renderSkeleton();
  }

  update = (obj: mendix.lib.MxObject) => {
    if (this.mxObjectContext === obj) return;
    console.debug(this.widgetId + '.update on new object');
    this.loadingStarted = false;
    this.pageInitiated = false;
    this.mxObjectContext = obj;
    this.resetSubscriptions();
    this.loadContent();
  };

  resize = () => {
    if (this.widgetDomNode.offsetParent !== null) {
      this.loadContent();
    }
  };

  uninitialize = () => {
    if (this.contentForm) {
      this.contentForm.destroy();
    }
  };

  private resetSubscriptions = () => {
    this.subscriptionHandles = [];
    if (this.mxObjectContext) {
      const subscription = window.mx.data.subscribe({
        guid: this.mxObjectContext.getGuid(),
        callback: () => {
          if (this.loadingStarted == false) {
            console.debug(
              this.widgetId + ' Refresh triggered on object change.'
            );
            this.loadContent();
          }
        },
      });
      this.subscriptionHandles.push(subscription);
    }
  };

  private switchContent = () => {
    ReactDOM.unmountComponentAtNode(this.widgetDomNode);
    this.widgetDomNode.innerHTML = '';
    this.widgetDomNode.appendChild(this.divContent!);
  };

  private openFormByFormProp = (pageContext?: mendix.lib.MxContext) => {
    console.debug(this.widgetId + '.openFormByFormProp: ');
    this.divContent = document.createElement('div');
    const props: FormProps = {
      location: 'node',
      domNode: this.divContent,
      callback: (mxform: mxui.lib.form._FormBase) => {
        console.debug(this.widgetId + '.showPage on form');
        if (this.contentForm != null && mxform != null) {
          this.contentForm.destroy();
        }
        this.contentForm = (mxform as unknown) as mxui.lib.form.InlineForm;
        this.switchContent();
        this.loadingStarted = false;
      },
      error: (error: object) => {
        console.error(this.widgetId, error);
      },
    };
    if (pageContext) props.context = pageContext;
    mx.ui.openForm(this.widgetParams.pageContent, props);
  };

  private loadContent = () => {
    console.debug(this.widgetId + '.loadContent');
    if (this.loadingStarted) return;

    this.loadingStarted = true;

    if (this.pageInitiated) {
      this.switchContent();
      this.loadingStarted = false;
    } else {
      this.pageInitiated = true;
      console.debug(this.widgetId + ' setPage');
      if (this.mxObjectContext) {
        const pageContext = new mendix.lib.MxContext();
        pageContext.setTrackObject(this.mxObjectContext);
        this.openFormByFormProp(pageContext);
      } else {
        this.openFormByFormProp();
      }
    }
  };

  private renderSkeleton = () => {
    console.debug(`${this.widgetId} >> renderSkeleton`);
    const props: PlaceholderProps = {
      skeletonSVG: this.widgetParams.placeholderSkeleton,
      repeatCount: this.widgetParams.repeatCount,
      containerClassName: this.widgetParams.containerClass,
      containerStyle: parseStyle(this.widgetParams.containerStyle),
      itemClassName: this.widgetParams.itemClass,
      itemStyle: parseStyle(this.widgetParams.itemStyle),
    };
    ReactDOM.render(<Placeholder {...props} />, this.widgetDomNode);
  };
}
