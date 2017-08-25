import GoogleAnalytics from 'react-native-google-analytics-bridge';

GoogleAnalytics.setTrackerId('UA-85940622-1');

export function setIsEmpty(data) {
  return {
    type: 'SET_IS_EMPTY',
    data
  };
}

export function keepAwake() {
  return {
    type: 'KEEP_AWAKE',
  };
}

export function fetchMyPractices() {
  return {
    type: 'api_call',
    url: 'practices/pieces/',
    actionPrefix: 'FETCH_MY_PRACTICES'
  };
}

export function subscribePracticePiece(pieceUrl, successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'practices/',
    method: 'post',
    actionPrefix: 'SUBSCRIBE_PRACTICE_PIECE',
    data: {
      duration: 0,
      piece: pieceUrl
    },
    onSuccess: successCb,
    onError: errorCb
  };
}

export function subscribePracticeAssignment(assignmentUrl, successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'practices/',
    method: 'post',
    actionPrefix: 'SUBSCRIBE_PRACTICE_PIECE',
    data: {
      duration: 0,
      assignment: assignmentUrl
    },
    onSuccess: successCb,
    onError: errorCb
  };
}

export function submitFreePracticeTime(practiceData, successCb, errorCb) {
  //console.log('Practice id', practiceData);
  GoogleAnalytics.trackEvent('Practice id', 'FreePractice');
  return {
    type: 'api_call',
    url: 'practices/',
    method: 'post',
    actionPrefix: 'SUBMIT_FREE_PRACTICE_TIME',
    data: {
      ...practiceData
    },
    onSuccess: successCb,
    onError: errorCb
  };
}

export function submitPracticeTime(practiceData, successCb, errorCb) {
  //console.log('Practice id', practiceData);
  GoogleAnalytics.trackEvent('Practice id', practiceData.id.toString());
  return {
    type: 'api_call',
    url: `practices/${practiceData.id}/`,
    method: 'put',
    actionPrefix: 'SUBMIT_PRACTICE_TIME',
    data: {
      ...practiceData
    },
    onSuccess: successCb,
    onError: errorCb
  };
}

export function addNewPractice(title, successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'pieces/',
    method: 'post',
    actionPrefix: 'SUBMIT_NEW_PRACTICE',
    data: {title},
    onSuccess: successCb,
    onError: errorCb
  };
}

export function addNewPracticeByID(id, title, successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'pieces/',
    method: 'post',
    actionPrefix: 'SUBMIT_NEW_PRACTICE',
    data: { musopen_sheetmusic_id: id, title },
    onSuccess: successCb,
    onError: errorCb
  };
}

export function fetchMyPracticeAchievements(successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'practices/achievements/',
    actionPrefix: 'FETCH_MY_PRACTICES_ACHIEVEMENTS',
    onSuccess: successCb,
    onError: errorCb
  };
}

export function fetchMyPieceAchievements(successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'practices/pieces/achievements/',
    actionPrefix: 'FETCH_MY_PIECES_ACHIEVEMENTS',
    onSuccess: successCb,
    onError: errorCb
  };
}

export function fetchMyPracticesTime() {
  return {
    type: 'api_call',
    url: 'practices/',
    actionPrefix: 'FETCH_MY_PRACTICES_TIME',
  };
}

