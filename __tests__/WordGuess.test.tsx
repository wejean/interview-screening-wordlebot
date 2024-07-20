// @ts-ignore
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WordleGuess from '../src/components/WordGuess';

describe('WordleGuess Component', () => {
    const mockOnSubmit = jest.fn();

    it('should render the WordleGuess component', () => {
        render(
            <WordleGuess
                guessNumber={1}
                wordToGuess="serai"
                onSubmit={mockOnSubmit}
                isActive={true}
            />
        );

        // @ts-ignore
        expect(screen.getByText('Guess #1')).toBeInTheDocument();
        // @ts-ignore
        expect(screen.getByText('Word to Guess: serai')).toBeInTheDocument();
    });

    it('should show the response color selection', () => {
        render(
            <WordleGuess
                guessNumber={1}
                wordToGuess="serai"
                onSubmit={mockOnSubmit}
                isActive={true}
            />
        );

        expect(screen.getAllByRole('button')).toHaveLength(5);
    });

    it('should call onSubmit with the correct response when the submit button is clicked', async () => {
        render(
            <WordleGuess
                guessNumber={1}
                wordToGuess="serai"
                onSubmit={mockOnSubmit}
                isActive={true}
            />
        );

        fireEvent.mouseDown(screen.getAllByRole('button')[0]);
        fireEvent.click(screen.getByText('Green'));
        fireEvent.mouseDown(screen.getAllByRole('button')[1]);
        fireEvent.click(screen.getByText('Gray'));
        fireEvent.mouseDown(screen.getAllByRole('button')[2]);
        fireEvent.click(screen.getByText('Yellow'));

        fireEvent.click(screen.getByText('Submit'));

        expect(mockOnSubmit).toHaveBeenCalledWith([
            { letter: 's', color: 'g' },
            { letter: 'e', color: 'x' },
            { letter: 'r', color: 'y' },
            { letter: 'a', color: 'x' },
            { letter: 'i', color: 'x' }
        ]);
    });

    it('should show loading spinner inside the button when loading', async () => {
        render(
            <WordleGuess
                guessNumber={1}
                wordToGuess="serai"
                onSubmit={mockOnSubmit}
                isActive={true}
            />
        );

        fireEvent.click(screen.getByText('Submit'));

        // @ts-ignore
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
