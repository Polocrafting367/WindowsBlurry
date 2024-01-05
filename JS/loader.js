setTimeout(function() {


    var bootValue = localStorage.getItem('Boot');

    if (bootValue && bootValue === 'FichierCSS7') {
     window.location.href = "lockXP78B.html";
    }

    else{
    window.location.href = "W81011367.html";
    }

    

}, 3500);

function startAnimation() {
    var lool = document.getElementById('lool');

    // Use console.log for debugging
    console.log('startAnimation function called');

    // Wait for 3 seconds before triggering the animation
    setTimeout(function () {
        // Remove the trigger class
        lool.classList.remove('trigger-animation');

        // Add the duplication class
        lool.classList.add('duplication');

        // Use console.log for debugging
        console.log('Animation classes updated');
    }, 2000); // Adjusted the delay to 3000 milliseconds (3 seconds)
}

// Call the startAnimation function
startAnimation();




