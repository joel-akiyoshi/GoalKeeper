// begin when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // create variables for each element
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
            const goal = { title, description, deadline };
            addGoalToList(goal);
            saveGoal(goal);
            goalForm.reset();
            document.querySelector('.goal-form-container').style.display = 'none';
        }
    });

    function addGoalToList(goal) {
        const li = document.createElement('li');
        li.textContent = `${goal.title} - ${goal.deadline}`;

        // delete functionality
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            removeGoal(goal, li);
        });


        // expansion functionality
        li.addEventListener('click', () => {
            li.classList.toggle('expanded');
            if (li.classList.contains('expanded')) {
                li.innerHTML = `
                <strong>${goal.title}</strong><br>
                <em>${goal.deadline}</em><br>
                ${goal.description}
                `;
            } else {
                li.textContent = `${goal.title} - ${goal.deadline}`;
            }
            li.appendChild(deleteButton);
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
