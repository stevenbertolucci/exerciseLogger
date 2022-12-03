import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import {useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './components/Loading';
import LogInPage from './pages/LogInPage';

function App() {

  const {isLoading, error, isAuthenticated} = useAuth0();
  const [exerciseToEdit, setExerciseToEdit] = useState();
  

  if (error) {
    return <div>Oops... {error.message}</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="App">
      <header>
        <h1>Exercise Logger</h1>
        <p>Welcome to the Exercise Logger! <br /> 
          Use this app to keep track of your exercises. <br /> <br /> </p> <p className='App-p'>Please log in first to access the table!</p>
      </header>
      <Router>
        <div className="App-header">
      <Routes>
          <Route path="/" element= {isAuthenticated ? <HomePage setExerciseToEdit={setExerciseToEdit}/> : <LogInPage />}/>
          <Route path="/create-exercise" element={<CreateExercisePage />}/>
          <Route path="/edit-exercise" element={<EditExercisePage exerciseToEdit={exerciseToEdit} />}/>
      </Routes>
           </div>
      </Router>
      <footer>&#169; 2022 Steven Bertolucci</footer>
    </div>
  );
}

export default App;
