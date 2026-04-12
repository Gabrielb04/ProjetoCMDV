import { Button } from '../../../../components/ui/button'
import { Card, CardContent } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Input } from '../../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { ThemeToggle } from '../../../components/shared/ThemeToggle'
import { ArrowLeft, History, Calendar, Gauge, FileText, Download, Trash2, Filter, Settings, Wrench, DollarSign } from 'lucide-react'
import { useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import type { MaintenanceRecord, Vehicle, MaintenanceItem } from '../../../types'

type DateFilterType = 'all'|'last-month'|'last-3-months'|'last-year'|'custom'
type TypeFilterType = 'all'|'parts'|'service'

const PARTS = ['óleo','oleo','filtro','pastilha','disco','pneu','amortecedor','bateria','vela','correia','bomba','radiador','freio','embreagem','peca','peça','troca','substituicao','substituição']
const SERVICES = ['alinhamento','balanceamento','lavagem','limpeza','revisao','revisão','inspecao','inspeção','manutencao','manutenção','servico','serviço','ajuste','calibragem','diagnostico','diagnóstico','reparo']

const fmtDate = (d: Date) => d.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})
const fmtDateShort = (d: Date) => d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})
const money = (n:number)=>`R$ ${n.toFixed(2).replace('.',',')}`
const obsFromNotes = (n?:string)=>{ if(!n) return ''; const i=n.split('\\n').find(l=>l.includes('• Observações:')); return i?i.replace('• Observações:','').trim():'' }

interface Props{
  history:MaintenanceRecord[]; maintenanceItems:MaintenanceItem[]; vehicle:Vehicle;
  onBack:()=>void; onRemoveRecords:(ids:string[])=>void;
}

export function MaintenanceHistory({ history = [], maintenanceItems = [], vehicle, onBack, onRemoveRecords }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all')
  const [customStart, setCustomStart] = useState(''); const [customEnd, setCustomEnd] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilterType>('all')

  const getType = (r:MaintenanceRecord):'parts'|'service'|'unknown' => {
    const it = maintenanceItems.find(i=>i.id===r.itemId); if(it) return it.type
    const name=r.itemName.toLowerCase()
    if (PARTS.some(k=>name.includes(k))) return 'parts'
    if (SERVICES.some(k=>name.includes(k))) return 'service'
    return 'unknown'
  }

  const valid = useMemo(()=>history.filter(r=>r && typeof r==='object' && r.id && r.itemName && typeof r.km==='number' && r.date instanceof Date && !isNaN(r.date.getTime())),[history])

  const filtered = useMemo(()=>{
    const now=new Date()
    const start = dateFilter==='last-month'    ? new Date(now.getFullYear(),now.getMonth()-1,now.getDate())
                : dateFilter==='last-3-months' ? new Date(now.getFullYear(),now.getMonth()-3,now.getDate())
                : dateFilter==='last-year'     ? new Date(now.getFullYear()-1,now.getMonth(),now.getDate())
                : dateFilter==='custom' && customStart ? new Date(customStart) : null
    const end   = dateFilter==='custom' && customEnd ? new Date(customEnd) : null

    return valid.filter(r=>{
      if(start && r.date < start) return false
      if(end && r.date > end) return false
      if(typeFilter==='all') return true
      const t=getType(r)
      if(t==='unknown') return typeFilter==='parts'
      return t===typeFilter
    })
  },[valid,dateFilter,customStart,customEnd,typeFilter])

  const sorted = useMemo(()=>[...filtered].sort((a,b)=>b.date.getTime()-a.date.getTime()),[filtered])
  const grouped = useMemo(()=>sorted.reduce((acc, r)=>{ const y=r.date.getFullYear(); (acc[y]??=[]).push(r); return acc },{} as Record<number,MaintenanceRecord[]>),[sorted])
  const years = useMemo(()=>Object.keys(grouped).map(Number).sort((a,b)=>b-a),[grouped])
  const total = useMemo(()=>filtered.reduce((s,r)=>s+(r.cost||0),0),[filtered])

  const allSelected = selected.length===filtered.length && filtered.length>0
  const someSelected = selected.length>0

  const toggleOne=(id:string,checked:boolean)=>setSelected(p=>checked?[...p,id]:p.filter(i=>i!==id))
  const toggleAll =(checked:boolean)=>setSelected(checked?filtered.map(r=>r.id):[])
  const removeSel = ()=>{ if(someSelected){ onRemoveRecords(selected); setSelected([]) } }

  const genPDF=()=>{
    const doc=new jsPDF(); const W=doc.internal.pageSize.width; const H=doc.internal.pageSize.height; const M=20; let y=30
    const br=(need:number)=>{ if(y+need>H-M){doc.addPage(); y=30} }
    const add=(t:string,x:number,yy:number,w?:number)=>{ if(w){ const lines=doc.splitTextToSize(t,w); doc.text(lines,x,yy); return lines.length*6 } doc.text(t,x,yy); return 6 }
    doc.setFont('helvetica','normal')
    doc.setFontSize(20); doc.text('Histórico de Manutenções',M,y); y+=15
    doc.setFontSize(12)
    ;['Veículo: '+vehicle.brand+' '+vehicle.model, `Ano: ${vehicle.year}`, `Placa: ${vehicle.plate}`, `Quilometragem Atual: ${vehicle.currentKm.toLocaleString('pt-BR')} km`,
      'Relatório gerado em: '+new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})].forEach(t=>{doc.text(t,M,y); y+=8})
    y+=7
    const hasFilters = dateFilter!=='all'||typeFilter!=='all'
    if(hasFilters){
      doc.setFontSize(11); doc.text('Filtros aplicados:',M,y); y+=8
      if(typeFilter!=='all'){ doc.text(`• Tipo: ${typeFilter==='parts'?'Peças':'Serviços'}`,M+5,y); y+=6 }
      if(dateFilter!=='all'){
        const txt = dateFilter==='last-month'?'Último mês'
          : dateFilter==='last-3-months'?'Últimos 3 meses'
          : dateFilter==='last-year'?'Último ano'
          : `Período: ${customStart?new Date(customStart).toLocaleDateString('pt-BR'):'início'} até ${customEnd?new Date(customEnd).toLocaleDateString('pt-BR'):'hoje'}`
        doc.text(`• ${txt}`,M+5,y); y+=6
      }
      y+=10
    }
    doc.setFontSize(14); doc.text('Resumo:',M,y); y+=10
    doc.setFontSize(11)
    const partsCount = filtered.filter(r=>['parts','unknown'].includes(getType(r))).length
    const servicesCount = filtered.filter(r=>getType(r)==='service').length
    ;[
      `• Total de manutenções${hasFilters?' (filtradas)':''}: ${filtered.length}`,
      `• Peças: ${partsCount}`, `• Serviços: ${servicesCount}`, `• Custo total${hasFilters?' (filtrado)':''}: ${money(total)}`,
      sorted.length?`• Última manutenção: ${fmtDate(sorted[0].date)}`:''
    ].filter(Boolean).forEach(t=>{doc.text(t as string,M+5,y); y+=8})
    y+=7
    if(filtered.length){
      doc.setFontSize(14); doc.text('Histórico Detalhado:',M,y); y+=15
      years.forEach(Y=>{
        br(20); doc.setFontSize(12); doc.text(String(Y),M,y); y+=10
        grouped[Y].forEach(r=>{
          br(30); doc.setFontSize(10)
          const performed = !!(r.notes && (r.notes.includes('realizado:')||r.notes.includes('realizada:')))
          const t=getType(r); const typeLabel = performed ? (t==='service'?'Serviço - Manutenção':'Peça - Manutenção') : (t==='service'?'Serviço':'Peça')
          const itemTitle = r.cost && r.cost > 0 
            ? `• ${r.itemName} - ${money(r.cost)} (${typeLabel})`
            : `• ${r.itemName} (${typeLabel})`;
          doc.text(itemTitle,M+5,y); y+=8
          doc.setFontSize(9)
          ;[`• Data: ${fmtDate(r.date)}`, `• Quilometragem: ${r.km.toLocaleString('pt-BR')} km`].forEach(s=>{doc.text(s,M+10,y); y+=5})
          const it=maintenanceItems.find(i=>i.id===r.itemId)
          if(it?.alertKm){ doc.text(`• Alertas configurados - Alerta KM: ${it.alertKm.toLocaleString('pt-BR')} km`,M+10,y); y+=7 }
          if(it?.alertDate){ doc.text(`• Alertas configurados - Alerta Data: ${it.alertDate.toLocaleDateString('pt-BR')}`,M+10,y); y+=7 }
          const userObs = obsFromNotes(r.notes); if(userObs){ y += add(`• Observações: ${userObs}`,M+10,y,W-M*2-10)+2 }
          y+=5
        })
        y+=10
      })
    } else doc.text('Nenhuma manutenção encontrada com os filtros aplicados.',M,y)
    let file=`Historico_Manutencao_${vehicle.plate.replace('-','')}${typeFilter!=='all'?'_'+(typeFilter==='parts'?'Pecas':'Servicos'):''}${dateFilter!=='all'?'_'+dateFilter:''}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(file)
  }

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
          <div className="flex items-center gap-2">
            <button
              onClick={genPDF}
              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">PDF</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-lg font-semibold">Histórico</h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'} encontrados
          </p>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap w-full">
          <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
            <Select value={typeFilter} onValueChange={(v:TypeFilterType)=>setTypeFilter(v)}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tipo"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="parts"><div className="flex items-center gap-2"><Settings className="w-4 h-4"/>Peças</div></SelectItem>
                <SelectItem value="service"><div className="flex items-center gap-2"><Wrench className="w-4 h-4"/>Serviços</div></SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={(v:DateFilterType)=>setDateFilter(v)}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Filtrar por data"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="last-month">Último mês</SelectItem>
                <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="last-year">Último ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {someSelected && (
              <Button onClick={removeSel} variant="destructive" className="flex items-center gap-2 w-full sm:w-auto">
                <Trash2 className="w-4 h-4"/><span className="hidden sm:inline">Excluir {selected.length} registro{selected.length>1?'s':''}</span><span className="sm:hidden">Excluir</span>
              </Button>
            )}
          </div>

          {dateFilter==='custom' && (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <Input type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)} className="w-full sm:w-auto"/>
              <Input type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)} className="w-full sm:w-auto"/>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        {valid.length===0 ? (
          <Card><CardContent className="p-8 text-center"><History className="w-12 h-12 text-muted-foreground mx-auto mb-4"/><h3>Nenhum histórico encontrado</h3><p className="text-muted-foreground mt-2">Quando você registrar manutenções, elas aparecerão aqui</p><Button className="mt-4" onClick={onBack}>Voltar ao Painel</Button></CardContent></Card>
        ) : filtered.length===0 ? (
          <Card><CardContent className="p-8 text-center"><Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4"/><h3>Nenhum registro encontrado</h3><p className="text-muted-foreground mt-2">Nenhuma manutenção corresponde aos filtros selecionados</p><Button variant="outline" className="mt-4" onClick={()=>{setDateFilter('all');setTypeFilter('all')}}>Limpar filtros</Button></CardContent></Card>
        ) : (
          <div className="space-y-4">
            {/* Stats Panel — layout fixo 2 linhas, sem breakpoints */}
            <div className="space-y-2">
              {/* Linha 1: 3 colunas iguais */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { t: 'Total',    v: String(filtered.length), Icon: History  },
                  { t: 'Peças',    v: String(filtered.filter(r=>['parts','unknown'].includes(getType(r))).length), Icon: Settings },
                  { t: 'Serviços', v: String(filtered.filter(r=>getType(r)==='service').length), Icon: Wrench   },
                ].map(({ t, v, Icon }) => (
                  <Card key={t}>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{t}</p>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-base font-medium">{v}</p>
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Linha 2: 2 colunas iguais */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { t: 'Última Manutenção', v: sorted[0] ? fmtDateShort(sorted[0].date) : '-', Icon: Calendar   },
                  { t: 'Custo Total',       v: money(total),                                    Icon: DollarSign },
                ].map(({ t, v, Icon }) => (
                  <Card key={t}>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{t}</p>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-medium truncate">{v}</p>
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {years.map(y=>(
              <div key={y} className="space-y-4">
                <h2 className="text-xl font-semibold sticky top-0 bg-background py-2 border-b">{y}</h2>
                <div className="space-y-3">
                  {grouped[y].map(r=>{
                    const t=getType(r), sel=selected.includes(r.id)
                    const performed=!!(r.notes&&(r.notes.includes('realizado:')||r.notes.includes('realizada:')))
                    const badges = performed
                      ? [{text:t==='service'?'Serviço':'Peça',variant:'default' as const},{text:'Manutenção',variant:'secondary' as const}]
                      : [{text:t==='service'?'Serviço':'Peça',variant:'default' as const}]
                    const it=maintenanceItems.find(i=>i.id===r.itemId); const hasAlert=!!(it&&(it.alertKm||it.alertDate))
                    const userObs=obsFromNotes(r.notes)

                    return (
                      <Card key={r.id} className={`hover:shadow-md transition-all ${sel?'bg-accent/50 border-primary':'border-border/50'}`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Checkbox id={r.id} checked={sel} onCheckedChange={(c)=>toggleOne(r.id,c)}/>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-shrink-0">{t==='service'?<Wrench className="w-5 h-5 text-foreground"/>:<Settings className="w-5 h-5 text-foreground"/>}</div>
                                    <h3 className="font-medium">{r.itemName}</h3>
                                    {r.cost && r.cost > 0 && (
                                      <div className="flex items-center gap-2 ml-auto">
                                        <DollarSign className="w-4 h-4 text-muted-foreground"/>
                                        <span className="font-medium">{money(r.cost)}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {badges.map((b,i)=><Badge key={i} variant={b.variant} className="text-xs">{b.text}</Badge>)}
                                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                                      <Gauge className="w-3 h-3"/>
                                      {r.km.toLocaleString('pt-BR')} km
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/><span className="text-sm text-muted-foreground">Data</span></div>
                                  <p className="font-medium">{fmtDate(r.date)}</p>
                                </div>
                                
                                {hasAlert && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2"><Settings className="w-4 h-4 text-muted-foreground"/><span className="text-sm text-muted-foreground">Alertas Configurados</span></div>
                                    <div className="font-medium text-sm space-y-1">
                                      {it?.alertKm && <p>Alerta KM: {it.alertKm.toLocaleString('pt-BR')} km</p>}
                                      {it?.alertDate && <p>Alerta Data: {it.alertDate.toLocaleDateString('pt-BR')}</p>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {userObs && (
                              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-blue-600"/><span className="text-sm font-medium text-blue-600">Observações</span></div>
                                <p className="text-sm text-muted-foreground">{userObs}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}