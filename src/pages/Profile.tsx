
import { AppLayout } from '@/components/AppLayout';
import { Separator } from '@/components/ui/separator';
import { ProfileUpdateForm } from '@/components/user/ProfileUpdateForm';
import { PasswordUpdateForm } from '@/components/user/PasswordUpdateForm';

const Profile = () => {
  return (
    <AppLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Perfil de Usuário</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e senha
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileUpdateForm />
          <PasswordUpdateForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
