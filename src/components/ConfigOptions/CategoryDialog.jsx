import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";

const CATEGORIES = [
  "town",
  "area",
  "building",
  "mountain",
  "peninsula",
  "island",
  "water body",
  "descriptor"
];

export default function CategoryDialog(props) {
  const intl = useIntl();

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <FormattedMessage
          id="config.chooseCategories"
          defaultMessage="Choose Overlay Categories"
        />
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormGroup>
            {CATEGORIES.map(category => (
              <FormControlLabel
                key={category}
                control={
                  <Switch
                    checked={props.categories[category]}
                    onChange={() =>
                      props.onChange(category, !props.categories[category])
                    }
                    name={category}
                  />
                }
                label={intl.formatMessage({
                  id: `categories.${category}`,
                  defaultMessage: category
                })}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
