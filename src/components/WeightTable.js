
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import styles from '../styles/Weightlog.module.css';
import Pagination from '@mui/material/Pagination';
import React, { useState, useCallback, useEffect} from 'react';

const backendUrl = process.env.REACT_APP_APIURL;

function formatDate(isoDate) {
    const date = new Date(isoDate);
    const month = date.getMonth() + 1;  
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
}

function WeightTable({data, onChange}) {
    const token = localStorage.getItem('token'); // json web token

    const fetchWeightLogs = useCallback(async () => {
        if (!token) return; // prevent making the request if there is no token/user isn't logged in
        try {
            const response = await fetch(`${backendUrl}/api/weight/get_weight_logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
            });

            const weightlogData = await response.json(); 
            setEntries(weightlogData.weightlogs);  

        } catch (error) {
            console.error('Error:', error);
        }
    }, [token]); // token should be included in the dependency array

    useEffect(() => {
        fetchWeightLogs();
    }, [fetchWeightLogs, data]); // useCallback ensures checkMealLogs doesn't change unnecessarily

    


    const deleteEntry = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/weight/delete_weight_entry/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,  // jwt authorization
                    'Content-Type': 'application/json',  
                }
            });
            
            if (response.ok){
                fetchWeightLogs(); 
                onChange(); 
            }
            else {
                throw new Error('Failed to delete weight entry');
            }
        }
        catch(error) {
            console.error('Error deleting meal item:', error); 
        }
    }; 

    // EDIT BUTTON FUNCTIONALITY
    // state for the index to edit 
    const [editIndex, setEditIndex] = useState(null); 

    // state for the weight edit
    const [newWeight, setNewWeight] = useState('');
    // func for saving the weight edit

    const handleSaveEdit = async (id) => {
        

        try {
            const response = await fetch(`${backendUrl}/api/weight/edit_weight_entry/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt token
                },
                body: JSON.stringify({
                    weight: newWeight ? newWeight: 0, 
                })
            });

            const result = await response.json(); 

            if (response.ok) {
                fetchWeightLogs(); 
            } else {
                console.error('Failed to edit entry:', result.message);
            }
        }
        catch (error){
            console.error('Error editing weight:', error)
        }
        finally {
            setEditIndex(null); 
            onChange(); 
        }
    }

    // ensure the user cannot type a number greater 999.999 or less than 0  
    const handleEditInput = (event) =>{
        let value = event.target.value; // Get the current value of the input
        
        // the weight value inside the input only changes as long as it is below 1000
        // the input also cannot have more than 7 digits, highest possible input is 999.999
        if (value < 1000 && value.length < 8 && value >= 0){ // if the current value is 999, if a user tries typing another 9 the value won't change
            setNewWeight(value);
        }
    }

    
    // FOR PAGINATION
    const [currentPage, setCurrentPage] = useState(1); // current page state
    const [rowsPerPage] = useState(7); // number of rows to display per page


    // entries is an array for objects that will hold each entry's date and weight
    const [entries, setEntries] = useState([]); 

    const totalPages = Math.ceil(entries.length / rowsPerPage); // Calculate total pages

    // Get the data for the current page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = entries.slice(indexOfFirstRow, indexOfLastRow);

    // Change page
    const handlePageChange = (_, value) => {
        setCurrentPage(value);
    };

    const paddedRows = [
        ...currentRows,
        ...Array.from({ length: rowsPerPage - currentRows.length }, () => ({ weight_date: '', weight_lbs: '' }))
    ];




    return (
        <div style = {{display: 'flex', alignItems: 'center', flexDirection: 'column'}}> 
            <table 
                style = {{
                    width: '100%',
                    borderCollapse: 'collapse'
                }}
            >
                <thead style = {{backgroundColor: '#007BFF'}}>
                    <tr style={{ backgroundColor: 'white', color: 'black', borderCollapse: 'collapse', border: 'none',}}>
                        <th style={{ padding: '10px', width: '40%', fontSize: '14px'}}>Date</th>
                        <th style={{ padding: '10px', width: '30%', fontSize: '14px'}}>Weight</th>
                        <th style={{ padding: '10px', width: '30%', fontSize: '14px'}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                            
                {paddedRows.map((entry, index) => (
                    <tr style={{ height: '20px', borderBottom: '1px solid #ddd' }} key={index}>
                        {/* first column with date value of entry */}
                        <td style={{ textAlign: 'center', fontFamily: '"Roboto", sans-serif', height: '20px', fontSize: '14px', border: 'none'}}>{entry.weight_date ? formatDate(entry.weight_date) : ''}</td>
                        {/* second column with weight value of entry */}
                        <td style={{ textAlign: 'center', fontFamily: '"Roboto", sans-serif', height: '20px'}}> 
                            {editIndex === index 
                                    ? 
                                    <div>
                                        <input // if the index of the entry is the one being edited, its weight column becomes an input element
                                        className = {styles['weight-edit-input']}
                                        type="number"
                                        value={newWeight}
                                        onChange={handleEditInput}
                                        //onChange={(e) => setNewWeight(e.target.value)}
                                        style={{ width: '80px' }}
                                        max = '1000'
                                        min = '0'
                                        />
                                        <span className = {styles['edit-unit']}>lbs</span>
                                    </div>
                                    :
                                    <div>
                                        {entry.weight_lbs === 0 
                                        ? '0 lbs' // display 0 lbs if the input is empty
                                        : <div style = {{fontSize: '14px'}}>{entry.weight_lbs? `${entry.weight_lbs} lbs` : ''} </div>
                                        }
                                                    
                                    </div>
                            }
                        </td>
                        {/* third column with action options of editing or deleting the entry */}
                        <td style={{ padding: '10px', textAlign: 'center' }} className = {styles['actionButtons']}>
                            {entry.weight_lbs || entry.weight_lbs === 0 ? (
                                editIndex === index ? (
                                 // if editing index is the index of the entry
                                    <div>
                                        <button
                                            className={styles['actionButton']}
                                            onClick={() => {
                                                if (newWeight === '') {
                                                    setNewWeight('0'); 
                                                }
                                                
                                                handleSaveEdit(entry.id)}}
                                        >
                                            <CheckIcon />
                                        </button>
                                    </div>
                                ) : (
                                // if editing index is not the index of the entry
                                <div className={styles['actionButtons']}>
                                    <button
                                        className={styles['actionButton']}
                                        onClick={() => setEditIndex(index)}
                                    >
                                        <EditIcon style={{ fontSize: '18px' }} />
                                    </button>
                                    <button
                                        className={styles['actionButton']}
                                        onClick={() => deleteEntry(entry.id)}
                                    >
                                        <DeleteIcon style={{ fontSize: '18px' }} />
                                    </button>
                                </div>
                                )
                            ) : (
                            <button
                                className={styles['actionButton']}
                                disabled
                                style = {{opacity: '0'}}
                            >
                                <DeleteIcon style={{ fontSize: '18px' }} />
                            </button>
                            )}

                        </td>
                    </tr>
                ))}

                </tbody>


            </table>
            <Pagination 
                sx = {{backgroundColor: 'white' ,width: 'auto', marginTop: '1vh'}} 
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
            />
        </div>
    );
}

export default WeightTable;
