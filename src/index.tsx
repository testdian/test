/**
 * @description 入口
 */
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './api/request';
import App from './App';
import { AntProvider } from './components/AntdProvider';
import { LocaleProvider } from './components/LocaleProvider';
import config from './config';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { USER_KEY } from './store/module/user';
import { isPrototypeDemo } from './utils/prototypeDemo';

if (isPrototypeDemo()) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      accessToken: 'test',
      refreshToken: 'test',
      username: 'test',
      realName: 'test',
      userType: 0,
    }),
  );
  const base = config.BASENAME || '';
  if ([base, `${base}/`].includes(window.location.pathname)) {
    window.history.replaceState({}, '', `${base}/home`);
  }
}

createRoot(document.getElementById('root') || document.body).render(
  <LocaleProvider>
    <AntProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AntProvider>
  </LocaleProvider>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line
reportWebVitals(console.warn);
