import {
  AsyncStorage,
  Alert
} from 'react-native';

import Utils from '../../services/utils';
import Analytics from '../../services/mixpanelAnalytics';

/**
 * Fetch user's data
 * @return {Object} middleware action
 */
export function fetchUserData() {
  return {
    type: 'api_call',
    url: 'auth/user/',
    actionPrefix: 'USER_FETCH_DATA'
  };
}

/**
 * Register User
 * @param  {Object} data                  - serialized data
 * @param  {Function(String)} onSuccessCb
 * @param  {Function} onErrorCb
 */
export function register(data, onSuccessCb, onErrorCb) {
  return {
    type: 'api_call',
    url: 'auth/registration/',
    method: 'post',
    actionPrefix: 'USER_REGISTER',
    data,
    onSuccess: (uid) => {
      // AsyncStorage.setItem('userId', uid.key).then(onSuccessCb);
      // console.warn(data);
      // AsyncStorage.setItem('userEmail', data.email).then(onSuccessCb);
      AsyncStorage.setItem('userEmail', data.email)
      .then(() => {
        AsyncStorage.setItem('userId', uid.key).then(onSuccessCb);
      });

      // analytics
      Analytics.register(data.email, data.name, data.role);
    },
    onError: (errRes) => {
      Alert.alert('Registration error', Utils.parseServerError(errRes));
      onErrorCb && onErrorCb();
    }
  };
}

/**
 * Login user
 * @param  {Object} data        serialized form data
 * @param  {function(String)} onSuccessCb
 * @param  {Function} onErrorCb
 */
export function login(data, onSuccessCb, onErrorCb) {
  return {
    type: 'api_call',
    url: 'auth/login/',
    method: 'post',
    actionPrefix: 'USER_LOGIN',
    data,
    onSuccess: (uid) => {
      AsyncStorage.setItem('userEmail', data.email)
      .then(() => {
        AsyncStorage.setItem('userId', uid.key).then(onSuccessCb);
      });

      // analytics
      Analytics.login(data.email);
    },
    onError: (res) => {
      Alert.alert('Login failure', Utils.parseServerError(res));
    }
  };
}

/**
 * Logout user.
 * @param  {Function} onSuccessCb
 */
export function logout(onSuccessCb) {
  return {
    type: 'api_call',
    url: 'auth/logout/',
    method: 'post',
    actionPrefix: 'USER_LOGOUT',
    onSuccess: () => {
      AsyncStorage.removeItem('userEmail')
      .then(() => {
        AsyncStorage.removeItem('userId').then(onSuccessCb);

        // analytics
        Analytics.logout();
      });

    },
    onError: (e) => {
      // FIXME: logout fails if access token dead!
      AsyncStorage.removeItem('userEmail')
      .then(() => {
        AsyncStorage.removeItem('userId').then(onSuccessCb);
        
        // analytics
        Analytics.logout();
      });
      console.log(e);
    }
  };
}

/**
 * Updates User's data
 * @param  {Object} data - serialized form
 */
export function updateData(data, successCB) {
  return {
    type: 'api_call',
    url: 'auth/user/',
    actionPrefix: 'USER_UPDATE_DATA',
    method: 'patch',
    data,
    onSuccess: successCB,
    onError: (err) => {
      Alert.alert('Failure',
        Object.keys(err).map((key) => key).join(' ,') + ': ' +
        Object.keys(err).map((key) => err[key]).join('\n'));
    }
  };
}

/**
 * Quick update user's data in store only
 * @param  {Object} data - serialized form
 */
export function updateDataLocal(data) {
  return {
    type: 'USER_UPDATE_DATA_SUCCESS',
    data
  };
}

/**
 * Update user's photo
 * @param  {Object} imageData - photo Object received from RN module
 * @return {Function}         - thunk middleware
 */
export function updateUserPhoto(imageData) {
  // let successCB = () => Alert.alert('Congratulations!', 'Photo has been successfully uploaded.');
  let failureCB = () => Alert.alert('Failure', 'Sorry, an error occurred while uploading your photo, please try again');
  let content_type = 'image/jpeg';
  let upload_type = 'avatar';

  let data = {
    content_type,
    upload_type,
    filename: imageData.name
  };

  let image = {
    uri: imageData.uri,
    name: imageData.name,
    type: content_type
  };

  return (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      dispatch(requestAWSSignature(data, resolve, reject));
    });

    promise
      .then((res) => UploadImageAWS(res, image))
      .then((imageUrl) => dispatch(patchUserAvatar(imageUrl)))
      .then(null, failureCB)
      .catch(console.error);

    return;
  };
}

/**
 * Sends request to API server and receives AWS signed url to upload image.
 * @param  {Object} data      - options Object
 * {@link https://github.com/musopen/musiced#9-file-uploading}
 * @param  {Function(Object)} onSuccess
 * @param  {Function} onError
 */
function requestAWSSignature(data, onSuccess, onError) {
  return {
    type: 'api_call',
    url: 's3-signed-urls/',
    actionPrefix: 'USER_UPDATE_PHOTO_AWS',
    method: 'post',
    data,
    onSuccess,
    onError
  };
}

/**
 * Upload image to AWS S3
 * @param {Object} res   - response Object from requestAWSSignature function
 * @param {Object} image - formally image file. RN represents files as Objects
 * with 'uri' property
 */
function UploadImageAWS(res, image) {
  let xhr = new XMLHttpRequest();
  let AWSUploadUrl = res.url;
  let imageUrl = AWSUploadUrl.split('?')[0];

  let promise = new Promise((resolve, reject) => {
    xhr.onload = function(e) {
      console.log('onload', xhr.response);

      resolve(imageUrl);
    };

    xhr.onerror = function(e) {
      console.log('onerror', xhr.response);
      reject();
    };

    xhr.open('PUT', AWSUploadUrl, true);
    xhr.setRequestHeader('Content-Type', image.type);

    xhr.send(image);
  });

  return promise;
}

/**
 * Patch user to set avatar url.
 * @param  {String} imageUrl - AWS image url
 */
function patchUserAvatar(imageUrl) {
  return {
    type: 'api_call',
    url: 'auth/user/',
    method: 'patch',
    actionPrefix: 'USER_UPDATE_API_PHOTO_URL',
    data: {
      avatar: imageUrl
    },
    onSuccess: Promise.resolve,
    onError: Promise.reject
  };
}

/////////////////////
// Social connects //
/////////////////////
/**
 * Login with Facebook auth
 * @param  {Object} data        - Facebook auth response Object
 * @param  {Function} onSuccessCb
 */
export function loginWithFB(data, onSuccessCb) {
  return {
    type: 'api_call',
    url: 'auth/facebook/',
    method: 'post',
    actionPrefix: 'USER_LOGIN_VIA_FACEBOOK',
    data: {
      access_token: data.token
    },
    onSuccess: (successData) => {
      // console.warn('facebook login: ' + successData.key);
      AsyncStorage.setItem('userId', successData.key).then(onSuccessCb);
      Analytics.login(data.email, 'FB');
    }
  };
}

// export async function fbMyLogin(data, onSuccessCb) {
//   console.warn('access_token', data.credentials.token);
//   try {
//     let headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded',
//     };
//     let response = await fetch('http://adagio.co/api/auth/facebook/', {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify({
//         access_token: data.credentials.token,
//       }),
//     });
//     let responseJson = false;

//     try {
//       responseJson = await response;
//       console.warn('response: ', responseJson);
//       responseJson = responseJson.json();
//       if (responseJson.hasOwnProperty("key")) {
//         // AsyncStorage.setItem('userId', JSON.stringify(responseJson.key)).then(onSuccessCb);
//         console.warn('yes', responseJson.key);
//       } else {
//         console.warn('no');
//       }
//       return true;
//       console.warn('error 1');

//     } catch (error) {
//       console.warn('error 2');
//       return false;
//     }
//     // AsyncStorage.setItem('userId', responseJson.key).then(onSuccessCb);
//   } catch (error) {
//     console.warn('error 3');
//   }
// }


/**
 * Login with google oauth
 * @param  {Object} data        - Google auth response Object
 * @param  {Function} onSuccessCb
 */
export function loginWithGoogle(data, onSuccessCb) {
  return {
    type: 'api_call',
    url: 'auth/google/',
    method: 'post',
    actionPrefix: 'USER_LOGIN_VIA_GOOGLE',
    data: {
      access_token: data.accessToken
    },
    onSuccess: (successData) => {
      // console.warn('facebook login: ' + successData.key);
      AsyncStorage.setItem('userId', successData.key).then(onSuccessCb);
      Analytics.login(data.email, 'Google');
    }
  };
}

function patchUser(onSuccess) {
  return {
    type: 'api_call',
    url: 'auth/user/',
    actionPrefix: 'USER_PATCH',
    method: 'PATCH',
    data: {
      role: 'student'
    },
    onSuccess: onSuccess
  };
}

// we need to make some additional modifications to make it work for register
// once you register with social links you dont have roles yet, and this leads to
// errors.
// so we need to patch user before navigating to main screens
export function registerWithFB(data, onSuccessCb) {
  // console.warn('fb reg: ', data);
  return (dispatch) => {
    Analytics.register(data.email, data.name, 'student', 'FB');
    dispatch(loginWithFB(data.credentials, () => {
      dispatch(patchUser(onSuccessCb));
    }));
  };
}

export function registerWithGoogle(data, onSuccessCb) {
  console.log(data);
  return (dispatch) => {
    Analytics.register(data.email, data.name, 'student', 'Google');
    dispatch(loginWithGoogle(data, () => {
      dispatch(patchUser(onSuccessCb));
    }));
  };
}

export function sendPasswordResetRequest(email, successCB, errorCB) {
  return {
    type: 'api_call',
    url: 'auth/password/reset/',
    method: 'post',
    data: {email},
    actionPrefix: 'USER_PATCH',
    onSuccess: successCB,
    onError: errorCB
  };
}

export function fetchMyLevel() {
  return {
    type: 'api_call',
    url: 'practices/progress/',
    actionPrefix: 'FETCH_MY_LEVEL'
  };
}
