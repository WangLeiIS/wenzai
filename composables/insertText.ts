export function insertText(text: string, cursorPosition: number, inputMessage: string) {
  return inputMessage.slice(0, cursorPosition) + text + inputMessage.slice(cursorPosition)
}

