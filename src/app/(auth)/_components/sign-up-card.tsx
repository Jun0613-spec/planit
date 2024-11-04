"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Loader from "@/components/loader";

import { useSignUp } from "@/hooks/auth/use-sign-up";

import { signupSchema } from "@/lib/zod";

const SignUpCard = () => {
  const { mutate, isPending } = useSignUp();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    mutate(values, {
      onSuccess: async () => {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/"
        });
      }
    });
  };

  const onProviderSignIn = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <Card className="mt-20 h-full w-full md:w-[500px] shadow-lg border border-neutral-300 dark:border-neutral-600 rounded-lg">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Sign up to manage tasks and boost team productivity with Planit
        </CardDescription>
      </CardHeader>
      <div className="mb-2 px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="name"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="primary"
              disabled={isPending}
              size="lg"
              className="w-full"
            >
              {isPending ? <Loader /> : "Sign up"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button
          className="w-full"
          variant="secondary"
          size="lg"
          onClick={() => onProviderSignIn("google")}
        >
          <FcGoogle className="mr-2 size-5" />
          Continue with Google
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          size="lg"
          onClick={() => onProviderSignIn("github")}
        >
          <FaGithub className="mr-2 size-5" />
          Continue with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="flex items-center justify-center p-7">
        <p className="text-sm font-medium text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-sky-700">
            sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
