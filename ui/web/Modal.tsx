import React from "react";
import styled from "styled-components";
import { Card } from "./primitives";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalCard = styled(Card)`
  width: min(900px, 95vw);
`;

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>{children}</ModalCard>
    </Backdrop>
  );
}
