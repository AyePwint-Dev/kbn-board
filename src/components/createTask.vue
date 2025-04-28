<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col form-inline d-flex mb-3">
                <input type="text" class="form-control me-2" v-model="newTask" placeholder="Add new task">
                <button class="btn btn-primary" @click="add">Add</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CreateTask',
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
                //   createTask(this.newTask)
                // console.log('Task added:', this.newTask)
                // }
                // return this.arrTodo.concat(this.arrInProgress, this.arrDone)
            }
        }
    }
}
</script>   
<style>
</style>
