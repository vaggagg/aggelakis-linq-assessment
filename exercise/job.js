function getUrlID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    return id;
}

function removeLoader() {
    const loader = window.document.querySelector('.loading-container');
    loader.classList.add('hidden');
}

function addError() {
    removeLoader();
    const mainContent = window.document.querySelector('.main-content .center-container');
    const error = document.createElement('div');
    error.classList.add('error-container');
    error.innerHTML = `
        <div class="error-text f18 dark f700">This page does not exist or something went wrong</div>
        <br></br>
        <a href="job-listing.html" class="button lightblue">Back to Job List</a>
        
    `;
    mainContent.appendChild(error);

}

async function getJobData(id) {
    const jobData = await fetch(`http://localhost:3000/jobs/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            addError();
        });

    const listOfSkills = await fetch(`http://localhost:3000/skills`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            addError();
        });

    const finalSkills = listOfSkills.map(skill => {
        const foundSkill = jobData.skills.find(e => e.id === skill.id);
        if (foundSkill) {
            return {
                ...skill,
                'selected': true
            };
        }

        return skill;
    });

    return {
        ...jobData,
        skills: finalSkills
    }
}

function handleClick(event) {
    const selected = event.target.getAttribute('data-selected');
    event.target.setAttribute('data-selected', selected === 'true' ? 'false' : 'true');
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

function initListeners() {

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

    document.getElementById('delete_button').addEventListener('click', async function () {

        const id = getUrlID();
        const response = await fetch(`http://localhost:3000/jobs/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            alert('There was an error deleting the job');
            return;
        }
        alert('Job deleted. You will be redirected to the job listing page');
        window.location.href = 'job-listing.html';
    });

    document.getElementById('save_button').addEventListener('click', async function () {
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

        const skills = document.querySelectorAll('.skill-item');

        const selectedSkills = Array.from(skills).filter(skill => skill.getAttribute('data-selected') === 'true')
            .map(skill => {
                return {

                    id: skill.getAttribute('data-id'),
                    name: skill.innerText,
                }
            }
            );

        const id = getUrlID();

        const jobDataForUpdate = {
            jobTitle: jobTitle.value,
            yearsOfExperience: yearsOfExperience.value,
            salary: salary.value,
            skills: selectedSkills
        }

        const response = await fetch(`http://localhost:3000/jobs/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobDataForUpdate)
        });

        if (!response.ok) {
            alert('There was an error updating the job');
            return;
        }

        alert('Job updated. You will be redirected to the job listing page');

        window.location.href = 'job-listing.html';


    });
}

function initGeneralData(title = 'Loading...', id) {
    const header = window.document.querySelector('.header-container .mainTitle');
    if (header) {
        header.innerHTML = 'Edit Job: ' + title + ' ID: ' + id;
    }

    window.document.title = title;
}


async function init() {
    const id = getUrlID();
    if (!id) {
        addError();
        return;
    }
    const mainJobData = await getJobData(id);

    removeLoader();

    initGeneralData(mainJobData.jobTitle, id);

    const jobItem = window.document.querySelector('.job-details');

    jobItem.innerHTML =
        `<div class="job-form">
    <div class="left-container">
    <div class="input-container">
        <div class="label f14">Job Title</div>
        <input type="text" class="input jobTitle" value="${mainJobData.jobTitle}">
    </div>
    <div class="input-container">
        <div class="label f14">Years of experience</div>
        <input type="text" class="input years" value="${mainJobData.yearsOfExperience}">
    </div>
    <div class="input-container no-padding">
        <div class="label f14">Salary</div>
        <input type="text" class="input salary" value="${mainJobData.salary}">
    </div>
</div>
<div class="right-container">
    <div class="list-container">
        <div class="label f14">Skills</div>
        <ul class="skill-list">
        ${mainJobData.skills.map(skill => `<li class="skill-item" data-id=${skill.id} data-selected=${skill.selected ? true : false} onclick="handleClick(event)">${skill.name}</li>`).join('')}
        </div>
    </div>
</div>
<div class='button-container'>
    <div class="button gray" id="delete_button">Delete</div>
    <div class="button lightblue" id="save_button">Save</div>
</div>
</div>`;

initListeners();








}

init();
