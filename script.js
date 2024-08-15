/*
class QuoteDataStore {
    fetch() {
        // time logic can be put here too. "caching, storing the timestamps"
        return "if patience...";
        // asynchronous: look at xmlhttp
    }

    fetch2(callBack) {  // callback is a function 
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "quotes.com", true);
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {  // good case
                  console.log(xhr.responseText);
                  callBack(xhr.responseText)  // param is the quote
                } else {  // bad case
                  console.error(xhr.statusText);
                }
              }
        }
    };
}
*/

class GoalDataStore {
    // methods relating to localStorage
    constructor() {
        // upon instantiation, make a goalsArray attribute
        let goalsJson = localStorage.getItem("goals");
        this.goalsArray = goalsJson ? JSON.parse(goalsJson) : [];
    }

    removeGoal(goal) {
        this.goalsArray = this.goalsArray.filter(
            g => !(g.title === goal.title && g.deadline === goal.deadline && g.description === goal.description)
        );
        localStorage.setItem('goals', JSON.stringify(this.goalsArray));
    }

    saveGoal(goal) {
        this.goalsArray.push(goal);
        localStorage.setItem('goals', JSON.stringify(this.goalsArray));
    }

    getGoalsArray() {
        return this.goalsArray;
    }
}


class Goal {
    // properties (title, deadline, description)
    constructor(title, deadline, description) {
        this.title = title;
        this.deadline = deadline;
        this.description = description;
    }
    
    isValid() {  // returns boolean
        return this.title && this.deadline && this.description;
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const goalForm = document.querySelector('.goal-form');
    const goalList = document.getElementById('goal-list');
    const createNewButton = document.getElementById('create-new');
    const cancelButton = document.getElementById('cancel');

    const goalDataStore = new GoalDataStore();

    // const quoteDataStore = new QuoteDataStore();

    /*
    function handleQuote(quote) {
         // document.getElementById('example');
         // update the UI with quote
         // "update the UI" can be a lot of things. More than just replacing an HTML tag. Processing
    }

    quoteDataStore.fetch2(handleQuote)  // access the HTML location, call quoteDataStore.fetch()
    */

    // show goalbox
    createNewButton.addEventListener('click', () => {
        document.querySelector('.goal-form-container').style.display = 'flex';
    });

    // hide goalbox
    cancelButton.addEventListener('click', () => {
        document.querySelector('.goal-form-container').style.display = 'none';
    });

    // submit the form
    goalForm.addEventListener('submit', (event) => {
        event.preventDefault()  // prevents reload
        const title = document.getElementById('goal-title').value;
        const description = document.getElementById('goal-description').value;
        const deadline = document.getElementById('goal-deadline').value;

        let goal = new Goal(title, deadline, description);
        if ( goal.isValid() ) {
            goalDataStore.saveGoal(goal);  // update localStorage
            addGoalToList(goal);  // update UI
            goalForm.reset();
            document.querySelector('.goal-form-container').style.display = 'none';
        }

    });

    // Updates the UI with new goal element, builds in deletion capability
    function addGoalToList(goal) {
        // make the goal as a list element
        const li = document.createElement('li');
        li.textContent = `${goal.title} - ${goal.deadline}`
        
        // separate element for description (expandable)
        const description = document.createElement('div');
        description.textContent = goal.description;
        description.className = 'goal-description';
        
        // complete-goal functionality
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete!';
        completeButton.className = 'complete-button';
        completeButton.addEventListener('click', () => {
            goalDataStore.removeGoal(goal);  // update localStorage
            goalList.removeChild(li);  // update UI
        });

        // expansion functionality
        li.addEventListener('click', () => {
            li.classList.toggle('expanded');
            if (li.classList.contains('expanded')) {
                li.appendChild(description);
                li.appendChild(completeButton);
            } else {
                li.removeChild(description);
                li.removeChild(completeButton);
            }
        });

        goalList.appendChild(li);
    }
});
