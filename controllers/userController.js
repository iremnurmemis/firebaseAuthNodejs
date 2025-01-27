const User = require("../models/User");
const { firestore, authAdmin } = require("../firebase");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  getIdToken,
  onAuthStateChanged

} = require("firebase/auth");
const { use } = require("../routes/userRoutes");

const auth = getAuth();
console.log(firestore);

const usersRef = firestore.collection("users");

const denemeRef = firestore.collection("kullanıcılar");
const getUsers = async (req, res) => {
  try {
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const userRef = firestore.collection("users").doc();
    await userRef.set({
      name,
      email,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", userId: userRef.id });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const doc = await usersRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
  }
};

const getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("E-posta adresi gerekli");
    }

    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      console.log("No user found for email:", email); 
      return null;
    }

    let user;
    snapshot.forEach((doc) => {
      user = { id: doc.id, ...doc.data() };
    });

    console.log("User data retrieved: ", user); 
    return user;

  } catch (error) {
    throw new Error(`Kullanıcı getirilirken hata oluştu: ${error.message}`);
  }
};



const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    await usersRef.doc(req.params.id).update({ name, email });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    await usersRef.doc(req.params.id).delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

const registerUser = (req, res) => {
  const { email, password, name } = req.body;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Başarıyla yeni kullanıcı oluşturuldu:", user.uid);

      const userRef = usersRef.doc(user.uid);
      return userRef.set({
        name,
        email,
        createdAt: new Date(),
      });
    })
    .then(() => {
      res.status(200).json({ message: "Kullanıcı kaydı başarılı" });
    })
    .catch((error) => {
      console.log("Yeni kullanıcı oluşturulurken hata:", error);
      res.status(500).json({ error: "Kullanıcı kaydı yapılamadı" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Successfully authenticated user:", userCredential.user.uid);

      userCredential.user.getIdToken()
        .then((idToken) => {
          res.status(200).json({
            message: "User login successful",
            token: idToken, 
          });
        })
        .catch((error) => {
          console.log("Error getting token:", error);
          res.status(500).json({ error: "Error generating token" });
        });
    })
    .catch((error) => {
      console.log("Error authenticating user:", error);
      res.status(401).json({ error: "Invalid credentials" });
    });
};

const resetPassword= async (req,res)=>{
  const { email } = req.body;

  const auth = getAuth();

  if (!email) {
    return res.status(400).json({ error: "E-posta adresi gerekli" });
  }

  await sendPasswordResetEmail(auth,email)
    .then(() => {
      res.status(200).json({ message: 'Şifre sıfırlama e-postası gönderildi.' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Şifre sıfırlama e-postası gönderilemedi', error: error.message });
    });

};

const sendEmailVerificationCode = async (req, res) => {
  const { email } = req.body;
  const auth = getAuth();

  if (!email) {
    return res.status(400).json({ error: "E-posta adresi gerekli" });
  }

  try {
    const userRecord = await getUserByEmail(email);

    if (!userRecord) {
      console.log("User not found for email:", email); 
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const user = auth.currentUser;
    if (!user) {
      return res.status(401).json({ error: "Kullanıcı giriş yapmamış" });
    }

    await sendEmailVerification(user);

    return res.status(200).json({ message: "Doğrulama bağlantısı gönderildi." });

  } catch (error) {
    console.log("Error during email verification: ", error.message); 
    return res.status(500).json({ error: "Doğrulama e-postası gönderilirken hata oluştu", details: error.message });
  }
};


const Logout = (req, res) => {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      res.status(200).json({ message: 'Kullanıcı başarılı bir şekilde çıkış yaptı.' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Çıkış yaparken hata oluştu', error: error.message });
    });
};


const userDelete=(req,res)=>{
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return res.status(400).json({ message: "No user logged in" });
  }

  user.delete().then(() => {
    res.status(200).json({ message: 'User account deleted successfully' });
  })
  .catch((error) => {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  });
};

const refreshToken=(req,res)=>{
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return res.status(400).json({ message: "No user logged in" });
  }

  user.getIdToken(auth,true).then((idToken)=>{
    res.status(200).json({ message: 'Token refreshed', token: idToken });
  }).catch((error) => {
    res.status(500).json({ message: 'Error refreshing token', error: error.message });
  });

}

const checkAuthStatus = async (req, res) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Kullanıcı var mı?
  if (!user) {
    return res.status(401).json({ message: 'Oturum açılmamış kullanıcı' });
  }

  // Giriş yapan kullanıcının UID'sini alalım
  console.log('Kullanıcı UID:', user.uid); // Kullanıcı UID'sini konsola yazdır

  try {
    // Kullanıcı verisini Firestore'dan sorguluyoruz
    const userSnapshot = await usersRef.doc(user.uid).get();
    if (userSnapshot.exists) {
      console.log('Kullanıcı verisi:', userSnapshot.data()); // Veriyi konsola yazdır
      res.status(200).json({ message: 'Kullanıcı oturum açtı', user: userSnapshot.data() });
    } else {
      console.log('Kullanıcı bulunamadı.');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.log('Veri çekme hatası:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};



module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  resetPassword,
  sendEmailVerificationCode,
  Logout,
  userDelete,
  refreshToken,
  checkAuthStatus
};
