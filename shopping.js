const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log('submited');
  const name = e.currentTarget.item.value;
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  // push items into state
  items.push(item);
  console.log(`there are now ${items.length} in your state`);
  // clear the form
  e.target.reset();
  // fire off custom event that will tell anyone who cares items have been updated.
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
  const html = items
    .map(
      item => `<li class="shopping-item">
  <input 
  value="${item.id}" 
  type="checkbox"
  ${item.complete && 'checked'}
  >
  <span class="itemName">${item.name}</span>
  <button 
  aria-label="Remove ${item.name}"
  value="${item.id}"
  >&times;</button>

  </li>`
    )
    .join('');
  // console.log(html);
  list.innerHTML = html;
}
function mirrorToLocalStorage() {
  // console.info('Saving items to Localstorage');
  localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
  console.info('restoring from LS');
  // pull items from local storage
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length) {
    items = lsItems;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('deleting item', id);
  // update items array with out deleted one
  items = items.filter(item => item.id !== id);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  console.log('marking as complete', id);
  const itemRef = items.find(item => item.id === id);
  console.log(itemRef);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}
shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// event delegation: we listend to the click on the list UL, then delagate the click over to the button if that was clicked
list.addEventListener('click', function(e) {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});
restoreFromLocalStorage();
