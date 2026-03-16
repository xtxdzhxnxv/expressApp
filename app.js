const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); // В начало файла


const app = express();
app.use(express.json());
app.use(cors()); // Сразу после const app = express();

// 1. Твоя ссылка к Atlas (не забудь свой пароль!)
const dbUrl = process.env.MONGO_URL;
mongoose.connect(dbUrl)
    .then(() => console.log('Подключено к MongoDB!'))
    .catch(err => console.log('Ошибка:', err));

// 2. Схема (вместо того, чтобы думать, как устроен .json, мы описываем это тут)
const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    message: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}));


const auth = (req, res, next) => {
    try {
        // Берем токен из заголовка запроса
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Проверяем его нашей секретной фразой
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Добавляем ID юзера в запрос, чтобы другие роуты его видели
        req.userId = decoded.id;
        
        next(); // Всё супер, пропускаем дальше!
    } catch (e) {
        res.status(401).send("Ошибка: Сначала авторизуйся!");
    }
};



// Роут: Получить все контакты из базы данных
app.get('/contacts', auth, async (req, res) => {
    try {
        // Находим вообще всё, что есть в коллекции Contact
        const myContacts = await Contact.find({ owner: req.userId });        
        // Отправляем это обратно в браузер в формате JSON
        res.json(myContacts);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных" });
    }
});





app.post('/contacts', auth, async (req, res) => {
    try {
        // Берем данные из тела запроса (body)
        const newContact = new Contact({
            name: req.body.name,
            message: req.body.message,
            owner: req.userId
        });

        await newContact.save();
        res.status(201).json(newContact); 
    } catch (err) {
        console.error('POST /contacts error:', err);
        res.status(400).json({ message: "Ошибка: проверь данные", error: err.message });
    }
});




app.delete('/contacts/:id', auth, async (req, res) => {
    try {
        const result = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.userId });
        if (!result)
            return res.status(404).json({ message: "Контакт не найден или у вас нет прав на его удаление" });
        res.json({ message: "Контакт удален" , deletedContact: result });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});





app.patch('/contacts/:id', auth, async (req, res) => {
    try {
        // { new: true } говорит мангусту вернуть уже обновленный объект, а не старый
        const updatedContact = await Contact.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId },
            req.body, 
            { new: true } 
            
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Контакт не найден" });
        }

        res.json({ message: "Данные обновлены!", updatedContact });
    } catch (err) {
        res.status(500).json({ message: "Ошибка: " + err.message });
    }
});




const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
}));


const bcrypt = require('bcrypt'); 
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const hashedPassword =  await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).send("Пользователь зарегистрирован!");
    } catch (err) {
        res.status(500).send("Mistake: " + err.message);
    }
});

const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("Юзер не найден");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Неверный пароль");

    const token = jwt.sign({ id: user._id }, 'OWNERS_KEY', { expiresIn: '1h' });

    res.json({ token });
    token.savetoLocalStorage(); 
});






app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});

