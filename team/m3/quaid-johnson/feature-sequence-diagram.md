
Sequence diagram for how the Form page works

```mermaid
sequenceDiagram
    participant U as User
    participant F as Form Page
    participant R as Recipe Class
    participant I as IndexDB
    participant S as Server

    U->>F: Open 'Add Recipe'
    F->>R: Form inits recipe object
    R->>F: Gets blank template
    F->>U: Generates fields from blank object and sends to user
    U->>F: Fills form and presses submit
    F->>R: Form checks with recipe object to see if fields are filled
    R->>F: Sends fields that are not filled otherwise sends serializable object 
    F->>I: Stores recipe object
    I->>S: Saves recipe object