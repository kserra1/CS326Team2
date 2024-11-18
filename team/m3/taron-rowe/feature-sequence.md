# Feature sequence for login page

**Feature Descriptions: (worked on it together with Fuming Zhang)**

This feature allows the user to switch between login and register using a button on the same page allowing them easy access to both functions. They are able to use this feature to create an account with password, username, and email to later login with to their own individual account

sequenceDiagram
    participant U as User
    participant P as Page
    participant EH as Event Hub
    participant AS as AuthService
    participant US as UserStorage

    U->>P: Clicks on "Switch to Register" button
    P->>EH: Triggers event "SwitchForm"
    EH->>P: Change form to register mode

    U->>P: Enters username, email, and password
    U->>P: Clicks on "Register" button
    P->>EH: Triggers event "SubmitRegistration"
    EH->>AS: Call registerUser(username, email, password)
    AS->>US: Save user data in user object
    US-->>AS: Confirm user stored
    AS->>EH: Emit "UserRegistered" event
    EH->>P: Display "Registration successful" message

    U->>P: Clicks on "Switch to Login" button
    P->>EH: Triggers event "SwitchForm"
    EH->>P: Change form to login mode

    U->>P: Enters username and password
    U->>P: Clicks on "Login" button
    P->>EH: Triggers event "SubmitLogin"
    EH->>AS: Call loginUser(username, password)
    AS->>US: Verify user credentials in user object
    US-->>AS: Return verification status
    AS->>EH: Emit "LoginSuccessful" or "LoginFailed" event
    EH->>P: Display corresponding message to user

