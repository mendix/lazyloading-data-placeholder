import declare from 'dojoBaseDeclare';
import _widgetBase from 'MxWidgetBase';

import { widgetName } from '../package.json';
import WidgetContainer from './containers';

export default declare(`${widgetName}.widget.${widgetName}`, [_widgetBase], {
  constructor: function() {
    logger.debug(this.id + '.constructor');
  },
  postCreate: function() {
    logger.debug(this.id + '.postCreate');
    this.container = new WidgetContainer(this.id, this.params, this.domNode);
  },
  update(contextObject: mendix.lib.MxObject, callback: () => void) {
    console.debug(`${this.id} >> update`);
    this.unsubscribeAll();
    this.container.update(contextObject);
    if (callback && typeof callback === 'function') callback();
  },
  resize: function() {
    console.debug(`${this.id} >> resize`);
    this.container.resize();
  },
  uninitialize: function() {
    logger.debug(this.id + '.uninitialize');
    this.container.uninitialize();
  },
  enable() {
    logger.debug(this.id + '.enable');
  },
  disable() {
    logger.debug(this.id + '.disable');
  },
});
