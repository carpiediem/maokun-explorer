import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

export default function AboutDialog() {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="about-dialog-title"
      >
        <DialogTitle id="about-dialog-title">
          <FormattedMessage id="about.title" defaultMessage="The Mao Kun Map" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {" "}
            The{" "}
            <a
              href="https://en.wikipedia.org/wiki/Mao_Kun_map"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mao Kun map
            </a>{" "}
            was compiled in 1621 across many pages of the book{" "}
            <a
              href="https://en.wikipedia.org/wiki/Wubei_Zhi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wubei Zhi
            </a>
            . It's name is believed to be derived from the owner of the library
            where it was compiled. It's sources include records from many
            voyages, but the most famous of these were the treasure fleets of{" "}
            <a
              href="https://en.wikipedia.org/wiki/Zheng_He"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zheng He
            </a>{" "}
            (between 1405 and 1433). Because of this, the map is commonly
            referred to as Zheng He's Navigation Map (鄭和航海圖) in modern
            Chinese. It is the earliest Chinese map to portray an adequate
            representation of Southern Asia, Persia, Arabia and East Africa.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
