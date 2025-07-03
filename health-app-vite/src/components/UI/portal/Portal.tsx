import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type PortalProps = {
  children: ReactNode;
  containerId?: string; // по умолчанию "portal-root"
};

export const Portal = ({
  children,
  containerId = "portal-root",
}: PortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(containerId);

    if (!el) {
      el = document.createElement("div");
      el.id = containerId;
      document.body.appendChild(el);
    }

    setContainer(el);
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};
