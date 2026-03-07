import RegisterHero from '../components/RegisterHero';
import SignUp from '../components/SignUp';

export default function Register() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <RegisterHero />
      <SignUp />
    </main>
  );
}