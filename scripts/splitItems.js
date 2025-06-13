// stackSplit.js - mechanics of item moving from a stack
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initStackSplitting, 500);
});

function setupItemForSplitting(item) {
    if (item.dataset.stackable === 'true' && parseInt(item.dataset.count) > 1) {
        let stats = item.dataset.stats || '';
        // Remove previous instructions if any
        stats = stats.replace(/\n\nShift: half of stack \| Ctrl: 1 piece/g, '');
        item.dataset.stats = stats + (stats ? '\n\n' : '') + 'Shift: half of stack | Ctrl: 1 piece';
    }
    item.removeEventListener('mousedown', startDrag);
    item.addEventListener('mousedown', handleItemPickup);
}

function initStackSplitting() {
    const originalCreateItem = window.createItem;
    window.createItem = function(item, slotIndex, containerType) {
        if (item.stackable && item.count > 1) {
            item.stats = (item.stats || '') + (item.stats ? '\n\n' : '') + 'Shift: half of stack | Ctrl: 1 piece';
        }
        const result = originalCreateItem.apply(this, arguments);
        const container = document.getElementById(containerType);
        const slot = container?.querySelector(`.slot[data-index="${slotIndex}"]`);
        const newItem = slot?.querySelector('.item');
        if (newItem) setupItemForSplitting(newItem);
        return result;
    };
    processAllExistingItems();
    setupMutationObserver();
}

function processAllExistingItems() {
    document.querySelectorAll('.item').forEach(item => {
        setupItemForSplitting(item);
    });
}



function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList?.contains('item')) {
                    setTimeout(() => setupItemForSplitting(node), 50);
                }
            });
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function handleItemPickup(e) {
    const item = e.currentTarget;
    if (item.dataset.stackable !== 'true' || parseInt(item.dataset.count) <= 1) {
        startDrag(e);
        return;
    }
    const takeCount = calculateAmountToTake(e, parseInt(item.dataset.count));
    if (takeCount >= parseInt(item.dataset.count)) {
        startDrag(e);
        return;
    }
    e.preventDefault();
    splitItemStack(item, takeCount, e);
}

function calculateAmountToTake(event, currentCount) {
    if (event.ctrlKey) return 1;
    if (event.shiftKey) return Math.max(1, Math.floor(currentCount / 2));
    return currentCount;
}

function updateItemCount(item, newCount) {
    item.dataset.count = newCount;
    const countElement = item.querySelector('.item-count');
    if (newCount > 1) {
        if (countElement) {
            countElement.textContent = newCount;
        } else {
            item.insertAdjacentHTML('beforeend', `<div class="item-count">${newCount}</div>`);
        }
    } else if (countElement) {
        countElement.remove();
    }
}

function splitItemStack(originalItem, takeCount, event) {
    const newItem = originalItem.cloneNode(true);
    newItem.dataset.count = takeCount;
    updateItemCount(originalItem, parseInt(originalItem.dataset.count) - takeCount);
    updateItemCount(newItem, takeCount);
    setupDrag(newItem, originalItem, event);
    setupItemForSplitting(newItem);
    addItemEventListeners(newItem);
}

function setupDrag(newItem, originalItem, event) {
    lastSlot = originalItem.parentElement;
    draggedItem = newItem;
    newItem.classList.add('dragging');
    lastSlot.classList.add('item-dragged');
    const rect = originalItem.getBoundingClientRect();
    offset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    Object.assign(newItem.style, {
        position: 'absolute',
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        zIndex: '1000'
    });
    document.body.appendChild(newItem);
}
