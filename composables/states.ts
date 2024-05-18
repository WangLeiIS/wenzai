//model
export const useModels = () => useState<string[]>('models', () => ['gpt-4o','gpt-3.5-turbo','gpt-4','gpt-4-turbo'])
export const useModel = () => useState<string>('model', () => '')

// toolbar
export const useIsLoading = () => useState<boolean>('isAnswer', () => false)
export const useIsContext = () => useState<boolean>('isContext', () => false)


//textarea
export const useCursorPosition = () => useState<number>('cursorPosition', () => 0)
export const useSelectPosition = () => useState<number>('selectPosition', () => 0)
export const useInputMessage = () => useState<string>('inputMessage', () => '')
export const useInputQuestion = () => useState<string>('inputQuestion', () => '')
export const useIsSelect = () => useState<boolean>('isSelect', () => false)
export const useIsCall = () => useState<boolean>('isCall', () => false)

//preview
export const usePreview = () => useState<number>('previewMode', () => 0)