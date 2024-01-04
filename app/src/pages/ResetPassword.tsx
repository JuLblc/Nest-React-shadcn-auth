import { useCallback, useEffect, useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { checkResetTokenValidity, resetPassword } from "../services/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useCountdownRedirect } from "@/hooks/useCountdownRedirect";
import {
  PASSWORD_MIN_LENGTH,
  REDIRECT_COUNTDOWN_IN_SECOND,
  SIGN_IN_URL,
} from "@/constants";
import MainLayout from "@/components/layout/MainLayout";

type ResetPasswordState = {
  email?: string;
  isExpired: boolean;
  error: string;
  isSuccess: boolean;
};

const ResetPasswordFormSchema = z.object({
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

type ResetPasswordInput = z.infer<typeof ResetPasswordFormSchema>;

const ResetPassword = () => {
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordFormSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
    },
  });

  const [state, setState] = useState<ResetPasswordState>({
    email: "",
    isExpired: true,
    error: "",
    isSuccess: false,
  });

  const { email, isExpired, error, isSuccess } = state;

  const countdown = useCountdownRedirect({
    isSuccess,
    initialCountdown: REDIRECT_COUNTDOWN_IN_SECOND,
    url: SIGN_IN_URL,
  });

  const query = useQuery();
  const resetToken = query.get("resetToken");

  const retrieveUserEmail = useCallback(async () => {
    const { email, isExpired } =
      resetToken && (await checkResetTokenValidity(resetToken));

    setState((prevState) => ({
      ...prevState,
      email,
      isExpired,
    }));
  }, [resetToken]);

  useEffect(() => {
    retrieveUserEmail();
  }, [retrieveUserEmail]);

  const handlePasswordReset = async (
    resetPasswordInput: ResetPasswordInput
  ) => {
    try {
      resetToken &&
        (await resetPassword(resetPasswordInput.password, resetToken));

      setState((prevState) => ({
        ...prevState,
        isSuccess: true,
      }));
    } catch (error) {
      const errorMessage = (error as Error).message;
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
      console.error("Error: ", errorMessage);
    }
  };

  return (
    <MainLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordReset)}>
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Réinitialisation du mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              {!isExpired ? (
                <>
                  <p className="mb-4">
                    Réinitialisation du mot de passe associé à :{" "}
                    <span className="font-medium">{email}</span>
                  </p>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormMessage className="pt-4 pb-4">
                    {"Ce lien n'est plus valide."}
                  </FormMessage>
                  <Link to="/forgotten-password" className="text-sm underline">
                    Réinitialiser mot de passe
                  </Link>
                </>
              )}
            </CardContent>
            {!isExpired ? (
              <CardFooter className="flex-col items-start">
                {isSuccess ? (
                  <FormMessage className="pt-4 text-green-600">
                    Nouveau mot de passe enregistré. <br />
                    Redirection dans {countdown} sec.
                  </FormMessage>
                ) : (
                  <Button>Enregistrer</Button>
                )}
                {error ? (
                  <FormMessage className="pt-4">{error}</FormMessage>
                ) : null}
              </CardFooter>
            ) : null}
          </Card>
        </form>
      </Form>
    </MainLayout>
  );
};

export default ResetPassword;
