import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Switch } from '../../../../components/ui/switch';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { ArrowLeft, Plus, AlertTriangle, Settings, Wrench, Calendar, Gauge, DollarSign } from 'lucide-react';
import type { MaintenanceItem, Vehicle } from '../../../types';

interface MaintenanceFormProps {
  vehicle: Vehicle;
  maintenanceItems?: MaintenanceItem[];
  onSubmit: (item: Omit<MaintenanceItem, 'id' | 'status' | 'progress' | 'dateProgress'>) => void;
  onBack: () => void;
}

export function MaintenanceForm({ vehicle, maintenanceItems = [], onSubmit, onBack }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'parts' as 'parts' | 'service',
    hasKmAlert: false,
    hasDateAlert: false,
    alertKm: 0,
    alertDate: '',
    kmBase: vehicle.currentKm || 0,
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    notes: '',
    cost: ''
  });
  const [duplicateError, setDuplicateError] = useState<string>('');
  const [selectedCommonItem, setSelectedCommonItem] = useState<string | null>(null);

  const checkForDuplicate = (itemName: string): boolean => {
    const normalizedName = itemName.trim().toLowerCase();
    return maintenanceItems.some(item => 
      item.name.trim().toLowerCase() === normalizedName
    );
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
    
    // Limpar seleção do item comum se o usuário começar a digitar manualmente
    if (selectedCommonItem && value !== selectedCommonItem) {
      setSelectedCommonItem(null);
    }
    
    // Limpar erro se o usuário está digitando
    if (duplicateError && value.trim() !== '') {
      setDuplicateError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar duplicata antes de submeter
    if (checkForDuplicate(formData.name)) {
      setDuplicateError(`O item "${formData.name}" já existe no painel. Escolha outro nome ou registre uma manutenção para o item existente.`);
      return;
    }
    
    const item: Omit<MaintenanceItem, 'id' | 'status' | 'progress' | 'dateProgress'> = {
      name: formData.name,
      type: formData.type,
      alertKm: formData.hasKmAlert ? formData.alertKm : undefined,
      alertDate: formData.hasDateAlert && formData.alertDate ? formData.alertDate : undefined,
      kmBase: formData.kmBase,
      lastMaintenanceDate: formData.lastMaintenanceDate, // Passa como string para ser processada no App.tsx
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      notes: formData.notes.trim() ? formData.notes.trim() : undefined
    };

    onSubmit(item);
  };

  const commonParts = [
    { name: 'Filtro de óleo', alertKm: 10000, cost: 55 }, // A cada 10.000 km - R$ 55,00
    { name: 'Filtro de ar condicionado/cabine', alertKm: 15000, cost: 120 }, // A cada 15.000 km - R$ 120,00
    { name: 'Pastilhas de freio', alertKm: 10000, cost: 275 }, // Inspeção a cada 10.000 km - R$ 275,00
    { name: 'Kit de embreagem (carros manuais)', alertKm: 100000, cost: 1200 }, // A cada 100.000 km - R$ 1.200,00
    { name: 'Pneus', alertKm: 40000, cost: 550 }, // A cada 40.000 km - R$ 550,00
    { name: 'Velas de ignição', alertKm: 30000, cost: 190 }, // A cada 30.000 km - R$ 190,00
    { name: 'Correia dentada', alertKm: 80000, cost: 800 }, // A cada 80.000 km - R$ 800,00
    { name: 'Amortecedores', alertKm: 60000, cost: 1650 }, // A cada 60.000 km - R$ 1.650,00
    { name: 'Bomba d\'água', alertKm: 100000, cost: 400 }, // A cada 100.000 km - R$ 400,00
    { name: 'Bateria', daysInterval: 1095, cost: 600 }, // A cada 36 meses - R$ 600,00
  ];

  const commonServices = [
    { name: 'Revisão geral', daysInterval: 365, cost: 800 }, // A cada 365 dias - R$ 800,00
    { name: 'Alinhamento e balanceamento', daysInterval: 180, cost: 185 }, // A cada 180 dias - R$ 185,00
    { name: 'Troca de óleo do motor', daysInterval: 365, alertKm: 10000, cost: 275 }, // Alerta duplo: 10.000 km ou 365 dias - R$ 275,00
    { name: 'Limpeza do ar condicionado', daysInterval: 365, cost: 275 }, // A cada 365 dias - R$ 275,00
    { name: 'Revisão da suspensão', daysInterval: 365, cost: 225 }, // A cada 365 dias - R$ 225,00
    { name: 'Revisão do sistema de freios', daysInterval: 365, cost: 275 }, // A cada 365 dias - R$ 275,00
    { name: 'Inspeção da bateria', daysInterval: 365, cost: 100 }, // A cada 12 meses (365 dias) - R$ 100,00
    { name: 'Funilaria e Pintura', daysInterval: 365, cost: 1200 }, // A cada 12 meses (365 dias) ou sob demanda - R$ 1.200,00
    { name: 'Calibrar Pneus', daysInterval: 7, cost: 0 }, // A cada 7 dias - Gratuito
    { name: 'Limpeza de bicos injetores', alertKm: 30000, cost: 300 }, // Apenas por quilometragem: a cada 30.000 km - R$ 300,00
  ];

  // Itens especiais que normalmente têm alertas tanto por tempo quanto por quilometragem
  const specialItems = [
    { 
      name: 'Bateria automotiva', 
      type: 'parts' as const,
      alertKm: undefined, // Bateria não depende de km
      daysInterval: 1095, // 3 anos
      description: 'Alerta apenas por tempo (3 anos)',
      cost: 650 // R$ 400-900 (média R$ 650)
    },
    { 
      name: 'Pneus (com alerta de tempo)', 
      type: 'parts' as const,
      alertKm: 40000,
      daysInterval: 1825, // 5 anos
      description: 'Alerta duplo: 40.000 km OU 5 anos',
      cost: 550 // R$ 300-800 (média R$ 550) por unidade
    },
    { 
      name: 'Correia dentada (com alerta de tempo)', 
      type: 'parts' as const,
      alertKm: 80000,
      daysInterval: 1460, // 4 anos
      description: 'Alerta duplo: 80.000 km OU 4 anos',
      cost: 800 // R$ 400-1200 (média R$ 800) kit completo
    }
  ];

  const selectCommonPart = (item: { name: string; alertKm?: number; daysInterval?: number; cost?: number }) => {
    // Verificar se já existe antes de selecionar
    if (checkForDuplicate(item.name)) {
      setDuplicateError(`O item "${item.name}" já existe no painel. Escolha outro nome ou registre uma manutenção para o item existente.`);
      return;
    }
    
    // Marcar como selecionado
    setSelectedCommonItem(item.name);
    
    // Configurar alertas baseado no que a peça oferece
    const hasDateAlert = !!item.daysInterval;
    const hasKmAlert = !!item.alertKm;
    
    // Calcular data de alerta se houver intervalo de dias
    let alertDate = '';
    if (item.daysInterval) {
      const date = new Date();
      date.setDate(date.getDate() + item.daysInterval);
      alertDate = date.toISOString().split('T')[0];
    }
    
    setFormData(prev => ({
      ...prev,
      name: item.name,
      type: 'parts',
      hasKmAlert,
      hasDateAlert,
      alertKm: item.alertKm || 0,
      alertDate,
      cost: item.cost !== undefined ? item.cost.toString() : '',
      notes: ''
    }));
    
    // Limpar qualquer erro anterior
    setDuplicateError('');
  };

  const selectCommonService = (item: { name: string; daysInterval?: number; alertKm?: number; cost?: number }) => {
    // Verificar se já existe antes de selecionar
    if (checkForDuplicate(item.name)) {
      setDuplicateError(`O serviço "${item.name}" já existe no painel. Escolha outro nome ou registre uma manutenção para o item existente.`);
      return;
    }
    
    // Marcar como selecionado
    setSelectedCommonItem(item.name);
    
    // Configurar alertas baseado no que o serviço oferece
    const hasDateAlert = !!item.daysInterval;
    const hasKmAlert = !!item.alertKm;
    
    // Calcular data de alerta se houver intervalo de dias
    let alertDate = '';
    if (item.daysInterval) {
      const date = new Date();
      date.setDate(date.getDate() + item.daysInterval);
      alertDate = date.toISOString().split('T')[0];
    }
    
    setFormData(prev => ({
      ...prev,
      name: item.name,
      type: 'service',
      hasKmAlert,
      hasDateAlert,
      alertKm: item.alertKm || 0,
      alertDate,
      cost: item.cost !== undefined ? item.cost.toString() : '',
      notes: ''
    }));
    
    // Limpar qualquer erro anterior
    setDuplicateError('');
  };

  const selectSpecialItem = (item: { name: string; type: 'parts' | 'service'; alertKm?: number; daysInterval?: number; cost?: number }) => {
    // Verificar se já existe antes de selecionar
    if (checkForDuplicate(item.name)) {
      setDuplicateError(`O item "${item.name}" já existe no painel. Escolha outro nome ou registre uma manutenção para o item existente.`);
      return;
    }
    
    // Calcular data de alerta se houver intervalo de dias
    let alertDate = '';
    if (item.daysInterval) {
      const date = new Date();
      date.setDate(date.getDate() + item.daysInterval);
      alertDate = date.toISOString().split('T')[0];
    }
    
    // Marcar como selecionado
    setSelectedCommonItem(item.name);
    
    setFormData(prev => ({
      ...prev,
      name: item.name,
      type: item.type,
      hasKmAlert: !!item.alertKm,
      hasDateAlert: !!item.daysInterval,
      alertKm: item.alertKm || 0,
      alertDate,
      cost: item.cost !== undefined ? item.cost.toString() : ''
    }));
    
    // Limpar qualquer erro anterior
    setDuplicateError('');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      {/* ─ TOP BAR ── */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <ThemeToggle />
        </div>
        <div className="mt-2">
          <h1 className="text-lg font-semibold">Adicionar Manutenção</h1>
          <p className="text-xs text-muted-foreground">
            Cadastre peças e serviços para acompanhar
          </p>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pt-4 pb-28">
        {/* Tipo de Manutenção */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Tipo de Manutenção
            </CardTitle>
            <CardDescription className="text-sm">
              Escolha entre troca de peças ou serviços
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <Tabs 
              value={formData.type} 
              onValueChange={(value) => {
                setFormData(prev => ({ 
                  ...prev, 
                  type: value as 'parts' | 'service',
                  name: '',
                  hasKmAlert: false,
                  hasDateAlert: false,
                  alertKm: 0,
                  alertDate: '',
                  cost: ''
                }));
                setSelectedCommonItem(null);
                setDuplicateError('');
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parts" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Troca de Peças
                </TabsTrigger>
                <TabsTrigger value="service" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Serviços
                </TabsTrigger>
              </TabsList>

              <TabsContent value="parts" className="mt-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Peças Comuns</CardTitle>
                    <CardDescription className="text-sm">
                      Selecione uma peça pré-configurada com valores de mercado 2025
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {commonParts.map((item) => {
                        const isDuplicate = checkForDuplicate(item.name);
                        const isSelected = selectedCommonItem === item.name;
                        const hasKmAlert = !!item.alertKm;
                        const hasDateAlert = !!item.daysInterval;
                        
                        return (
                          <Button
                            key={item.name}
                            variant={isSelected ? "default" : isDuplicate ? "secondary" : "outline"}
                            className={`justify-start h-auto p-3 transition-all duration-200 ${
                              isSelected 
                                ? 'ring-2 ring-primary bg-primary text-primary-foreground shadow-md transform scale-[1.02]' 
                                : isDuplicate 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-accent/50 hover:border-primary/50 hover:scale-[1.01]'
                            }`}
                            onClick={() => selectCommonPart(item)}
                            disabled={isDuplicate}
                          >
                            <div className="text-left w-full">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-sm font-medium truncate">{item.name}</span>
                                {isDuplicate && (
                                  <span className="text-xs text-muted-foreground flex-shrink-0">(já existe)</span>
                                )}
                                {isSelected && (
                                  <span className="text-xs opacity-80 flex-shrink-0">✓ Selecionado</span>
                                )}
                              </div>
                              
                              {/* Mostrar alertas - apenas km ou apenas tempo */}
                              <div className="space-y-1 mb-1">
                                {hasKmAlert && (
                                  <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    <Gauge className="w-3 h-3" />
                                    A cada {item.alertKm!.toLocaleString('pt-BR')} km
                                  </div>
                                )}
                                {hasDateAlert && (
                                  <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    <Calendar className="w-3 h-3" />
                                    A cada {item.daysInterval!} dias
                                  </div>
                                )}
                              </div>
                              
                              <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-green-600'}`}>
                                <DollarSign className="w-3 h-3" />
                                R$ {item.cost.toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="service" className="mt-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Serviços Comuns</CardTitle>
                    <CardDescription className="text-sm">
                      Selecione um serviço pré-configurado com valores de mercado 2025
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {commonServices.map((item) => {
                        const isDuplicate = checkForDuplicate(item.name);
                        const isSelected = selectedCommonItem === item.name;
                        const hasKmAlert = !!item.alertKm;
                        const hasDateAlert = !!item.daysInterval;
                        
                        return (
                          <Button
                            key={item.name}
                            variant={isSelected ? "default" : isDuplicate ? "secondary" : "outline"}
                            className={`justify-start h-auto p-3 transition-all duration-200 ${
                              isSelected 
                                ? 'ring-2 ring-primary bg-primary text-primary-foreground shadow-md transform scale-[1.02]' 
                                : isDuplicate 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-accent/50 hover:border-primary/50 hover:scale-[1.01]'
                            }`}
                            onClick={() => selectCommonService(item)}
                            disabled={isDuplicate}
                          >
                            <div className="text-left w-full">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-sm font-medium truncate">{item.name}</span>
                                {isDuplicate && (
                                  <span className="text-xs text-muted-foreground flex-shrink-0">(já existe)</span>
                                )}
                                {isSelected && (
                                  <span className="text-xs opacity-80 flex-shrink-0">✓ Selecionado</span>
                                )}
                              </div>
                              
                              {/* Mostrar alertas - duplos, apenas km ou apenas tempo */}
                              <div className="space-y-1 mb-1">
                                {hasKmAlert && hasDateAlert && (
                                  <>
                                    <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                      <Gauge className="w-3 h-3" />
                                      A cada {item.alertKm!.toLocaleString('pt-BR')} km
                                    </div>
                                    <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                      <Calendar className="w-3 h-3" />
                                      A cada {item.daysInterval!} dias
                                    </div>
                                  </>
                                )}
                                {hasKmAlert && !hasDateAlert && (
                                  <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    <Gauge className="w-3 h-3" />
                                    A cada {item.alertKm!.toLocaleString('pt-BR')} km
                                  </div>
                                )}
                                {!hasKmAlert && hasDateAlert && (
                                  <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    <Calendar className="w-3 h-3" />
                                    A cada {item.daysInterval!} dias
                                  </div>
                                )}
                              </div>
                              
                              <div className={`text-xs flex items-center gap-1 ${
                                item.cost > 0 
                                  ? (isSelected ? 'text-primary-foreground/80' : 'text-green-600')
                                  : (isSelected ? 'text-primary-foreground/80' : 'text-blue-600')
                              }`}>
                                <DollarSign className="w-3 h-3" />
                                {item.cost > 0 ? `R$ ${item.cost.toFixed(2).replace('.', ',')}` : 'Gratuito'}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Custom Form */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Detalhes da Manutenção</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome {formData.type === 'parts' ? 'Peça' : 'Serviço'} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={formData.type === 'parts' ? "Ex: Troca de óleo, Pastilhas de freio" : "Ex: Revisão geral, Alinhamento"}
                  required
                  className="w-full"
                />
                {duplicateError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{duplicateError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kmBase">Quilometragem *</Label>
                <Input
                  id="kmBase"
                  type="number"
                  value={formData.kmBase || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, kmBase: parseInt(e.target.value) || 0 }))}
                  placeholder="Km da última troca/serviço"
                  min="0"
                  required
                  className="w-full"
                />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Informe a quilometragem em que {formData.type === 'parts' ? 'esta peça foi substituída' : 'este serviço foi realizado'} pela última vez
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDate">Data da Última Manutenção *</Label>
                <Input
                  id="lastDate"
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastMaintenanceDate: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">{formData.type === 'parts' ? 'Custo da peça' : 'Custo serviço'} *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground">R$</span>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    className="w-full pl-10"
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Valores já preenchidos com médias de mercado brasileiro 2025. Ajuste conforme sua região.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={`Observações sobre ${formData.type === 'parts' ? 'esta peça' : 'este serviço'}...`}
                  className="w-full min-h-[80px]"
                  rows={3}
                />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Informações adicionais que serão exibidas no histórico de manutenção
                </p>
              </div>

              {/* Alertas */}
              <div className="space-y-4">
                <div className="space-y-4">
                  {/* Alerta por Quilometragem */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasKmAlert"
                        checked={formData.hasKmAlert}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasKmAlert: checked }))}
                      />
                      <Label htmlFor="hasKmAlert" className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Alerta por quilometragem
                      </Label>
                    </div>
                    {formData.hasKmAlert && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="alertKm">Intervalo do Alerta (km)</Label>
                        <Input
                          id="alertKm"
                          type="number"
                          value={formData.alertKm || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, alertKm: parseInt(e.target.value) || 0 }))}
                          placeholder="Ex: 10000"
                          min="1"
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          A cada quantos quilômetros você deseja {formData.type === 'parts' ? 'trocar esta peça' : 'realizar este serviço'}?
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Alerta por Data */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasDateAlert"
                        checked={formData.hasDateAlert}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasDateAlert: checked }))}
                      />
                      <Label htmlFor="hasDateAlert" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Alerta por data
                      </Label>
                    </div>
                    {formData.hasDateAlert && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="alertDate">Data do Próximo {formData.type === 'parts' ? 'Troca' : 'Serviço'}</Label>
                        <Input
                          id="alertDate"
                          type="date"
                          value={formData.alertDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, alertDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          O status ficará "Em Breve" quando faltar 7 dias ou menos para esta data
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!formData.hasKmAlert && !formData.hasDateAlert && (
                  <div className="bg-accent/30 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      {formData.type === 'parts' ? 'Peças' : 'Serviços'} sem alerta configurado irão apenas para o histórico e não aparecerão no painel de manutenção
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar ao Painel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}