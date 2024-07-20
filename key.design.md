# Wordle Bot Project: Key Design Choices and Implementation

## Design Choices

### 1. Component Structure
The application is structured using React functional components with TypeScript for type safety and better developer experience. Key components include `App`, which serves as the main container, and `WordleGuess`, which handles the display and interaction of individual guesses. This modular approach ensures that each component is responsible for a single part of the application, making it easier to manage and test.

### 2. State Management
State management is handled using React's built-in `useState` and `useEffect` hooks. The `App` component maintains the overall game state, including the current guess number, the suggested word, game history, and the loading state. This approach simplifies the state management and leverages React's reactivity to update the UI efficiently.

### 3. API Integration
The application integrates with the Wordle solver API using a dedicated `api.ts` module. This module exports functions that handle the API calls, encapsulating the API logic and making it easier to manage and test. Error handling and loading states are also managed within this module to provide a better user experience.

### 4. User Experience
User experience is enhanced with clear visual feedback for loading states and errors. The `WordleGuess` component displays a loading spinner inside the submit button to indicate when the application is processing a request. Additionally, the application provides success and error messages to inform the user about the game status.

## Implementation Details

### Initial Load and State Restoration
Upon initial load, the application checks for saved game state in `localStorage`. If a saved state is found, it restores the game to its previous state, including the suggested word and the history of guesses. If no saved state is found, the application makes an initial API call to get the first suggested word. This design ensures that users can continue their game from where they left off, providing a seamless experience.

### Handling API Responses
The `handleClueSubmit` function processes the clues provided by the user and makes an API call to get the next suggested word. The response from the API is then used to update the game state, which includes the guess history and the suggested word for the next round. If the API indicates a win, the game state is updated accordingly, and a success message is displayed.

### Testing
Unit tests are implemented using Jest and React Testing Library to ensure the components behave as expected. Tests cover various scenarios, including rendering components, handling user interactions, and displaying loading states. The tests are placed in a `tests` directory, following best practices for test organization and maintenance.

## Notes for Reviewers
- **Loading Indicator**: The loading indicator is designed to show inside the submit button, providing clear feedback to the user without disrupting the overall layout.
- **Error Handling**: API errors are caught and displayed to the user, ensuring that any issues are communicated clearly.
- **Game State Persistence**: The use of `localStorage` to persist game state ensures that users can resume their game even after closing the browser or refreshing the page.

This project demonstrates a structured approach to building a responsive and user-friendly React application, leveraging TypeScript for type safety and Jest for robust testing.
