export const parseBearer = async (bearer: string) => {
  const [_, token] = bearer.trim().split(' ')
  return token
}
