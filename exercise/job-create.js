

async function getLatestId() {
    const response = await fetch('http://localhost:3000/jobs');
    const data = await response.json();

    if (data.length === 0) {
        return 0;
    }

    const maxId = Math.max(...Array.from(data).map((a)=>Number(a.id)));
    
    return maxId;
}

function regexValidations(type = 'text', value) {
    switch (type) {
        case 'text':
            return /^[a-zA-Z0-9\s]{2,}$/.test(value);
        case 'number':
            return /^[0-9]{1,}$/.test(value);
        default:
            return false;
    }

}

function removeLoader() {
    const loader = window.document.querySelector('.loading-container');
    loader.classList.add('hidden');
    const jobCreateContainer = window.document.querySelector('.job-create-details');
    jobCreateContainer.classList.remove('hidden');
}

function addError() {
    const error = window.document.querySelector('.error-container');
    error.classList.remove('hidden');

}

async function getSkills() {
    const response = await fetch('http://localhost:3000/skills');
    const skills = await response.json();
    return skills;
}

function handleClick(event) {
    const selected = event.target.getAttribute('data-selected');
    event.target.setAttribute('data-selected', selected === 'true' ? 'false' : 'true');
}

function fillSkills(skills){
    const skillsListContainer = window.document.querySelector('.skill-list');

    skills.forEach(skill => {
        const skillElement = document.createElement('li');
        skillElement.classList.add('skill-item');
        skillElement.setAttribute('data-id', skill.id);
        skillElement.setAttribute('data-name', skill.name);
        skillElement.setAttribute('data-selected', 'false');
        skillElement.addEventListener('click', handleClick);
        skillElement.innerText = skill.name;
        skillsListContainer.appendChild(skillElement);
    });
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return `${year}-${month}-${day}`;
}

async function initListener() {
    const logoContainer = window.document.querySelector('.logo-container');
    logoContainer.addEventListener('click', () => {
        const mainContent = window.document.querySelector('.main-content');
        if (mainContent.classList.contains('openMenu')) {
            mainContent.classList.remove('openMenu');
        }
        else
            mainContent.classList.add('openMenu');
    }
    );
    const button = window.document.getElementById('save_button');
    button.addEventListener('click', async function() {
        const selectedSkills = window.document.querySelectorAll('.skill-item[data-selected="true"]');
        const selectedSkillsArray = Array.from(selectedSkills).map(skill => {
            return {
                id: skill.getAttribute('data-id'),
                name: skill.getAttribute('data-name')
            }
        });

        const latestID = await getLatestId();

        let isJobTitleValid;
        let isSalaryValid;
        let isYearsValid;

        const jobTitle = document.querySelector('.jobTitle');

        if (!regexValidations('text', jobTitle.value)) {
            jobTitle.classList.add('error-regex');
            isJobTitleValid = false;
        }
        else {
            jobTitle.classList.remove('error-regex');
            isJobTitleValid = true;
        }

        const yearsOfExperience = document.querySelector('.years');

        if (!regexValidations('number', yearsOfExperience.value)) {
            yearsOfExperience.classList.add('error-regex');
            isYearsValid = false;
        }
        else {
            yearsOfExperience.classList.remove('error-regex');
            isYearsValid = true;
        }
        const salary = document.querySelector('.salary');

        if (!regexValidations('number', salary.value)) {
            salary.classList.add('error-regex');
            isSalaryValid = false;
        }

        else {
            salary.classList.remove('error-regex');
            isSalaryValid = true;
        }

        if (!isJobTitleValid || !isSalaryValid || !isYearsValid) {
            return;
        }

        const jobData = {
            id: (latestID + 1).toString(),
            jobTitle: document.querySelector('.jobTitle').value,
            yearsOfExperience: document.querySelector('.years').value,
            salary: document.querySelector('.salary').value,
            skills: selectedSkillsArray,
            createdDate: formatDate(new Date())
        };

        try {
            const response = await fetch(`http://localhost:3000/jobs/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });

            if (!response.ok) {
                throw new Error('There was an error updating the job');
            }

            alert('Job updated. You will be redirected to the job listing page');
            window.location.href = 'job-listing.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

const data = getSkills()
.then(data => {
    fillSkills(data);
    removeLoader();
    initListener();
})
.catch(() => {
    addError();
    removeLoader();
});