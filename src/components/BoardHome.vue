<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Kanban Board</a>
            <button class="btn btn-primary" @click="createNewBoard">New Board</button>
        </div>
    </nav>
    <div class="container py-5">    
      <h1 class="text-center mb-4">Project Boards</h1>
        
      <div class="row g-4">
        <div 
          class="col-md-4" 
          v-for="board in allBoards" 
          :key="board.id"
        >
          <div class="card shadow-sm h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <h5 class="card-title">{{ board.title }}</h5>
              <button 
                class="btn btn-primary mt-3"
                @click="navigateToBoard(board.id)"
              >
                Open Board
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </template>
  
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
    collection,
    getDoc,
    addDoc,
    doc,
    getDocs,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const router = useRouter();
const allBoards = ref([]);
const loading = ref(false);
const boardId = ref();
const boardTitle = ref("Loading...");
const columns = ref([]);
const sortOrder = ref('asc'); 
// Load All Boards
const loadAllBoards = async () => {
    loading.value = true;
    try {
        const boardRef = collection(db, 'boards');
        const snapshot = await getDocs(boardRef);

        let boards = snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title
        }));

        boards.sort((a, b) => {
            return sortOrder.value === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });

        allBoards.value = boards;
    } catch (error) {
        console.error("Error loading all boards:", error);
    } finally {
        loading.value = false;
    }
};

// Navigate to Specific Board
const navigateToBoard = (boardId) => {
    router.push({ name: 'BoardPage', params: { id: boardId } });
};
// Create New Board
const createNewBoard = async () => {
    const newBoardTitle = prompt("Enter the new board title:");
    if (newBoardTitle) {
        loading.value = true; // <-- Add this line to show loading immediately
        
        const boardRef = await addDoc(collection(db, 'boards'), {
            title: newBoardTitle,
        });

        boardId.value = boardRef.id; // Set new board as the active board
        boardTitle.value = newBoardTitle; // Update the board title in the navbar
        loadAllBoards()
        await loadColumnsByBoardId(boardId.value); // Wait for columns to load
    }
};

// Function to load columns by boardId
const loadColumnsByBoardId = async (boardId) => {
    const boardRef = doc(db, 'boards', boardId);
    const boardSnapshot = await getDoc(boardRef);

    if (boardSnapshot.exists()) {
        boardTitle.value = boardSnapshot.data().title;
    } else {
        console.log('Board not found');
        boardTitle.value = 'Board Not Found';
    }

    const colRef = collection(db, 'boards', boardId, 'columns');
    
    // Set loading to true when starting to load columns
    loading.value = true;

    onSnapshot(colRef, async (snapshot) => {
        const tempCols = [];

        for (const colDoc of snapshot.docs) {
            const columnData = { id: colDoc.id, ...colDoc.data(), cards: [] };

            const cardsSnapshot = await getDocs(
                collection(db, 'boards', boardId, 'columns', colDoc.id, 'cards')
            );

            const cards = cardsSnapshot.docs.map((cardDoc) => ({
                id: cardDoc.id,
                ...cardDoc.data(),
            }));

            columnData.cards = cards.sort((a, b) => a.order - b.order);
            tempCols.push(columnData);
        }

        columns.value = tempCols;

        // Finally after everything loaded
        loading.value = false;
    });
};
onMounted(() => {
    loadAllBoards();
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