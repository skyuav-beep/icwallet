'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

export type PortalRole = "merchant" | "admin";

export interface PortalSection {
  id: string;
  href: string;
  label: string;
  labelKr: string;
  description?: string;
  descriptionKr?: string;
}

interface PortalState {
  role: PortalRole;
  sections: PortalSection[];
  activeSection: string | null;
}

type PortalAction =
  | { type: "set-sections"; sections: PortalSection[] }
  | { type: "set-active"; sectionId: string | null };

export interface PortalContextValue extends PortalState {
  setActiveSection: (sectionId: string | null) => void;
  registerSections: (sections: PortalSection[]) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

function portalReducer(state: PortalState, action: PortalAction): PortalState {
  switch (action.type) {
    case "set-sections": {
      const nextSections = action.sections;
      const currentIsValid = nextSections.some(
        (section) => section.id === state.activeSection,
      );
      return {
        ...state,
        sections: nextSections,
        activeSection: currentIsValid
          ? state.activeSection
          : nextSections[0]?.id ?? null,
      };
    }
    case "set-active": {
      if (
        action.sectionId !== null &&
        !state.sections.some((section) => section.id === action.sectionId)
      ) {
        return state;
      }
      return { ...state, activeSection: action.sectionId };
    }
    default:
      return state;
  }
}

export function PortalProvider({
  role,
  initialSections,
  children,
}: {
  role: PortalRole;
  initialSections: PortalSection[];
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(portalReducer, {
    role,
    sections: initialSections,
    activeSection: initialSections[0]?.id ?? null,
  });

  const setActiveSection = useCallback((sectionId: string | null) => {
    dispatch({ type: "set-active", sectionId });
  }, []);

  const registerSections = useCallback((sections: PortalSection[]) => {
    dispatch({ type: "set-sections", sections });
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({
      role: state.role,
      sections: state.sections,
      activeSection: state.activeSection,
      setActiveSection,
      registerSections,
    }),
    [registerSections, setActiveSection, state],
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortalContext() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error(
      "Portal context unavailable. Wrap the tree with <PortalProvider />.",
    );
  }
  return context;
}

export function usePortalSections() {
  const { sections, activeSection, setActiveSection } = usePortalContext();
  return { sections, activeSection, setActiveSection };
}
