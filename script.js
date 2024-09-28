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


// handles localStorage
class GoalDataStore {
    constructor() {
        // upon instantiation, make a goalsArray attribute
        let goalsJson = localStorage.getItem('goals');
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


class GoalKeeperUI {
    // attributes of the UI are the elements
    constructor(goalDataStore) {
        this.goalDataStore = goalDataStore;
        this.mode = 'add';
        this.currentEditGoal = null;
        this.currentEditLi = null;
        
        this.formContainer = document.querySelector('.goal-form-container');
        this.goalForm = document.querySelector('.goal-form');
        this.goalList = document.getElementById('goal-list');
        this.createNewButton = document.getElementById('create-new');
        this.cancelButton = document.getElementById('cancel');

        this.setupEventListeners();
        this.loadStoredGoals();
    }

    setupEventListeners() {
        // show goalbox
        this.createNewButton.addEventListener('click', () => {
            document.querySelector('.goal-form-container').style.display = 'flex';
        });

        // hide goalbox
        this.cancelButton.addEventListener('click', () => {
            document.querySelector('.goal-form-container').style.display = 'none';
        });

        // submit the form and add a new event listener
        this.goalForm.addEventListener('submit', (event) => {
            event.preventDefault()  // prevents reload
            const title = document.getElementById('goal-title').value;
            const description = document.getElementById('goal-description').value;
            const deadline = document.getElementById('goal-deadline').value;

            // if the mode is in editing
                // remove the old from the UI (using removeChild goalForm and the stored li)
                // remove the old from the datastore (using removeGoal and the stored Goal)
                // turn off editing mode

            if ( this.mode === 'edit' ) {
                this.goalList.removeChild(this.currentEditLi);
                this.goalDataStore.removeGoal(this.currentEditGoal);
                this.mode = 'add';
            }

            let goal = new Goal(title, deadline, description);
            if ( goal.isValid() ) {
                this.goalDataStore.saveGoal(goal);  // update localStorage
                this.addGoalToList(goal);  // update UI
                this.goalForm.reset();
                document.querySelector('.goal-form-container').style.display = 'none';
            }

        });
    }

    loadStoredGoals() {
        const storedGoals = this.goalDataStore.getGoalsArray();
        storedGoals.forEach(goal => this.addGoalToList(goal));
    }

    addGoalToList(goal) {
        // make the goal as a list element
        const li = document.createElement('li');
        li.textContent = `${goal.title} - ${goal.deadline}`;
        
        // separate element for description (expandable)
        const description = document.createElement('div');
        description.textContent = goal.description;
        description.className = 'goal-description';
        
        // complete-goal functionality
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete!';
        completeButton.className = 'complete-button';
        completeButton.addEventListener('click', () => {
            this.goalDataStore.removeGoal(goal);  // update localStorage
            this.goalList.removeChild(li);  // update UI
        });

        // expansion functionality
        li.addEventListener('click', () => {
            li.classList.toggle('expanded');
            if (li.classList.contains('expanded')) {
                li.appendChild(description);
                li.appendChild(editButton);
                li.appendChild(completeButton);
                
            } else {
                li.removeChild(description);
                li.removeChild(editButton);
                li.removeChild(completeButton);
            }
        });

        this.goalList.appendChild(li);

        // edit-goal functionality
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {

        // change the mode to editing
        // save the current goal that is being edited into a property
        // save the current li that is being edited into a property
        this.mode = 'edit';
        this.currentEditGoal = goal;
        this.currentEditLi = li;

        this.formContainer.style.display = 'flex';
        document.getElementById('goal-title').value = goal.title;
        document.getElementById('goal-deadline').value = goal.deadline;
        document.getElementById('goal-description').value = goal.description;
        })
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let goalDataStore = new GoalDataStore();
    let goalKeeperUI = new GoalKeeperUI(goalDataStore);
});
