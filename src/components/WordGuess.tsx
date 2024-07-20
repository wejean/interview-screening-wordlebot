import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, Button, CircularProgress } from '@mui/material';

interface WordleGuessProps {
    guessNumber: number;
    wordToGuess: string;
    response?: Array<{ letter: string; color: string }>;
    onSubmit: (response: Array<{ letter: string; color: string }>) => Promise<void>;
    isActive: boolean;
    loading?: boolean;
}

const WordleGuess: React.FC<WordleGuessProps> = ({ guessNumber, wordToGuess, response = [], onSubmit, isActive }) => {
    const [currentResponse, setCurrentResponse] = useState(Array(5).fill('x'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (response.length > 0) {
            setCurrentResponse(response.map((res) => res.color));
        }
    }, [response]);

    const handleResponseChange = (index: number, color: string) => {
        const newResponse = [...currentResponse];
        newResponse[index] = color;
        setCurrentResponse(newResponse);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formattedResponse = wordToGuess.split('').map((letter, index) => ({
            letter,
            color: currentResponse[index],
        }));
        await onSubmit(formattedResponse);
        setLoading(false);
    };

    const getBackgroundColor = (color: string) => {
        switch (color) {
            case 'g':
                return '#6aaa64'; // Green
            case 'y':
                return '#c9b458'; // Yellow
            case 'x':
            default:
                return '#787c7e'; // Gray
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <h2>Guess #{guessNumber}</h2>
            <p>Word to Guess: {wordToGuess}</p>
            <Grid container spacing={1}>
                {Array.from(wordToGuess).map((letter, index) => (
                    <Grid item xs={2} key={index}>
                        <TextField
                            value={letter}
                            disabled
                            inputProps={{ style: { textAlign: 'center' } }}
                        />
                    </Grid>
                ))}
            </Grid>
            {!isActive && (
                <Box sx={{ mt: 2 }}>
                    <p>What response did you get back?</p>
                    <Grid container spacing={1}>
                        {Array.from(wordToGuess).map((letter, index) => (
                            <Grid item xs={2} key={index}>
                                <TextField
                                    value={letter}
                                    disabled
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    sx={{
                                        backgroundColor: getBackgroundColor(currentResponse[index]),
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: getBackgroundColor(currentResponse[index]),
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {isActive && (
                <>
                    <Box sx={{ mt: 2 }}>
                        <p>What response did you get back?</p>
                        <Grid container spacing={1} marginBottom={'10px'} fontWeight={'90px'}>
                            {Array.from(wordToGuess).map((letter, index) => (
                                <Grid item xs={2} key={index}>
                                    <TextField
                                        value={letter}
                                        disabled
                                        inputProps={{ style: { textAlign: 'center' } }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Grid container spacing={1}>
                            {Array.from(wordToGuess).map((_, index) => (
                                <Grid item xs={2} key={index}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={currentResponse[index]}
                                            onChange={(e) => handleResponseChange(index, e.target.value)}
                                            sx={{
                                                backgroundColor: getBackgroundColor(currentResponse[index]),
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: getBackgroundColor(currentResponse[index]),
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="x">Gray</MenuItem>
                                            <MenuItem value="y">Yellow</MenuItem>
                                            <MenuItem value="g">Green</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </>
            )}
        </Box>
    );
};

export default WordleGuess;
