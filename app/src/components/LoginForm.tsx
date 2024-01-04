import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signin, signup } from "@/services/auth";
import { useCookies } from "react-cookie";
import { useEffect, useRef, useState } from "react";
import {
  HOME_URL,
  PASSWORD_MIN_LENGTH,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "@/constants";

const COOKIE_TIME_OUT_MS = 7 * 24 * 60 * 60 * 1000;

const SignUpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, {
      message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`,
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Le mot de passe doit contenir au moins une majuscule.",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Le mot de passe doit contenir au moins une minuscule.",
    })
    .refine((password) => /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(password), {
      message: "Le mot de passe doit contenir au moins un caractère spécial.",
    }),
});

const SignInFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Le format de l'adresse email est incorrect." }),
  password: z.string().min(1, {
    message: "Merci de saisir un mot de passe.",
  }),
});

export type Credentials =
  | z.infer<typeof SignUpFormSchema>
  | z.infer<typeof SignInFormSchema>;

type LoginFormProps = {
  mode: "signin" | "signup";
};

const LoginForm = (props: LoginFormProps) => {
  const { mode } = props;
  const isSignIn = mode === "signin";

  const cardFooterContent = {
    buttonLabel: isSignIn ? "Se connecter" : "S'inscrire",
    linkText: isSignIn ? "Pas encore de compte?" : "Déjà inscrit?",
    linkLabel: isSignIn ? "Inscrivez-vous" : "Connectez-vous",
    linkTo: isSignIn ? SIGN_UP_URL : SIGN_IN_URL,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookie] = useCookies(["token"]);
  const [error, setError] = useState<string>("");
  const errorRef = useRef(error);

  const navigate = useNavigate();

  const form = useForm<Credentials>({
    resolver: zodResolver(isSignIn ? SignInFormSchema : SignUpFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (errorRef.current) {
      form.reset({ email: "", password: "" });
    }
    form.clearErrors();
    setError("");
  }, [mode, form]);

  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  const handleLoginSubmit = async (credentials: Credentials) => {
    const postSignUp = async (credentials: Credentials) => {
      try {
        const { access_token: token } = await signup(credentials);

        const cookieExpirationAt = new Date(Date.now() + COOKIE_TIME_OUT_MS);
        setCookie("token", token, {
          path: HOME_URL,
          expires: cookieExpirationAt,
        });

        navigate(SIGN_IN_URL);
      } catch (error) {
        const errorMessage = (error as Error).message;

        errorMessage.includes("409")
          ? setError(`Adresse email ${credentials.email} déjà utilisée.`)
          : setError(errorMessage);

        console.error("Error during login submit: ", errorMessage);
      }
    };

    const postSignIn = async (credentials: Credentials) => {
      try {
        const { access_token: token } = await signin(credentials);

        const cookieExpirationAt = new Date(Date.now() + COOKIE_TIME_OUT_MS);
        setCookie("token", token, {
          path: HOME_URL,
          expires: cookieExpirationAt,
        });

        navigate(HOME_URL);
      } catch (error) {
        const errorMessage = (error as Error).message;

        if (errorMessage.includes("403")) {
          setError("Le mot de passe ne correspond pas à cette adresse email.");
        } else if (errorMessage.includes("404")) {
          setError("Adresse email inconnue.");
        } else {
          setError(errorMessage);
        }

        console.error("Error during login submit: ", errorMessage);
      }
    };

    isSignIn ? postSignIn(credentials) : postSignUp(credentials);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Authentification</CardTitle>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="exemple@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  {isSignIn ? (
                    <Link
                      to="/forgotten-password"
                      className="text-sm underline"
                    >
                      Mot de passe oublié?
                    </Link>
                  ) : (
                    <FormDescription>
                      <p className="text-slate-950 font-medium">
                        Règles du mot de passe:
                      </p>
                      <ul className="pt-2 pl-4">
                        <li>- Minimum {PASSWORD_MIN_LENGTH} caractères</li>
                        <li>- Minimum 1 majuscule</li>
                        <li>- Minimum 1 minuscule</li>
                        <li>- Minimum 1 caractère spécial</li>
                      </ul>
                    </FormDescription>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start">
            <Button>{cardFooterContent.buttonLabel}</Button>
            <div className="w-full flex justify-between pt-2 text-sm">
              <span>{cardFooterContent.linkText}</span>
              <Link to={cardFooterContent.linkTo} className="underline">
                {cardFooterContent.linkLabel}
              </Link>
            </div>
            {error ? <FormMessage className="pt-4">{error}</FormMessage> : null}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
export default LoginForm;
