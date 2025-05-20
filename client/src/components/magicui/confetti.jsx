// components/magicui/confetti.jsx
"use client";
import confetti from "canvas-confetti";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { Button } from "@/components/ui/button";

const ConfettiContext = createContext({});

const ConfettiComponent = forwardRef((props, ref) => {
  const {
    options = {}, // Default to empty object
    globalOptions = { resize: true, useWorker: true },
    manualstart = true, // Default to true to prevent auto-firing
    className,
    children,
  } = props;
  const instanceRef = useRef(null);

  const canvasRef = useCallback((node) => {
    if (node !== null) {
      if (instanceRef.current) return;
      instanceRef.current = confetti.create(node, {
        ...globalOptions,
        resize: true,
      });
    } else {
      if (instanceRef.current) {
        instanceRef.current.reset();
        instanceRef.current = null;
      }
    }
  }, [globalOptions]);

  const fire = useCallback(async (opts = {}) => {
    try {
      await instanceRef.current?.({ ...options, ...opts });
    } catch (error) {
      console.error("Confetti error:", error);
    }
  }, [options]);

  const api = useMemo(() => ({
    fire,
  }), [fire]);

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      (async () => {
        try {
          await fire();
        } catch (error) {
          console.error("Confetti effect error:", error);
        }
      })();
    }
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} className={className} />
      {children}
    </ConfettiContext.Provider>
  );
});

ConfettiComponent.displayName = "Confetti";

export const Confetti = ConfettiComponent;

const ConfettiButtonComponent = ({ options, children, ...props }) => {
  const handleClick = async (event) => {
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      await confetti({
        ...options,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      });
    } catch (error) {
      console.error("Confetti button error:", error);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

ConfettiButtonComponent.displayName = "ConfettiButton";

export const ConfettiButton = ConfettiButtonComponent;