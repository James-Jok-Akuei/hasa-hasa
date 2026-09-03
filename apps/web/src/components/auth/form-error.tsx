/**
 * Errors that belong to the form rather than one field — an address already
 * registered, a resend cooldown, the API being unreachable.
 */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="mt-6 text-center text-xs leading-relaxed tracking-wider text-red-300"
    >
      {message}
    </p>
  );
}
