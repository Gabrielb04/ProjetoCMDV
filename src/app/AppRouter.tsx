import { ForgotPassword, Login, Register, ResetPassword, useAuth } from '../features/auth';
import { VehicleRegistration, VehicleSelection, KilometrageUpdate, useVehicles } from '../features/vehicles';
import { Dashboard } from '../features/dashboard';
import { MaintenanceForm, MaintenanceRecord, MaintenanceHistory, useMaintenance } from '../features/maintenance';
import { useAppHandlers, useAppEffects } from '../hooks';

export default function AppRouter() {
  // Custom hooks - Estado da aplicação
  const auth = useAuth();
  const vehicles = useVehicles(auth.currentUser?.id || null);
  const maintenance = useMaintenance(auth.currentUser?.id || null, vehicles.selectedVehicleId);

  // Custom hooks - Handlers e navegação
  const {
    navigation,
    handleVehicleRegistration,
    handleVehicleSelection,
    handleVehicleDelete,
    handleBackToVehicleSelection,
    handleKmUpdate,
    handleKmSkip,
    handleAddMaintenanceItem,
    handleRecordMaintenance,
    handleRemoveMaintenanceItems,
    handleRemoveHistoryRecords,
    handleLogout,
  } = useAppHandlers({ auth, vehicles, maintenance });

  // Efeitos colaterais
  useAppEffects({ auth, vehicles, maintenance, navigation });

  if (auth.isLoading || vehicles.isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center max-w-md mx-auto">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (auth.authError && !auth.isAuthenticated) {
    console.warn(auth.authError);
  }

  if (vehicles.vehicleError) {
    console.warn(vehicles.vehicleError);
  }

  const isResetPasswordRoute = window.location.pathname === '/reset-password';

  if (isResetPasswordRoute) {
    return (
      <ResetPassword
        onPasswordUpdated={() => {
          auth.switchAuthScreen('login');
          auth.handleLogout();
        }}
      />
    );
  }

  // Renderização condicional - Telas de autenticação
  if (!auth.isAuthenticated) {
    if (auth.authScreen === 'forgot-password') {
      return <ForgotPassword onBackToLogin={() => auth.switchAuthScreen('login')} />;
    }

    if (auth.authScreen === 'login') {
      return (
        <Login
          onLogin={auth.handleLogin}
          onSwitchToRegister={() => auth.switchAuthScreen('register')}
          onForgotPassword={() => auth.switchAuthScreen('forgot-password')}
        />
      );
    }

    return <Register onRegister={(user) => {
      auth.handleRegister(user);
      navigation.goToVehicleSelection();
    }} onSwitchToLogin={() => auth.switchAuthScreen('login')} />;
  }

  // Telas principais - Sistema de navegação
  switch (navigation.currentScreen) {
    case 'vehicle-selection':
      return (
        <VehicleSelection
          vehicles={vehicles.vehicles}
          onSelectVehicle={handleVehicleSelection}
          onAddVehicle={() => navigation.goToRegistration()}
          onDeleteVehicle={handleVehicleDelete}
          onLogout={handleLogout}
          currentUser={auth.currentUser}
        />
      );

    case 'registration':
      return (
        <VehicleRegistration
          onRegister={handleVehicleRegistration}
          onBack={vehicles.hasVehicles ? handleBackToVehicleSelection : undefined}
          onLogout={handleLogout}
        />
      );

    case 'dashboard':
      return (
        <Dashboard
          vehicle={vehicles.selectedVehicle!}
          maintenanceItems={maintenance.maintenanceItems}
          maintenanceHistory={maintenance.maintenanceHistory}
          onNavigate={(screen) => {
            switch (screen) {
              case 'add-item':
                navigation.goToAddItem();
                break;
              case 'record-maintenance':
                navigation.goToRecordMaintenance();
                break;
              case 'history':
                navigation.goToHistory();
                break;
              case 'update-km':
                navigation.goToUpdateKm();
                break;
            }
          }}
          onUpdateKm={() => navigation.goToUpdateKm()}
          onBackToVehicles={handleBackToVehicleSelection}
          onRemoveItems={handleRemoveMaintenanceItems}
          currentUser={auth.currentUser}
        />
      );

    case 'add-item':
      return (
        <MaintenanceForm
          vehicle={vehicles.selectedVehicle!}
          maintenanceItems={maintenance.maintenanceItems}
          onSubmit={handleAddMaintenanceItem}
          onBack={() => navigation.goToDashboard()}
        />
      );

    case 'record-maintenance':
      return (
        <MaintenanceRecord
          vehicle={vehicles.selectedVehicle!}
          maintenanceItems={maintenance.maintenanceItems}
          maintenanceHistory={maintenance.maintenanceHistory}
          onSubmit={handleRecordMaintenance}
          onBack={() => navigation.goToDashboard()}
        />
      );

    case 'history':
      return (
        <MaintenanceHistory
          vehicle={vehicles.selectedVehicle!}
          history={maintenance.maintenanceHistory}
          maintenanceItems={maintenance.maintenanceItems}
          onBack={() => navigation.goToDashboard()}
          onRemoveRecords={handleRemoveHistoryRecords}
        />
      );

    case 'update-km':
      return (
        <KilometrageUpdate
          vehicle={vehicles.selectedVehicle!}
          onUpdate={handleKmUpdate}
          onSkip={handleKmSkip}
        />
      );

    default:
      return null;
  }
}