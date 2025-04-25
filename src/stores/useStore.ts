import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { initialItems } from '../data/initialItems'

export interface Item {
  id: string
  name: string
  suggested: number
  suggestedPerPerson: number
  unit: string
  adjustedQuantity: number
  price: number
  ageMultipliers?: Record<string, number>
  genderMultipliers?: Record<string, number>
}

interface StoreState {
  peopleCount: number
  items: Item[]
  demographics: {
    ageGroups: Record<string, number>
    genders: Record<string, number>
  }
  ageMultipliers: Record<string, number>
  genderMultipliers: Record<string, number>
  theme: 'light' | 'dark'
  setPeopleCount: (count: number) => void
  toggleTheme: () => void
  setItemQuantity: (id: string, quantity: number) => void
  setItemPrice: (id: string, price: number) => void
  setDemographics: (category: 'ageGroups' | 'genders', key: string, value: number) => void
  total: () => number
  serializeState: () => string
  deserializeState: (encoded: string) => void
  generateShareableLink: () => string
  addCustomItem: (item: Omit<Item, 'id'> & { id: string; suggestedPerPerson: number }) => void
  deleteItem: (id: string) => void
}



export const useStore = create<StoreState>()(persist(
    (set, get) => ({
      peopleCount: 10,
      items: initialItems,
      demographics: {
        ageGroups: { children: 0, adults: 0 },
        genders: { male: 0, female: 0 }
      },
      ageMultipliers: { children: 0.7, adults: 1.0 },
      genderMultipliers: { male: 1.2, female: 0.9 },
      serializeState: () => {
        const state = get()
        return btoa(JSON.stringify({
          peopleCount: state.peopleCount,
          items: state.items,
          demographics: state.demographics,
          ageMultipliers: state.ageMultipliers,
          genderMultipliers: state.genderMultipliers
        }))
      },
      deserializeState: (encoded) => {
        try {
          const state = JSON.parse(atob(encoded))
          set({
            peopleCount: state.peopleCount,
            items: state.items,
            demographics: state.demographics,
            ageMultipliers: state.ageMultipliers,
            genderMultipliers: state.genderMultipliers
          })
        } catch (e) {
          console.error('Erro ao decodificar estado:', e)
        }
      },
      generateShareableLink: () => {
        return `${window.location.origin}${window.location.pathname}?state=${get().serializeState()}`
      },
      setPeopleCount: (count) => set({ peopleCount: Math.max(1, count) }),
      setItemQuantity: (id, quantity) => set(state => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, adjustedQuantity: quantity } : item
        )
      })),
      setItemPrice: (id, price) => set(state => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, price } : item
        )
      })),
      setDemographics: (category, key, value) => {
        set((state) => {
          const newValue = Math.max(0, value)
          const currentCategory = { ...state.demographics[category] }
          const currentSum = Object.values(currentCategory).reduce((a, b) => a + b, 0)
          
          const adjustedValue = Math.min(
            newValue,
            state.peopleCount - (currentSum - (currentCategory[key] || 0))
          )

          return {
            demographics: {
              ...state.demographics,
              [category]: {
                ...currentCategory,
                [key]: adjustedValue
              }
            }
          }
        })
      },
      total: () => get().items.reduce(
        (acc, item) => acc + (item.adjustedQuantity * (item.price || 0)),
        0
      ),
      addCustomItem: (item) => set(state => ({
        items: [...state.items, item]
      })),
      deleteItem: (id) => set(state => ({
        items: state.items.filter(item => item.id !== id)
      })),
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      }
    }),
    {
      name: 'churrasco-storage',
      storage: createJSONStorage(() => localStorage)
    }
  ))