
```mermaid
sequenceDiagram
    participant U as User
    participant P as Page
    participant S as Server

    U->>P: Open Recipe Page
    P->>S: Request list of recipes
    S->>P: Send list of recipes

    U->>P: Scroll through recipes
    P->>S: Fetch next set of recipes
    S->>P: Send next set of recipes

    U->>P: Like a recipe
    P->>S: Save like to recipe
    S->>P: Confirm like saved

    U->>P: Comment on a recipe
    P->>S: Submit comment
    S->>P: Confirm comment submission
