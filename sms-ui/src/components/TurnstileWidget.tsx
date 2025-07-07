import Turnstile from "react-turnstile";

export default function TurnstileWidget({
  onVerify,
}: {
  onVerify: (token: string) => void;
}) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  return <Turnstile sitekey={siteKey} onVerify={onVerify} />;
}
