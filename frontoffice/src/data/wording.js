import fr from "./fr.json"
import en from "./en.json"

export const wording = (lang, word) => {
  const wording = {
    fr,
    en,
  }
  if (lang && word) {
    return wording[lang][word]
  } else {
    return null
  }
}
