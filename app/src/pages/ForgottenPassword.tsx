import { useEffect, useState } from "react";
import { sendPasswordResetRequest } from "../services/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCountdownRedirect } from "@/hooks/useCountdownRedirect";
import { REDIRECT_COUNTDOWN_IN_SECOND, SIGN_IN_URL } from "@/constants";
import MainLayout from "@/components/layout/MainLayout";

const ForgottenPasswordFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Le format de l'adresse email est incorrect." }),
});

type ForgottenPasswordInput = z.infer<typeof ForgottenPasswordFormSchema>;

const ForgottenPassword = () => {
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const form = useForm<ForgottenPasswordInput>({
    resolver: zodResolver(ForgottenPasswordFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const countdown = useCountdownRedirect({
    isSuccess,
    initialCountdown: REDIRECT_COUNTDOWN_IN_SECOND,
    url: SIGN_IN_URL,
  });

  const email = form.getValues("email");

  useEffect(() => {
    setError("");
  }, [email]);

  const handlePasswordResetRequest = async (
    forgottenPasswordInput: ForgottenPasswordInput
  ) => {
    try {
      await sendPasswordResetRequest(forgottenPasswordInput.email);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = (error as Error).message;

      if (errorMessage.includes("400")) {
        setError(
          "Vous avez réinitialisé votre mot de passe dans les 10 dernières minutes. Merci patienter avant de refaire une demande."
        );
      } else if (errorMessage.includes("404")) {
        setError(`Adresse email ${forgottenPasswordInput.email} inconnue.`);
      } else {
        setError(errorMessage);
      }

      console.error("Error: ", errorMessage);
    }
  };

  return (
    <MainLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordResetRequest)}>
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Mot de passe oublié</CardTitle>
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
            </CardContent>
            <CardFooter className="flex-col items-start">
              {isSuccess ? (
                <FormMessage className="pt-4 text-green-600">
                  Un email de réinitialisation vous a été envoyé. <br />
                  Redirection dans {countdown} sec.
                </FormMessage>
              ) : (
                <Button>Réinitialiser mot de passe</Button>
              )}
              {error ? (
                <FormMessage className="pt-4">{error}</FormMessage>
              ) : null}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </MainLayout>
  );
};

export default ForgottenPassword;
