import lpu from '../lpu.js'

let initialLpuArray;

const tbodyEl = document.querySelector('#data-lpu');
const selectEl = document.querySelector('#organization-parent');
const organizationNameInput = document.querySelector('#organization-name');
const addressInput = document.querySelector('#address');
const phoneInput = document.querySelector('#phone');
const saveButtonEl = document.querySelector('#data-save-btn');
const removeButtonEl = document.querySelector('#data-delete-btn');
const formEl = document.querySelector('form');

let currentSelectedEl, lastSelectedEl;
let selectedId;

init();

removeButtonEl.addEventListener('click', event => {
    event.preventDefault();
    removeOrganization();
});

saveButtonEl.addEventListener('click', event => {
    event.preventDefault();
    if (!organizationNameInput.value) {
        alert('Заполните поле \'Наименование учереждения\'');
        return;
    }
    if (initialLpuArray.some(elem => elem.full_name === organizationNameInput.value) &&
        !confirm('Такое наименование организации уже существует. Создать?')) {
        return;
    }
    if (currentSelectedEl && confirm('При нажатии на \'Ок\' будут перезаписаны данные выделенного учереждения. \nПри нажатии на \'Отмена\' создана новая запись об организации')) {
        editSelectedOrganization();
    } else {
        addNewOrganization();
    }
});

document.addEventListener('click', () => {
    if (currentSelectedEl) {
        lastSelectedEl = currentSelectedEl;
        currentSelectedEl = null;
        selectedElementOnTable();
    }
});

formEl.addEventListener('click', event => event.stopPropagation());

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
    rowEl.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentSelectedEl !== rowEl) {
            lastSelectedEl = currentSelectedEl;
            currentSelectedEl = rowEl;
            selectedId = rowEl.getAttribute('id').slice(10);
            selectedElementOnTable(organization);
        }
    });
}

function selectedElementOnTable(organization) {
    if (lastSelectedEl && lastSelectedEl.classList) {
        lastSelectedEl.classList.remove('selected-row');
        organizationNameInput.value = '';
        addressInput.value = '';
        phoneInput.value = '';
        selectEl.selectedIndex = 0;
    }
    if (currentSelectedEl) {
        currentSelectedEl.classList.add('selected-row');
        organizationNameInput.value = currentSelectedEl.children[0].textContent;
        addressInput.value = currentSelectedEl.children[1].textContent;
        phoneInput.value = currentSelectedEl.children[2].textContent;
        const selectedEl = document.querySelector('#select-org-' + organization.hid);
        selectedEl ? selectedEl.selected = true : selectEl.selectedIndex = 0;
    }
}

function addOptionOnSelect(organization) {
    const optionEl = document.createElement('option');
    optionEl.setAttribute('id', 'select-org-' + organization.id);
    optionEl.textContent = organization.full_name;
    selectEl.appendChild(optionEl);
}

function removeOrganization() {
    const removeRowEl = document.querySelector('#table-org-' + selectedId);
    if (removeRowEl) {
        if (!confirm("Удалить выделенное учереждение?")) return;
        if (initialLpuArray.some(elem => elem.hid === selectedId) &&
            !confirm("Все подразделения выбранного учереждения будут удалены. Удалить?")) {
            return
        } else {
            initialLpuArray.forEach(event => {
                if (event.hid === selectedId)
                    removeElement(event.id);
            });
        }
        removeElement(selectedId);
    } else {
        alert('Выберите организацию')
    }
}

function removeElement(id) {
    const removeRowEl = document.querySelector('#table-org-' + id);
    const removeOptionEl = document.querySelector('#select-org-' + id);
    tbodyEl.removeChild(removeRowEl);
    selectEl.removeChild(removeOptionEl);
    initialLpuArray = initialLpuArray.filter(event => event.id !== id);
    localStorage.setItem('lpu', JSON.stringify(initialLpuArray));
}

function addNewOrganization() {
    const newOrganization = {
        id: Math.random().toString().substr(2, 8),
        hid: null,
        full_name: organizationNameInput.value,
        address: addressInput.value,
        phone: phoneInput.value,
    };
    if (selectEl.selectedIndex) {
        newOrganization.hid = selectEl.selectedOptions[0].id.slice(11);
    }
    initialLpuArray.push(newOrganization);
    localStorage.setItem('lpu', JSON.stringify(initialLpuArray));

    addRowInTable(newOrganization);
}

function editSelectedOrganization() {
    if(selectedId === selectEl.selectedOptions[0].id.slice(11)){
        alert('Организация не может быть родительской самой себе.');
        return;
    }
    currentSelectedEl.children[0].textContent = organizationNameInput.value;
    currentSelectedEl.children[1].textContent = addressInput.value;
    currentSelectedEl.children[2].textContent = phoneInput.value;
    const editOptionEl = document.querySelector('#select-org-' + selectedId);
    editOptionEl.textContent = organizationNameInput.value;
    const editOrganization = {
        id: selectedId,
        hid: null,
        full_name: organizationNameInput.value,
        address: addressInput.value,
        phone: phoneInput.value,
    };
    if (selectEl.selectedIndex) {
        editOrganization.hid = selectEl.selectedOptions[0].id.slice(11);
    }
    initialLpuArray = initialLpuArray.map(item => {
        if(item.id === editOrganization.id){
            return editOrganization;
        }
        return item;
    });
    localStorage.setItem('lpu', JSON.stringify(initialLpuArray));
}