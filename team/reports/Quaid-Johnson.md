# Contribution Log for Quaid Johnson

## November 6, 2024

### Task: Create a Recipe class for easy recipe manipulation and a shared object for each part of the program to use

- **Details:**
- Create recipe class
- Create default recipe template object in class - default with null values so form page knows how to fill the object with true values
- Create get and set functions dynamically in the class based off the object
- Create check function for the types in the default template
- Create iterator

- **Link to Commit:** [Slack commit](https://github.com/kserra1/CS326Team2/commit/376b7e7285f80f281857e76220a84076e42e7986)

## November 9, 2024

### Task: Implement the webpages Form to use recipe object

- **Details:**
- Merge the recipe obj branch with the form page branch 
- Use default values to dynamically create field elements 
- Use Iterator for all the values that need updating


- **Link to Commit:** [Slack commit](https://github.com/kserra1/CS326Team2/commit/cdaed171dbc132048bb9a10c07156262a2ba19b1)



## November 14, 2024

### Task: Have the form page update the recipe object and save it to indexDB

- **Details:**
- Create a change event listener for each div element that updates the recipe object
- if nested field elements - change event stores value in its div.data property and each div's event listener updates based on its child element's data property
- Fields that update array objects in the recipe class update on add button

- **Link to Commit:** [Slack commit](https://github.com/kserra1/CS326Team2/commit/f189604dbfd757459e03f192fc5f51e89af46d0c)

## November 17, 2024

### Task: Add css styling to form page so that it looks better

- **Details:**
- give nice style for each label and input elements
- give nice style to elements that input objects - restyles its child input elements
- gives nice readable style to elements that update lists - had to rework a couple times to make it look the most understandable

- **Link to Commit:** [Slack commit](https://github.com/kserra1/CS326Team2/commit/662dd6126af9fe7a7f2d52f261033ffe60ae40a4)
