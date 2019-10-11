//import '../style/style.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { WidgetProps } from '../@typings';
import { Placeholder, PlaceholderProps } from '../components/Placeholder';
import parseStyle from '../utils/parseStyle';

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
    this.loadingStarted = false;
    this.pageInitiated = false;
    this.divContent = undefined;
    this.renderSkeleton();
  }

  update = (obj: mendix.lib.MxObject) => {
    if (this.mxObjectContext === obj) return;
    console.debug(this.widgetId + '.update on new object');
    this.loadingStarted = false;
    this.pageInitiated = false;
    this.mxObjectContext = obj;
    this.resetSubscriptions();
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
              this.widgetId + '.Refresh triggered on object change.'
            );
            this.loadContent();
          }
        },
      });
      this.subscriptionHandles.push(subscription);
    }
  };

  private showContent = () => {
    ReactDOM.unmountComponentAtNode(this.widgetDomNode);

    this.widgetDomNode.innerHTML = '';
    this.widgetDomNode.appendChild(this.divContent!);
  };

  private openFormByFormProp = (pageContext?: mendix.lib.MxContext) => {
    console.debug(this.widgetId + '._openFormByFormProp: ');
    this.divContent = document.createElement('div');
    var props = {
      location: 'node' as 'content' | 'popup' | 'modal' | 'node',
      domNode: this.divContent,
      callback: (mxform: mxui.lib.form._FormBase) => {
        console.debug(this.widgetId + '._showPage on form');
        if (this.contentForm != null && mxform != null) {
          this.contentForm.destroy();
        }
        this.contentForm = (mxform as unknown) as mxui.lib.form.InlineForm;
        this.showContent();
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
    console.debug(this.widgetId + '._loadAndShowcontent');
    if (this.loadingStarted) return;

    this.loadingStarted = true;

    if (this.pageInitiated) {
      if (this.loadingStarted) {
        this.showContent();
        this.loadingStarted = false;
      } else {
        console.debug(this.widgetId + '_setPage skip because already set.');
      }
    } else {
      this.pageInitiated = true;
      console.debug(this.widgetId + '_setPage');
      if (this.mxObjectContext) {
        var pageContext = new mendix.lib.MxContext();
        pageContext.setTrackObject(this.mxObjectContext);
        this.openFormByFormProp(pageContext);
      } else {
        this.openFormByFormProp();
      }
    }
  };

  private calcWidth = () => {
    if (this.widgetParams.width) return this.widgetParams.width;

    if (this.widgetDomNode.offsetWidth) return this.widgetDomNode.offsetWidth;

    if (
      this.widgetDomNode.parentElement &&
      this.widgetDomNode.parentElement.offsetWidth
    )
      return this.widgetDomNode.parentElement.offsetWidth;

    return 200;
  };

  private calcHeight = () => {
    if (this.widgetParams.height) return this.widgetParams.height;

    if (this.widgetDomNode.offsetHeight) return this.widgetDomNode.offsetHeight;

    if (
      this.widgetDomNode.parentElement &&
      this.widgetDomNode.parentElement.offsetHeight
    )
      return this.widgetDomNode.parentElement.offsetHeight;

    return 200;
  };

  private renderSkeleton = () => {
    console.debug(`${this.widgetId} >> renderSkeleton`);
    const props: PlaceholderProps = {
      skeletonSVG: this.widgetParams.placeholderSkeleton,
      repeatCount: this.widgetParams.repeatCount,
      style: parseStyle(this.widgetParams.style),
      className: this.widgetParams.className,
      placeholderClassName: this.widgetParams.itemClass,
      itemClassName: this.widgetParams.placeholderClass,
      animate: true,
      animateInterval: 0.3,
      ariaLabel: 'Loading content ...',
      gradientRatio: 3,
      width: this.calcWidth(),
      height: this.calcHeight(),
      preserveAspectRatio: 'none',
      primaryColor: '#ddddee',
      primaryOpacity: 0.8,
      secondaryColor: '#bbbbdd',
      secondaryOpacity: 0.6,
      rtl: false,
      speed: 1,
    };
    ReactDOM.render(<Placeholder {...props} />, this.widgetDomNode);
  };
}
