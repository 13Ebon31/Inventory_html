// combineItems.js - mechanics of connecting items with crafting switch

// Global crafting mode variable 
let craftMode = false;

// Function to check if items can be connected
function canCombineItems(item1, item2) {
    if (!craftMode) return false; // Check only if crafting mode is enabled
    
    const key1 = `${item1.dataset.id},${item2.dataset.id}`;
    const key2 = `${item2.dataset.id},${item1.dataset.id}`;
    
    return craftingRecipes[key1] || craftingRecipes[key2];
}

// Function for connecting objects
function combineItems(draggedItem, targetItem, draggedSlot, targetSlot) {
    const key1 = `${draggedItem.dataset.id},${targetItem.dataset.id}`;
    const key2 = `${targetItem.dataset.id},${draggedItem.dataset.id}`;
    const recipe = craftingRecipes[key1] || craftingRecipes[key2];
    if (!recipe) return false;

    // Define the parameters of the items
    const draggedStackable = draggedItem.dataset.stackable === "true";
    const targetStackable = targetItem.dataset.stackable === "true";
    const sameType = draggedItem.dataset.id === targetItem.dataset.id;
    
    // Case 1: Both items are stackable and of the same type (potion + potion)
    if (draggedStackable && targetStackable && sameType) {
        const draggedCount = parseInt(draggedItem.dataset.count);
        const targetCount = parseInt(targetItem.dataset.count);
        const maxStack = parseInt(draggedItem.dataset.maxStack);
        
        // Use 1 item from each stack
        const newDraggedCount = draggedCount - 1;
        const newTargetCount = targetCount - 1;
        const totalRemainder = newDraggedCount + newTargetCount;
        
        
        createItem(recipe, targetSlot.dataset.index, targetSlot.dataset.type);
        
        
        draggedItem.remove();
        targetItem.remove();
        
        // Processing the remains
        if (totalRemainder > 0) {
            const container = document.getElementById(draggedSlot.dataset.type);
            createStackInEmptySlots(container, {
                id: draggedItem.dataset.id,
                name: draggedItem.dataset.name,
                icon: draggedItem.querySelector('.item-icon').innerHTML,
                rarity: draggedItem.dataset.rarity,
                stats: draggedItem.dataset.stats,
                stackable: "true",
                maxStack: maxStack
            }, totalRemainder);
        }
        
        updateSlotStyle(draggedSlot);
        updateSlotStyle(targetSlot);
        return true;
    }
    
    // Case 2: Only one item stackable (sword + potions)
    if ((draggedStackable || targetStackable) && !(draggedStackable && targetStackable)) {
        const stackableItem = draggedStackable ? draggedItem : targetItem;
        const stackableSlot = draggedStackable ? draggedSlot : targetSlot;
        const nonStackableItem = draggedStackable ? targetItem : draggedItem;
        
        const currentCount = parseInt(stackableItem.dataset.count);
        
        if (currentCount > 1) {
            const newCount = currentCount - 1;
            
            // Create a new item using the recipe
            createItem(recipe, targetSlot.dataset.index, targetSlot.dataset.type);
            
            // Delete both original items
            draggedItem.remove();
            targetItem.remove();
            
            // Delete both original items
            const container = document.getElementById(stackableSlot.dataset.type);
            createStackInEmptySlots(container, {
                id: stackableItem.dataset.id,
                name: stackableItem.dataset.name,
                icon: stackableItem.querySelector('.item-icon').innerHTML,
                rarity: stackableItem.dataset.rarity,
                stats: stackableItem.dataset.stats,
                stackable: "true",
                maxStack: stackableItem.dataset.maxStack
            }, newCount);
            
            updateSlotStyle(draggedSlot);
            updateSlotStyle(targetSlot);
            return true;
        }
    }
    
   // Case 4: Both items are stackable, but of different types (brooms + threads)
    if (draggedStackable && targetStackable && !sameType) {
        const draggedCount = parseInt(draggedItem.dataset.count);
        const targetCount = parseInt(targetItem.dataset.count);
        
        // Use 1 item from each stack
        const newDraggedCount = draggedCount - 1;
        const newTargetCount = targetCount - 1;
        
        // Create a new item using the recipe
        createItem(recipe, targetSlot.dataset.index, targetSlot.dataset.type);
        
        // Delete both original items
        draggedItem.remove();
        targetItem.remove();
        
        // Process the remainder for the draggedItem (broom)
        if (newDraggedCount > 0) {
            const draggedContainer = document.getElementById(draggedSlot.dataset.type);
            createStackInEmptySlots(draggedContainer, {
                id: draggedItem.dataset.id,
                name: draggedItem.dataset.name,
                icon: draggedItem.querySelector('.item-icon').innerHTML,
                rarity: draggedItem.dataset.rarity,
                stats: draggedItem.dataset.stats,
                stackable: "true",
                maxStack: draggedItem.dataset.maxStack
            }, newDraggedCount);
        }
        
        // Process the remainder for targetItem (threads)
        if (newTargetCount > 0) {
            const targetContainer = document.getElementById(targetSlot.dataset.type);
            createStackInEmptySlots(targetContainer, {
                id: targetItem.dataset.id,
                name: targetItem.dataset.name,
                icon: targetItem.querySelector('.item-icon').innerHTML,
                rarity: targetItem.dataset.rarity,
                stats: targetItem.dataset.stats,
                stackable: "true",
                maxStack: targetItem.dataset.maxStack
            }, newTargetCount);
        }
        
        updateSlotStyle(draggedSlot);
        updateSlotStyle(targetSlot);
        return true;
    }
    
    // Case 3: Both items are not stackable or cannot be combined
    draggedItem.remove();
    targetItem.remove();
    createItem(recipe, targetSlot.dataset.index, targetSlot.dataset.type);
    updateSlotStyle(draggedSlot);
    updateSlotStyle(targetSlot);
    return true;
}

// New function for creating stacks in free slots
function createStackInEmptySlots(container, itemTemplate, totalCount) {
    let remaining = totalCount;
    const maxStack = parseInt(itemTemplate.maxStack);
    
    while (remaining > 0) {
        const freeSlot = findFirstEmptySlot(container);
        if (!freeSlot) break;
        
        const count = Math.min(remaining, maxStack);
        createItem({
            ...itemTemplate,
            count: count
        }, freeSlot.dataset.index, freeSlot.dataset.type);
        
        remaining -= count;
    }
}
// Function to find the first empty slot in the container
function findFirstEmptySlot(container) {
    const slots = container.querySelectorAll('.slot');
    for (let slot of slots) {
        if (!slot.querySelector('.item')) {
            return slot;
        }
    }
    return null;
}
// New function to find multiple empty slots
function findAllEmptySlots(container, count) {
    const slots = container.querySelectorAll('.slot');
    const emptySlots = [];
    
    for (let slot of slots) {
        if (!slot.querySelector('.item')) {
            emptySlots.push(slot);
            if (emptySlots.length >= count) break;
        }
    }
    
    return emptySlots;
}

// Modified handleMouseUp function taking into account crafting mode
function handleMouseUpCombine(e) {
    if (!draggedItem) return;
    
    draggedItem.classList.remove('dragging');
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('hovered-slot', 'storage-hovered'));
    
    if (lastSlot) {
        lastSlot.classList.remove('item-dragged');
    }
    
    const targetSlot = findClosestSlot(e.clientX, e.clientY);
    
    if (targetSlot) {
        const targetItem = targetSlot.querySelector('.item');
        
        if (targetItem && targetItem !== draggedItem) {
            // Crafting mode: attempting to merge
            if (craftMode && canCombineItems(draggedItem, targetItem)) {
                if (combineItems(draggedItem, targetItem, lastSlot, targetSlot)) {
                    draggedItem = null;
                    return;
                }
            }
            
            // If items can be stacked
            if (canStackItems(draggedItem, targetItem)) {
                stackItems(draggedItem, targetItem, targetSlot);
            } else {
                // Find a free slot to move targetItem (sword)
                const freeSlot = findFreeSlot(targetItem.dataset.container);
                if (freeSlot) {
                    swapItems(targetItem, freeSlot); // Move the sword to in free slot
                    placeItem(draggedItem, targetSlot); // Put the item in the place of the sword
                } else {
                    returnItem(draggedItem, lastSlot); // If there is no space, cancel
                }
            }
        } else {
            placeItem(draggedItem, targetSlot); // If the slot is empty
        }
    } else {
        returnItem(draggedItem, lastSlot); // If you didn't get into the slot
    }
    
    draggedItem = null;
}

// Looks for the first free slot in the specified container (inventory/storage)
function findFreeSlot(containerType) {
    const container = document.getElementById(containerType);
    const slots = container.querySelectorAll('.slot');
    
    for (let slot of slots) {
        if (!slot.querySelector('.item')) {
            return slot;
        }
    }
    return null; // No free slots
}

// Initialize the connection mechanics
function initCombineMechanics() {
    // Override the mouseup handler
    document.removeEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUpCombine);
    
    // Create a button to switch the crafting mode
    const craftButton = document.createElement('button');
    craftButton.id = 'craftButton';
    craftButton.textContent = 'Craft Mod (OFF)';
    craftButton.style.position = 'fixed';
    craftButton.style.right = '20px';
    craftButton.style.top = '20px';
    craftButton.style.padding = '5px 10px';
    craftButton.style.backgroundColor = '#444';
    craftButton.style.color = 'white';
    craftButton.style.border = '1px solid #666';
    craftButton.style.borderRadius = '4px';
    craftButton.style.cursor = 'pointer';
    craftButton.style.zIndex = '1000';
    craftButton.addEventListener('click', toggleCraftMode);
    document.body.appendChild(craftButton);
    
    console.log('Combine mechanics initialized');
}

// Toggle crafting mode
function toggleCraftMode() {
    craftMode = !craftMode;
    const button = document.getElementById('craftButton');
    
    if (craftMode) {
        button.textContent = 'Craft Mod (ON)';
        button.style.backgroundColor = '#4CAF50';
        showAlert('Crafting mode is enabled. You can now combine items');
    } else {
        button.textContent = 'Craft Mod (OFF)';
        button.style.backgroundColor = '#444';
        showAlert('Crafting mode is disabled. Items will not combine');
    }
}

// Function for showing notifications
function showAlert(message) {
    const alert = document.createElement('div');
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.bottom = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.padding = '10px 20px';
    alert.style.backgroundColor = '#333';
    alert.style.color = 'white';
    alert.style.borderRadius = '5px';
    alert.style.zIndex = '1000';
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s';
    document.body.appendChild(alert);
    
    // Fade in
    setTimeout(() => alert.style.opacity = '1', 10);
    
    // Fade out after 3 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Connect after loading inventory
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCombineMechanics, 100);
});