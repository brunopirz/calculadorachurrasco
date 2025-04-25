import { useStore } from './stores/useStore'
import ItemsList from './components/ItemsList'
import Summary from './components/Summary'
import ThemeToggle from './components/ThemeToggle'
import ShareButton from './components/ShareButton'
import DemographicsInput from './components/DemographicsInput'
import CustomItemInput from './components/CustomItemInput'
import Logo from './components/Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

export default function App() {
  const { theme } = useStore()

  // Aplicar o tema ao elemento HTML
  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    // Aplicar cores de fundo e texto baseadas no tema (via style.css :root e @media)
    <div className="min-h-screen flex flex-col items-center py-4 px-4 fade-in overflow-auto bg-gradient-to-b from-orange-100 to-orange-200 dark:from-gray-800 dark:to-gray-900">
      <Logo />
      {/* Container principal com formato mais quadrado */}
      <div className="bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] shadow-lg rounded-lg p-4 calculator-container">
        {/* Cabeçalho com título e toggle de tema */}
        <header className="flex justify-between items-center mb-4 border-b pb-3 border-[var(--color-border)]">
          <h1 className="text-2xl font-bold flex items-center">
            <FontAwesomeIcon icon={faUtensils} className="mr-2 text-[var(--color-secondary)]" />
            Calculadora de Churrasco
          </h1>
          <ThemeToggle />
        </header>

        <div className="flex flex-col md:flex-row gap-4 h-full">
          {/* Coluna da esquerda */}
          <div className="md:w-1/2 flex flex-col gap-4">
            {/* Seção de Inputs */}
            <section className="grid grid-cols-1 gap-4">
              <DemographicsInput />
            </section>
            
            {/* Lista de Itens */}
            <section>
              <ItemsList />
            </section>
            
            {/* Item personalizado ao final */}
            <section className="mt-4">
              <CustomItemInput />
            </section>
          </div>
          
          {/* Coluna da direita */}
          <div className="md:w-1/2 flex flex-col gap-4">
            {/* Resumo e Botão de Compartilhar */}
            <section>
              <Summary />
            </section>

            <footer className="flex justify-end mt-auto">
              <ShareButton />
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}