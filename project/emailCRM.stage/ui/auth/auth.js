const API = {
  login: 'login',
  signup: 'signup',
  validate: 'validateSession'
};

function callApi(fn, args = []) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(err => reject(err.message || err))
      [fn](...args);
  });
}

function saveSession(token) {
  localStorage.setItem('session_token', token);
}

function getSession() {
  return localStorage.getItem('session_token');
}

function clearSession() {
  localStorage.removeItem('session_token');
}
