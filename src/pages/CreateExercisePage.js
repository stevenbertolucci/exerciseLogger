import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import LogOutButton from '../components/LogOutButton';

export const CreateExercisePage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [reps, setReps] = useState();
    const [weight, setWeight] = useState();
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');

    const addExercise = async () => {
        const newExercise = {name, reps, weight, unit, date};
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {'Content-Type': 'application/json',
            },
        });
        if(response.status === 201) {
            alert("Successfully added the exercise!");
        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        navigate("/");
    };

    return (
        <div>
            <Navigation />
            <LogOutButton />
            <h1>Add Exercise</h1>
            <fieldset className="App-fieldset">
            <input className='App-input'
                type="text"
                placeholder="Enter exercise here"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input className='App-input'
                type="number"
                placeholder="Enter # of reps"
                value={reps}
                onChange={e => setReps(e.target.value)} />
            <input className='App-input'
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select name="selection" id="unitChosen" onChange={e => setUnit(e.target.value)} className="App-select">
                <option value="">Choose Unit </option>
                <option value="kgs">kgs</option>
                <option value="lbs">lbs</option>
            </select>
            <input className='App-input'
                type="text"
                placeholder="Enter date"
                value={date}
                onChange={e => setDate(e.target.value)} />
            <button className='App-button'
                onClick={addExercise}
            >Add</button>
            </fieldset>    
        </div>
    );
}

export default CreateExercisePage; 