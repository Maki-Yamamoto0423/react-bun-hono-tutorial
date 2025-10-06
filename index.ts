Bun.serve({
  fetch(req) {
    return new Response("Hello from bun server");
  },
});

console.log("server running");
