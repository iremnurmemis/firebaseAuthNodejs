const express = require("express");
const { getUsers, createUser, getUserById, updateUser, deleteUser,registerUser,loginUser,resetPassword,sendEmailVerificationCode,Logout,userDelete,refreshToken,checkAuthStatus} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Tüm kullanıcıları getir"
 *     description: "Firestore veritabanından tüm kullanıcıları getirir"
 *     responses:
 *       200:
 *         description: "Başarılı"
 */
router.get("/", getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "Yeni kullanıcı oluştur"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Kullanıcı oluşturuldu"
 */
router.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: "Belirtilen ID'ye sahip kullanıcıyı getir"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Başarılı"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: "Belirtilen ID'ye sahip kullanıcıyı güncelle"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Kullanıcı güncellendi"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: "Belirtilen ID'ye sahip kullanıcıyı sil"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Kullanıcı silindi"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 */
router.delete("/:id", deleteUser);



/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: "Yeni kullanıcı kaydet"
 *     description: "E-posta ve şifre ile yeni bir kullanıcı kaydeder ve Firestore veritabanına ekler."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Kullanıcı başarıyla kaydedildi"
 *       500:
 *         description: "Kullanıcı kaydı sırasında bir hata oluştu"
 */
router.post("/register", registerUser);


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: "Kullanıcı giriş yap"
 *     description: "E-posta ve şifre ile kullanıcı giriş işlemi yapar."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Başarılı giriş"
 *       401:
 *         description: "Geçersiz kimlik bilgileri"
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: "Şifre sıfırlama isteği gönder"
 *     description: "Kullanıcının e-posta adresine şifre sıfırlama bağlantısı gönderir"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Şifre sıfırlama e-postası gönderildi"
 *       400:
 *         description: "E-posta adresi gerekli"
 *       500:
 *         description: "Şifre sıfırlama işlemi başarısız"
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /users/send-email-verification:
 *   post:
 *     summary: "E-posta doğrulama bağlantısı gönder"
 *     description: "Kullanıcının e-posta adresine doğrulama bağlantısı gönderir"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Doğrulama bağlantısı gönderildi"
 *       400:
 *         description: "E-posta adresi gerekli"
 *       500:
 *         description: "Doğrulama e-postası gönderilirken hata oluştu"
 */
router.post("/send-email-verification", sendEmailVerificationCode);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: "Kullanıcı çıkışı"
 *     description: "Kullanıcıyı Firebase Authentication üzerinden çıkış yapar."
 *     responses:
 *       200:
 *         description: "Başarılı çıkış"
 *       500:
 *         description: "Çıkış sırasında hata oluştu"
 */
router.post("/logout", Logout);

/**
 * @swagger
 * /users/delete:
 *   post:
 *     summary: "Kullanıcıyı sil"
 *     description: "Firebase Authentication üzerinden kullanıcı hesabını siler."
 *     responses:
 *       200:
 *         description: "Kullanıcı başarıyla silindi"
 *       500:
 *         description: "Kullanıcı silinirken hata oluştu"
 */
router.post("/delete", userDelete);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: "Token yenileme"
 *     description: "Kullanıcı kimlik doğrulama token'ını yeniler."
 *     responses:
 *       200:
 *         description: "Token başarıyla yenilendi"
 *       500:
 *         description: "Token yenileme işlemi sırasında hata oluştu"
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /users/check-auth-status:
 *   get:
 *     summary: "Kullanıcı oturum durumu kontrol et"
 *     description: "Kullanıcının oturum açıp açmadığını kontrol eder"
 *     responses:
 *       200:
 *         description: "Kullanıcı oturum açtı"
 *       401:
 *         description: "Oturum açılmamış kullanıcı"
 */
router.get("/check-auth-status", checkAuthStatus);


module.exports = router;


