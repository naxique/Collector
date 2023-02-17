import { Menu } from "@mui/material";

interface MenuProps {
  children: JSX.Element[],
  anchorEl: null | HTMLElement,
  id: string,
  onClose: () => void
}

const MenuWrapper = ({ children, anchorEl, id, onClose }: MenuProps) => {
  const isMenuOpen = Boolean(anchorEl);
  
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={id}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={onClose}
    >
      {children}
    </Menu>
  );
};

export default MenuWrapper;