export function keepAwake() {
  return {
    type: 'KEEP_AWAKE',
  };
}

export function saveInterimDataGoal(data) {
  return {
    type: 'SAVE_INTERIM_DATA_GOAL',
    data,
  };
}

export function cleanInterimDataGoal() {
  return {
    type: 'CLEAN_INTERIM_DATA_GOAL',
  };
}

export function fetchMyGoals() {
  return {
    type: 'api_call',
    url: 'goals/?embed=piece',
    actionPrefix: 'FETCH_MY_GOALS',
  };
}

export function createGoal(id, duration, interval, piece, successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'goals/',
    method: 'post',
    actionPrefix: 'SUBMIT_NEW_GOALS',
    data: {
      name: duration,
      duration,
      interval,
      piece,
    },
    onSuccess: successCb,
    onError: errorCb,
  };
}

export function editGoal(id, duration, interval, piece, successCb) {
  return {
    type: 'api_call',
    url: `goals/${id}/`,
    method: 'patch',
    actionPrefix: 'EDIT_GOAL',
    data: {
      name: duration,
      duration,
      interval: interval === 0 ? 'week' : 'month',
      piece,
    },
    onSuccess: successCb,
  };
}

export function deleteGoal(id, successCb) {
  // console.log('deleteGoal', successCb);
  return {
    type: 'api_call',
    url: `goals/${id}/`,
    method: 'delete',
    actionPrefix: 'DELETE_GOAL',
    onSuccess: successCb,
    // data: {
    //   pk: id,
    // }
  };
}
