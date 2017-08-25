import Api from '../../services/api';

function serializeParams(obj) {
  let query = Object.keys(obj).map((key) => {
    return `${key}=${obj[key]}`;
  }).join('&');
  // console.log('serializeParams', query);
  return '?' + query;
}

let apiMiddleware = (store) => (next) => (action) => {
  if (action.type !== 'api_call') {
    return next(action);
  }


  // console.warn('API basePath', action);

  let api = action.basePath ? new Api(action.basePath) : new Api();
  let method = (action.method && action.method.toUpperCase()) || 'GET';
  let body = method !== 'GET' && action.data ? JSON.stringify(action.data) : null;

  let params = action.basePath ? (method === 'GET' && action.data ? action.data : '' ) : (method === 'GET' && action.data ? serializeParams(action.data) : '');

  // console.log('api', api);
  // console.log('method', method);
  // console.log('body', body);
  // console.log('params', params);

  if (action.url) {
    next({type: `${action.actionPrefix}_REQUEST`});
    // console.log('body: ', body);
    api.makeRequst(`${action.url}${params}`, {
      method: method,
      body
    }).then(
      (data) => {
        // console.log('response data', data);
        action.basePath ?
          next({type: `${action.actionPrefix}_SUCCESS`, data, other: action.other}) :
          next({type: `${action.actionPrefix}_SUCCESS`, data});
        if (typeof action.onSuccess === 'function') {
          // console.log('action.onSuccess');
          action.onSuccess(data);
        }
      },
      (error) => {
        // console.log('error', error);
        next({type: `${action.actionPrefix}_FAILURE`, error});
        if (typeof action.onError === 'function') {
          error.response.then(action.onError);
        }
      }
    );
  }
  return next(action);
};

export default apiMiddleware;
