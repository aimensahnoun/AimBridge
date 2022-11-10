import crypto from "crypto";

export const hash = (body: any) => {
  const secret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET as string;

  const encrypted = crypto
    .createHash("sha256")
    .update(secret + body)
    .digest("hex");

  return encrypted;
};
