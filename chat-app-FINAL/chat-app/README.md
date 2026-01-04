# Real-Time Chat Application

A secure, scalable real-time chat application built with Node.js, Express, Socket.IO, and MongoDB.

## 🚀 Features

### Security
- ✅ **Password Hashing**: All passwords hashed with bcrypt (no plaintext storage)
- ✅ **XSS Prevention**: Input sanitization and HTML escaping
- ✅ **Session Security**: HttpOnly cookies, SameSite protection, secure sessions
- ✅ **Rate Limiting**: Prevents brute force attacks on auth routes
- ✅ **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection

### Authentication & Authorization
- ✅ **Secure Login/Signup**: Validated inputs with error handling
- ✅ **Session Management**: Persistent sessions across refreshes
- ✅ **Route Protection**: Unauthenticated users cannot access chat
- ✅ **Graceful Logout**: Proper session cleanup

### Chat Features
- ✅ **Real-time Messaging**: Instant message delivery via Socket.IO
- ✅ **Message Persistence**: All messages stored in MongoDB
- ✅ **Message History**: Recent messages loaded on chat join
- ✅ **Typing Indicators**: See when others are typing
- ✅ **Online Presence**: Track who's currently online
- ✅ **Timestamps**: All messages show send time
- ✅ **Message Styling**: Distinct styling for own vs others' messages
- ✅ **Auto-scroll**: Automatically scroll to newest messages
- ✅ **Room Support**: Basic infrastructure for multi-room chat (ready for expansion)

### User Experience
- ✅ **Connection Status**: Visual feedback for connection state
- ✅ **Error Handling**: Graceful error messages for disconnects/failures
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Modern UI**: WhatsApp-inspired clean interface
- ✅ **Animations**: Smooth message animations and transitions

### Code Quality
- ✅ **Clean Architecture**: Separated concerns (routes/controllers/models/sockets)
- ✅ **Modular Structure**: Easy to maintain and extend
- ✅ **Commented Code**: Clear documentation throughout
- ✅ **Environment Config**: Centralized configuration management
- ✅ **No node_modules**: Excluded from repository

## 📁 Project Structure

```
chat-app/
├── config/
│   ├── config.js          # Centralized app configuration
│   └── database.js        # Database connection setup
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── chatController.js  # Chat page logic
├── middleware/
│   ├── auth.js            # Auth middleware
│   └── rateLimiter.js     # Rate limiting middleware
├── models/
│   ├── User.js            # User schema
│   └── Message.js         # Message schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── chatRoutes.js      # Chat endpoints
├── sockets/
│   └── chatSocket.js      # Socket.IO event handlers
├── utils/
│   └── sanitizer.js       # Input sanitization utilities
├── views/
│   ├── login.ejs          # Login page
│   ├── signup.ejs         # Signup page
│   └── chat.ejs           # Chat interface
├── public/
│   └── style.css          # Styles
├── .env                   # Environment variables (not committed)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
└── server.js              # Main application entry
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install missing dependencies** (if any)
   ```bash
   npm install dotenv express-rate-limit
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and update:
   ```env
   NODE_ENV=development
   PORT=9200
   MONGO_URI=mongodb://127.0.0.1:27017/chatApp
   SESSION_SECRET=your_super_secret_key_change_in_production
   ```

4. **Start MongoDB**
   ```bash
   # On Linux/Mac
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

5. **Run the application**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

6. **Access the application**
   ```
   http://localhost:9200
   ```

## 🔒 Security Best Practices

### For Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use a strong, random `SESSION_SECRET` (min 32 characters)
   - Never commit `.env` file

2. **HTTPS**
   - Use HTTPS in production (cookies set to secure)
   - Configure SSL certificates

3. **Database**
   - Use MongoDB Atlas or secure MongoDB instance
   - Enable authentication on MongoDB
   - Use connection string with credentials

4. **Rate Limiting**
   - Adjust rate limits based on expected traffic
   - Consider using Redis for distributed rate limiting

5. **Additional Security**
   - Implement CSRF protection for sensitive operations
   - Add input validation on all routes
   - Regular security audits
   - Keep dependencies updated

## 📝 API Endpoints

### Authentication
- `GET /signup` - Signup page
- `POST /signup` - Create new account
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - End session

### Chat
- `GET /chat` - Chat interface (protected)
- `GET /` - Redirect to login or chat

## 🔌 Socket.IO Events

### Client → Server
- `new user` - Register user as online
- `chat message` - Send message
- `typing` - User started typing
- `stop typing` - User stopped typing
- `disconnect` - User disconnected

### Server → Client
- `updateUsers` - Online users list updated
- `chat message` - New message received
- `typing update` - Typing users updated
- `user joined` - User joined notification
- `user left` - User left notification
- `connect` - Successfully connected
- `disconnect` - Connection lost
- `error` - Error occurred

## 🎯 Future Enhancements

### Planned Features
- [ ] Multiple chat rooms
- [ ] Private messaging
- [ ] File/image sharing
- [ ] Message reactions (emoji)
- [ ] User profiles with avatars
- [ ] Message search
- [ ] Message editing/deletion
- [ ] Read receipts
- [ ] Push notifications
- [ ] Voice/video calls

### Scalability Improvements
- [ ] Redis for session storage
- [ ] Socket.IO Redis adapter for horizontal scaling
- [ ] Message pagination
- [ ] CDN for static assets
- [ ] Load balancing

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use
```bash
# Change PORT in .env file or kill existing process
lsof -ti:9200 | xargs kill -9
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

ISC

## 👤 Author

Built with ❤️ as a portfolio-quality chat application

---

## 🔥 What's New in Version 2.0

### Major Improvements
1. **Security Overhaul**: Complete security implementation with bcrypt, XSS prevention, rate limiting
2. **Clean Architecture**: Refactored to MVC pattern with clear separation of concerns
3. **Enhanced UX**: Typing indicators, connection status, better error handling
4. **Modular Code**: Easy to maintain and extend
5. **Production Ready**: Environment configuration, security headers, graceful shutdown

### Breaking Changes
- Restructured file organization (old structure incompatible)
- New dependencies: `dotenv`, `express-rate-limit`
- Environment variables now required (`.env` file)

### Migration from v1.0
1. Install new dependencies: `npm install`
2. Create `.env` file from `.env.example`
3. Update imports if you modified any files
4. Test authentication flows (password validation added)
