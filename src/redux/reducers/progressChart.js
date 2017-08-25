let initialState = {
  datasets:
    {
      values: [],
      start_date: ''
    },
  monthDatasets: {
      values: [],
      start_date: ''
  },
  status: 'fresh'
};

export default function progressChartReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_PROGRESS_CHART_DATA_REQUEST':
      return Object.assign({}, state, {...initialState,
        status: 'fetching'
      });

    case 'FETCH_PROGRESS_CHART_DATA_SUCCESS':
      let datasets; // works for one dataset only

      Object.keys(action.data.datasets).map((key) => {
        datasets = action.data.datasets[key];
      });

      return Object.assign({}, state, {
        datasets,
        status: 'fetched'
      });

    case 'FETCH_PROGRESS_CHART_DATA_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

      // --------------

    case 'FETCH_PROGRESS_CHART_MONTH_DATA_REQUEST':
      return Object.assign({}, state, {...initialState,
        status: 'fetching'
      });

    case 'FETCH_PROGRESS_CHART_MONTH_DATA_SUCCESS':
      let monthDatasets; // works for one dataset only

      Object.keys(action.data.datasets).map((key) => {
        monthDatasets = action.data.datasets[key];
      });

      return Object.assign({}, state, {
        monthDatasets,
        status: 'fetched'
      });

    case 'FETCH_PROGRESS_CHART_MONTH_DATA_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

      // --------------
      
    default:
      return state;
  }
}
