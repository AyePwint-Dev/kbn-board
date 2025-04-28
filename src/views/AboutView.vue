<template>
    <div class="container py-5">
      <h1 class="text-center mb-4">Kanban Board Web App</h1>
      <p class="lead text-center">
        This is a simple Kanban Board application built with <strong>Vue 3</strong>, 
        <strong>Firebase Firestore</strong>, and <strong>Bootstrap</strong>.<br />
        It allows users to view project boards, create new boards, and navigate to a specific board's page.
      </p>
  
      <hr class="my-5" />
  
      <section>
        <h2>✨ Features</h2>
        <ul class="list-group list-group-flush mb-5">
          <li class="list-group-item">View all available project boards.</li>
          <li class="list-group-item">Create a new project board dynamically.</li>
          <li class="list-group-item">Navigate to the selected board to view its tasks and columns.</li>
          <li class="list-group-item">Real-time updates using Firestore's <code>onSnapshot</code>.</li>
          <li class="list-group-item">Loading indicator while fetching data.</li>
        </ul>
      </section>
  
      <section>
        <h2>🛠️ Tech Stack</h2>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Vue 3</li>
          <li class="list-group-item">Firebase Firestore</li>
          <li class="list-group-item">Vue Router</li>
          <li class="list-group-item">Bootstrap 5</li>
        </ul>
      </section>
    </div>
  </template>
  
  <script setup>
  // No script needed for static content
  </script>
  
  <style scoped>
  h1, h2 {
    font-weight: bold;
  }
  p {
    font-size: 1.2rem;
  }
  </style>
  