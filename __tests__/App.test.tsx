import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { fetchWordleResult } from '../src/api/api';

jest.mock('../src/api/api');

describe('App Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should render the App component', async () => {
        (fetchWordleResult as jest.Mock).mockResolvedValue({ guess: 'abcde' });

        render(<App />);

        // @ts-ignore
        expect(screen.getByText('Wordle Bot')).toBeInTheDocument();

        // @ts-ignore
        await waitFor(() => expect(screen.getByText('Guess #1')).toBeInTheDocument());
    });

    it('should load the initial word and clue from the server', async () => {
        (fetchWordleResult as jest.Mock).mockResolvedValue({ guess: 'abcde' });

        render(<App />);

        // @ts-ignore
        await waitFor(() => expect(screen.getByText('Guess #1')).toBeInTheDocument());
        // @ts-ignore
        expect(screen.getByText('Word to Guess: serai')).toBeInTheDocument();
    });

    it('should save the game state to local storage', async () => {
        (fetchWordleResult as jest.Mock).mockResolvedValue({ guess: 'abcde' });

        render(<App />);

        await waitFor(() => {
            const state = JSON.parse(localStorage.getItem('wordleState') || '{}');
            expect(state.suggestedWord).toBe('abcde');
            expect(state.guessNumber).toBe(2);
        });
    });

    it('should show success message when game is won', async () => {
        (fetchWordleResult as jest.Mock).mockResolvedValue({ guess: 'ggggg' });

        render(<App />);

        // @ts-ignore
        await waitFor(() => expect(screen.getByText('Yay! All Done')).toBeInTheDocument());
    });

    it('should show game over message when all guesses are used', async () => {
        (fetchWordleResult as jest.Mock).mockResolvedValue({ guess: 'xxxxx' });

        render(<App />);

        await waitFor(() => {
            for (let i = 1; i <= 6; i++) {
                // @ts-ignore
                expect(screen.getByText(`Guess #${i}`)).toBeInTheDocument();
            }
        });

        // @ts-ignore
        expect(screen.getByText('Game Over')).toBeInTheDocument();
    });
});
