import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

function DroppableArea({ id, children }: { id: string; children: ReactNode }) {
  const { setNodeRef } = useDroppable({ id });

  return <div ref={setNodeRef}>{children}</div>;
}

export default DroppableArea;
