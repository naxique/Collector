import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material';
import React,  { useState, useEffect, useMemo } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import * as locales from '@mui/material/locale';
import { strings } from './locales/localeStrings';

import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import CollectionPage from './pages/CollectionPage';
import NewCollectionPage from './pages/NewCollectionPage';
import ItemPage from './pages/ItemPage';
import NewItemPage from './pages/NewItemPage';
import SearchResultsPage from './pages/SearchResultsPage';

type SupportedLocales = keyof typeof locales;
type Locale = keyof typeof strings

function App() {
  const [locale, setLocale] = useState<SupportedLocales>('enUS');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let theme = createTheme({ palette: { mode: 'dark'} }, {locale: 'enUS'});
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
            locale={locale as Locale}
          /> 
        }>
          <Route index element={ <HomePage locale={locale as Locale} /> } />
          <Route path='login' element={ <LoginPage locale={locale as Locale} /> } />
          <Route path='signup' element={ <SignupPage locale={locale as Locale} /> } />
          <Route path='user' element={ <UserPage /> } />
          <Route path='admin' element={ <AdminPage /> } />
          <Route path='collection' element={ <CollectionPage /> } />
          <Route path='newcollection' element={ <NewCollectionPage /> } />
          <Route path='item' element={ <ItemPage /> } />
          <Route path='newitem' element={ <NewItemPage /> } />
          <Route path='search' element={ <SearchResultsPage /> } />
        </Route>
      </Routes>
    </BrowserRouter> </ThemeProvider> </StyledEngineProvider>
  );
}

export default App;