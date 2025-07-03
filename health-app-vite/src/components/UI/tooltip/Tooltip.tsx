import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { Portal } from "../portal/Portal";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
};

const Tooltip = ({
  content,
  children,
  placement = "top",
  offset = 8,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible || !targetRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const middleX = rect.left + rect.width / 2 + scrollX;
    const middleY = rect.top + rect.height / 2 + scrollY;

    let top = 0,
      left = 0;

    switch (placement) {
      case "top":
        top = rect.top + scrollY - offset;
        left = middleX;
        break;
      case "bottom":
        top = rect.bottom + scrollY + offset;
        left = middleX;
        break;
      case "left":
        top = middleY;
        left = rect.left + scrollX - offset;
        break;
      case "right":
        top = middleY;
        left = rect.right + scrollX + offset;
        break;
    }

    setStyle({ top, left });
  }, [visible, placement, offset]);

  const getTransform = () => {
    switch (placement) {
      case "top":
        return "translate(-50%, -100%)";
      case "bottom":
        return "translate(-50%, 0)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0, -50%)";
      default:
        return "translate(-50%, -100%)";
    }
  };

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ display: "flex" }}
      >
        {children}
      </div>

      {visible && (
        <Portal>
          <div
            style={{
              position: "absolute",
              top: style.top,
              left: style.left,
              transform: getTransform(),
              background: "#333",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 1000,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
