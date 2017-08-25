class Utils {
  static now() {
    return Date.now || function() {
      return new Date().getTime();
    };
  }

  debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    var later = function() {
      var last = Utils.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = Utils.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }

  parseServerError(res) {
    return Object.keys(res).map((key) => res[key]).join('\n');
  }

  /**
   * Fetches data one-by-one to reduce processor work.
   *
   * @param {Array} actions - list of actions to call
   */
  chainingFetch(actions) {
    actions.map((_fetchAction) => {
      return setTimeout(() => this.props.dispatch(_fetchAction()), 4);
    });
  }

  backAndroidHandler() {
    if (this.props.navigator.getCurrentRoutes().length > 1) {
      this.props.navigator.pop();
      return true;
    }
    return false;
  }

  backAndroidHandlerPractice() {
    // if (this.props.navigator.getCurrentRoutes().length > 1) {
    //   // this.props.navigator.pop();
    //   // return true;
    // }
    // return false;
    // console.warn('tadam');
    // return true;
  }
}

export default new Utils();
