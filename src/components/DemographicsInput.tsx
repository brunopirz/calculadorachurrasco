import { useStore } from '../stores/useStore'

export default function DemographicsInput() {
  const { peopleCount, demographics, setDemographics } = useStore()

  const ageGroups = [
    { label: 'Crianças (0-12)', key: 'children' },
    { label: 'Adultos (18+)', key: 'adults' }
  ]

  const genders = [
    { label: 'Masculino', key: 'male' },
    { label: 'Feminino', key: 'female' }
  ]

  const totalAge = Object.values(demographics.ageGroups).reduce((a, b) => a + b, 0);
  const totalGender = Object.values(demographics.genders).reduce((a, b) => a + b, 0);

  const presetButtons = [
    { label: '5 pessoas', adults: 5, children: 0, male: 3, female: 2 },
    { label: '10 pessoas', adults: 10, children: 0, male: 5, female: 5 },
    { label: '15 pessoas', adults: 15, children: 0, male: 8, female: 7 },
    { label: '20 pessoas', adults: 20, children: 0, male: 10, female: 10 }
  ]

  const handlePresetClick = (preset) => {
    setDemographics('ageGroups', 'adults', preset.adults)
    setDemographics('ageGroups', 'children', preset.children)
    setDemographics('genders', 'male', preset.male)
    setDemographics('genders', 'female', preset.female)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {presetButtons.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
          >
            {preset.label}
          </button>
        ))}
      </div>
      {(totalAge !== peopleCount || totalGender !== peopleCount) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
          <p className="text-xs text-red-700">
            A soma dos grupos demográficos ({totalAge} pessoas) deve corresponder ao número total de participantes ({peopleCount})
          </p>
        </div>
      )}
      <h2 className="text-lg font-semibold text-white mb-3">Distribuição Demográfica</h2>
      
      <div className="grid grid-cols-1 gap-3">
        <div>
          <h3 className="text-md font-medium text-white mb-2">Faixa Etária</h3>
          <div className="space-y-3">
            {ageGroups.map((group) => (
              <div key={group.key} className="flex items-center justify-between">
                <label className="text-sm text-white">{group.label}</label>
                <input
                  type="number"
                  value={demographics.ageGroups[group.key]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(100, Number(e.target.value) || 0))
                    setDemographics('ageGroups', group.key, value)
                  }}
                  onBlur={() => {
                    const currentSum = Object.values(demographics.ageGroups).reduce((a, b) => a + b, 0)
                    if (currentSum !== peopleCount) {
                      setDemographics('ageGroups', group.key, demographics.ageGroups[group.key])
                    }
                  }}
                  className={`w-20 px-2 py-1 border rounded-md text-sm ${totalAge !== peopleCount ? 'border-red-500' : ''}`}
                  min="0"
                  step="1"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-white mb-2">Gênero</h3>
          <div className="space-y-3">
            {genders.map((gender) => (
              <div key={gender.key} className="flex items-center justify-between">
                <label className="text-sm text-white">{gender.label}</label>
                <input
                  type="number"
                  value={demographics.genders[gender.key]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(100, Number(e.target.value) || 0))
                    setDemographics('genders', gender.key, value)
                  }}
                  onBlur={() => {
                    const currentSum = Object.values(demographics.genders).reduce((a, b) => a + b, 0)
                    if (currentSum !== peopleCount) {
                      setDemographics('genders', gender.key, demographics.genders[gender.key])
                    }
                  }}
                  className={`w-20 px-2 py-1 border rounded-md text-sm ${totalGender !== peopleCount ? 'border-red-500' : ''}`}
                  min="0"
                  step="1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}