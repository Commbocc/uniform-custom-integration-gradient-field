import { initializeUniformMeshSDK } from '@uniformdev/mesh-sdk'

export const useUniformMesh = async () => {
  try {
    const meshSdk = await initializeUniformMeshSDK()
    return meshSdk
  } catch (error: any) {
    throw createError({
      statusCode: 403,
      statusMessage: error.message,
      fatal: true,
    })
  }
}
