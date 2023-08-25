import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

//importing components 
import HomePage from './components/HomePage';
import MemberPage from './components/MemberPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/:studentId" element={<MemberPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
