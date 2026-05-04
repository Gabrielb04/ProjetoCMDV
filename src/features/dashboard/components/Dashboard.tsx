import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";
import { Checkbox } from "../../../../components/ui/checkbox";
import { ThemeToggle } from "../../../components/shared/ThemeToggle";
import {
  Car,
  Plus,
  History,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  Trash2,
  Wrench,
  DollarSign,
  Calendar,
  User as UserIcon,
  ChevronRight,
  Filter,
  LayoutGrid,
  Bell,
} from "lucide-react";
import { useState, useMemo } from "react";
import type {
  Vehicle,
  MaintenanceItem,
  MaintenanceRecord,
  User,
} from "../../../types";

// Importar logos
import volkswagenLogo from 'figma:asset/c0762b14f96b81db88b13ecd00be7ef50ab60ca3.png';
import chevroletLogo from 'figma:asset/3abf4724dd274fac4c34328a760e9c270b5dbc27.png';
import fiatLogo from 'figma:asset/05e78c6e98897898bc5ddf4f4f471a6be40ee5bc.png';
import hondaLogo from 'figma:asset/96081528d2d03aa26c04433aadb0e49340912e6f.png';
import toyotaLogo from 'figma:asset/2d3911414a5edcad409dfcf18475577cba6ccbc3.png';
import fordLogo from 'figma:asset/0d381dac51bffa6e971cbf819e1f3c12b6eac996.png';
import hyundaiLogo from 'figma:asset/114ff71236490e77dbd54e8f27db75fb92b69188.png';
import renaultLogo from 'figma:asset/921945439e162eb1664f600474a88bed59f1d515.png';
import nissanLogo from 'figma:asset/5602fb8dd1ee4da2854779daca8cff05206350e5.png';
import peugeotLogo from 'figma:asset/73b0f0170aafd5ed8a429aa24d7327a7e6ae6150.png';
import jeepLogo from 'figma:asset/9f6026f4fc05ba41b326a9885935818a61329b0b.png';
import citroenLogo from 'figma:asset/67ac8574683f26978321ff21da290fe4a74942bd.png';
import audiLogo from 'figma:asset/e91613a915fc64c2290cd5dadfacd276dd0320c8.png';
import bmwLogo from 'figma:asset/36cf619177f6b8edee85f5c273ea8024e9bee4d7.png';
import bydLogo from 'figma:asset/fbc33347af3002e211a520ca903829c44efd5d86.png';
import volvoLogo from 'figma:asset/5dbaf7a440021188e77370648fc8a43d03081f31.png';
import suzukiLogo from 'figma:asset/2210eeb7a851db726099ae589c70064532817fec.png';
import subaruLogo from 'figma:asset/a311a42ce64c2b143092a9d1c037773fa1c29acc.png';
import kiaLogo from 'figma:asset/360eef4afb55329b58ef5cb6fa6541335b3eefe3.png';
import landRoverLogo from 'figma:asset/8cf576e61666fc28d4227f9b61bd1e1741ee4f52.png';
import jaguarLogo from 'figma:asset/9ddf2339d2c1bb23732fb44a8aaf2b96767e7942.png';
import mitsubishiLogo from 'figma:asset/9de98cdb4aa7c35b2e8ecf5650f3bb3a6b87cdb9.png';
import mercedesLogo from 'figma:asset/919a1c3e8bee25454ad40852f662d4f301d55134.png';
import porscheLogo from 'figma:asset/2d3e04fd5d23dd4c287a2789841abd3dfeb7b5d1.png';
import ferrariLogo from 'figma:asset/976abfba0fe5ccfa000a2824a6f9aac88b052811.png';

const BRAND_LOGOS: Record<string, string> = {
  'volkswagen': volkswagenLogo,
  'chevrolet': chevroletLogo,
  'fiat': fiatLogo,
  'honda': hondaLogo,
  'toyota': toyotaLogo,
  'ford': fordLogo,
  'hyundai': hyundaiLogo,
  'renault': renaultLogo,
  'nissan': nissanLogo,
  'peugeot': peugeotLogo,
  'jeep': jeepLogo,
  'citroen': citroenLogo,
  'audi': audiLogo,
  'bmw': bmwLogo,
  'byd': bydLogo,
  'volvo': volvoLogo,
  'suzuki': suzukiLogo,
  'subaru': subaruLogo,
  'kia': kiaLogo,
  'land-rover': landRoverLogo,
  'jaguar': jaguarLogo,
  'mitsubishi': mitsubishiLogo,
  'mercedes-benz': mercedesLogo,
  'porsche': porscheLogo,
  'ferrari': ferrariLogo,
};

interface DashboardProps {
  vehicle: Vehicle;
  maintenanceItems: MaintenanceItem[];
  maintenanceHistory: MaintenanceRecord[];
  onNavigate: (
    screen:
      | "add-item"
      | "record-maintenance"
      | "history"
      | "update-km",
  ) => void;
  onUpdateKm: () => void;
  onBackToVehicles: () => void;
  onRemoveItems: (itemIds: string[]) => void;
  currentUser?: User;
}

const formatDateSafely = (date: any): string => {
  try {
    const dateObj =
      date instanceof Date ? date : new Date(date);
    return !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString("pt-BR")
      : "Não informada";
  } catch {
    return "Não informada";
  }
};

const formatDateExtended = (date: any): string => {
  try {
    const dateObj =
      date instanceof Date ? date : new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return "Não informada";
  } catch {
    return "Não informada";
  }
};

export function Dashboard({
  vehicle,
  maintenanceItems,
  onNavigate,
  onUpdateKm,
  onBackToVehicles,
  onRemoveItems,
  currentUser,
}: DashboardProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    [],
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "ok" | "warning" | "overdue"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "parts" | "service"
  >("all");
  const [showFilters, setShowFilters] = useState(false);

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Buscar o logo da marca
  const logoSrc = vehicle.brandId ? BRAND_LOGOS[vehicle.brandId] : null;

  const itemsWithAlert = maintenanceItems.filter(
    (item) => item.alertKm || item.alertDate,
  );

  const typeFilteredItems =
    typeFilter === "all"
      ? itemsWithAlert
      : itemsWithAlert.filter(
          (item) => item.type === typeFilter,
        );

  const filteredItems =
    statusFilter === "all"
      ? typeFilteredItems
      : typeFilteredItems.filter((item) => {
          if (statusFilter === "warning")
            return (
              item.status === "warning" ||
              item.status === "date-warning"
            );
          if (statusFilter === "overdue")
            return (
              item.status === "overdue" ||
              item.status === "date-overdue"
            );
          return item.status === statusFilter;
        });

  const okItems = typeFilteredItems.filter(
    (item) => item.status === "ok",
  ).length;
  const warningItems = typeFilteredItems.filter(
    (item) =>
      item.status === "warning" ||
      item.status === "date-warning",
  ).length;
  const overdueItems = typeFilteredItems.filter(
    (item) =>
      item.status === "overdue" ||
      item.status === "date-overdue",
  ).length;

  const totalCosts = useMemo(
    () =>
      typeFilteredItems.reduce(
        (total, item) => total + (item.cost || 0),
        0,
      ),
    [typeFilteredItems],
  );

  const handleItemSelection = (
    itemId: string,
    checked: boolean,
  ) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(
      checked ? filteredItems.map((item) => item.id) : [],
    );
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length > 0) {
      onRemoveItems(selectedItems);
      setSelectedItems([]);
    }
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length &&
    filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ok":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-50 dark:bg-green-950/40",
          border: "border-green-200 dark:border-green-800",
          badge:
            "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
          label: "OK",
          barColor: "rgb(34 197 94)",
        };
      case "warning":
      case "date-warning":
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-950/40",
          border: "border-amber-200 dark:border-amber-800",
          badge:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
          label: "Em Breve",
          barColor: "rgb(245 158 11)",
        };
      case "overdue":
      case "date-overdue":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-50 dark:bg-red-950/40",
          border: "border-red-200 dark:border-red-800",
          badge:
            "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
          label: "Vencido",
          barColor: "rgb(239 68 68)",
        };
      default:
        return {
          icon: <Settings className="w-4 h-4" />,
          color: "text-gray-500",
          bg: "bg-gray-50 dark:bg-gray-800/40",
          border: "border-gray-200 dark:border-gray-700",
          badge: "bg-gray-100 text-gray-700",
          label: "Sem Alerta",
          barColor: "rgb(156 163 175)",
        };
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      {/* ── TOP BAR ── */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Vehicle info */}
          <button
            onClick={onBackToVehicles}
            className="flex items-center gap-2 min-w-0 group"
          >
            <div className="w-9 h-9 bg-white rounded-full border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={vehicle.brand}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <Car className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold truncate leading-tight group-hover:text-primary transition-colors">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                {vehicle.plate}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={onUpdateKm}
              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">
                {vehicle.currentKm.toLocaleString("pt-BR")} km
              </span>
            </button>
          </div>
        </div>

        {/* User + Date strip */}
        {currentUser && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserIcon className="w-3 h-3" />
              <span>{currentUser.name}</span>
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {currentDate}
            </p>
          </div>
        )}
        {!currentUser && (
          <p className="text-xs text-muted-foreground capitalize mt-1">
            {currentDate}
          </p>
        )}
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 space-y-4 pt-4">
        {/* ── SUMMARY CARDS (horizontal scroll) ── */}
        <div className="flex flex-wrap gap-2 justify-center pb-1">
          {/* Total - REMOVED */}

          {/* OK */}
          <button
            onClick={() => setStatusFilter("ok")}
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-3 min-w-[80px] border transition-all ${
              statusFilter === "ok"
                ? "bg-green-500 text-white border-green-500 shadow-md"
                : "bg-card border-green-200 dark:border-green-800"
            }`}
          >
            <CheckCircle
              className={`w-4 h-4 ${statusFilter === "ok" ? "text-white" : "text-green-500"}`}
            />
            <span
              className={`text-lg font-bold leading-none ${statusFilter === "ok" ? "text-white" : "text-green-600 dark:text-green-400"}`}
            >
              {okItems}
            </span>
            <span
              className={`text-[10px] font-medium ${statusFilter === "ok" ? "text-white/80" : "text-muted-foreground"}`}
            >
              OK
            </span>
          </button>

          {/* Em Breve */}
          <button
            onClick={() => setStatusFilter("warning")}
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-3 min-w-[80px] border transition-all ${
              statusFilter === "warning"
                ? "bg-amber-400 text-white border-amber-400 shadow-md"
                : "bg-card border-amber-200 dark:border-amber-800"
            }`}
          >
            <Clock
              className={`w-4 h-4 ${statusFilter === "warning" ? "text-white" : "text-amber-500"}`}
            />
            <span
              className={`text-lg font-bold leading-none ${statusFilter === "warning" ? "text-white" : "text-amber-600 dark:text-amber-400"}`}
            >
              {warningItems}
            </span>
            <span
              className={`text-[10px] font-medium ${statusFilter === "warning" ? "text-white/80" : "text-muted-foreground"}`}
            >
              Em Breve
            </span>
          </button>

          {/* Vencidos */}
          <button
            onClick={() => setStatusFilter("overdue")}
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-3 min-w-[80px] border transition-all ${
              statusFilter === "overdue"
                ? "bg-red-500 text-white border-red-500 shadow-md"
                : "bg-card border-red-200 dark:border-red-800"
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 ${statusFilter === "overdue" ? "text-white" : "text-red-500"}`}
            />
            <span
              className={`text-lg font-bold leading-none ${statusFilter === "overdue" ? "text-white" : "text-red-600 dark:text-red-400"}`}
            >
              {overdueItems}
            </span>
            <span
              className={`text-[10px] font-medium ${statusFilter === "overdue" ? "text-white/80" : "text-muted-foreground"}`}
            >
              Vencidos
            </span>
          </button>

          {/* Custos */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-3 min-w-[96px] bg-card border border-emerald-200 dark:border-emerald-800">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold leading-none text-emerald-600 dark:text-emerald-400">
              R${" "}
              {totalCosts.toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              Custos
            </span>
          </div>
        </div>

        {/* ── SECTION HEADER ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-semibold">
                Painel de Reparos
              </h2>
              <p className="text-xs text-muted-foreground">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "itens"}
                {(statusFilter !== "all" ||
                  typeFilter !== "all") &&
                  ` de ${typeFilteredItems.length}`}
              </p>
            </div>
            {/* Total pill — limpa filtros de status */}
            <button
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors ml-2 ${
                statusFilter === "all" && typeFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              <Settings className="w-3 h-3" />
              Total ({typeFilteredItems.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isSomeSelected && (
              <button
                onClick={handleRemoveSelected}
                className="flex items-center gap-1 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 px-2.5 py-1.5 rounded-full border border-red-200 dark:border-red-800"
              >
                <Trash2 className="w-3 h-3" />
                Remover ({selectedItems.length})
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                showFilters || typeFilter !== "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              <Filter className="w-3 h-3" />
              Filtrar
            </button>
          </div>
        </div>

        {/* ── TYPE FILTER + SELECT ALL (collapsible) ── */}
        {showFilters && (
          <div className="bg-card border rounded-2xl p-3 space-y-3">
            {/* Type tabs */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Tipo
              </p>
              <div className="flex gap-2">
                {[
                  {
                    value: "parts",
                    label: "Peças",
                    icon: <Wrench className="w-3 h-3" />,
                  },
                  {
                    value: "service",
                    label: "Serviços",
                    icon: <Settings className="w-3 h-3" />,
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setTypeFilter(opt.value as any)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      typeFilter === opt.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-transparent"
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Select all */}
            {filteredItems.length > 0 && (
              <div className="flex items-center gap-2 pt-1 border-t">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-xs cursor-pointer text-muted-foreground"
                >
                  Selecionar todos os itens visíveis
                </label>
              </div>
            )}
          </div>
        )}

        {/* ── ITEMS LIST ── */}
        {itemsWithAlert.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">
              Nenhum reparo cadastrado
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Adicione peças e serviços para monitorar os
              alertas
            </p>
            <button
              onClick={() => onNavigate("add-item")}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Adicionar ao Painel
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">
              Nenhum item para este filtro
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-xs text-primary mt-3"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const cfg = getStatusConfig(item.status);
              const isSelected = selectedItems.includes(
                item.id,
              );
              const kmProgress = item.alertKm
                ? Math.min(item.progress * 100, 100)
                : null;
              const dateProgress = item.alertDate
                ? Math.min((item.dateProgress || 0) * 100, 100)
                : null;

              return (
                <div
                  key={item.id}
                  className={`bg-card rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-primary ring-1 ring-primary"
                      : cfg.border
                  }`}
                >
                  {/* Row 1: checkbox + name + badge */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleItemSelection(
                          item.id,
                          checked as boolean,
                        )
                      }
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold truncate">
                          {item.name}
                        </h3>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {item.type === "parts"
                            ? "Peça"
                            : "Serviço"}
                        </span>
                      </div>

                      {/* Row 2: meta info chips */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Gauge className="w-3 h-3" />
                          <span>
                            {item.kmBase.toLocaleString(
                              "pt-BR",
                            )}{" "}
                            km base
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatDateSafely(
                              item.lastMaintenanceDate,
                            )}
                          </span>
                        </div>
                        {item.alertKm && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Bell className="w-3 h-3" />
                            <span>
                              Alerta:{" "}
                              {item.alertKm.toLocaleString(
                                "pt-BR",
                              )}{" "}
                              km
                            </span>
                          </div>
                        )}
                        {item.alertDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Data:{" "}
                              {formatDateSafely(item.alertDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress bars */}
                      {(kmProgress !== null ||
                        dateProgress !== null) && (
                        <div className="mt-3 space-y-2">
                          {kmProgress !== null && (
                            <div>
                              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Progresso KM</span>
                                <span>
                                  {Math.round(kmProgress)}%
                                </span>
                              </div>
                              <Progress
                                value={kmProgress}
                                className="h-1.5"
                                style={
                                  {
                                    "--progress-foreground":
                                      cfg.barColor,
                                  } as any
                                }
                              />
                            </div>
                          )}
                          {dateProgress !== null && (
                            <div>
                              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Progresso Data</span>
                                <span>
                                  {Math.round(dateProgress)}%
                                </span>
                              </div>
                              <Progress
                                value={dateProgress}
                                className="h-1.5"
                                style={
                                  {
                                    "--progress-foreground":
                                      item.status ===
                                      "date-overdue"
                                        ? "rgb(239 68 68)"
                                        : item.status ===
                                            "date-warning"
                                          ? "rgb(245 158 11)"
                                          : "rgb(34 197 94)",
                                  } as any
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cost pill */}
                    {item.cost && item.cost > 0 && (
                      <div className="flex-shrink-0 flex flex-col items-end">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                          R${" "}
                          {item.cost.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t z-30 px-4 pt-3 pb-5 safe-area-bottom">
        <div className="grid grid-cols-4 gap-2">
          {/* Add */}
          <button
            onClick={() => onNavigate("add-item")}
            className="flex flex-col items-center gap-1 py-2 px-2 rounded-xl bg-primary text-primary-foreground"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              Adicionar
            </span>
          </button>

          {/* Update */}
          <button
            onClick={() => onNavigate("record-maintenance")}
            className="flex flex-col items-center gap-1 py-2 px-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent transition-colors"
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              Atualizar
            </span>
          </button>

          {/* History */}
          <button
            onClick={() => onNavigate("history")}
            className="flex flex-col items-center gap-1 py-2 px-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent transition-colors"
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              Histórico
            </span>
          </button>

          {/* Vehicles */}
          <button
            onClick={onBackToVehicles}
            className="flex flex-col items-center gap-1 py-2 px-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent transition-colors"
          >
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              Veículos
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}