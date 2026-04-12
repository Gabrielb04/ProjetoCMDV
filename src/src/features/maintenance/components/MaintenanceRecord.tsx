import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Switch } from '../../../../components/ui/switch';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { ArrowLeft, Wrench, Calendar, Gauge, DollarSign } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import type { MaintenanceItem, MaintenanceRecord as MaintenanceRecordType, Vehicle } from '../../../types';

interface MaintenanceRecordProps {
  vehicle: Vehicle;
  maintenanceItems: MaintenanceItem[];
  maintenanceHistory?: MaintenanceRecordType[];
  onSubmit: (record: Omit<MaintenanceRecordType, 'id'> & { nextAlertDate?: Date; shouldAddToPanel?: boolean }) => void;
  onBack: () => void;
}

export function MaintenanceRecord({ vehicle, maintenanceItems, maintenanceHistory = [], onSubmit, onBack }: MaintenanceRecordProps) {
  // Filtrar apenas itens com alerta configurado (KM ou data)
  const itemsWithAlert = maintenanceItems.filter(item => item.alertKm || item.alertDate);
  const [formData, setFormData] = useState({
    itemId: '',
    date: new Date().toISOString().split('T')[0],
    km: vehicle.currentKm,
    notes: '',
    nextAlertDate: '',
    cost: '',
    enableAlert: true // Novo campo para controlar se o alerta deve ser ativado
  });

  const selectedItem = itemsWithAlert.find(item => item.id === formData.itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem) return;

    // Para serviços, verificar se data de alerta é obrigatória quando alerta está ativo
    if (selectedItem.type === 'service' && formData.enableAlert && selectedItem.alertDate && !formData.nextAlertDate) {
      return; // Não submeter se data é obrigatória mas não foi preenchida
    }

    const record: Omit<MaintenanceRecordType, 'id'> & { nextAlertDate?: Date; shouldAddToPanel?: boolean } = {
      itemId: formData.itemId,
      itemName: selectedItem.name,
      date: formData.date as any, // Passa como string para ser processada no App.tsx
      km: formData.km,
      notes: formData.notes || undefined,
      nextAlertDate: formData.enableAlert && formData.nextAlertDate ? new Date(formData.nextAlertDate) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      shouldAddToPanel: formData.enableAlert // Controla se deve ir para o painel ou só para o histórico
    };

    onSubmit(record);
  };

  const getItemStatusInfo = (item: MaintenanceItem) => {
    const statusInfo = [];
    
    // Status por quilometragem
    if (item.alertKm) {
      const kmSinceLastMaintenance = vehicle.currentKm - item.kmBase;
      const progress = kmSinceLastMaintenance / item.alertKm;
      
      if (progress >= 1.0) {
        const kmOverdue = kmSinceLastMaintenance - item.alertKm;
        statusInfo.push({ 
          text: `Vencido há ${kmOverdue.toLocaleString('pt-BR')} km`, 
          color: 'text-red-600',
          type: 'km'
        });
      } else if (progress >= 0.8) {
        const kmRemaining = item.alertKm - kmSinceLastMaintenance;
        statusInfo.push({ 
          text: `Faltam ${kmRemaining.toLocaleString('pt-BR')} km`, 
          color: 'text-yellow-600',
          type: 'km'
        });
      } else {
        const kmRemaining = item.alertKm - kmSinceLastMaintenance;
        statusInfo.push({ 
          text: `Faltam ${kmRemaining.toLocaleString('pt-BR')} km`, 
          color: 'text-green-600',
          type: 'km'
        });
      }
    }
    
    // Status por data
    if (item.alertDate) {
      const today = new Date();
      const alertDate = new Date(item.alertDate);
      const diffTime = alertDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        statusInfo.push({ 
          text: diffDays === 0 ? 'Vence hoje' : `Atrasado há ${Math.abs(diffDays)} dias`, 
          color: 'text-red-600',
          type: 'date'
        });
      } else if (diffDays <= 7) {
        statusInfo.push({ 
          text: `Vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`, 
          color: 'text-yellow-600',
          type: 'date'
        });
      } else {
        statusInfo.push({ 
          text: `Vence em ${diffDays} dias`, 
          color: 'text-green-600',
          type: 'date'
        });
      }
    }
    
    return statusInfo.length > 0 ? statusInfo : [{ text: 'Sem alerta configurado', color: 'text-gray-500', type: 'none' }];
  };

  // Função para sugerir próxima data baseada no intervalo atual
  const suggestNextAlertDate = () => {
    if (!selectedItem?.alertDate) return;
    
    const lastMaintenance = new Date(selectedItem.lastMaintenanceDate);
    const currentAlert = new Date(selectedItem.alertDate);
    const intervalDays = Math.ceil((currentAlert.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
    
    const maintenanceDate = new Date(formData.date);
    const suggestedDate = new Date(maintenanceDate);
    suggestedDate.setDate(suggestedDate.getDate() + intervalDays);
    
    setFormData(prev => ({
      ...prev,
      nextAlertDate: suggestedDate.toISOString().split('T')[0]
    }));
  };

  // Função para sugerir custo baseado no histórico
  const suggestCostFromHistory = () => {
    if (!selectedItem) return;
    
    // Buscar os registros do histórico para o mesmo item, ordenados por data mais recente
    const itemHistory = maintenanceHistory
      .filter(record => record.itemName === selectedItem.name && record.cost && record.cost > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (itemHistory.length > 0) {
      const lastCost = itemHistory[0].cost;
      setFormData(prev => ({
        ...prev,
        cost: lastCost!.toString()
      }));
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      {/* ── TOP BAR ── */}
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
          <h1 className="text-lg font-semibold">Atualizar Manutenção</h1>
          <p className="text-xs text-muted-foreground">
            Registre uma manutenção realizada
          </p>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pt-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Manutenção</CardTitle>
            <CardDescription>
              Informe os dados da manutenção realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemsWithAlert.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum item com alerta configurado
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Apenas itens com alerta de quilometragem ou data podem ser registrados para manutenção
                </p>
                <Button className="mt-4" onClick={onBack}>
                  Voltar ao Painel
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item">Manutenção *</Label>
                  <Select 
                    value={formData.itemId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, itemId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a manutenção que irá realizar" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemsWithAlert.map((item) => {
                        const statusInfo = getItemStatusInfo(item);
                        return (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex flex-col items-start">
                              <span>{item.name}</span>
                              {statusInfo.map(info => (
                                <span className={`text-xs ${info.color}`} key={info.type}>
                                  {info.text}
                                </span>
                              ))}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {selectedItem && (
                    <div className="p-3 bg-accent/50 rounded-md space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {selectedItem.type === 'parts' ? 'Peça' : 'Manutenção'}
                        </Badge>
                        {selectedItem.alertKm && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Gauge className="w-3 h-3" />
                            Alerta por KM
                          </Badge>
                        )}
                        {selectedItem.alertDate && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Alerta por Data
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Última manutenção:</span>{' '}
                        {selectedItem.lastMaintenanceDate.toLocaleDateString('pt-BR')} 
                        {' '}({selectedItem.kmBase.toLocaleString('pt-BR')} km)
                      </p>
                      {selectedItem.cost && selectedItem.cost > 0 && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Custo estimado:</span>{' '}
                          R$ {selectedItem.cost.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                      {selectedItem.alertKm && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Intervalo configurado:</span>{' '}
                          {selectedItem.alertKm.toLocaleString('pt-BR')} km
                        </p>
                      )}
                      {selectedItem.alertDate && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Data de alerta atual:</span>{' '}
                          {new Date(selectedItem.alertDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data da Manutenção *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem *</Label>
                  <Input
                    id="km"
                    type="number"
                    value={formData.km || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, km: parseInt(e.target.value) || 0 }))}
                    placeholder="Km no momento da manutenção"
                    min="0"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Quilometragem no momento em que a manutenção foi realizada
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Custo da Manutenção *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground">R$</span>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  {selectedItem && (
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={suggestCostFromHistory}
                        className="text-xs"
                        disabled={!maintenanceHistory.some(record => 
                          record.itemName === selectedItem.name && record.cost && record.cost > 0
                        )}
                      >
                        <DollarSign className="w-3 h-3 mr-1" />
                        Sugerir Custo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          const itemHistory = maintenanceHistory
                            .filter(record => record.itemName === selectedItem.name && record.cost && record.cost > 0)
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                          
                          if (itemHistory.length > 0) {
                            return `Baseado na última manutenção: R$ ${itemHistory[0].cost!.toFixed(2).replace('.', ',')}`;
                          } else {
                            return 'Nenhum histórico de custo encontrado';
                          }
                        })()} 
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Informe o custo real da manutenção para controle de gastos
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ex: Óleo 5W30 sintético, Pastilhas Bosch..."
                    rows={3}
                  />
                </div>

                {selectedItem?.alertDate && (
                  <div className="space-y-4">
                    {/* Controle para ativar/desativar alerta */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="enableAlert">Manter Alerta Ativo</Label>
                          <p className="text-sm text-muted-foreground">
                            {formData.enableAlert 
                              ? 'O item permanecerá no painel com novo alerta' 
                              : 'O item será removido do painel e mantido apenas no histórico'
                            }
                          </p>
                        </div>
                        <Switch
                          id="enableAlert"
                          checked={formData.enableAlert}
                          onCheckedChange={(checked) => setFormData(prev => ({ 
                            ...prev, 
                            enableAlert: checked,
                            nextAlertDate: checked ? prev.nextAlertDate : '' // Limpar data se desativado
                          }))}
                        />
                      </div>
                    </div>

                    {/* Campo de data - obrigatório para serviços quando alerta está ativo */}
                    {formData.enableAlert && (
                      <div className="space-y-2">
                        <Label htmlFor="nextAlertDate">
                          Próxima Data de Alerta
                          {selectedItem.type === 'service' && ' *'}
                        </Label>
                        <Input
                          id="nextAlertDate"
                          type="date"
                          value={formData.nextAlertDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, nextAlertDate: e.target.value }))}
                          required={selectedItem.type === 'service'}
                        />
                        <div className="flex items-center gap-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={suggestNextAlertDate}
                            className="text-xs"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Sugerir Próxima Data
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Baseado no intervalo atual de {Math.ceil((new Date(selectedItem.alertDate).getTime() - new Date(selectedItem.lastMaintenanceDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                          </p>
                        </div>
                        {selectedItem.type === 'service' && (
                          <p className="text-sm text-muted-foreground">
                            Para serviços, a próxima data de alerta é obrigatória quando o alerta está ativo
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={
                      !formData.itemId || 
                      (selectedItem?.type === 'service' && formData.enableAlert && selectedItem?.alertDate && !formData.nextAlertDate)
                    }
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Atualizar Manutenção
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}