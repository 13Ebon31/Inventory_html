// combineItems.js - inventory mechanics script with drag-and-drop mouse movement mechanics

document.addEventListener('DOMContentLoaded', initInventory);

        function initInventory() {
            const inventory = document.getElementById('inventory');
            const storage = document.getElementById('storage');
            const tooltip = document.getElementById('tooltip');
            const toggleInventoryBtn = document.getElementById('toggleInventory');
            const toggleStorageBtn = document.getElementById('toggleStorage');
            const inventoryContainer = document.getElementById('inventoryContainer');
            const storageContainer = document.getElementById('storageContainer');
            
            // Initialize buttons
            toggleInventoryBtn.addEventListener('click', () => {
                inventoryContainer.classList.toggle('hidden');
                toggleInventoryBtn.classList.toggle('active');
            });
            
            toggleStorageBtn.addEventListener('click', () => {
                storageContainer.classList.toggle('hidden');
                toggleStorageBtn.classList.toggle('active');
            });
            
            // Initialize slots
            createSlots(inventory, 20, 'inventory');
            createSlots(storage, 20, 'storage');
            
            // Placing items
            inventoryItems.forEach((item, i) => createItem(item, i, 'inventory'));
            storageItems.forEach((item, i) => createItem(item, i, 'storage'));
            
            // Global variables for dragging
            let draggedItem = null;
            let lastSlot = null;
            let offset = { x: 0, y: 0 };

            // Event handlers
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        function createSlots(container, count, type) {
            for (let i = 0; i < count; i++) {
                const slot = document.createElement('div');
                slot.className = `slot ${type === 'storage' ? 'storage-slot' : ''}`;
                slot.dataset.index = i;
                slot.dataset.type = type;
                container.appendChild(slot);
            }
        }

        function createItem(item, slotIndex, containerType) {
            const container = document.getElementById(containerType);
            const slot = container.querySelector(`.slot[data-index="${slotIndex}"]`);
            if (!slot) return;
            
            const itemElement = document.createElement('div');
            itemElement.className = `item ${item.rarity}`;
            
           // Save data in dataset
            itemElement.dataset.id = item.id;
            itemElement.dataset.name = item.name;
            itemElement.dataset.stats = item.stats;
            itemElement.dataset.rarity = item.rarity;
            itemElement.dataset.slot = slotIndex;
            itemElement.dataset.container = containerType;
            itemElement.dataset.count = item.count;
            itemElement.dataset.stackable = item.stackable;
            if (item.stackable) {
                itemElement.dataset.maxStack = item.maxStack;
            }
            
            itemElement.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                ${item.count > 1 ? `<div class="item-count">${item.count}</div>` : ''}
            `;
            
            slot.appendChild(itemElement);
            
            // Add the has-item class and rarity class to the slot
            updateSlotStyle(slot);
            
            addItemEventListeners(itemElement);
        }

        function updateSlotStyle(slot) {
            // Remove all rarity classes and has-item
            slot.classList.remove('has-item', 'normal', 'rare', 'epic', 'legendary', 'item-dragged');
            
            // If there is an item in the slot, add the corresponding classes
            const item = slot.querySelector('.item');
            if (item) {
                slot.classList.add('has-item');
                slot.classList.add(item.dataset.rarity);
            }
        }

        function addItemEventListeners(item) {
            item.addEventListener('mousedown', startDrag);
            item.addEventListener('mouseenter', showTooltip);
            item.addEventListener('mouseleave', hideTooltip);
        }

        function showTooltip(e) {
            if (draggedItem) return;
            const item = e.currentTarget;
            const tooltip = document.getElementById('tooltip');
            
            tooltip.className = `tooltip tooltip-${item.dataset.rarity}`;
            tooltip.innerHTML = `
                <div class="tooltip-title">${item.dataset.name}</div>
                <div class="tooltip-stats">${item.dataset.stats.replace(/\n/g, '<br>')}</div>
                ${item.dataset.stackable === 'true' ? `<div class="tooltip-stats">Количество: ${item.dataset.count}/${item.dataset.maxStack}</div>` : ''}
            `;
            
            const rect = item.getBoundingClientRect();
            tooltip.style.left = `${rect.right + 10}px`;
            tooltip.style.top = `${rect.top}px`;
            tooltip.style.opacity = '1';
        }

        function hideTooltip() {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.opacity = '0';
        }

        function startDrag(e) {
            const item = e.currentTarget;
            lastSlot = item.parentElement;
            draggedItem = item;
            item.classList.add('dragging');
            
            // Add a class to the slot to hide the color
            lastSlot.classList.add('item-dragged');
            
            // Hide the tooltip when dragging starts
            hideTooltip();
            
            const rect = item.getBoundingClientRect();
            offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            
            Object.assign(item.style, {
                position: 'absolute',
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                zIndex: '1000'
            });
            
            document.body.appendChild(item);
            e.preventDefault();
        }

        function handleMouseMove(e) {
            if (!draggedItem) return;
            
            draggedItem.style.left = `${e.clientX - offset.x}px`;
            draggedItem.style.top = `${e.clientY - offset.y}px`;
            
            document.querySelectorAll('.slot').forEach(slot => {
                const rect = slot.getBoundingClientRect();
                const isHovered = 
                    e.clientX >= rect.left - 10 && 
                    e.clientX <= rect.right + 10 && 
                    e.clientY >= rect.top - 10 && 
                    e.clientY <= rect.bottom + 10;
                
                const hoverClass = slot.dataset.type === 'inventory' ? 'hovered-slot' : 'storage-hovered';
                slot.classList.toggle(hoverClass, isHovered);
            });
        }

        function handleMouseUp(e) {
            if (!draggedItem) return;
            
            draggedItem.classList.remove('dragging');
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('hovered-slot', 'storage-hovered'));
            
            // Remove the item-dragged class from the original slot
            if (lastSlot) {
                lastSlot.classList.remove('item-dragged');
            }
            
            const targetSlot = findClosestSlot(e.clientX, e.clientY);
            
            if (targetSlot) {
                const existingItem = targetSlot.querySelector('.item');
                
                if (existingItem && existingItem !== draggedItem) {
                    // Check if items can be combined
                    if (canStackItems(draggedItem, existingItem)) {
                        stackItems(draggedItem, existingItem, targetSlot);
                    } else {
                        swapItems(existingItem, lastSlot);
                        placeItem(draggedItem, targetSlot);
                    }
                } else {
                    placeItem(draggedItem, targetSlot);
                }
            } else {
                returnItem(draggedItem, lastSlot);
            }
            
            // Restore the ability to show the tooltip
            draggedItem = null;
        }

        function canStackItems(item1, item2) {
            // Items can be combined if:
            // 1. Both items have the same id
            // 2. Both items are stackable
            // 3. The sum of count does not exceed maxStack
            return item1.dataset.id === item2.dataset.id && 
                   item1.dataset.stackable === 'true' && 
                   item2.dataset.stackable === 'true' &&
                   parseInt(item1.dataset.count) + parseInt(item2.dataset.count) <= parseInt(item2.dataset.maxStack);
        }

        function stackItems(sourceItem, targetItem, targetSlot) {
            const newCount = parseInt(sourceItem.dataset.count) + parseInt(targetItem.dataset.count);
            targetItem.dataset.count = newCount;
            
            // Update the display of quantity
            const countElement = targetItem.querySelector('.item-count');
            if (countElement) {
                countElement.textContent = newCount;
            } else {
                targetItem.insertAdjacentHTML('beforeend', `<div class="item-count">${newCount}</div>`);
            }
            
            // Remove the dragged item
            sourceItem.remove();
            
            // Update the style of the original slot
            updateSlotStyle(lastSlot);
        }

        function findClosestSlot(x, y) {
            let targetSlot = null;
            let minDistance = Infinity;
            
            document.querySelectorAll('.slot').forEach(slot => {
                const rect = slot.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.hypot(x - centerX, y - centerY);
                
                if (distance < minDistance && distance < 100) {
                    minDistance = distance;
                    targetSlot = slot;
                }
            });
            
            return targetSlot;
        }

        function swapItems(item, newSlot) {
            // Move the item to a new slot
            newSlot.appendChild(item);
            updateItemPosition(item);
            item.dataset.slot = newSlot.dataset.index;
            item.dataset.container = newSlot.dataset.type;
            
            // Update the styles of both slots
            updateSlotStyle(item.parentElement);
            updateSlotStyle(newSlot);
        }

        function placeItem(item, slot) {
            // Place the item in the slot
            slot.appendChild(item);
            updateItemPosition(item);
            item.dataset.slot = slot.dataset.index;
            item.dataset.container = slot.dataset.type;
            
            // Update the styles of both slots
            updateSlotStyle(lastSlot);
            updateSlotStyle(slot);
        }

        function returnItem(item, slot) {
            // Return the item to the original slot
            slot.appendChild(item);
            updateItemPosition(item);
            
            // Update slot style
            updateSlotStyle(slot);
        }

        function updateItemPosition(item) {
            Object.assign(item.style, {
                position: '',
                left: '',
                top: '',
                width: '',
                height: '',
                zIndex: ''
            });
        }