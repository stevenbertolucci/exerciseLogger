import React from 'react';
import { Link } from 'react-router-dom';
import ExerciseTable from '../components/ExerciseTable';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import LogOutButton from '../components/LogOutButton';

function HomePage({setExerciseToEdit}) {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, {method: 'delete'});
        if (response.status === 204) {
            const getResponse = await fetch('/exercises');
            const exercises = await getResponse.json();
            setExercises(exercises);
        } else {
            console.error(`Failed to delete exercise with id = ${_id}, status code = ${response.status}`)
        }
    };

    const onEdit = async exercise => {
        setExerciseToEdit(exercise);
        navigate("/edit-exercise");
    };

    const loadExercises = async () => {
        const response = await fetch('/exercises');
        const exercises = await response.json();
        setExercises(exercises);
    };

    useEffect(() => {
        loadExercises();
    }, []);


    return (
        <>
            <Navigation />
            <LogOutButton />
            <h2>Welcome! Here is the list of Exercises</h2>
            <ExerciseTable exercises={exercises} onDelete={onDelete} onEdit={onEdit}></ExerciseTable>
            <Link to="/create-exercise">Add an exercise</Link>
        </>
    );
}

export default HomePage;