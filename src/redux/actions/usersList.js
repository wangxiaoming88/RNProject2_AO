//@flow
/**
 * Fetch teacher's list.
 */
export function fetchTeachers() {
  return {
    type: 'api_call',
    url: 'users/',
    actionPrefix: 'FETCH_TEACHERS_LIST',
    data: {
      role: 'teacher'
    }
  };
}

/**
 * Fetch teacher's list paginated.
 * @param {Object<offset:number, limit:number>}} data - pagination options.
 */
export function fetchTeachersPaginated(data) {
  return {
    type: 'api_call',
    url: 'users/',
    actionPrefix: 'FETCH_TEACHERS_LIST_PAGINATED',
    data: {
      role: 'teacher',
      ...data
    }
  };
}
