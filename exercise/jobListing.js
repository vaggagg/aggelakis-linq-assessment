

async function getData() {
    const response = await fetch('http://localhost:3000/jobs ');
    const data = await response.json();
    return data;
}

function removeLoader() {
    const loader = window.document.querySelector('.loading-container');
    loader.classList.add('hidden');
}

function addLoader() {
    const loader = window.document.querySelector('.loading-container');
    loader.classList.remove('hidden');
}

function addError() {
    const error = window.document.querySelector('.error-container');
    error.classList.remove('hidden');

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
}


function createJobListing(data) {

    const jobListing = window.document.querySelector('.job-list');

    if (data.length === 0) {
        const noDataElement = document.createElement('div');
        noDataElement.classList.add('no-data');
        noDataElement.innerHTML = `
            <div class="no-data-text f18 dark f700">No jobs found</div>
        `;
        jobListing.appendChild(noDataElement);
        return;
    }

    const sortedData = data.toSorted(function (a, b) {
        a = a.createdDate.split('-').join('');
        b = b.createdDate.split('-').join('');
        return a < b ? 1 : a > b ? -1 : 0;
    });

    sortedData.forEach((job, index) => {
        const jobElement = document.createElement('li');
        jobElement.classList.add('job-item');
        jobElement.innerHTML = `
            <a href='job.html?id=${job.id}'>
            <div class="left-section">
                <div class="job-title f18 dark f700">${job.jobTitle}</div>
                <div class="job-experience f14"><img src = "../images/Money.svg" alt="Money"/> ${job.yearsOfExperience} years of Experience</div>
                <div class="skill-title f14">Skills</div>
                <ul class="skill-list">
                    ${job.skills.map(skill => `<li class="skill-item">${skill.name}</li>`).join('')}
                </ul>
            </div>
            <div class="right-section">
                <div class="salary f700 f18">${job.salary}€/month</div>
                ${index == 0 ? `<div class="latest-tag f500">Latest job</div>` : ''}
            </div>
        </li>
        `;
        jobListing.appendChild(jobElement);
    });
}

const data = getData()
    .then(data => {
        initListeners();
        createJobListing(data);
        removeLoader();
    })
    .catch((e) => {
        addError();
        removeLoader();
    });