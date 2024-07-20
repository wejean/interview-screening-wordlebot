import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import WordleGuess from './components/WordGuess';
import { fetchWordleResult, WordleRequestItem } from './api/api';
import Layout from './components/Layout';
import Header from './components/Header';
import './index.css';

const App: React.FC = () => {
    const [initialWord] = useState<string>('serai');
    const [suggestedWord, setSuggestedWord] = useState<string>('');
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [guessNumber, setGuessNumber] = useState<number>(1);
    const [responseHistory, setResponseHistory] = useState<Array<{ guessNumber: number; wordToGuess: string; response: Array<{ letter: string; color: string }> }>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [win, setWin] = useState<boolean>(false);

    useEffect(() => {
        const handleInitialSubmit = async () => {
            setLoading(true);
            try {
                const clue = 'gxyxx';
                const currentRequest: WordleRequestItem = {
                    word: initialWord,
                    clue: clue
                };
                const newRequestHistory = [currentRequest];
                const newResponseHistory = [{
                    guessNumber: 1,
                    wordToGuess: initialWord,
                    response: initialWord.split('').map((letter, index) => ({ letter, color: clue[index] }))
                }];

                const data = await fetchWordleResult(newRequestHistory);
                if (data.guess === 'WIN') {
                    setGameOver(true);
                }else {
                    setSuggestedWord(data.guess);
                    setResponseHistory(newResponseHistory);
                    setGuessNumber(2);

                    saveStateToLocalStorage({
                        suggestedWord: data.guess,
                        guessNumber: 2,
                        requestHistory: newRequestHistory,
                        responseHistory: newResponseHistory,
                        gameOver: false,
                    });
                }
            } catch (err:any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        const savedState = localStorage.getItem('wordleState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            setSuggestedWord(parsedState.suggestedWord);
            setGuessNumber(parsedState.guessNumber);
            setResponseHistory(parsedState.responseHistory);
            setGameOver(parsedState.gameOver);
            setLoading(false); // Stop loading since the state is restored
        } else {
            handleInitialSubmit();
        }
    }, [initialWord]);

    const saveStateToLocalStorage = (state: any) => {
        localStorage.setItem('wordleState', JSON.stringify(state));
    };

    const handleClueSubmit = async (clues: Array<{ letter: string; color: string }>) => {
        try {
            const clueString = clues.map(clue => clue.color).join(''); // Convert to string like "gxyxx"
            const currentRequest: WordleRequestItem = {
                word: guessNumber === 1 ? initialWord : suggestedWord,
                clue: clueString
            };
            const newRequestHistory = [currentRequest];
            const newResponseHistory = [...responseHistory, { guessNumber, wordToGuess: guessNumber === 1 ? initialWord : suggestedWord, response: clues }];

            const data = await fetchWordleResult(newRequestHistory);
            if (data.guess === 'ggggg') {
                setGameOver(true);
                setWin(true);
            }
            if(guessNumber === 6 && data.guess !== 'ggggg'){
                localStorage.clear();
                setGameOver(true);
            } else {
                setSuggestedWord(data.guess);
                setResponseHistory(newResponseHistory);
                setGuessNumber(guessNumber + 1);

                saveStateToLocalStorage({
                    suggestedWord: data.guess,
                    guessNumber: guessNumber + 1,
                    requestHistory: newRequestHistory,
                    responseHistory: newResponseHistory,
                    gameOver: false,
                });
            }
        } catch (err) {
            setError('Failed to fetch next word');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
                    <Box display="flex" alignItems="center">
                        Wordle Bot
                    </Box>
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    !gameOver && (
                        <Box>
                            {responseHistory.map((entry) => (
                                <WordleGuess
                                    key={entry.guessNumber}
                                    guessNumber={entry.guessNumber}
                                    wordToGuess={entry.wordToGuess}
                                    response={entry.response}
                                    onSubmit={async () => {}} // No submission for past guesses
                                    isActive={false}
                                />
                            ))}
                            <WordleGuess
                                guessNumber={guessNumber}
                                wordToGuess={guessNumber === 1 ? initialWord : suggestedWord}
                                onSubmit={handleClueSubmit}
                                isActive={true}
                            />
                        </Box>
                    )
                )}
                {
                    gameOver && win ? gameOver && <Alert severity="success" sx={{ mt: 2 }}>Yay! All Done</Alert>
                        : gameOver && <Alert severity="error" sx={{ mt: 2 }}>Game Over</Alert>
                }
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Container>
        </Layout>
    );
};

export default App;
