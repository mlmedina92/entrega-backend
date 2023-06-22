export const premium = (req, res, next) => {
  const isPremium = req.user && (req.user.premium || req.user.admin);

  if (isPremium) {
    next();
  } else {
    res.status(403).json({ message: "Acceso no autorizado" });
  }
};

export const admin = (req, res, next) => {
  const isAdmin = req.user && req.user.admin;

  if (isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Acceso no autorizado" });
  }
};

export const checkOwner = (req, res, next) => {
  const isOwner = req.user && req.user.id === req.body.owner;
  const isAdmin = req.user && req.user.admin;

  if (isOwner || isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Acceso no autorizado" });
  }
};
