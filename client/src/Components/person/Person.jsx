import React, { useEffect } from "react";
import PersonForm from "./PersonForm"
import PersonList from "./PersonList"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast';
import axios from "axios";
import { data } from "react-router-dom";

function Person() {
    const BASE_URL = import.meta.env.VITE_BASE_API_URL + "/people";
    const [people, setPeople] = React.useState([])
    const [loading, setLoading] = React.useState(true);
    const [editData, setEditData] = React.useState(null);

    useEffect(() => {
        setLoading(true);
        try {

            const loadPeople = async () => {
                var peopleData = (await axios.get(BASE_URL)).data;
                setPeople(peopleData);
            }
            loadPeople();
        } catch (error) {
            console.log("Error");
            toast.error("Failed to load people.");
        }
        finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        methods.reset(editData)
    }, [editData]);

    const defaultFormValues = {
        personId: 0,
        firstName: "",
        lastName: "",
    }

    const methods = useForm({
        defaultValues: defaultFormValues,
    });


    const handleFormReset = () => {
        methods.reset(defaultFormValues);
    }
    const handleFormSubmit = async(person) => {
        setLoading(true);
        try {
            if (person.personId <= 0) {
                const createdPerson = (await axios.post(BASE_URL, person)).data;
                setPeople((previousPerson) => [...previousPerson, createdPerson]);
            }
            else {
                await axios.put(`${BASE_URL}/${person.personId}`, person);
                setPeople((previousPeople) => previousPeople.map(p => p.personId === person.personId ? person : p));
                setEditData(null);
            }
            methods.reset(defaultFormValues);
            toast.success("Saved successfully!");

        } catch (error) {
            console.log("Error");
            toast.error("Failed to save person.");
        }
        finally {
            setLoading(false);
        }

    }
    const handlePersonEdit = (person) => {
        setEditData(person);
        console.log("Edit person:", person);
        // Implement your edit logic here
    }

    const handlePersonDelete = async (person) => {
        if (!confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}?`))
            return;
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}/${person.personId}`);
            setPeople((previousPeople) => previousPeople.filter(p => p.personId !== person.personId));
            toast.success("Deleted successfully!");
        } catch (error) {
            console.log("Error");
            toast.error("Failed to delete person.");
        }
        finally {
            setLoading(false);
        }

        // Implement your delete logic here
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Person Management
                    </h1>
                    {loading && (<p>Loading...</p>)}

                </div>

                <PersonForm methods={methods} onFormReset={handleFormReset} onFormSubmit={handleFormSubmit} />
                <PersonList peopleList={people} onPersonEdit={handlePersonEdit} onPersonDelete={handlePersonDelete} />
            </div>
        </div>
    )
}

export default Person