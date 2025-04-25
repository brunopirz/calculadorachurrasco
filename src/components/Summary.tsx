import { useStore } from '../stores/useStore'
import jsPDF from 'jspdf'

export default function Summary() {
  const { peopleCount, total, items, demographics } = useStore()
  const totalCost = total()
  const carvaoItem = items.find(item => item.name === 'Carvão')
  const carvaoTotal = carvaoItem ? carvaoItem.adjustedQuantity * carvaoItem.price : 0
  const totalSemCarvao = totalCost - carvaoTotal
  const costPerPerson = peopleCount > 0 ? totalSemCarvao / peopleCount + (carvaoTotal / peopleCount) : 0
  
  const calculatePerPerson = () => {
    // A interface já mostra os valores por pessoa automaticamente
    // então não precisamos fazer nada aqui, pois já está implementado no JSX
    return
  }

  const generatePDF = async () => {
    try {
      const doc = new jsPDF()
      
      // Configurar cabeçalho
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('Lista do Churrasco', 105, 20, { align: 'center' })
      
      // Detalhes participantes
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Participantes: ${peopleCount} pessoa${peopleCount !== 1 ? 's' : ''}`, 15, 35)
      
      // Tabela de itens
      let yPosition = 45
      doc.setFillColor(240, 240, 240)
      doc.rect(15, yPosition, 180, 10, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('Item', 20, yPosition + 7)
      doc.text('Quantidade', 90, yPosition + 7)
      doc.text('Por Pessoa', 130, yPosition + 7)
      doc.text('Valor', 170, yPosition + 7)
      
      yPosition += 15
      doc.setFont('helvetica', 'normal')
      items.forEach((item) => {
        if(item.adjustedQuantity > 0) {
          doc.text(item.name, 20, yPosition)
          doc.text(`${item.adjustedQuantity} ${item.unit}`, 90, yPosition)
          if (item.name === 'Carvão') {
            doc.text('Total', 130, yPosition)
          } else {
            const perPerson = item.adjustedQuantity / peopleCount
            const displayValue = item.unit.toLowerCase() === 'kg' ? (perPerson * 1000).toFixed(0) : 
                               item.unit.toLowerCase() === 'l' ? (perPerson * 1000).toFixed(0) : 
                               perPerson.toFixed(2)
            const displayUnit = item.unit.toLowerCase() === 'kg' ? 'gr' : 
                               item.unit.toLowerCase() === 'l' ? 'ml' : 
                               item.unit
            doc.text(`${displayValue} ${displayUnit}`, 130, yPosition)
          }
          doc.text(`R$ ${(item.adjustedQuantity * item.price).toFixed(2)}`, 170, yPosition)
          yPosition += 8
        }
      })
      
      yPosition += 10
      // Detalhes demográficos
      doc.setFont('helvetica', 'bold')
      doc.text('Distribuição Etária:', 15, yPosition)
      yPosition += 8
      doc.setFont('helvetica', 'normal')
      Object.entries(demographics.ageGroups).forEach(([group, count]) => {
        if(count > 0) {
          doc.text(`${group}: ${count} (${((count / peopleCount) * 100).toFixed(1)}%)`, 20, yPosition)
          yPosition += 6
        }
      })
      
      yPosition += 5
      doc.setFont('helvetica', 'bold')
      doc.text('Distribuição de Gênero:', 15, yPosition)
      yPosition += 8
      doc.setFont('helvetica', 'normal')
      Object.entries(demographics.genders).forEach(([gender, count]) => {
        if(count > 0) {
          doc.text(`${gender}: ${count} (${((count / peopleCount) * 100).toFixed(1)}%)`, 20, yPosition)
          yPosition += 6
        }
      })
      
      yPosition += 10
      doc.setFont('helvetica', 'bold')
      doc.text(`Total: R$ ${totalCost.toFixed(2)}`, 15, yPosition)
      yPosition += 8
      doc.text(`Custo por pessoa: R$ ${costPerPerson.toFixed(2)}`, 15, yPosition)
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text('Gerado por Churrasco Calculator', 105, 280, { align: 'center' })
      
      doc.save('lista-churrasco.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar o PDF. Por favor, tente novamente.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-gray-800">Total Estimado</h2>
          <p className="text-2xl font-bold text-blue-600">
            R$ {totalCost.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            R$ {costPerPerson.toFixed(2)} por pessoa
          </p>
          <div className="mt-2 text-sm text-gray-600">
            {items.map((item) => {
              if (item.name === 'Carvão') {
                return <p key={item.id}>{item.name}: Total {item.adjustedQuantity} {item.unit}</p>;
              }
              const perPerson = item.adjustedQuantity / peopleCount;
              const displayValue = item.unit.toLowerCase() === 'kg' ? (perPerson * 1000).toFixed(0) : 
                                 item.unit.toLowerCase() === 'l' ? (perPerson * 1000).toFixed(0) : 
                                 perPerson.toFixed(2);
              const displayUnit = item.unit.toLowerCase() === 'kg' ? 'gr' : 
                                 item.unit.toLowerCase() === 'l' ? 'ml' : 
                                 item.unit;
              return (
                <p key={item.id}>{item.name}: {displayValue} {displayUnit}/pessoa</p>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={generatePDF}
          >
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  )
}