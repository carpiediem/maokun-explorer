import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import WikipediaIcon from './WikipediaIcon';

const useStyles = makeStyles((theme) => ({
  menuArrow: { width: 25, minWidth: 25 },
}));

function MenuButtons({ anchorRef, href, open, setOpen }) {
  const classes = useStyles();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <ButtonGroup variant="text" color="primary" ref={anchorRef} aria-label="split button">
      <Button component="a" href={href} target="_blank">
        <WikipediaIcon />
      </Button>
      <Button
        size="small"
        aria-controls={open ? 'split-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
        className={classes.menuArrow}
      >
        <ArrowDropDownIcon />
      </Button>
    </ButtonGroup>
  );
}

export default MenuButtons;
