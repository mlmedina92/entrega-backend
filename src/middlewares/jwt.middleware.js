import jwt from 'jsonwebtoken'

// export function jwtValidation(req, res, next) {
//   // const authHeader = req.get('Authorization')
//   // const token = authHeader.split(' ')[1]
//   const token = req.cookies.token
//   const verifiedUser = jwt.verify(token, 'secretCode')
//   if (verifiedUser) {
//     req.user = verifiedUser.user
//     next()
//   } else {
//     res.json({ message: 'Authentication error' })
//   }
// }

export const jwtValidation = (req, res, next) => {
  const jwtCookie = req.cookies['token'];
  if (!jwtCookie) {
    return res.status(401).json({ error: 'No autorizado. La cookie "token" no está creada.' });
  }
  try {
    const verifiedUser = jwt.verify(jwtCookie, 'secretCode');
    req.user = verifiedUser.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'No autorizado. Token inválido.' });
  }
};