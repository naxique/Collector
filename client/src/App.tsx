import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material';
import React,  { useState, useEffect, useMemo } from 'react';
import { Routes, Route, BrowserRouter, redirect } from 'react-router-dom'
import * as locales from '@mui/material/locale';
import { enUS, ruRU } from './locales/localeStrings';

import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

type SupportedLocales = keyof typeof locales;

function App() {
  const [locale, setLocale] = useState<SupportedLocales>('enUS');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localeStrings, setLocaleStrings] = useState(enUS);

  let theme = createTheme({ palette: { mode: 'dark'} }, {locale: 'enUS'});
  
  useEffect(() => {
    if (locale === 'enUS') setLocaleStrings(enUS);
    else if (locale === 'ruRU') setLocaleStrings(ruRU);
    else throw Error("Locale is not supported");
  }, [locale])
  
  theme = useMemo(
    () => createTheme({ palette: { mode: themeMode} }, locales[locale]),
    [locale, themeMode]
  );

  const topbarThemeChangeHandle = (darkMode: boolean) => {
    if (darkMode) setThemeMode('dark');
    else setThemeMode('light');
  };

  const topbarLocaleChangeHandle = (l: SupportedLocales) => {
    setLocale(l);
  };

  return (
    <StyledEngineProvider injectFirst> <ThemeProvider theme={theme}> <BrowserRouter>
      <Routes>
        <Route path='/' element={ 
          <TopBar
            themeChangeCallback={topbarThemeChangeHandle}
            localeChangeCallback={topbarLocaleChangeHandle}
            isLoggedIn={isLoggedIn}
            currentLocale={locale}
            localeStrings={localeStrings}
          /> 
        }>
          <Route index element={ <HomePage /> } />
          <Route path='login' element={ <LoginPage /> } />
          <Route path='signup' element={ <SignupPage /> } />
        </Route>
      </Routes>
    </BrowserRouter> </ThemeProvider> </StyledEngineProvider>
  );
}

export default App;