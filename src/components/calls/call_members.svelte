<script lang="ts">
  const devMode = true;

  let users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Carol" },
  ];

  function addUser() {
    const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users = [...users, { id: nextId, name: `User${nextId}` }];
  }

  function removeUser() {
    if (users.length > 0) users = users.slice(0, -1);
  }
</script>

<div class="p-4 flex flex-col items-center justify-center min-h-[80vh]">
  {#if devMode}
    <div class="mb-4 flex gap-2">
      <button
        on:click={addUser}
        class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        + Add User
      </button>
      <button
        on:click={removeUser}
        class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        - Remove User
      </button>
    </div>
  {/if}

  <div
    class="relative w-full max-w-[1200px] aspect-video bg-gray-800 rounded overflow-hidden flex items-center justify-center"
  >
    <div
      class="grid gap-3"
      style="
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        width: 90%;
        height: 90%;
      "
    >
      {#each users as user (user.id)}
        <div class="aspect-video bg-gray-900 rounded-md flex flex-col items-center justify-center text-white select-none">
          <div
            class="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold"
            aria-label="User avatar"
          >
            {user.name[0]}
          </div>
          <div class="mt-2 font-semibold truncate max-w-full">{user.name}</div>
        </div>
      {/each}

      {#if users.length === 0}
        <div class="text-gray-500 col-span-full text-center py-10">
          No users in the call
        </div>
      {/if}
    </div>
  </div>
</div>
