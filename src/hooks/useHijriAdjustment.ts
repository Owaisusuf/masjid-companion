import { useCallback, useEffect, useState } from "react";
import { loadHijriAdjustment, saveHijriAdjustment, type HijriAdjustment } from "@/lib/hijriAdjustmentStore";

export function useHijriAdjustment() {
  const [adjustment, setAdjustmentState] = useState<HijriAdjustment>(() => loadHijriAdjustment());

  useEffect(() => {
    const sync = () => setAdjustmentState(loadHijriAdjustment());
    window.addEventListener("storage", sync);
    window.addEventListener("masjid-hijri-adjustment-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("masjid-hijri-adjustment-changed", sync);
    };
  }, []);

  const setAdjustment = useCallback((value: number) => {
    saveHijriAdjustment(value);
    setAdjustmentState(loadHijriAdjustment());
  }, []);

  return { adjustment, setAdjustment };
}
