let navButton = document.querySelector('#nav-mobile');
let navIcons = document.querySelector('#nav-icons');

navButton.onclick = function() {
  navIcons.classList.toggle('open');
}