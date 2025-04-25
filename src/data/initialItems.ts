import type { Item } from '../stores/useStore'

export const initialItems: Item[] = [
  {
    id: 'carne',
    name: 'Carne',
    suggested: 0.3,
    suggestedPerPerson: 0.3,
    unit: 'kg',
    price: 0,
    adjustedQuantity: 0,
    ageMultipliers: {
      'adults': 1.2,
      'children': 0.5
    }
  },
  {
    id: 'cerveja',
    name: 'Cerveja',
    suggested: 2.838,
    suggestedPerPerson: 2.838,
    unit: 'l',
    price: 0,
    adjustedQuantity: 0
  },
  {
    id: 'linguica',
    name: 'Linguiça',
    suggested: 0.15,
    suggestedPerPerson: 0.15,
    unit: 'kg',
    price: 0,
    adjustedQuantity: 0
  },
  {
    id: 'asa',
    name: 'Asa',
    suggested: 0.2,
    suggestedPerPerson: 0.2,
    unit: 'kg',
    price: 0,
    adjustedQuantity: 0
  },
  {
    id: 'carvao',
    name: 'Carvão',
    suggested: 0.1,
    suggestedPerPerson: 0.1,
    unit: 'kg',
    price: 20,
    adjustedQuantity: 1
  }
];