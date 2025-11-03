export default async function createUser(userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/create-account?user_id=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}
