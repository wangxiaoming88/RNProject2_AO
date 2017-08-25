// @flow

import {AsyncStorage} from 'react-native';

function checkStatus(response) {
  // console.warn('RESPONSE: ',response);

  if (response.ok) {
    return response;
  } else {
    let error:Object = new Error(response.statusText);
    try {
      error.response = response.json();
    } catch (e) {
      error.response = response.text();
    }

    // Authorize error
    if (response.status === 401) {
      AsyncStorage.removeItem('userId')
        .then(() => {throw error;});
    }
    throw error;
  }
}

function parseJSON(response) {
  var _res;

  if (response._bodyText) {
    try {
      _res = response.json();
    } catch (e) {
      _res = response.text();
    }
  } else {
    // if server just responds with status (like on DELETE action)
    return true;
  }

  return _res;
}

class Api {
  basePath: string;
  makeRequst: () => void;
  headers: Object;

  constructor(basePath = 'https://adagio.co/api/') {
    this.basePath = basePath;
    this.makeRequst = this.makeRequst.bind(this);
    this.headers = basePath === 'https://adagio.co/api/' ? {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json',
      'X-Application-Key': '0a8b73bb2b5992036c1b8a3d19ef9180'
    };
  }

  makeRequst(url: string, options: Object) {
    return AsyncStorage.getItem('userId')
      .then((uid) => {
        if (uid) {
          this.headers.Authorization = `Token ${uid}`;
        }
        return fetch(this.basePath + url, {
          headers: this.headers,
          ...options});
      })
      .then(checkStatus)
      .then(parseJSON);
  }

  get(url: string, options: Object) {
    return this.makeRequst(url, {method: 'GET', ...options});
  }

  post(url: string, data: Object) {
    return this.makeRequst(url, {method: 'POST', body: JSON.stringify(data)});
  }

  patch(url: string, data: Object) {
    return this.makeRequst(url, {method: 'PATCH', body: JSON.stringify(data)});
  }

  put(url: string, data: Object) {
    return this.makeRequst(url, {method: 'PUT', body: JSON.stringify(data)});
  }

  delete(url: string) {
    return this.makeRequst(url, {method: 'DELETE'});
  }
}

export default Api;
