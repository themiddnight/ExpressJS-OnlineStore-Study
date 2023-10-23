// reload the page with query string
const reload = () => {
    window.location.href = `/products?sort=${sortSelect.value}`;
}

// get sort and order element
const sortSelect = document.getElementById('sort_select');

// set value of sort and order from query string
const urlParams = new URLSearchParams(window.location.search);
const sort = urlParams.get('sort');
if (sort) {
    sortSelect.value = sort;
}

// add event listener to sort and order select
sortSelect.addEventListener('change', reload);