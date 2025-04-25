import { useState } from 'react'
import { useStore } from '../stores/useStore'

export default function CustomItemInput() {
  const [newItem, setNewItem] = useState({ name: '', suggested: 0, suggestedPerPerson: 0, unit: 'un', price: 0 })
  const { addCustomItem } = useStore()

  const handleAdd = () => {
    if (newItem.name && newItem.suggested > 0) {
      addCustomItem({
        ...newItem,
        id: Math.random().toString(36).substr(2, 9),
        adjustedQuantity: Math.round(newItem.suggestedPerPerson * useStore.getState().peopleCount),
        suggestedPerPerson: newItem.suggestedPerPerson
      })
      setNewItem({ name: '', suggested: 0, suggestedPerPerson: 0, unit: 'un', price: 0 })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Adicionar Item Personalizado</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nome do item"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          className="p-2 border rounded-md"
        />
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={newItem.suggested || ''}
            onChange={(e) => setNewItem({...newItem, suggested: Number(e.target.value), suggestedPerPerson: Number(e.target.value)})}
            className="w-full p-2 border rounded-md"
            placeholder="Qtd por pessoa"
            min="0"
            step="0.1"
          />
          <select
            value={newItem.unit}
            onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
            className="p-2 border rounded-md"
          >
            <option value="un">un</option>
            <option value="kg">kg</option>
            <option value="l">l</option>
          </select>
        </div>

        <input
          type="number"
          value={newItem.price || ''}
          onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
          className="p-2 border rounded-md"
          placeholder="Preço unitário"
          min="0"
          step="0.01"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Adicionar Item
        </button>
      </div>
    </div>
  )
}