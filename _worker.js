export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // If the request is for a file with an extension, serve it directly
    if (url.pathname.includes('.')) {
      return fetch(request);
    }
    
    // For all routes without extensions, serve the index.html
    return fetch(new URL('/index.html', url.origin));
  }
}
