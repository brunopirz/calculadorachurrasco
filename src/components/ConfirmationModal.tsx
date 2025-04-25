import { useEffect } from 'react'

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja realizar esta ação?'
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}