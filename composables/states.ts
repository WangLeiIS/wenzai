//model
export const useModels = () => useState<string[]>('models', () => ['gpt-3.5-turbo','gpt-3.5-turbo-16k-0613','gpt-3.5-turbo-1106'])
export const useModel = () => useState<string>('model', () => '')

// toolbar
export const useIsLoading = () => useState<boolean>('isAnswer', () => false)
export const useIsContext = () => useState<boolean>('isContext', () => false)

//textarea
export const useCursorPosition = () => useState<number>('cursorPosition', () => 0)
export const useSelectPosition = () => useState<number>('selectPosition', () => 0)
export const useInputMessage = () => useState<string>('inputMessage', () => '# Hello World\n')
export const useIsSelect = () => useState<boolean>('isSelect', () => false)
export const useIsCall = () => useState<boolean>('isCall', () => false)

