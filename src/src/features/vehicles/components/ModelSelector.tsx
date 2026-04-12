import { Label } from '../../../../components/ui/label';
import { getModelsByBrand } from '../data/vehicleData';
import { ChevronDown } from 'lucide-react';

interface ModelSelectorProps {
  brandId: string;
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ brandId, value, onChange }: ModelSelectorProps) {
  const models = getModelsByBrand(brandId);

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Modelo</Label>
      <div className="relative">
        <select
          id="model"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10"
        >
          <option value="" disabled>
            {models.length > 0 ? 'Selecione o modelo' : 'Digite o modelo'}
          </option>
          {models.length > 0 ? (
            models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))
          ) : (
            <option value="outro">Outro modelo</option>
          )}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      
      {/* Input para outros modelos quando não houver lista */}
      {models.length === 0 && value === 'outro' && (
        <input
          type="text"
          placeholder="Digite o modelo do veículo"
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}
    </div>
  );
}