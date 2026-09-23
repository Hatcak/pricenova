"use client";

/**
 * Workspace state that several screens share: the repricing safety controls
 * (approval queue, undo, the global stop) and the competitor-match review.
 *
 * It's in-memory on purpose — this kit ships without a backend, so a refresh
 * resets it. When Supabase is wired, swap the reducers for real mutations and
 * every screen below keeps working unchanged.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { DEMO_COOKIE } from "@/lib/supabase/config";
import {
  appliedReprices,
  pendingReprices,
  productMatches,
  repriceRules,
  type ProductMatch,
  type RepriceEvent,
} from "@/lib/demo/data";

type RuleMode = "auto" | "approval";
type MatchStatus = ProductMatch["status"];

interface AppState {
  /** Demo session — entered through "open the demo panel" rather than signup. */
  isDemo: boolean;

  /** The big red switch: false means no rule may touch a price, at all. */
  autopilot: boolean;
  setAutopilot: (on: boolean) => void;

  /** Suggestions waiting on you. Nothing here has changed your store yet. */
  pending: RepriceEvent[];
  approve: (id: string) => void;
  reject: (id: string) => void;
  approveAll: () => void;
  rejectedCount: number;

  /** Changes that did go through, newest first. Each one can be put back. */
  applied: RepriceEvent[];
  reverted: string[];
  undo: (id: string) => void;
  undoAll: () => void;

  /** Per-rule controls, mirrored from the demo rules. */
  ruleModes: Record<string, RuleMode>;
  setRuleMode: (id: string, mode: RuleMode) => void;
  rulePaused: Record<string, boolean>;
  toggleRulePause: (id: string) => void;

  /** Competitor-match review. */
  matchStatus: Record<string, MatchStatus>;
  setMatch: (id: string, status: MatchStatus) => void;
  pendingMatchCount: number;
}

const Ctx = createContext<AppState | null>(null);

/**
 * The demo marker is a cookie (set by the /demo route) rather than
 * sessionStorage, because the proxy has to see it too: that's what lets a demo
 * visitor reach the dashboard without a Supabase session. Read as an external
 * value rather than copied into state in an effect, so the server render and
 * the first client render agree.
 */
const neverChanges = () => () => {};

function readDemoFlag() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c === `${DEMO_COOKIE}=1`);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const isDemo = useSyncExternalStore(neverChanges, readDemoFlag, () => false);
  const [autopilot, setAutopilot] = useState(true);
  const [pending, setPending] = useState<RepriceEvent[]>(pendingReprices);
  const [applied, setApplied] = useState<RepriceEvent[]>(appliedReprices);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [reverted, setReverted] = useState<string[]>([]);
  const [ruleModes, setRuleModes] = useState<Record<string, RuleMode>>(() =>
    Object.fromEntries(repriceRules.map((r) => [r.id, r.mode])),
  );
  const [rulePaused, setRulePaused] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(repriceRules.map((r) => [r.id, r.status === "paused"])),
  );
  const [matchStatus, setMatchStatus] = useState<Record<string, MatchStatus>>(() =>
    Object.fromEntries(productMatches.map((m) => [m.id, m.status])),
  );


  const approve = useCallback((id: string) => {
    setPending((list) => {
      const hit = list.find((p) => p.id === id);
      if (hit) setApplied((done) => [{ ...hit, at: new Date().toISOString() }, ...done]);
      return list.filter((p) => p.id !== id);
    });
  }, []);

  const reject = useCallback((id: string) => {
    setPending((list) => {
      if (list.some((p) => p.id === id)) setRejectedCount((n) => n + 1);
      return list.filter((p) => p.id !== id);
    });
  }, []);

  const approveAll = useCallback(() => {
    setPending((list) => {
      const now = new Date().toISOString();
      setApplied((done) => [...list.map((p) => ({ ...p, at: now })), ...done]);
      return [];
    });
  }, []);

  const undo = useCallback((id: string) => {
    setReverted((list) => (list.includes(id) ? list : [...list, id]));
  }, []);

  const undoAll = useCallback(() => {
    setApplied((list) => {
      setReverted(list.map((a) => a.id));
      return list;
    });
  }, []);

  const setRuleMode = useCallback((id: string, mode: RuleMode) => {
    setRuleModes((m) => ({ ...m, [id]: mode }));
  }, []);

  const toggleRulePause = useCallback((id: string) => {
    setRulePaused((p) => ({ ...p, [id]: !p[id] }));
  }, []);

  const setMatch = useCallback((id: string, status: MatchStatus) => {
    setMatchStatus((m) => ({ ...m, [id]: status }));
  }, []);

  const pendingMatchCount = useMemo(
    () => Object.values(matchStatus).filter((s) => s === "pending").length,
    [matchStatus],
  );

  const value = useMemo<AppState>(
    () => ({
      isDemo,
      autopilot,
      setAutopilot,
      pending,
      approve,
      reject,
      approveAll,
      rejectedCount,
      applied,
      reverted,
      undo,
      undoAll,
      ruleModes,
      setRuleMode,
      rulePaused,
      toggleRulePause,
      matchStatus,
      setMatch,
      pendingMatchCount,
    }),
    [
      isDemo, autopilot, pending, approve, reject, approveAll, rejectedCount,
      applied, reverted, undo, undoAll, ruleModes, setRuleMode, rulePaused,
      toggleRulePause, matchStatus, setMatch, pendingMatchCount,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}
