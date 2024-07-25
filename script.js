
document.addEventListener('DOMContentLoaded', () => {

    const goalForm = document.querySelector('.goal-form');
    const goalList = document.getElementById('goal-list');
    const createNewButton = document.getElementById('create-new');
    const cancelButton = document.getElementById('cancel');

    createNewButton.addEventListener('click', () => {
        document.querySelector('.goal-form-container').style.display = 'flex';
    });

    cancelButton.addEventListener('click', () => {
        document.querySelector('.goal-form-container').style.display = 'none';
    });

    goalForm.addEventListener('submit', (event) => {
        // prevents from reloading
        event.preventDefault()
        const title = document.getElementById('goal-title').value;
        const description = document.getElementById('goal-description').value;
        const deadline = document.getElementById('goal-deadline').value;

        if (title && description && deadline) {
            const goal = { title, description, deadline };  // save as an object
            addGoalToList(goal);
            saveGoal(goal);
            goalForm.reset();
            document.querySelector('.goal-form-container').style.display = 'none';
        }
    });

    function addGoalToList(goal) {
        // make the goal as a list element
        const li = document.createElement('li');
        li.textContent = `${goal.title} - ${goal.deadline}`
        
        // separate element for description (expandable)
        const description = document.createElement('div');
        description.textContent = goal.description;
        description.className = 'goal-description';

        // delete functionality
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete!';
        completeButton.className = 'complete-button';
        completeButton.addEventListener('click', () => {
            removeGoal(goal, li);
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

    function removeGoal(goal, li) {
        let goals = localStorage.getItem('goals');
        if (goals) {
            goals = JSON.parse(goals);

            goals = goals.filter(g => !(g.title == goal.title && g.deadline == goal.deadline && g.description == goal.description));
            
            // remove from localStorage (replace localStorage value)
            localStorage.setItem('goals', JSON.stringify(goals));

            // remove from the UI
            goalList.removeChild(li);
        }
    }

    function saveGoal(goal) {
        let goals = localStorage.getItem('goals');
        if (goals) {
            goals = JSON.parse(goals);
        } else {
            goals = [];
        }
        goals.push(goal);
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    function loadGoals() {
        let goals = localStorage.getItem('goals');
        if (goals) {
            goals = JSON.parse(goals);
            goals.forEach(goal => addGoalToList(goal));
        }
    }

    loadGoals();
});
