import { ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  texto: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ open, texto, onClose, onConfirm }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-72 space-y-4 animate-fade">
        <p>{texto}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Cancelar</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white">Excluir</button>
        </div>
      </div>
    </div>
  );
}
