```mermaid
sequenceDiagram
    participant User as User
    participant UI as User Interface
    participant JS as JavaScript Logic
    participant Recipes as Recipes Array
    User->>UI: Selects a category from the dropdown
    UI->>JS: Calls filter function with selected category
    JS->>Recipes: Applies filter based on category
    alt Category is "breakfast," "lunch," "dinner," or "snack"
        JS->>Recipes: Filters recipes where [category] === true
    else Other categories
        JS->>Recipes: Filters recipes where recipe.category === selected category
    end
    JS->>UI: Updates recipe list with filtered results
    User->>UI: Sees filtered recipes
