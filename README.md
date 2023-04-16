## Getting Started

#### To start the application (frontend, backend, db)  
   > docker-compose up --build

#### The Application will be rendered at:  
   > http://localhost:3000/

## Application Features

Technologies/Tools Used:

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Cypress](https://www.cypress.io/)
- [Material-UI](https://material-ui.com/)
- [Docker](https://www.docker.com/)

Below you will find the steps needed to accomplish the following user stories:

As an admin...

- I can create a new session and reorder and delete existing sessions.
- I can create a new question within a session and reorder and delete existing
questions within a session
- I can view a list of all sessions and view all questions within each session

##### Restore the Application

1. Click the "Restore DB" button in the top right corner of the screen.

##### Create New Session

1. Click the "Create Session" button in the top right of the window
2. Fill in the name field
3. Click the "Add Question" button
4. Fill in the question field
5. Repeat steps 3 and 4 until you are satisfied
6. Click the "Add Session" button
7. Celebrate your success

##### Reorder Sessions

1. Click and hold the mouse down on the session you wish to move
2. Drag the session to the desired position on the dashboard
3. Release

##### Delete Session

1. Click the blue circle button in the top right of the session you wish to delete (It has a pencil icon inside it)
2. Click the red "Delete Session" button

##### Create New Question

1. Click the blue circle button in the top right of the session you wish to add a new question to (It has a pencil icon inside it)
2. Click the "Add Question" button
3. Fill in the question field
4. Click the "Save Session" button

##### Reorder Questions

1. Click the blue circle button in the top right of the session you wish to reorder the questions in (It has a pencil icon inside it)
2. Click and hold the mouse down on the question you wish to move (There is a convenient handle icon to the left of the question)
3. Drag the question to the desired position in the list
4. Release

##### Delete Question

1. Click the blue circle button in the top right of the session you wish to delete a question in (It has a pencil icon inside it)
2. Click the trashcan icon next to the question you wish to delete
3. Click the "Save Session" button
   
## Running Tests

Tests can be run by running the following command in the `/frontend` directory:
   > npm run cypress:open

## Production Considerations

##### Authentication

I would use a JWT token to authenticate users. With each API request, I would send the token in the header to be authenticated by middleware in the backend. I would also consider building a user management system to manage users and their sessions.

##### Actually answering questions in a session

I am assuming this would be for the user and not the Admin portal. I would have a user portal that would allow the user to view their sessions and questions. If sessions are completed, the user would be able to see the results of the session. I'd consider a relationship table in the database to connect users with sessions.

##### Session Versioning

Each update to a session would be a new version of the session. This would allow us to rollback to a previous version of the session. We could limit this by only allowing the user to rollback to a previous version of the session if they were the one who created the session. Or we could hold the last 3 versions of the session in the database. I've done something similar to this with creating snapshots of data as the user updates it.

##### Multiple Question Types

Each question would be its own component. We could allow the user to create open ended questions, multiple choice questions, fill in the blank questions, etc. We could store this as a JSON object in the database. Then we could use the question input type to render the question. The Admin would be able to manage these questions and create sessions out of them. 

##### Validation

Currently, I am not validating on the frontend but would ideally like to add validation middleware on the backend. This would cover calls from postman and other APIs. 

##### Testing

Testing would have to be expanded for production. The application as is does E2E testing on the frontend but it should also do comprehensive unit testing on the backend.
