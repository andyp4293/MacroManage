import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function FoodSearchModal({ open, onClose, onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm); // pass the onSearch prop with the search term
        setSearchTerm(''); // clear the search term after searching
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Add Food to Log
                <IconButton // close button to close modal
                    aria-label="close"
                    onClick={onClose} // when button is clicked, the modal will be closed
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin = 'dense'
                    id="search"
                    label="Search foods"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00c691', // Label color when focused
                    },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#00c691', // Border color when focused
                        },
                    },
                }}
                    
                />
                <Button
                    disableRipple
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{ marginTop: '10px',
                        background: '#00c691',
                        '&:hover': {
                            backgroundColor: '#00a67e'
                        }
                    }}
                >
                    Search
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default FoodSearchModal;
