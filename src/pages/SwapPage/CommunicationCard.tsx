import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardHeader } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import { CommunicationStatus, Role } from "../../api/swapTypes";

interface CommunicationCardHeaderProps {
  status: CommunicationStatus;
  role: Role;
}

function CommunicationCardHeader({
  status,
  role
}: CommunicationCardHeaderProps) {
  if (status === CommunicationStatus.Sent && role === Role.Alice) {
    return (
      <CardHeader
        title="Swap request sent"
        subheader="Waiting for the other party to respond"
        avatar={<SendIcon />}
      />
    );
  } else if (status === CommunicationStatus.Accepted && role === Role.Alice) {
    return (
      <CardHeader
        title="Your swap request was accepted!"
        avatar={<FontAwesomeIcon icon={faHandshake} />}
      />
    );
  } else if (status === CommunicationStatus.Rejected && role === Role.Alice) {
    return <CardHeader title="Swap request declined :(" />;
  } else if (status === CommunicationStatus.Sent && role === Role.Bob) {
    return (
      <CardHeader
        title="Swap request received"
        subheader="Please respond to the swap request"
        avatar={<SendIcon />}
      />
    );
  } else if (status === CommunicationStatus.Accepted && role === Role.Bob) {
    return (
      <CardHeader
        title="You have accepted this swap request"
        avatar={<FontAwesomeIcon icon={faHandshake} />}
      />
    );
  } else {
    return <CardHeader title="You have declined this swap request" />;
  }
}

export default CommunicationCardHeader;
