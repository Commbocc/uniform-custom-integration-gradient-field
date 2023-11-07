interface ColorModel {
  color: string
  opacity: number
}

interface GradientModel {
  name?: string
  angle?: number
  colors?: ColorModel[]
  compiledValue?: string
}
