import { signIn } from "@/auth";

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
    // Extracting fields from formData
    const payload = {
      name: formData.get("fullname"),
      email: formData.get("email") ,
      password: formData.get("password") ,
     
    };
  
  
    try {
      // Use fetch to make a POST request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    
  
      const data = await response.json();
      console.log("do register response:", data);
      return data;
    } catch (error: any) {
      console.error("Error in registration:", error);
    }
  }