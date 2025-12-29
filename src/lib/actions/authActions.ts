import { signIn } from "@/auth";
import { createBrowserSupabaseClient } from "../supabase/client";

export async function doCredentialLogin(formData: FormData) {
  const email = formData.get("username");
  const password = formData.get("password");
  console.log("email forom docredentail login", email, "password", password);

  try {
    const response = await signIn("credentials", {
      email: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!response) {
      console.log("error in sign in", response);
      throw new Error("Invalid credentials");
    }
    if (response) {
    }

    return response;
  } catch (error: any) {
    console.log("authactions:", error);
    const errorMessage = error.cause?.err?.message;
    console.log("authactions errromessage", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function doRegister(formData: FormData) {
  const supabase = createBrowserSupabaseClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {
      user: data.user,
      session: data.session,
    };
  } catch (err: any) {
    console.error("Registration error:", err);
    return { error: "Something went wrong during registration" };
  }
}
