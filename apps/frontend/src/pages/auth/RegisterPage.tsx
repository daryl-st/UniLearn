import { useNavigate } from "react-router-dom";
import RegisterHero from "@/components/RegisterHero";
import SignUp from "@/components/SignUp";
import { roleHomePath } from "@/utils/auth";
import { useAuth } from "@/contextes/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();

  const handleRegister = async (input: { fullName: string; email: string; password: string }) => {
    const user = await registerStudent(input);
    navigate(roleHomePath(user.role));
  };

  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground lg:flex-row">
      <RegisterHero />
      <SignUp onSubmit={handleRegister} />
    </main>
  );
}
