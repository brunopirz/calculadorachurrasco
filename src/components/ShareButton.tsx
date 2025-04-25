import { useStore } from '../stores/useStore'

export default function ShareButton() {
  const { generateShareableLink } = useStore()

  const handleShare = async () => {
    const link = generateShareableLink()
    try {
      await navigator.clipboard.writeText(link)
      alert('Link copiado para a área de transferência! Cole e compartilhe.')
    } catch (err) {
      prompt('Copie o link abaixo:', link)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors ml-4"
    >
      Compartilhar Churrasco
    </button>
  )
}