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

  divContent: HTMLElement | undefined;
  divLoader: HTMLElement | undefined;

  subscriptionHandles: number[];
  mxObjectContext: mendix.lib.MxObject | undefined;

  loadingStarted: boolean;
  pageInitiated: boolean;
  contentForm: mxui.lib.form.InlineForm | undefined;
  active: boolean;
  visibilityCheck: boolean;
  // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
  constructor(id: string, params: WidgetProps, parentNode: HTMLElement) {
    this.widgetId = id;
    this.widgetParams = params;
    this.widgetDomNode = parentNode;
    this.subscriptionHandles = [];
    this.mxObjectContext = undefined;
    this.active = true;
    this.contentForm = undefined;
    this.loadingStarted = false;
    this.pageInitiated = false;
    this.visibilityCheck = true;
    this.divContent = undefined;
    this.divLoader = undefined;
    this.createLayout();
  }

  postCreate = () => {
    this._updateRendering();
  };

  createLayout = () => {
    let placeholder = document.createElement('div');
    placeholder.className = 'dataviewloader';
    this.divLoader = document.createElement('div');
    this.divLoader.className = 'loadergif';
    this.divLoader.id = 'divLoader';
    this.divLoader.style.display = 'block';
    placeholder.appendChild(this.divLoader);
    this.divContent = document.createElement('div');
    this.divContent.className = 'loadercontent';
    this.divContent.id = 'divContent';
    this.divContent.style.display = 'none';
    this.divContent.innerText = 'content';
    placeholder.appendChild(this.divContent);
    this.widgetDomNode.appendChild(placeholder);
    this.renderSkeleton(this.divLoader);
  };

  update = (obj: mendix.lib.MxObject) => {
    if (this.mxObjectContext === obj) return;

    console.log(this.widgetId + '.update on new object');
    this.loadingStarted = false;
    this.pageInitiated = false;

    this.mxObjectContext = obj;
    this._resetSubscriptions();
  };

  resize = () => {
    console.log(this.widgetId + '.resize');
    // TODO: How to handle tabs and conditional visibility
    if (this.widgetDomNode.offsetParent !== null) {
      this._loadAndShowcontent();
    }
  };

  uninitialize = () => {
    logger.debug(this.widgetId + '.uninitialize');
    // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
    this.active = false;

    if (!!this.contentForm) {
      this.contentForm.destroy();
    }
  };

  _updateRendering = () => {
    logger.debug(this.widgetId + '._updateRendering');

    if (this.mxObjectContext) {
      this._showLoader();

      if (this.widgetDomNode.offsetParent !== null || !this.visibilityCheck) {
        this._loadAndShowcontent();
      }
    }
  };

  _showLoader = () => {
    this.divContent!.style.display = 'none';
    this.divLoader!.style.display = 'block';
  };

  _showContent = () => {
    this.divLoader!.style.display = 'none';
    this.divContent!.style.display = 'block';
  };

  _loadAndShowcontent = () => {
    logger.debug(this.widgetId + '._loadAndShowcontent');
    if (this.loadingStarted == false) {
      this.loadingStarted = true;
      //if (this.mxObjectContext) {
      this._setPage(this.mxObjectContext);
      //}
    }
  };

  _openFormByFormProp = (pageContext?: mendix.lib.MxContext) => {
    logger.debug(this.widgetId + '._openFormByFormProp: ');
    var props = {
      location: 'node' as 'content' | 'popup' | 'modal' | 'node',
      domNode: this.divContent,
      callback: (mxform: mxui.lib.form._FormBase) => {
        logger.debug(this.widgetId + '._showPage on form');
        if (this.contentForm != null && mxform != null) {
          this.contentForm.destroy();
        }
        this.contentForm = (mxform as unknown) as mxui.lib.form.InlineForm;
        this._showContent();
        this.loadingStarted = false;
      },
      error: (error: object) => {
        console.log(this.widgetId, error);
      },
    };

    if (pageContext) props.context = pageContext;
    mx.ui.openForm(this.widgetParams.pageContent, props);
  };

  _setPage = (pageObj?: mendix.lib.MxObject) => {
    logger.debug(this.widgetId + '._setPage');

    if (this.pageInitiated) {
      if (this.loadingStarted) {
        this._showPage();
      } else {
        console.log(this.widgetId + '_setPage skip because already set.');
      }
    } else {
      this.pageInitiated = true;
      this.divContent!.innerHTML = '';
      console.log(this.widgetId + '_setPage');
      if (pageObj) {
        var pageContext = new mendix.lib.MxContext();
        pageContext.setTrackObject(pageObj);
        this._openFormByFormProp(pageContext);
      } else {
        this._openFormByFormProp();
      }
    }
  };

  _showPage = () => {
    logger.debug(this.widgetId + '._showPage on form');
    this._showContent();
    this.loadingStarted = false;
  };

  _resetSubscriptions = () => {
    logger.debug(this.widgetId + '._resetSubscriptions');
    this.subscriptionHandles = [];

    // When a mendix object exists create subscribtions.
    if (this.mxObjectContext) {
      console.log(
        this.widgetId + '._resetSubscriptions setup refresh handler: '
      );
      const subscription = window.mx.data.subscribe({
        guid: this.mxObjectContext.getGuid(),
        callback: () => {
          if (this.loadingStarted == false) {
            console.log(this.widgetId + '.Refresh triggered on object change.');
            //this._updateRendering();
          }
        },
      });
      this.subscriptionHandles.push(subscription);
    }
  };

  calcWidth = () => {
    if (this.widgetParams.width) return this.widgetParams.width;

    if (this.widgetDomNode.offsetWidth) return this.widgetDomNode.offsetWidth;

    if (
      this.widgetDomNode.parentElement &&
      this.widgetDomNode.parentElement.offsetWidth
    )
      return this.widgetDomNode.parentElement.offsetWidth;

    return 300;
  };

  calcHeight = () => {
    if (this.widgetParams.height) return this.widgetParams.height;

    if (this.widgetDomNode.offsetHeight) return this.widgetDomNode.offsetHeight;

    if (
      this.widgetDomNode.parentElement &&
      this.widgetDomNode.parentElement.offsetHeight
    )
      return this.widgetDomNode.parentElement.offsetHeight;

    return 200;
  };

  renderSkeleton = (parent: HTMLElement) => {
    console.debug(`${this.widgetId} >> renderSkeleton`);
    const props: PlaceholderProps = {
      style: parseStyle(this.widgetParams.style),
      className: this.widgetParams.className,
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
      skeletonSVG: this.widgetParams.placeholderSkeleton,
      repeatCount: this.widgetParams.repeatCount,
    };
    ReactDOM.render(<Placeholder {...props} />, parent);
  };
}
