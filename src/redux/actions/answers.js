const basePath = 'https://dev.musopen.org/api/';

export function createAnswer(urlQuestion, description, username, id, idQuestion) {
  return {
    basePath,
    url: 'answers/',
    type: 'api_call',
    actionPrefix: 'CREATE_ANSWER',
    method: 'POST',
    data: {
      question: urlQuestion,
      description,
      username
    },
    other: {
      id,
      idQuestion
    }
  };
}

export function filterAnswer(idQuestion) {
  return {
    basePath,
    url: 'answers/?question=',
    type: 'api_call',
    actionPrefix: 'FILTER_ANSWER',
    method: 'GET',
    data: idQuestion,
  };
}

export function clearAnswer() {
  return {
    type: 'CLEAR_ANSWER',
  };
}

export function upvoteAnswer(url, username, idAnswer) {
  return {
    basePath: url,
    url: 'upvote/',
    type: 'api_call',
    actionPrefix: 'UPVOTE_ANSWER',
    method: 'PUT',
    data: {
      username,
    },
    other: {
      idAnswer
    }
  };
}

