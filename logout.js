let logoutButton = document.getElementById("logout");

function logoutCall()
{
    localStorage.removeItem("username");
    localStorage.removeItem("companyID");
    localStorage.removeItem("customId");
    localStorage.removeItem("password");

    setTimeout(() => {
        window.location.href = "login.html";  
    }, 10);
}

logoutButton.addEventListener("click", logoutCall);