import { AppBar, Box, Toolbar, Typography, Container, Button, IconButton, FormGroup, FormControlLabel, Switch, Tooltip, InputLabel, Select, MenuItem } from '@mui/material/';
import { Search, SearchIconWrapper, StyledInputBase } from './SearchBar';
import React,  { useState } from 'react';
import MenuWrapper from './MenuWrapper';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { enUS } from '../locales/localeStrings';
import * as locales from '@mui/material/locale';
import { Link, Outlet } from 'react-router-dom';

type SupportedLocales = keyof typeof locales;

interface TopBarProps {
  themeChangeCallback: (darkMode: boolean) => void,
  localeChangeCallback: (l: SupportedLocales) => void,
  isLoggedIn: boolean,
  localeStrings: typeof enUS,
  currentLocale: SupportedLocales
}

const TopBar = ({ themeChangeCallback, localeChangeCallback, isLoggedIn, currentLocale, localeStrings }: TopBarProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [darkModeSwitch, setDarkModeSwitch] = useState(true);

  const handleSettingsMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(e.currentTarget);
  }

  const handleSettingsMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleThemeSwitch = () => {
    setDarkModeSwitch(!darkModeSwitch);
    themeChangeCallback(!darkModeSwitch);
  };
  
  return (<>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            COLLECTOR
          </Typography>
          
          <Box sx={{ flexGrow: 1 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={localeStrings.SearchItems}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            { !isLoggedIn &&
              <Button key="login" component={Link} to='/login' sx={{ my: 2, color: 'white', display: 'block' }}>
                {localeStrings.Login}
              </Button>
            } { isLoggedIn &&
              <Tooltip title={localeStrings.OpenAccountPage}>
                <IconButton component={Link} to={`/user/${1}`} aria-label='Account'>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            }
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={localeStrings.OpenSettings}>
              <IconButton aria-label='Settings' onClick={handleSettingsMenuOpen}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

    <MenuWrapper id='settingsMenu' onClose={handleSettingsMenuClose} anchorEl={menuAnchorEl}>
      <Box sx={{ margin: '.1rem 1rem' }}>
        <FormGroup>
          <FormControlLabel control={<Switch checked={darkModeSwitch} onChange={handleThemeSwitch} />} label={localeStrings.DarkTheme} />
        </FormGroup>
      </Box>
      <Box sx={{ margin: '.3rem 1rem' }}>
        <FormGroup>
        <InputLabel id="locale-select">{localeStrings.Language}</InputLabel>
          <Select
            labelId="locale-select"
            id="locale-select"
            value={currentLocale}
            onChange={(e: any) => { localeChangeCallback(e.target.value as SupportedLocales) }}
            label={localeStrings.Language}
          >
            <MenuItem value='enUS'>English</MenuItem>
            <MenuItem value='ruRU'>Русский</MenuItem>
          </Select>
        </FormGroup>
      </Box>
    </MenuWrapper>

    <Outlet />
  </>)
};

export default TopBar;