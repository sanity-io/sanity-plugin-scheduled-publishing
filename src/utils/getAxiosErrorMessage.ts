import axios from 'axios'

export default function getAxiosErrorMessage(err: unknown): string {
  let message

  if (axios.isAxiosError(err)) {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      message = err.response.data.message || err.message
    } else if (err.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      message = err.request || err.message
    } else {
      // Something happened in setting up the request that triggered an Error
      message = err.message
    }
  } else {
    if (err instanceof Error) {
      message = err.message
    }
    message = String(err)
  }

  return message
}
