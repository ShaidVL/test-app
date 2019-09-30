import lpu from '../lpu.js'

const tbodyEl = document.querySelector('#data-lpu');
const selectEl = document.querySelector('#organization-parent');
const organizationNameInput = document.querySelector('#organization-name');
const addressInput = document.querySelector('#address');
const phoneInput = document.querySelector('#phone');
const saveButtonEl = document.querySelector('#data-save-btn');
const removeButtonEl = document.querySelector('#data-delete-btn');

let initialLpuArray;
let selectedId;
let lastSelectedEl;

init();

removeButtonEl.addEventListener('click', (event)=>{
    event.preventDefault();
    removeOrganization();
});

saveButtonEl.addEventListener('click', (event)=>{
    event.preventDefault();
    addNewOrganization();
});
function init() {
    if (localStorage.getItem('lpu') === null) {
        localStorage.setItem('lpu', JSON.stringify(lpu));
    }
    initialLpuArray = JSON.parse(localStorage.getItem('lpu'));

    initialLpuArray.forEach((item) => {
        addRowInTable(item);
        addOptionOnSelect(item);
    });
}

function addRowInTable(organization) {
    const rowEl = document.createElement('tr');
    rowEl.setAttribute('id', 'table-org-' + organization.id);
    const fullNameEl = document.createElement('td');
    fullNameEl.textContent = organization.full_name;
    fullNameEl.classList.add('col-4');
    const addressEl = document.createElement('td');
    addressEl.textContent = organization.address;
    addressEl.classList.add('col-4');
    const phoneEl = document.createElement('td');
    phoneEl.textContent = organization.phone;
    phoneEl.classList.add('col-4');
    rowEl.appendChild(fullNameEl);
    rowEl.appendChild(addressEl);
    rowEl.appendChild(phoneEl);
    tbodyEl.appendChild(rowEl);
    rowEl.addEventListener('click', () => {
        lastSelectedEl = document.querySelector('#' + selectedId);
        if (lastSelectedEl && lastSelectedEl.classList) {
            lastSelectedEl.classList.remove('selected-row');
        }
        rowEl.classList.add('selected-row');
        selectedId = rowEl.getAttribute('id');
        organizationNameInput.value = rowEl.children[0].textContent;
        addressInput.value = rowEl.children[1].textContent;
        phoneInput.value = rowEl.children[2].textContent;
        const selectedEl = document.querySelector('#select-org-'+ organization.hid);
        selectedEl ? selectedEl.selected = true : selectEl.selectedIndex = 0;
    });
}

function addOptionOnSelect(organization) {
    const optionEl = document.createElement('option');
    optionEl.setAttribute('id', 'select-org-' + organization.id);
    optionEl.textContent = organization.full_name;
    selectEl.appendChild(optionEl);
}

function removeOrganization() {
    const removeRowEl = document.querySelector('#' + selectedId);
    if(removeRowEl){
        const removedId = selectedId.slice(10);
        const removeOptionEl= document.querySelector('#select-org-' + removedId);
        selectEl.removeChild(removeOptionEl);
        tbodyEl.removeChild(removeRowEl);
        initialLpuArray = initialLpuArray.filter(event => event.id !== removedId);
        localStorage.setItem('lpu', JSON.stringify(initialLpuArray));
    }
}

function addNewOrganization() {
    const newOrganization = {
        id: Math.random().toString().substr(2, 8),
        hid: null,
        full_name: organizationNameInput.value,
        address:  addressInput.value,
        phone: phoneInput.value,
    };
    if(selectEl.selectedIndex){
        newOrganization.hid = selectEl.selectedOptions[0].id.slice(11);
    }
    initialLpuArray.push(newOrganization);
    localStorage.setItem('lpu', JSON.stringify(initialLpuArray));

    addRowInTable(newOrganization);
}