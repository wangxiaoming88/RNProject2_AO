export function fetchAssigments() {
  return {
    type: 'api_call',
    url: 'assignments/',
    actionPrefix: 'ASSIGNMENTS_FETCH',
    data: {
      embed: 'task',
      is_finished: 'False'
    }
  };
}

export function fetchCompletedAssigments() {
  return {
    type: 'api_call',
    url: 'assignments/',
    actionPrefix: 'ASSIGNMENTS_COMPLETED_FETCH',
    data: {
      embed: 'task',
      is_finished: 'True'
    }
  };
}
