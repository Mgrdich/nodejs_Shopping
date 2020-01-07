const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const hiddenQuant = document.querySelector('.quantityValue');
const incDec = document.getElementsByClassName("incDec");


function backdropClickHandler() {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
}

function handleIncDec() {
    hiddenQuant.value = this.value;
    const form = document.getElementById("incrementDecrement");
    form.submit(); //TODO Fix:the wrong form is getting submitted
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);


for (let i = 0; i < incDec.length; i++) {
    incDec[i].addEventListener('click', handleIncDec);
}

