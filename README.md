# 🎓 AI Classroom - Smart Assignment Management System

A comprehensive, AI-powered assignment management system for teachers and students with intelligent feedback, plagiarism detection, and voice assistance.

![AI Classroom](https://img.shields.io/badge/Status-Production%20Ready-green)
![Django](https://img.shields.io/badge/Django-4.2-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Python](https://img.shields.io/badge/Python-3.8+-blue)

## ✨ Features

### For Students
- 📝 **Assignment Submission**: Upload various file types (PDF, DOCX, PPTX, images)
- 🤖 **AI Analysis**: Get instant feedback on spelling, grammar, formatting, and code quality
- 🔍 **Plagiarism Check**: View similarity scores with other submissions
- 🎙️ **Voice Assistant**: Listen to feedback using Web Speech API
- 📊 **Progress Tracking**: Monitor grades and submission status
- 💬 **Interactive Q&A**: Ask questions about your feedback

### For Teachers
- 📚 **Assignment Management**: Create and manage assignments with due dates
- 👥 **Submission Review**: View and grade student submissions
- 🔬 **AI Insights**: Access detailed AI analysis for each submission
- ⚠️ **Similarity Alerts**: Identify potential plagiarism with color-coded badges
- 📈 **Analytics Dashboard**: Track class performance and trends
- ✍️ **Manual Grading**: Add comments and final grades

### AI Capabilities
- ✅ Spelling and grammar checking
- 📐 Formatting and structure analysis
- 💬 Wording quality assessment
- 💻 Code quality detection
- 🔗 TF-IDF based similarity detection
- 📊 Comprehensive scoring system

## 🏗️ Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **JWT** - Authentication
- **TextBlob** - NLP for spelling/grammar
- **scikit-learn** - Similarity detection
- **PyPDF2, python-docx, python-pptx** - File processing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Web Speech API** - Voice features

## 📁 Project Structure

```
ai-classroom/
├── backend/                    # Django backend
│   ├── ai_classroom_backend/   # Django project settings
│   ├── assignments_app/        # Main application
│   │   ├── ai/                 # AI modules
│   │   │   ├── text_extraction.py
│   │   │   ├── analysis.py
│   │   │   └── similarity.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── media/                  # Uploaded files
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── pages/              # Page components
    │   ├── services/           # API services
    │   ├── store/              # State management
    │   └── styles/             # Global styles
    ├── package.json
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📖 Usage Guide

### 1. Register an Account
- Visit `http://localhost:3000/register`
- Choose role (Student or Teacher)
- Fill in your details
- Click "Create Account"

### 2. For Students

**Submit an Assignment:**
1. Go to Dashboard → Assignments
2. Select an assignment
3. Upload your file (drag-and-drop or browse)
4. Click "Submit"

**Get AI Feedback:**
1. Go to your submission
2. Click "Run AI Analysis"
3. View detailed feedback with scores
4. Check similarity results

**Use Voice Assistant:**
1. Go to AI Assistant page
2. Select a submission
3. Click "Read Feedback Aloud"
4. Ask questions about your feedback

### 3. For Teachers

**Create an Assignment:**
1. Go to Dashboard → Assignments
2. Click "Create Assignment"
3. Fill in title, description, due date
4. Set allowed file types
5. Click "Create"

**Review Submissions:**
1. Go to Assignment → Submissions
2. View AI analysis and similarity scores
3. Add comments and grade
4. Approve/Reject/Request Changes

**Run Similarity Check:**
1. Go to an assignment
2. Click "Compute Similarity"
3. View similarity matrix
4. Check high-similarity alerts

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register/        # Register new user
POST /api/auth/login/           # Login
GET  /api/auth/me/              # Get current user
POST /api/auth/token/refresh/   # Refresh token
```

### Assignments
```
GET    /api/assignments/              # List assignments
POST   /api/assignments/              # Create assignment
GET    /api/assignments/{id}/         # Get assignment
POST   /api/assignments/{id}/submit/  # Submit assignment
GET    /api/assignments/{id}/submissions/  # List submissions
```

### Submissions
```
GET  /api/submissions/                # List submissions
GET  /api/submissions/{id}/           # Get submission
POST /api/submissions/{id}/analyze/   # Run AI analysis
GET  /api/submissions/{id}/analysis/  # Get analysis
GET  /api/submissions/{id}/similarity/  # Get similarity
POST /api/submissions/{id}/review/    # Submit review
```

### Dashboard
```
GET /api/dashboard/stats/  # Get dashboard statistics
```

## 🎨 UI/UX Design

The interface follows modern design principles:
- **Purple/Pink Gradient Theme** - Vibrant and engaging
- **Glassmorphism Effects** - Modern, premium feel
- **Smooth Animations** - Enhanced user experience
- **Responsive Design** - Works on all devices
- **Accessible** - WCAG compliant

## 🔒 Security

- JWT-based authentication
- Role-based access control
- File type and size validation
- CORS protection
- SQL injection prevention (Django ORM)
- XSS protection

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Backend (Django)
1. Set `DEBUG=False` in settings
2. Configure production database (PostgreSQL recommended)
3. Set strong `SECRET_KEY`
4. Configure static files serving
5. Use gunicorn/uwsgi for WSGI server
6. Set up nginx as reverse proxy

### Frontend (React)
1. Build production bundle: `npm run build`
2. Serve `dist/` folder with nginx or similar
3. Configure API endpoint for production

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Django and React communities
- TextBlob for NLP capabilities
- Web Speech API for voice features
- Tailwind CSS for beautiful styling

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@aiclassroom.com

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced OCR for handwritten text
- [ ] Integration with LMS platforms
- [ ] Multi-language support
- [ ] Video submission support
- [ ] Peer review system
- [ ] Gamification features

---
