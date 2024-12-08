let btnSubmit = document.querySelector(".submit")

btnSubmit.addEventListener("click", async (event) => {
     event.preventDefault();  
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    try {

        const response = await fetch("https://warm-west-marlin.glitch.me/users");
        const users = await response.json();
        // console.log(users)

     
        const user = users.find(u => u.email === email && u.password === password);
        console.log(user);
        
        

        if (user) {
            localStorage.setItem('userLocal', JSON.stringify(user.id));      
            if (user.isAdmin) {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "dashboard.html";
                console.log('user');
            }
        } else {
            document.getElementById("errorMessage").style.display = "block";
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("errorMessage").innerText = "An error occurred. Please try again.";
        document.getElementById("errorMessage").style.display = "block";
    }
});