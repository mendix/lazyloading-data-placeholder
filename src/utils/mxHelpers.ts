/**
 * We recommend isolating the usage of Mendix Client API from your React component.
 * It will make testing a lot easier.
 * For example, in your React component, you only need to mock a simple function `callMicroflow` instead of `window.mx.data.action`.
 * This is also helpful for migrating to pluggable widget later.
 *
 * We provide some examples here. You can implement your own Mendix Client API helpers.
 */

interface MxDataActionParams {
  actionname: string;
  applyto?: string | undefined;
  guids?: string[] | undefined;
  xpath?: string | undefined;
  constraints?: string | undefined;
  sort?: [string, 'desc' | 'asc'][] | undefined;
  gridid?: string | undefined;
}

interface MxDataGetParams {
  guid: string;
  noCache?: boolean | undefined;
  count?: boolean | undefined;
  path?: string | undefined;
  filter?:
    | {
        id?: string | undefined;
        attributes?: string[] | undefined;
        offset?: number | undefined;
        sort?: [string, 'desc' | 'asc'][] | undefined;
        amount?: number | undefined;
        distinct?: boolean | undefined;
        references?: mx.ReferencesSpec | undefined;
      }
    | undefined;
}

function action(params: MxDataActionParams) {
  return new Promise((resolve, reject) => {
    window.mx.data.action({
      params,
      callback: resolve,
      error: reject,
    });
  });
}

function get(params: MxDataGetParams) {
  return new Promise((resolve, reject) => {
    window.mx.data.get({ ...params, callback: resolve, error: reject });
  });
}

export const mxData = {
  action,
  get,
};

export const getData = get;
export const callMicroflow = (actionname: string) => action({ actionname });

export const getValue = (
  attribute: string,
  defaultValue: string | number | boolean,
  mxObject?: mendix.lib.MxObject
) => {
  return mxObject && attribute.trim()
    ? mxObject.get(attribute) || defaultValue
    : defaultValue;
};
