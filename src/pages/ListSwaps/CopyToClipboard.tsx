import { Button, Tooltip } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import copyToClipboard from "copy-to-clipboard";
import React from "react";

interface CopyToClipboardButtonProps {
  content: string;
  name?: string;
}

function CopyToClipboardButton({ content, name }: CopyToClipboardButtonProps) {
  name = name + " ";
  return (
    <Tooltip disableHoverListener={true} title={"Copied!"} placement={"top"}>
      <Button onClick={() => copyToClipboard(content)} color="primary">
        <FileCopy fontSize={"small"} />
        &nbsp;Copy {name}to clipboard
      </Button>
    </Tooltip>
  );
}

export default CopyToClipboardButton;
