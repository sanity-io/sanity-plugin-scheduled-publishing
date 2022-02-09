export default function getErrorMessage(err: unknown): string {
  let message

  if (err instanceof Error) {
    message = err.message
  }
  message = String(err)

  return message
}
