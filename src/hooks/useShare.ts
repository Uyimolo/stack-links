export const useShare = () => {
  const shareContent = (title: string, text: string, url: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const fullUrl = `${origin}${url}`

    // Check if the Web Share API is available
    if (navigator.share && typeof navigator.share === "function") {
      navigator
        .share({
          title,
          text,
          url: fullUrl,
        })
        .then(() => {
          console.log("Successfully shared:", text)
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          // Fallback for when sharing fails
          handleShareFallback(title, text, fullUrl)
        })
    } else {
      // Fallback for browsers that don't support Web Share API
      handleShareFallback(title, text, fullUrl)
    }
  }

  // Fallback function for browsers without Web Share API
  const handleShareFallback = (title: string, text: string, url: string) => {
    // You could implement clipboard copying here
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          // You might want to show a toast notification here
          console.log("URL copied to clipboard")
        })
        .catch((err) => {
          console.error("Failed to copy:", err)
        })
    } else {
      // Last resort fallback - create a temporary input element to copy
      const tempInput = document.createElement("input")
      document.body.appendChild(tempInput)
      tempInput.value = url
      tempInput.select()
      document.execCommand("copy")
      document.body.removeChild(tempInput)
      console.log("URL copied to clipboard (fallback method)")
    }
  }

  return { shareContent }
}
