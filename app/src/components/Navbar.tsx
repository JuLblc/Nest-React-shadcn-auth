import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useCookies } from "react-cookie";
import { logout } from "@/services/auth";
import { HOME_URL, SIGN_IN_URL, SIGN_UP_URL } from "@/constants";

const Navbar = () => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _, removeCookie] = useCookies(["token"]);
  console.log({ cookies });

  const handleLogout = () => {
    const deleteSession = async () => {
      const { token } = cookies;
      await logout(token);
      removeCookie("token", { path: HOME_URL });
    };

    deleteSession();
    navigate(SIGN_IN_URL);
  };
  return (
    <nav className="m-4 flex justify-between">
      <ul className="flex items-center space-x-4">
        <li>
          <Link to={HOME_URL}>Accueil</Link>
        </li>
        <li>
          <Link to="/about">À propos</Link>
        </li>
      </ul>
      <div className="flex space-x-4">
        {!cookies.token ? (
          <>
            <Button variant="secondary">
              <Link to={SIGN_IN_URL}>Se connecter</Link>
            </Button>
            <Button>
              <Link to={SIGN_UP_URL}>{"S'inscrire"}</Link>
            </Button>
          </>
        ) : (
          <Button variant="destructive" onClick={handleLogout}>
            Se déconnecter
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
