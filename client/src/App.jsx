import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import components 
import HomePage from './components/HomePage';
import MemberPage from './components/MemberPage';
import ErrorPage from './components/ErrorPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/member/:studentId" element={<MemberPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App;
