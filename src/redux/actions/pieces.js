export function fetchPieces() {
  return {
    type: 'api_call',
    url: 'pieces/',
    actionPrefix: 'FETCH_PIECES'
  };
}
