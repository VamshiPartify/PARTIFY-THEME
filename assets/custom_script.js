// document.querySelectorAll('.cart-item__remove-link').forEach(function(target){
//   target.addEventListener('click', function(e){
//     if(this.getAttribute('data-group') != ''){      
//       let target_id = this.getAttribute('data-group');

//       var groupProducts = document.querySelectorAll('.cart-item__remove-link[data-group="' + target_id + '"]');
      
//       var itemsToRemove = {};

//       [...groupProducts].forEach(function(product) {
//         var dataId = product.getAttribute('data-id');

//         itemsToRemove[dataId] = 0;
//       });

//       console.log(itemsToRemove);

//       fetch('/cart/update.js', {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           updates: itemsToRemove
//         })
//       }).then(function() {
//         window.location.href = '/cart';
//       }).catch(function() {
//         console.log("error");
//       });
//     }
//   })
// });