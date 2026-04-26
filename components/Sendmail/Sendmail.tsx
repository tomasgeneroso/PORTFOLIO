export async function sendEmail(senderEmail: string, subject: string, message: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderEmail, subject, message }),
  });

  const data = await response.json();
  return data;
}
