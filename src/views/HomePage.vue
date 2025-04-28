<template>
  <div class="p-4">
   
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Kanban Board</a>        
      </div>
    </nav>
    <h3>{{ boardTitle }}</h3>
    <!-- Add Column Section -->
    <div class="mb-4">
      <input
        v-model="newColumnTitle"
        placeholder="New Column Title"
        class="border p-2 rounded mr-2"
      />
      <button @click="addColumn" class="btn btn-primary px-4 py-2 rounded">
        Add Column
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Columns Section -->
    <div class="row mt-3">
      <div
        v-for="col in columns"
        :key="col.id"
        class="col-md-4"
        :id="`div-${col.id}`"
      >
        <div class="p-2 alert alert-warning">
          <div class="d-flex justify-content-between align-items-center">
            <h3>{{ col.title }}</h3>
            <button
              class="btn btn-sm"
              @click="deleteColumn(col.id)"
            >
            ❌
            </button>
          </div>

          <draggable
            v-model="col.cards"
            :group="{ name: 'cards', pull: true, put: true }"
            item-key="id"            
            @end="(event) => handleDragEnd(col, event)"
            @change="handleCardMove"
          >
            <template #item="{ element }">
              <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="col-md-8">
                    <b>{{ element.text }}</b>
                  </div>
                  <div class="col-md-3">
                    <button
                      class="btn btn-sm float-start"
                      @click="editCard(col.id,element)"
                    >
                      ✏️
                    </button>
                    <button
                      class="btn btn-sm float-end"
                      @click="deleteCard(col.id, element.id)"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </draggable>

          <!-- Add Card Input -->
          <input
            v-model="newCardText[col.id]"
            @keyup.enter="addCard(col.id)"
            placeholder="New Task"
            class="p-2 border rounded w-full mt-2"
          />
        </div>
      </div>
    </div>    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { db } from '../firebaseConfig'; // your Firebase setup
import {
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  setDoc
} from 'firebase/firestore';

const boardId = 'byx8MUoLjlxIoCQxCgHu';

const columns = ref([]);
const newColumnTitle = ref('');
const newCardText = ref({});
const loading = ref(true);

// Load Columns and Cards in Realtime
const loadColumns = () => {
  const colRef = collection(db, 'boards', boardId, 'columns');

  onSnapshot(colRef, async (snapshot) => {
    const tempCols = [];

    for (const colDoc of snapshot.docs) {
      const columnData = { id: colDoc.id, ...colDoc.data(), cards: [] };

      const cardsSnapshot = await getDocs(
        collection(db, 'boards', boardId, 'columns', colDoc.id, 'cards')
      );
      
      // Get all cards and sort them by their 'order' field
      const cards = cardsSnapshot.docs.map((cardDoc) => ({
        id: cardDoc.id,
        ...cardDoc.data(),
      }));

      columnData.cards = cards.sort((a, b) => a.order - b.order); // Sort cards by 'order'

      tempCols.push(columnData);
    }

    columns.value = tempCols;
    loading.value = false; // Set loading to false once data is loaded
  });
};

// Add Column
const addColumn = async () => {
  if (!newColumnTitle.value.trim()) return;

  const docRef = await addDoc(collection(db, 'boards', boardId, 'columns'), {
    title: newColumnTitle.value,
  });

  columns.value.push({ id: docRef.id, title: newColumnTitle.value, cards: [] });
  newColumnTitle.value = '';
};

// Delete Column
const deleteColumn = async (columnId) => {
  if (!confirm('Are you sure you want to delete this column?')) return;

  // Delete the cards in this column first
  const cardsRef = collection(db, 'boards', boardId, 'columns', columnId, 'cards');
  const cardsSnapshot = await getDocs(cardsRef);

  for (const cardDoc of cardsSnapshot.docs) {
    await deleteDoc(doc(db, 'boards', boardId, 'columns', columnId, 'cards', cardDoc.id));
  }

  // Now delete the column
  await deleteDoc(doc(db, 'boards', boardId, 'columns', columnId));

  // Remove the column from the local state
  columns.value = columns.value.filter(col => col.id !== columnId);
};

const addCard = async (columnId) => {
  const text = newCardText.value[columnId]; // get text for this column
  if (!text || !text.trim()) return;

  const cardsRef = collection(db, 'boards', boardId, 'columns', columnId, 'cards');

  // Get existing cards to determine the next order
  const snapshot = await getDocs(cardsRef);
  const newOrder = snapshot.size + 1; // Next order number

  // Create the new card
  const docRef = await addDoc(cardsRef, {
    text: text,
    createdAt: new Date(),
    order: newOrder,
    columnId: columnId,
  });

  // Optionally: Update local columns to immediately reflect the new card
  const column = columns.value.find((col) => col.id === columnId);
  if (column) {
    column.cards.push({
      id: docRef.id,
      text: text,
      order: newOrder,
      columnId: columnId
    });
  }

  newCardText.value[columnId] = ''; // Clear input
};
const editCard = async (colId, card) => {
  console.log("Card:", card);
  const newText = prompt("Edit card text:", card.text);

  if (newText !== null && newText.trim()) {
    try {
      // Make sure card has columnId before proceeding
      if (!colId) {
        console.error("card.columnId is missing!");
        return;
      }

      // Update Firebase with the new text
      const cardRef = doc(db, 'boards', boardId, 'columns', colId, 'cards', card.id);
      await updateDoc(cardRef, { text: newText });

      // Update the local state to reflect the change
      const column = columns.value.find((col) => col.id === card.columnId);
      if (column) {
        const cardToUpdate = column.cards.find((c) => c.id === card.id);
        if (cardToUpdate) {
          cardToUpdate.text = newText;  // Update the text in the local card
          // Trigger Vue's reactivity by reassigning the cards array
          column.cards = [...column.cards];  // Re-assign the cards array to force UI update
        }
      }

      // Optionally, re-fetch the entire column or board if necessary to ensure the UI is in sync
      // You can use this approach if you want to be sure that Firebase has correctly synced
      await fetchCardsForColumn(colId); // This is the function to re-fetch the column's cards from Firebase

    } catch (error) {
      console.error('Error updating card:', error);
    }
  }
};

// Function to fetch updated cards from Firebase for a specific column
const fetchCardsForColumn = async (colId) => {
  const cardsRef = collection(db, 'boards', boardId, 'columns', colId, 'cards');
  const snapshot = await getDocs(cardsRef);

  // Update the local column cards after fetching
  const column = columns.value.find((col) => col.id === colId);
  if (column) {
    column.cards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};


// Delete
const deleteCard = async (columnId, cardId) => {
  if (!confirm('Delete this card?')) return;
  await deleteDoc(doc(db, 'boards', boardId, 'columns', columnId, 'cards', cardId));

  const column = columns.value.find((col) => col.id === columnId);
  if (column) {
    column.cards = column.cards.filter((card) => card.id !== cardId);
  }
};

const handleCardMove = async (event) => {
  const { added, removed } = event;

  if (added && removed) {
    const movedCard = removed.element; 
    const oldColId = removed.from.dataset.columnId;
    const newColId = added.to.dataset.columnId;

    console.log('Moved card from column', oldColId, 'to', newColId);
    console.log('newColId:', newColId);

    const oldCardRef = doc(db, 'boards', boardId, 'columns', oldColId, 'cards', movedCard.id);
    const newCardRef = doc(db, 'boards', boardId, 'columns', newColId, 'cards', movedCard.id);

    try {
      // 1. Copy card data into new column with updated fields
      await setDoc(newCardRef, {
        ...movedCard,
        columnId: newColId,
        order: added.newIndex + 1,  // Set new order
        updatedAt: new Date(),
      });

      // 2. Delete from old column
      await deleteDoc(oldCardRef);

      console.log('Moved card from column', oldColId, 'to', newColId);

      // 3. Update orders in both affected columns
      await updateColumnOrders(oldColId);
      await updateColumnOrders(newColId);
      
    } catch (error) {
      console.error('Error moving card:', error);
    }
  }
};

// Helper function to update orders inside a column
const updateColumnOrders = async (columnId) => {
  const column = columns.value.find(c => c.id === columnId);
  if (!column) return;

  for (let i = 0; i < column.cards.length; i++) {
    const card = column.cards[i];
    const cardRef = doc(db, 'boards', boardId, 'columns', columnId, 'cards', card.id);
    await updateDoc(cardRef, {
      order: i + 1,  // Update the order according to the new index
      updatedAt: new Date(),
    });
  }
};
// Handle Drag End and Update Cards in DB
const handleDragEnd = async (col) => {
  const updatedCards = col.cards.map((card, index) => ({
    ...card,
    order: index + 1, // Set the new order based on the card's index in the column
    updatedAt: new Date(),
  }));
  console.log('Updated cards:', col);

  // Update each card's order in the database
  for (const card of updatedCards) {
    const cardRef = doc(db, 'boards', boardId, 'columns', col.id, 'cards', card.id);

    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      await updateDoc(cardRef, {
        updatedAt: card.updatedAt,
        order: card.order, // Update the order field in Firebase
      });
    }
  }
};

onMounted(() => {
  loadColumns();
});

</script>


<style scoped>
.kanban-column {
  min-height: 300px;
  max-height: 100%;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5); /* Semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.list-group-item {
  padding: 10px;
  margin: 5px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.list-group-item .btn {
  font-size: 12px;
}

.alert-warning {
  background-color: #f8f9fa;
  border-color: #ffeeba;
}

.row.mt-3 {
  display: flex;
  justify-content: space-between;
}

.col-md-4 {
  flex: 1;
  padding: 0 15px;
}
</style>
