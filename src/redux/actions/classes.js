import {
  Alert
} from 'react-native';

import Utils from '../../services/utils';

export function fetchJoinedClasses() {
  return {
    type: 'api_call',
    url: 'classes/personal/',
    actionPrefix: 'FETCH_CLASSES_PERSONAL',
  };
}

export function fetchTeachersClasses(teacherId) {
  return {
    type: 'api_call',
    url: 'classes/',
    actionPrefix: 'FETCH_TEACHERS_CLASSES',
    data: {
      teacher: teacherId
    }
  };
}

export function teachersClassSignUp(data, successCb, errorCb) {
  return {
    type: 'api_call',
    url: 'memberships/',
    method: 'post',
    actionPrefix: 'TEACHER_CLASS_SIGNUP',
    data,
    onSuccess: successCb && successCb,
    onError: errorCb && errorCb
  };
}

function fetchMembershipsList(onSuccessCb, onErrorCb) {
  return {
    type: 'api_call',
    url: 'memberships/',
    actionPrefix: 'FETCH_MEMBERSHIPS_LIST',
    onSuccess: onSuccessCb,
    onError: onErrorCb
  };
}

function leaveMembership(mid, onSuccessCb, onErrorCb) {
  return {
    type: 'api_call',
    url: `memberships/${mid}/`,
    method: 'delete',
    actionPrefix: 'TEACHER_MEMBERSHIP_LEAVE',
    onSuccess: onSuccessCb,
    onError: onErrorCb
  };
}

function _leaveClass(cid, onSuccessCb, onErrorCb) {
  return {
    type: 'TEACHER_CLASS_LEAVE_SUCCESS',
    cid: cid,
    onSuccess: onSuccessCb,
    onError: onErrorCb
  };
}

export function teachersClassLeave(data, onSuccessCb, onErrorCb) {
  return (dispatch) => {
    dispatch(fetchMembershipsList((res) => {
      if (res && res.length) {
        let membership = res.find((item) => {
          let _mid = item.student_class.split('/');
          _mid = _mid.slice(_mid.length - 2, _mid.length - 1);

          return Number(data.id) === Number(_mid);
        });

        if (membership) {
          let _mid = membership.url.split('/');
          _mid = _mid.slice(_mid.length - 2, _mid.length - 1);

          dispatch(leaveMembership(_mid, () => {
            dispatch(_leaveClass(data.id), onSuccessCb, onErrorCb);
          }, onErrorCb));
        } else {
          onErrorCb && onErrorCb();
        }
      } else {
        onErrorCb && onErrorCb();
      }
    }));
  };
}

export function teachersClassSignUpById(data, successCb, errorCb) {
  return (dispatch) => {
    dispatch(teachersClassFetchById(data.classId, (res) => {
      if (res.length) {
        dispatch(teachersClassSignUp({
          student: data.student,
          student_class: res[0].url
        }, successCb, errorCb));
      } else {
        errorCb();
      }
    }, errorCb));
  };
}

function teachersClassFetchById(classId, successCb, errorCb) {
  return {
    type: 'api_call',
    url: `classes/${classId}/`,
    actionPrefix: 'TEACHER_CLASS_FETCH_BY_ID',
    onSuccess: successCb,
    onError: errorCb
  };
}

export function sendTeacherQuestion(cid, data, onSuccessCb, onErrorCb) {
  console.warn('sendTeacherQuestion', {cid, data, onSuccessCb, onErrorCb});
  return {
    type: 'api_call',
    url: `classes/${cid}/feedback/`,
    method: 'post',
    actionPrefix: 'SEND_TEACHER_QUESTION',
    data,
    onSuccess: (res) => {
      Alert.alert('Question sent', 'Thank you!');
      onSuccessCb && onSuccessCb();
    },
    onError: (errRes) => {
      Alert.alert('Sending message failure', Utils.parseServerError(errRes));
      onErrorCb && onErrorCb();
    }
  };
}
