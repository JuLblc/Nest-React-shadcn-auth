import { useQuery } from "@/hooks/useQuery";
import LoginForm from "@/components/LoginForm";
import MainLayout from "@/components/layout/MainLayout";

const Login = () => {
  const query = useQuery();
  const loginMode = query.get("login");

  const isValidMode =
    loginMode && (loginMode === "signin" || loginMode === "signup");

  return (
    <MainLayout>
      {isValidMode ? <LoginForm mode={loginMode} /> : null}
    </MainLayout>
  );
};
export default Login;
