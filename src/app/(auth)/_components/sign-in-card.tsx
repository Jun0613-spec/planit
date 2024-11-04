"use client";

import { useState } from "react";
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

import { signinSchema } from "@/lib/zod";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const SignInCard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      }

      if (!result?.error) {
        router.push("/");
        toast.success("Welcome!");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onProviderSignIn = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <Card className="mt-20 h-full w-full md:w-[500px] shadow-lg border border-neutral-300 dark:border-neutral-600 rounded-lg">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign in to continue planning and organizing with Planit
        </CardDescription>
      </CardHeader>
      <div className="mb-2 px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? <Loader /> : "Sign in"}
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
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-sky-700">
            sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
