import React from "react";

interface Props {
  href: string;
  text: string;
  openInNewTab?: boolean;
}

export default function ExternalLink({
  href,
  text,
  openInNewTab = true
}: Props) {
  const target = openInNewTab ? "_blank" : null;

  return (
    <a
      onClick={e => e.stopPropagation()}
      target={target}
      rel="noopener noreferrer"
      href={href}
    >
      {text}
    </a>
  );
}
