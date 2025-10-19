// main.js
// ---------------------------------------------------
// Handles Add to Cart, dynamic cart counter, and other
// UI interactions on the frontend.
// ---------------------------------------------------

// When "Add to Cart" buttons are clicked
document.addEventListener("DOMContentLoaded", () => {
  const cartCountEl = document.getElementById("cart-count"); // element in header
  let cartCount = 0;

  // Attach to all Add to Cart buttons
  const addToCartBtns = document.querySelectorAll(".add-to-cart");

  addToCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Normally, you’d send this to server with fetch()
      cartCount++;
      if (cartCountEl) {
        cartCountEl.textContent = cartCount;
      }
      alert("Item added to cart!");
    });
  });
});
