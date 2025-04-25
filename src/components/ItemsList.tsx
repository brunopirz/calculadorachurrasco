import { useStore } from '../stores/useStore'
import { useState, useMemo, useCallback } from 'react' // Import useCallback
import ConfirmationModal from './ConfirmationModal'
import type { Item } from '../stores/useStore'

export default function ItemsList() {
  const { items, peopleCount, demographics, setItemQuantity, setItemPrice, deleteItem, ageMultipliers, genderMultipliers } = useStore()
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Wrap in useCallback and add dependencies
  const calculateDemographicQuantity = useCallback((item: Item) => {
    const total = Object.entries(demographics.ageGroups).reduce((acc, [group, count]) => acc + (count * (ageMultipliers[group] || 1)), 0)
                   + Object.entries(demographics.genders).reduce((acc, [gender, count]) => acc + (count * (genderMultipliers[gender] || 1)), 0);
    
    // Ensure peopleCount is at least 1 to avoid division by zero
    const effectivePeopleCount = Math.max(1, peopleCount);
    // Calculate the average multiplier based on demographics
    const averageMultiplier = total / effectivePeopleCount;

    return item.suggestedPerPerson * averageMultiplier;
  }, [demographics, ageMultipliers, genderMultipliers, peopleCount]);

  // Removed unused useMemo for totalDemographic

  return (
    <>
      <div className="bg-white dark:bg-[var(--color-background-dark)] rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex justify-between items-center">
  Itens do Churrasco
  <span className="text-sm font-normal text-gray-600 dark:text-gray-300">{items.length} itens listados</span>
</h2>
        
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-100">{item.name}</h3>
                  <button 
                    onClick={() => setItemToDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Remover item"
                  >
                    ×
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {/* Call the memoized function here */}
                  Sugerido: {calculateDemographicQuantity(item).toFixed(2)} {item.unit}
                </span>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Quantidade ({item.unit})
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700" // Adjusted styling
                        onClick={() => setItemQuantity(item.id, Math.max(0, item.adjustedQuantity - 1))}
                       disabled={item.adjustedQuantity <= 0} // Disable if quantity is 0
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.adjustedQuantity}
                        readOnly // Keep readOnly if direct input isn't desired
                       className="w-16 text-center border border-gray-300 rounded px-2 py-1" // Adjusted styling
                      />
                      <button 
                       className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700" // Adjusted styling
                        onClick={() => setItemQuantity(item.id, item.adjustedQuantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </label>
                </div>
  
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Preço Unitário (R$)
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => setItemPrice(item.id, Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      min="0"
                      step="0.01"
                     placeholder="0.00" // Add placeholder
                    />
                  </label>
                </div>
  
                <div className="flex items-end">
                  <span className="text-lg font-semibold text-gray-700">
                    Subtotal: R$ {(item.adjustedQuantity * item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onConfirm={() => {
          if (itemToDelete) {
            deleteItem(itemToDelete)
            setItemToDelete(null)
          }
        }}
        onCancel={() => setItemToDelete(null)}
        title="Remover item"
        message="Tem certeza que deseja remover este item permanentemente?"
      />
    </>
  )
}