import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useUnsavedChangesWarning = (
  condition: boolean,
  message: string = "You have unsaved changes. Do you want to leave?"
) => {
  useEffect(() => {
    if (!condition) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = ""); // Show browser prompt
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [condition]);
  useBlocker(() => (condition ? !window.confirm(message) : false));
};
