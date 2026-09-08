"use client";

import type { ReactNode } from "react";
import { Slot } from "radix-ui";
import { useCartUiStore } from "@/features/cart/cart-ui-store";

/**
 * Wraps a single child element (typically a Button) and makes it open the
 * cart drawer on click, preserving any onClick the child already has.
 *
 * Implemented with Radix's <Slot.Root> rather than React.cloneElement.
 * Both approaches are logically equivalent for merging an onClick handler
 * onto a single child, but a specific combination of Next.js 16 dev-mode
 * (Turbopack) + an async Server Component reading cookies() + a plain
 * `cloneElement` targeting an imported composite component (our <Button>)
 * reproducibly caused "Element type is invalid: ... got undefined" for the
 * *client-side* module boundary — even though every export involved is
 * correct in isolation. Slot.Root sidesteps that specific interaction and
 * is the same, already-battle-tested mechanism our own asChild-supporting
 * components (Button, Badge, etc.) use elsewhere in this codebase.
 */
export function CartSheetTrigger({ children }: { children: ReactNode }) {
  const open = useCartUiStore((state) => state.open);

  return (
    <Slot.Root onClick={() => open()}>
      {children}
    </Slot.Root>
  );
}
