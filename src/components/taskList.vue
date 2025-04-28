<template>
    <div class="row mt-3">      
        <div class="col-md-3">
          <div class="p-2 alert alert-warning">
            <h3>To Do</h3>
            <draggable class="list-group kanban-column" :list="arrTodo" group="tasks">
              <template #item="{ element }">
                <div class="list-group-item">
                  {{ element.name }}
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-2 alert alert-primary">
            <h3>In Progress</h3>
            <draggable class="list-group kanban-column" :list="arrInProgress" group="tasks">
              <template #item="{ element }">
                <div class="list-group-item">
                  {{ element.name }}
                </div>
              </template>
            </draggable>
  
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-2 alert alert-success">
            <h3>Done</h3>
            <draggable class="list-group kanban-column" :list="arrDone" group="tasks">
              <template #item="{ element }">
                <div class="list-group-item">
                  {{ element.name }}
                </div>
              </template>
            </draggable>
  
          </div>
        </div>
      </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
    name: 'taskList',
    components: {
        draggable
    },
    data() {
        return {
            newTask: '',
            arrTodo: [
                { name: 'Code Sign Up Page' },
                { name: 'Test Dashboard' },
                { name: 'Style Registration' },
                { name: 'Style Registration' }
            ],
            arrInProgress: [],
            arrDone: []
        }
    },
    methods: {
        add() {
            if (this.newTask) {
                this.arrTodo.push({ name: this.newTask })
                this.newTask = '';
            }
        }
    }
}
    
</script>   
<style>
.kanban-column{
    min-height: 300px;
  }
</style>