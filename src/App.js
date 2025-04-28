import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackForm from './compoenents/FeedbackForm';
import LoginForm from './compoenents/LoginForm';
import FeedbackList from './compoenents/FeedbackList';
import FeedbackDetails from './compoenents/FeedbackDetails';

function App() {
  return (
    // <div className="App">
    //   <FeedbackForm/>
    //   <LoginForm/>
    // </div>
     <Router>
     <Routes>
       <Route path="/" element={<LoginForm />} />
       <Route path="/feedback" element={<FeedbackForm />} />
       <Route path="/feedbackList" element={<FeedbackList />} />
       <Route path="/feedback/:id" element={<FeedbackDetails />} />

     </Routes>
   </Router>
  );
}

export default App;
