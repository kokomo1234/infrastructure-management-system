
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-infra-blue text-white rounded-md h-12 w-12 flex items-center justify-center text-2xl font-bold">
            IH
          </div>
        </div>
        <h1 className="text-3xl font-bold title-gradient">Infra-Hub Genius</h1>
        <p className="text-muted-foreground mt-2">
          Plateforme de gestion d'infrastructure départementale
        </p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Utilisez l'un des comptes suivants pour vous connecter :</p>
        <p className="mt-2">
          <strong>Admin :</strong> admin@example.com / password<br />
          <strong>Utilisateur :</strong> user@example.com / password
        </p>
      </div>
    </div>
  );
};

export default Login;
