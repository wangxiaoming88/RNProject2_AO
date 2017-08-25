import moment from 'moment';

export function fetchProgressChartData() {
  let monday = moment().startOf('isoweek').format('YYYY-MM-DD HH:mm:ss');
  let sunday = moment().endOf('isoweek').format('YYYY-MM-DD HH:mm:ss');

  return {
    type: 'api_call',
    url: 'practices/timechart/',
    actionPrefix: 'FETCH_PROGRESS_CHART_DATA',
    data: {
      created_min: monday,
      created_max: sunday,
    }
  };
}

export function fetchProgressChartDataBetweenDates() {

  let date = new Date(), y = date.getFullYear(), m = date.getMonth();
  let firstDay = new Date(y, m, 1);
  let lastDay = new Date(y, m + 1, 1);

  firstDay = moment(firstDay).format('YYYY-MM-DD HH:mm:ss');
  lastDay = moment(lastDay).format('YYYY-MM-DD HH:mm:ss');
  return {
    type: 'api_call',
    url: 'practices/timechart/',
    actionPrefix: 'FETCH_PROGRESS_CHART_MONTH_DATA',
    data: {
    	created_min: firstDay,
    	created_max: lastDay,
    }
  };
}
