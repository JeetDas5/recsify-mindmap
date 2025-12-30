import React from "react";

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  type = "prompt",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[60svw] bg-(--bg-primary) rounded-md shadow-2xl overflow-hidden border border-(--border-color)">
        <div className="p-6">
          <h3 className="text-xl font-bold text-(--text-primary) mb-4">
            {title}
          </h3>
          <div className="mb-6">{children}</div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-(--bg-secondary) text-(--text-primary) font-medium hover:bg-(--bg-tertiary) transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all shadow-md active:scale-95 ${
                type === "danger"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary hover:bg-primary-hover"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
