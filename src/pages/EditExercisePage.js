import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import LogOutButton from '../components/LogOutButton';

export const EditExercisePage = ({exerciseToEdit}) => {
    const navigate = useNavigate();

    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);


    const editExercise = async () => {
        const editedExercise = {name, reps, weight, unit, date};
        const response = await fetch(`/exercises/${exerciseToEdit._id}`, {
            method: 'PUT', 
            body: JSON.stringify(editedExercise),
            headers: {'Content-Type': 'application/json',
            },
        });
    if(response.status === 200) {
        alert("Successfully edited the exercise!");
    } else {
        alert(`Failed to edit exercise, status code = ${response.status}`);
    }
    navigate("/");
    };

    return (
        <div>
            <Navigation />
            <LogOutButton />
            <h1>Edit Exercise</h1>
            <fieldset className="App-fieldset">
            <input className='App-input'
                type="text"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input className='App-input'
                type="number"
                value={reps}
                onChange={e => setReps(e.target.value)} />
            <input className='App-input'
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select name="selection" id="unitChosen" onChange={e => setUnit(e.target.value)} className="App-select">
                <option value={unit}>{unit}</option>
                <option value="kgs">kgs</option>
                <option value="lbs">lbs</option>
            </select>
            <input className='App-input'
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)} />
            <button className='App-button'
                onClick={editExercise}
            >Save</button>
            </fieldset>
        </div>
    );
}

export default EditExercisePage;