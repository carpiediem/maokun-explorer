import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

export default function AboutDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const externalLink = url => (...chunks) => (
    <a href={url} target="_blank" rel="noopener noreferrer" class="external">
      {chunks}
    </a>
  );

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="about-dialog-title"
      >
        <DialogTitle id="about-dialog-title">
          <FormattedMessage
            id="about.title"
            defaultMessage="About the Mao Kun Map"
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>
              <FormattedMessage
                id="about.p1"
                values={{
                  a1: externalLink("https://en.wikipedia.org/wiki/Zheng_He"),
                  a2: externalLink("https://en.wikipedia.org/wiki/Mao_Kun_map")
                }}
              />
            </p>
            <p>
              <FormattedMessage
                id="about.p2"
                values={{
                  a1: externalLink(
                    "https://en.wikipedia.org/wiki/Yongle_Emperor"
                  ),
                  a2: externalLink(
                    "https://en.wikipedia.org/wiki/Yingya_Shenglan"
                  ),
                  a3: externalLink("https://en.wikipedia.org/wiki/Wubei_Zhi")
                }}
              />
            </p>
            <p>
              <FormattedMessage id="about.p3" />
            </p>
            <p>
              <FormattedMessage
                id="about.p4"
                values={{
                  a1: externalLink("http://rslc.us"),
                  a2: externalLink("http://www.world10k.com/blog/?page_id=192"),
                  a3: externalLink("http://www.world10k.com/world10k.html"),
                  a4: externalLink("http://www.world10k.com/blog/?p=2683"),
                  a5: externalLink(
                    "http://www1.geo.ntnu.edu.tw/climate/sihsuframe.html"
                  ),
                  a6: externalLink(
                    "https://en.wikipedia.org/wiki/Kamal_(navigation)"
                  ),
                  a7: externalLink(
                    "http://ciuhct.org/en/members/jose-manuel-malhao-pereira"
                  )
                }}
              />
            </p>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
