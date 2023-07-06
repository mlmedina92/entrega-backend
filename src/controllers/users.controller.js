import { getUsers, login, create, checkUser, changeUserRole, uploadDocuments, deleteUser, getInactiveUsers, checkByEmail, changePassword } from "../services/users.service.js";
import { transporter } from "../utils/nodemailer.js";
import { comparePasswords, generateToken, hashPassword } from "../utils.js";
import jwt from 'jsonwebtoken'
import config from "../config.js";

export const getUsersController = async (req, res) => {
  const users = await getUsers()
  res.json(users)
}

export const deleteInactiveUsers = async (req, res) => {
  try {
    const inactiveUsers = await getInactiveUsers(2);
    const deletedUsers = [];

    // Eliminar usuarios inactivos
    for (const user of inactiveUsers) {
      const { email } = user;

      const mailOptions = {
        from: "noreply@example.com",
        to: email,
        subject: "Eliminación de cuenta por inactividad",
        text: "Tu cuenta ha sido eliminada por inactividad.",
      };

      await transporter.sendMail(mailOptions);

      // Eliminar usuario de la base de datos
      await deleteUser(email);
      deletedUsers.push(email);
    }

    res.json({ message: "Usuarios inactivos eliminados", deletedUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar usuarios inactivos" });
  }
};

export const loginUser = async (req, res) => {
  const usersObj = req.body;
  const userLogged = await login(usersObj);
  if (userLogged) {
    req.session.uid = userLogged.user.uid;
    req.session.email = userLogged.user.email;
    req.session.password = userLogged.user.password;
    req.session.userName = userLogged.user.full_name;
    req.session.cartId = userLogged.user.cartId;
    req.session.role = userLogged.user.role;
    res.status(200).cookie("token", userLogged.token, { httpOnly: true }).redirect("/"); //redireccion a home, httpOnly hace que la info del token no pueda ser extraido en el front
    // res.json({ message: 'User logged', user })
  } else {
    res.redirect("/users/errorLogin"); // si no exite lo lleva a otra vista
  }
};

export const createUser = async (req, res) => {
  const usersObj = req.body;
  const newUser = await create(usersObj);
  if (newUser) {
    res.redirect("/");
    // res.json({ message: 'user created', user: newUser })
  } else {
    res.redirect("/users/errorRegistro");
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await checkByEmail(email);
  const resetToken = generateToken(user);
  try {
    if (user) {
      user.userToken = resetToken;
      await user.save();
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const mailOptions = {
      from: "noreply@example.com",
      to: email,
      subject: "Restablecer contraseña",
      html: `<p>Con <a href="${config.myUrl}/reset/${resetToken}">este</a> link podrás restablecer tu contraseña.</p>
        
      <img style="margin: 20px" height="200" src="https://www.enter.co/wp-content/uploads/2016/05/Contrase%C3%B1a-1024x768.jpg" >`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Correo electrónico de restablecimiento de contraseña enviado",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Error al solicitar el restablecimiento de contraseña",
      });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body;

  try {
    // Verificar la validez del token y su fecha de expiración
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, config.secretJWT);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(400)
          .send(
            `El enlace de restablecimiento de contraseña ha expirado, click <a href="/api/users/reset"/>aqui</a> para volver a a pedir un token.`
          );
      } else {
        throw err;
      }
    }

    const userId = decodedToken.user._id;
    const hashed = await hashPassword(password);

    const user = await checkUser(userId);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la nueva contraseña es igual a la contraseña actual
    const isSamePassword = await comparePasswords(password, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "No puedes utilizar la misma contraseña anterior" });
    }

    // Cambiar la contraseña del usuario utilizando la función del manager
    await changePassword(userId, hashed);
    user.userToken = null
    user.save()
    res.json({ message: "Contraseña restablecida exitosamente" }).redirect('/');
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Token inválido" });
  }
};

export const updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await checkUser(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isSamePassword = await comparePasswords(oldPassword, user.password);
    if (!isSamePassword) {
      return res
        .status(400)
        .json({ message: "La contraseña antigua no coincide" });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
};

export const changeRole = async (req, res) => {
  const userId = req.params.uid;

  try {
    const user = await checkUser(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const requiredDocuments = ["credentials", "adressProof", "accountStatus"];
    const userDocuments = user.documents.map(document => document.reference);

    const hasAllRequiredDocuments = requiredDocuments.every(document => userDocuments.includes(document));

    if (hasAllRequiredDocuments) {
      const updatedUser = await changeUserRole(userId);

      res.json({
        message: "Rol de usuario actualizado exitosamente",
        user: updatedUser,
      });
    } else {
      res.status(400).json({ message: "El usuario no ha cargado todos los documentos requeridos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el rol de usuario" });
  }
};

export const uploadDocumentsController = async (req, res) => {
  const userId = req.params.uid;
  const documents = req.files.map(file => {
    return {
      filename: file.filename,
      name: file.filename,
      reference: req.body.docType ? req.body.docType : file.fieldname,
    };
  });

  try {
    await uploadDocuments(userId, documents);

    res.json({ message: "Documentos subidos exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al subir los documentos" });
  }
};
