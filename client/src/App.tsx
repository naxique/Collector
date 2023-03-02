import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import * as locales from '@mui/material/locale';
import * as network from './network/network'
import { strings } from './locales/localeStrings';

import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import CollectionPage from './pages/CollectionPage';
import ItemPage from './pages/ItemPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import { User } from './models/User';
import { useCookies } from 'react-cookie';

type SupportedLocales = keyof typeof locales;
type Locale = keyof typeof strings;

function App() {
  const [locale, setLocale] = useState<SupportedLocales>('enUS');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'theme', 'locale']);

  useEffect(() => {
    if (cookies.theme) setThemeMode(cookies.theme);
    if (cookies.locale) setLocale(cookies.locale);
    if (cookies.user) { network.setToken(cookies.user.token); setUser(cookies.user); setIsLoggedIn(true); }
  }, []);

  const setCookies = (key: any, value: string) => {
    removeCookie(key, { path: '/' });
    const exp = new Date();
    exp.setTime(exp.getTime() + 8 * 60 * 60 * 1000); // expires in 8 hours
    setCookie(key, value, { path: '/', expires: exp })
  }

  let theme = createTheme({ palette: { mode: 'dark'} }, {locale: 'enUS'});
  theme = useMemo(
    () => createTheme({ palette: { mode: themeMode} }, locales[locale]),
    [locale, themeMode]
  );

  const topbarThemeChangeHandle = (theme: 'dark' | 'light') => {
    setThemeMode(theme);
    setCookies('theme', theme);
  };
  const topbarLocaleChangeHandle = (l: SupportedLocales) => {
    setLocale(l);
    setCookies('locale', l);
  };

  const userpageLoginSubmitCallback = (user: User) => {
    setUser(user);
    network.setToken(user.token);
    setCookies('user', JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const topbarHandleLogout = () => {
    setIsLoggedIn(false);
    removeCookie('user', { path: '/' });
  };

  return (
    <StyledEngineProvider injectFirst> <ThemeProvider theme={theme}> <BrowserRouter>
      <Routes>
        <Route path='/' 
          errorElement={ <NotFoundPage /> } 
          element={ 
            <TopBar
              theme={themeMode}
              themeChangeCallback={topbarThemeChangeHandle}
              localeChangeCallback={topbarLocaleChangeHandle}
              logoutCallback={topbarHandleLogout}
              isLoggedIn={isLoggedIn}
              locale={locale as Locale}
              cookies={ cookies }
            />
        }>
          <Route errorElement={ <NotFoundPage /> } />
          <Route index element={ <HomePage locale={locale as Locale} /> } />
          <Route path='login' element={ <LoginPage locale={locale as Locale} loginSubmitCallback={userpageLoginSubmitCallback} /> } />
          <Route path='signup' element={ <SignupPage locale={locale as Locale} /> } />
          <Route path='user/:userId' element={ <UserPage locale={locale as Locale} cookies={ cookies } /> } />
          <Route path='admin' element={ <AdminPage /> } />
          <Route path='collection/:collectionId' element={ <CollectionPage locale={locale as Locale} cookies={ cookies } /> } />
          <Route path='collection/:collectionId/:itemId' element={ <ItemPage locale={locale as Locale} cookies={ cookies } /> } />
          <Route path='search' element={ <SearchResultsPage /> } />
        </Route>
      </Routes>
    </BrowserRouter> </ThemeProvider> </StyledEngineProvider>
  );
}

export default App;