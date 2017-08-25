const basePath = 'https://dev.musopen.org/api/';

export function fetchSheetmusicAllFields(search) {
  return {
    basePath,
    url: 'sheetmusic/?search=',
    type: 'api_call',
    actionPrefix: 'SHEETMUSIC_ALL_FIELDS',
    method: 'GET',
    data: search,
  };
}

export function fetchSheetmusicById(idData) {
  return {
    basePath,
    url: 'sheetmusic/?ids=',
    type: 'api_call',
    actionPrefix: 'SHEETMUSIC_BY_ID',
    method: 'GET',
    data: idData,
    other: {
      id: idData,
    }
  };
}

export function cleanSerchResult() {
  return {
    type: 'CLEAN_SERCH_RESULT',
  };
}

export function createQuestion(url, title, description, username, id) {
  return {
    basePath,
    url: 'questions/',
    type: 'api_call',
    actionPrefix: 'CREATE_QUESTION',
    method: 'POST',
    data: {
      sheet_music: url,
      title: title,
      description: description,
      username: username,
    },
    other: {
      id
    }
  };
}

export function upvoteQuestion(url, username, id, idQuestion) {
  return {
    basePath: url,
    url: 'upvote/',
    type: 'api_call',
    actionPrefix: 'UPVOTE_QUESTION',
    method: 'PUT',
    data: {
      username,
    },
    other: {
      id,
      idQuestion
    }
  };
}

